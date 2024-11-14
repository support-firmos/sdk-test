// src/app/generate-invoice/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // Get query parameters from the request URL
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
    
    // Create the URL with encoded parameters
    const params = new URLSearchParams({
      client_name: clientName,
      product_name: productName
    }).toString();

    const fullUrl = `${BASE_URL}?${params}`;
    
    console.log('🔗 Requesting URL:', fullUrl);

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'accept': 'application/json'
      },
      // Empty body as per FastAPI requirements
      body: ''
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}: ${JSON.stringify(data)}`);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error:', error);
    
    return NextResponse.json(
      { error: 'Failed to generate invoice', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}