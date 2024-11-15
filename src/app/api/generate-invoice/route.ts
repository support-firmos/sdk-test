import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Parse the JSON body
    const body = await request.json();
    const { client_name, product_name } = body;

    if (!client_name || !product_name) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const url = 'https://firmos-copilot-autoinvoice-899783477192.us-central1.run.app/generate_invoice';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_name,
        product_name
      }),
      // Add Vercel's recommended fetch options
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate invoice',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}