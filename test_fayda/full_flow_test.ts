/**
 * FULL FLOW TEST - OTP → Authenticate → eKYC
 *
 * Runs all 3 steps automatically in order.
 * Uses the default staging OTP "111111".
 *
 * Run: npx ts-node test_fayda/full_flow_test.ts
 */

import { IdaClientFactory, OtpRequestDTO, AuthRequestDTO } from 'fayda-auth-client';
import { config } from '../src/config';

const INDIVIDUAL_ID = '8278536921561472';  // Replace with a real FAN for production
const OTP = '111111';                       // Default staging OTP

(async () => {
  const client = IdaClientFactory.createClient(config);

  // ── STEP 1: Request OTP ──────────────────────────────────────────────────
  console.log('=== STEP 1: Request OTP ===');
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

  // ── STEP 2: Authenticate ─────────────────────────────────────────────────
  console.log('\n=== STEP 2: Authenticate ===');
  const authRequest: AuthRequestDTO = {
    individualId: INDIVIDUAL_ID,
    individualIdType: 'FAN',
    otp: OTP,
    transactionID
  };

  try {
    const authResponse = await client.authenticate(authRequest);
    console.log('✓ Authentication result:', JSON.stringify(authResponse, null, 2));
  } catch (err: any) {
    console.error('✗ Authentication failed:', err.message);
    return;
  }

  // ── STEP 3: eKYC ────────────────────────────────────────────────────────
  console.log('\n=== STEP 3: eKYC ===');
  const ekycRequest: AuthRequestDTO = {
    individualId: INDIVIDUAL_ID,
    individualIdType: 'FAN',
    otp: OTP,
    transactionID
  };

  try {
    const ekycResponse = await client.performEkyc(ekycRequest);
    console.log('✓ eKYC result:', JSON.stringify(ekycResponse, null, 2));
  } catch (err: any) {
    console.error('✗ eKYC failed:', err.message);
  }
})();
