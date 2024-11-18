import { NextResponse } from 'next/server'

export async function GET() {
  const apiKey = process.env.INVOICE_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key is required' },
      { status: 401 }
    );
  }

  const url = 'https://api.copilot.com/v1/invoices';
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'authorization': `Bearer ${apiKey}`
      }
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}
