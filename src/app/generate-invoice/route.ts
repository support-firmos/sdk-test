// src/app/generate-invoice/route.ts
import { NextResponse } from 'next/server'

const customEncode = (str: string) => {
  return str
    .replace(/ /g, '%20')  // Replace spaces with %20
    .replace(/\(/g, '(')   // Keep parentheses as is
    .replace(/\)/g, ')')   // Keep parentheses as is
    .replace(/\$/g, '$')   // Keep dollar signs as is
    .replace(/\+/g, '%20') // Replace + with %20
    .replace(/\%/g, '%25') // Encode % signs
    .replace(/\-/g, '-');  // Keep hyphens as is
};

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
    // Create URL with custom encoding
    const params = new URLSearchParams({
      client_name: clientName,
      product_name: productName
    });

    // Create the full URL with custom encoding
    const encodedClientName = customEncode(clientName);
    const encodedProductName = customEncode(productName);
    const fullUrl = `${BASE_URL}?client_name=${encodedClientName}&product_name=${encodedProductName}`;
    
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