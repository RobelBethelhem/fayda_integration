/**
 * STEP 3 - Perform eKYC
 *
 * After calling Step 1 (request-otp), paste the transactionID below.
 * This returns the user's identity data from Fayda (name, DOB, address, etc.)
 *
 * Run: npx ts-node test_fayda/3_test_ekyc.ts
 */

import { IdaClientFactory, AuthRequestDTO } from 'fayda-auth-client';
import { config } from '../src/config';

(async () => {
  const client = IdaClientFactory.createClient(config);

  const request: AuthRequestDTO = {
    individualId: '8278536921561472',  // Same FAN used in Step 1
    individualIdType: 'FAN',
    otp: '111111',                     // Default staging OTP — use real OTP in production
    transactionID: '6670822601'  // ← Paste from Step 1 output
  };

  console.log('Sending eKYC request...');
  console.log('Individual ID:', request.individualId);
  console.log('Transaction ID:', request.transactionID);

  try {
    const response = await client.performEkyc(request);
    console.log('\n✓ eKYC Success!');
    console.log('Full Response:', JSON.stringify(response, null, 2));
    console.log('\n→ The response contains the verified identity data from Fayda.');
  } catch (err: any) {
    console.error('\n✗ eKYC Failed:', err.message);
  }
})();
