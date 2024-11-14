// src/app/generate-invoice/route.ts
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

    // Encode parameters properly
    const encodeParam = (str: string) => {
      return str.split('').map(char => {
        switch(char) {
          case ' ': return '%20';
          case '[': return '%5B';
          case ']': return '%5D';
          default: return char;
        }
      }).join('');
    };
    
    const fullUrl = `${BASE_URL}?client_name=${encodeParam(clientName)}&product_name=${encodeParam(productName)}`;
    
    console.log('🔗 Requesting URL:', fullUrl);

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'accept': 'application/json'
      },
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