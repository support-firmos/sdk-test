// src/utils/invoice_api.ts
export const generateInvoice = async (client_name: string, product_name: string) => {
    try {
      const encodedClientName = encodeURIComponent(client_name);
      const encodedProductName = encodeURIComponent(product_name);
      
      // Use our local API route instead of calling Cloud Run directly
      const url = `/api/generate-invoice?client_name=${encodedClientName}&product_name=${encodedProductName}`;
      
      console.log('Making request to:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }
      
      return response.json();
    } catch (error) {
      console.error('Error generating invoice:', error);
      throw error;
    }
  };