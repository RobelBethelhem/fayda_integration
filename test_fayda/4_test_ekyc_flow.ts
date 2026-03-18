/**
 * eKYC FLOW - OTP → eKYC (separate from authentication)
 *
 * Fayda requires a SEPARATE OTP for eKYC.
 * You cannot reuse a transactionID that was used for /authenticate.
 *
 * This script requests its own OTP and immediately calls eKYC with it.
 *
 * Run: npx ts-node test_fayda/4_test_ekyc_flow.ts
 */

import { IdaClientFactory, OtpRequestDTO, AuthRequestDTO } from 'fayda-auth-client';
import { config } from '../src/config';

const INDIVIDUAL_ID = '8278536921561472';
const OTP = '111111';

(async () => {
  const client = IdaClientFactory.createClient(config);

  // STEP 1: Request a fresh OTP specifically for eKYC
  console.log('=== Requesting OTP for eKYC ===');
  const otpRequest: OtpRequestDTO = {
    individualId: INDIVIDUAL_ID,
    individualIdType: 'FAN',
    otpChannel: ['PHONE', 'EMAIL']
  };

  let transactionID: string;

  try {
    const otpResponse = await client.requestOtp(otpRequest);
    transactionID = otpResponse.transactionID;
    console.log('✓ OTP sent. Transaction ID:', transactionID);
  } catch (err: any) {
    console.error('✗ OTP failed:', err.message);
    return;
  }

  // STEP 2: Use that transactionID ONLY for eKYC (no authenticate call)
  console.log('\n=== Performing eKYC ===');
  const ekycRequest: AuthRequestDTO = {
    individualId: INDIVIDUAL_ID,
    individualIdType: 'FAN',
    otp: OTP,
    transactionID
  };

  try {
    const ekycResponse = await client.performEkyc(ekycRequest);
    console.log('✓ eKYC Response:', JSON.stringify(ekycResponse, null, 2));
  } catch (err: any) {
    console.error('✗ eKYC failed:', err.message);
  }
})();
