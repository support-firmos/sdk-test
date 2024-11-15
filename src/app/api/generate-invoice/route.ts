// app/api/generate-invoice/route.ts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  console.log('🚀 API Route: Starting invoice generation request');
  
  try {
    // Log the incoming request
    const body = await request.json();
    console.log('📝 Request body:', body);
    
    const { client_name, product_name } = body;

    // Validate required fields
    if (!client_name || !product_name) {
      console.log('❌ Validation Error: Missing required parameters');
      return NextResponse.json({
        success: false,
        error: 'Missing required parameters'
      });
    }

    const url = 'https://firmos-copilot-autoinvoice-899783477192.us-central1.run.app/generate_invoice';
    
    // Create the properly formatted request body
    const requestBody = {
        params: {
            client_name: client_name,
            product_name: product_name
        }
    };

    console.log('🔄 Making request to external API:', {
      url,
      method: 'POST',
      body: requestBody
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    console.log('📥 External API Response:', data);

    if (!response.ok) {
      // Return error info
      return NextResponse.json({
        success: false,
        error: `Failed to process request: ${response.status}`,
        details: data
      });
    }

    console.log('✅ Successfully generated invoice');
    return NextResponse.json({
      success: true,
      data
    });
    
  } catch (error) {
    console.error('❌ Error in generate-invoice API route:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json({
      success: false,
      error: 'Failed to generate invoice',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}