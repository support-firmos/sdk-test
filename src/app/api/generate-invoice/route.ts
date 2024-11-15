import { NextResponse } from 'next/server';

const BASE_URL = "https://firmos-copilot-autoinvoice-899783477192.us-central1.run.app";

export async function POST(request: Request) {
  console.log('🚀 API Route: Starting invoice generation request');
  
  try {
    // Parse the incoming request
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

    // Use URL constructor as recommended
    const url = new URL("/generate_invoice", BASE_URL);
    url.searchParams.append("client_name", client_name);
    url.searchParams.append("product_name", product_name);

    console.log('🔄 Making request to:', url.toString());

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error generating invoice:", errorData.detail);
      return NextResponse.json({
        success: false,
        error: errorData.detail || 'Failed to generate invoice'
      });
    }

    const data = await response.json();
    console.log("Invoice Generation Success:", data.message);
    
    return NextResponse.json({
      success: true,
      message: data.message
    });
    
  } catch (error) {
    console.error('❌ Network or unexpected error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to generate invoice',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}