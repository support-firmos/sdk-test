import { NextResponse } from 'next/server'

const logApiRequest = (method: string, url: string, params: any) => {
  console.group('🌐 API Request Details');
  console.log('📍 Method:', method);
  console.log('🔗 Full URL:', url);
  console.log('🔍 Query Parameters:', params);
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
  const BASE_URL = 'https://firmos-copilot-autoinvoice-899783477192.us-central1.run.app/generate_invoice';
  
  try {
    const body = await request.json();
    
    // Create URL with query parameters
    const params = new URLSearchParams({
      client_name: body.client_name,
      product_name: body.product_name
    });
    
    const fullUrl = `${BASE_URL}?${params.toString()}`;
    
    // Log the request with full URL
    logApiRequest('GET', fullUrl, {
      client_name: body.client_name,
      product_name: body.product_name
    });

    console.time('API Call Duration');
    
    // Make GET request instead of POST since we're using query parameters
    const response = await fetch(fullUrl, {
      method: 'GET',
    });

    console.timeEnd('API Call Duration');

    const data = await response.json();
    
    logApiResponse(response.status, data);

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}: ${JSON.stringify(data)}`);
    }

    return NextResponse.json(data);
  } catch (error) {
    logApiResponse(500, null, error);
    
    return NextResponse.json(
      { error: 'Failed to generate invoice', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}