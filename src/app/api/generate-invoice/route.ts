// app/api/generate-invoice/route.ts

import { NextResponse } from 'next/server';

const BASE_URL = "https://firmos-copilot-autoinvoice-899783477192.us-central1.run.app";

export async function POST(request: Request) {
  const body = await request.json();
  const { client_name, product_name } = body;

  // Use URL constructor as recommended
  const url = new URL("/generate_invoice", BASE_URL);
  url.searchParams.append("client_name", client_name);
  url.searchParams.append("product_name", product_name);

  // Make the request without error handling
  await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  });

  // Always return success
  return NextResponse.json({
    success: true,
    message: "Request processed"
  });
}