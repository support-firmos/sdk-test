import { need } from '@/utils/need';

export function invoicelist (){
  const apiKey = need<string>(
    process.env.INVOICE_API_KEY,
    'COPILOT_API_KEY is required, guide available at: https://docs.copilot.com/docs/custom-apps-setting-up-your-first-app#step-2-register-your-app-and-get-an-api-key',
  );
  
  const url = 'https://api.copilot.com/v1/invoices';
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'X-API-KEY': apiKey
    }
  };
}

