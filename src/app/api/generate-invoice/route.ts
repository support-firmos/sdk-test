import { NextResponse } from 'next/server'

// Logger function for development
const logApiRequest = (method: string, url: string, body: any, headers: any) => {
  console.group('🌐 API Request Details');
  console.log('📍 Method:', method);
  console.log('🔗 URL:', url);
  console.log('📦 Request Body:', body);
  console.log('📋 Headers:', headers);
  console.groupEnd();
};

const logApiResponse = (status: number, data: any, error?: any) => {
  console.group('✨ API Response Details');
  console.log('📊 Status:', status);
  if (error) {
    console.error('❌ Error:', error);
  } else {
    console.log('📄 Response Data:', data);
  }
  console.groupEnd();
};

export async function POST(request: Request) {
  const API_URL = 'https://firmos-copilot-autoinvoice-899783477192.us-central1.run.app/generate_invoice';
  
  try {
    const body = await request.json();
    
    // Log the incoming request
    logApiRequest('POST', API_URL, body, {
      'Content-Type': 'application/json',
    });

    console.time('API Call Duration');
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    console.timeEnd('API Call Duration');

    const data = await response.json();
    
    // Log the API response
    logApiResponse(response.status, data);

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}: ${JSON.stringify(data)}`);
    }

    return NextResponse.json(data);
  } catch (error) {
    // Log any errors
    logApiResponse(500, null, error);
    
    return NextResponse.json(
      { error: 'Failed to generate invoice', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}