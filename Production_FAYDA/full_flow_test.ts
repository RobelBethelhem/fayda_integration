/**
 * PRODUCTION - Full Interactive Flow
 *
 * Runs: OTP (Auth) → Authenticate → OTP (eKYC) → eKYC
 *
 * IMPORTANT: Fayda requires a SEPARATE OTP for authenticate and eKYC.
 * This script will request TWO OTPs — the user will receive TWO SMS messages.
 *
 * REQUIRES VPN to be active (connecting to ida.fayda.et)
 *
 * Run: npm run prod:full
 */

import * as readline from 'readline';
import { IdaClientFactory, OtpRequestDTO, AuthRequestDTO } from 'fayda-auth-client';
import { config } from './config';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (q: string) => new Promise<string>(resolve => rl.question(q, resolve));

(async () => {
  const client = IdaClientFactory.createClient(config);

  const individualId = await question('Enter the FAN (16-digit Fayda ID): ');
  const id = individualId.trim();

  const otpRequest: OtpRequestDTO = {
    individualId: id,
    individualIdType: 'FAN',
    otpChannel: ['PHONE', 'EMAIL']
  };

  // ── STEP 1: OTP for Authentication ──────────────────────────────────────
  console.log('\n=== STEP 1: Requesting OTP for Authentication ===');
  let authTxnId: string;

  try {
    const otpRes = await client.requestOtp(otpRequest);
    authTxnId = otpRes.transactionID;
    console.log('✓ OTP sent. Transaction ID:', authTxnId);
    console.log('  Masked mobile:', otpRes.response?.maskedMobile);
  } catch (err: any) {
    console.error('✗ OTP failed:', err.message);
    rl.close();
    return;
  }

  const authOtp = await question('Enter the OTP received on phone (for authentication): ');

  // ── STEP 2: Authenticate ─────────────────────────────────────────────────
  console.log('\n=== STEP 2: Authenticating ===');
  const authRequest: AuthRequestDTO = {
    individualId: id,
    individualIdType: 'FAN',
    otp: authOtp.trim(),
    transactionID: authTxnId
  };

  try {
    const authRes = await client.authenticate(authRequest);
    if (authRes.response?.authStatus === true) {
      console.log('✓ Authentication SUCCESS');
      console.log('  authToken:', authRes.response.authToken);
    } else {
      console.log('✗ Authentication failed');
      console.log(JSON.stringify(authRes, null, 2));
      rl.close();
      return;
    }
  } catch (err: any) {
    console.error('✗ Authentication error:', err.message);
    rl.close();
    return;
  }

  // ── STEP 3: OTP for eKYC (separate — required by Fayda) ─────────────────
  console.log('\n=== STEP 3: Requesting a NEW OTP for eKYC ===');
  console.log('(Fayda requires a separate OTP for eKYC — you will receive another SMS)');
  let ekycTxnId: string;

  try {
    const ekycOtpRes = await client.requestOtp(otpRequest);
    ekycTxnId = ekycOtpRes.transactionID;
    console.log('✓ OTP sent. Transaction ID:', ekycTxnId);
  } catch (err: any) {
    console.error('✗ eKYC OTP failed:', err.message);
    rl.close();
    return;
  }

  const ekycOtp = await question('Enter the OTP received on phone (for eKYC): ');
  rl.close();

  // ── STEP 4: eKYC ────────────────────────────────────────────────────────
  console.log('\n=== STEP 4: Performing eKYC ===');
  const ekycRequest: AuthRequestDTO = {
    individualId: id,
    individualIdType: 'FAN',
    otp: ekycOtp.trim(),
    transactionID: ekycTxnId
  };

  try {
    const ekycRes = await client.performEkyc(ekycRequest);
    console.log('\n✓ eKYC Result:');
    console.log(JSON.stringify(ekycRes, null, 2));
  } catch (err: any) {
    console.error('✗ eKYC error:', err.message);
  }
})();
