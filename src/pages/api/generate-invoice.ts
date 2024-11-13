// src/pages/api/generate-invoice.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { client_name, product_name } = req.query;

  if (!client_name || !product_name) {
    return res.status(400).json({ 
      message: 'Missing required parameters',
      received: { client_name, product_name }
    });
  }

  try {
    const url = `https://firmos-copilot-autoinvoice-899783477192.us-central1.run.app/generate_invoice?client_name=${client_name}&product_name=${product_name}`;
    
    console.log('Forwarding request to:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('API Error:', data);
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}