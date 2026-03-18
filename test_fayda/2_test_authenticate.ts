/**
 * STEP 2 - Authenticate with OTP
 *
 * After calling Step 1 (request-otp), paste the transactionID below.
 * The OTP for staging/testing is "111111".
 *
 * Run: npx ts-node test_fayda/2_test_authenticate.ts
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

  console.log('Sending authentication request...');
  console.log('Individual ID:', request.individualId);
  console.log('Transaction ID:', request.transactionID);

  try {
    const response = await client.authenticate(request);
    console.log('\n✓ Authentication Success!');
    console.log('Full Response:', JSON.stringify(response, null, 2));
    console.log('\n→ If response contains authToken (psut), the user is verified.');
  } catch (err: any) {
    console.error('\n✗ Authentication Failed:', err.message);
  }
})();
