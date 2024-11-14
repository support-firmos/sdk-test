// src/app/generate-invoice/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { client_name, product_name } = body;

    if (!client_name || !product_name) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const BASE_URL = 'https://firmos-copilot-autoinvoice-899783477192.us-central1.run.app/generate_invoice';
    
    // Create URL parameters
    const params = new URLSearchParams({
      client_name,
      product_name
    }).toString();

    const fullUrl = `${BASE_URL}?${params}`;
    
    console.log('🔗 Requesting URL:', fullUrl);

    const response = await fetch(fullUrl, {
      method: 'GET', // Keep this as GET since the external API expects GET
      headers: {
        'Content-Type': 'application/json',
      },
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