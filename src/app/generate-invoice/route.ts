import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const clientName = url.searchParams.get('client_name');
    const productName = url.searchParams.get('product_name');

    if (!clientName || !productName) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const BASE_URL = 'https://firmos-copilot-autoinvoice-899783477192.us-central1.run.app/generate_invoice';
    const fullUrl = `${BASE_URL}?client_name=${encodeURIComponent(clientName)}&product_name=${encodeURIComponent(productName)}`;
    
    console.log('🔗 Requesting URL:', fullUrl);

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'accept': 'application/json'
      }
    });

    const data = await response.json();

    // Return immediately after successful response
    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('❌ Error:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: 'Failed to generate invoice', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}