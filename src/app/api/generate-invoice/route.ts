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
      body: ''
    });

    // First check if the response is ok
    if (!response.ok) {
      const errorText = await response.text(); // Get response as text first
      console.error('Error response:', errorText);
      
      let errorDetails;
      try {
        // Try to parse as JSON if possible
        errorDetails = JSON.parse(errorText);
      } catch {
        // If not JSON, use the text directly
        errorDetails = errorText;
      }

      return NextResponse.json({
        success: false,
        error: `Failed to process request: ${response.status}`,
        details: errorDetails
      });
    }

    // Try to parse the successful response
    let data;
    try {
      const responseText = await response.text();
      try {
        data = JSON.parse(responseText);
      } catch {
        // If response is not JSON, create a simple success object
        data = { message: responseText };
      }
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      return NextResponse.json({
        success: false,
        error: 'Failed to parse response',
        details: 'Invalid response format'
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