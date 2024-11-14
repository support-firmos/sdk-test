import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clientName = searchParams.get('client_name');
  const productName = searchParams.get('product_name');

  if (!clientName || !productName) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  const BASE_URL = 'https://firmos-copilot-autoinvoice-899783477192.us-central1.run.app/generate_invoice';
  
  try {
    // Create properly encoded URL parameters
    const params = new URLSearchParams({
      client_name: clientName,
      product_name: productName
    }).toString();

    const fullUrl = `${BASE_URL}?${params}`;
    
    console.log('🔗 Requesting URL:', fullUrl);

    const response = await fetch(fullUrl, {
      method: 'GET',
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