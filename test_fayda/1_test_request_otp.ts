/**
 * STEP 1 - Request OTP
 *
 * This sends an OTP to the user's phone/email.
 * Run this first before authenticate or ekyc.
 *
 * Run: npx ts-node test_fayda/1_test_request_otp.ts
 */

import { IdaClientFactory, OtpRequestDTO } from 'fayda-auth-client';
import { config } from '../src/config';

(async () => {
  const client = IdaClientFactory.createClient(config);

  const request: OtpRequestDTO = {
    individualId: '8278536921561472',  // Replace with a real FAN (16-digit Fayda ID)
    individualIdType: 'FAN',
    otpChannel: ['PHONE', 'EMAIL']     // OTP will be sent to phone and/or email
  };

  console.log('Sending OTP request...');
  console.log('Individual ID:', request.individualId);

  try {
    const response = await client.requestOtp(request);
    console.log('\n✓ OTP Request Success!');
    console.log('Transaction ID:', response.transactionID);
    console.log('Full Response:', JSON.stringify(response, null, 2));
    console.log('\n→ Copy the transactionID above and paste it into the next test files.');
  } catch (err: any) {
    console.error('\n✗ OTP Request Failed:', err.message);
  }
})();
