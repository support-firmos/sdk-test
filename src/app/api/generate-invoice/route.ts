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

    // Properly encode the query parameters
    const encodedClientName = encodeURIComponent(client_name);
    const encodedProductName = encodeURIComponent(product_name);
    
    // Construct URL with query parameters
    const url = `https://firmos-copilot-autoinvoice-899783477192.us-central1.run.app/generate_invoice?client_name=${encodedClientName}&product_name=${encodedProductName}`;
    
    console.log('🔄 Making request to external API:', {
      url,
      method: 'POST'
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'accept': 'application/json'
      },
      // Send empty body as shown in the curl example
      body: ''
    });

    const data = await response.json();
    console.log('📥 External API Response:', data);

    if (!response.ok) {
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