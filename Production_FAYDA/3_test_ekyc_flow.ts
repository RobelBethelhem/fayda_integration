/**
 * PRODUCTION - eKYC Flow (OTP → eKYC)
 *
 * IMPORTANT: eKYC requires its OWN separate OTP.
 * Do NOT reuse a transactionID from the authenticate step.
 *
 * This script automatically requests a fresh OTP, then asks
 * you to enter the real OTP received on the user's phone.
 *
 * REQUIRES VPN to be active (connecting to ida.fayda.et)
 *
 * Run: npm run prod:ekyc
 */

import * as readline from 'readline';
import { IdaClientFactory, OtpRequestDTO, AuthRequestDTO } from 'fayda-auth-client';
import { config } from './config';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (q: string) => new Promise<string>(resolve => rl.question(q, resolve));

(async () => {
  const client = IdaClientFactory.createClient(config);

  const individualId = await question('Enter the FAN (16-digit Fayda ID): ');

  // STEP 1: Request a fresh OTP dedicated to eKYC
  console.log('\nRequesting OTP for eKYC...');
  const otpRequest: OtpRequestDTO = {
    individualId: individualId.trim(),
    individualIdType: 'FAN',
    otpChannel: ['PHONE', 'EMAIL']
  };

  let transactionID: string;

  try {
    const otpResponse = await client.requestOtp(otpRequest);
    transactionID = otpResponse.transactionID;
    console.log('✓ OTP sent. Transaction ID:', transactionID);
    console.log('  Masked mobile:', otpResponse.response?.maskedMobile);
  } catch (err: any) {
    console.error('✗ OTP failed:', err.message);
    rl.close();
    return;
  }

  // STEP 2: Ask user for the real OTP they received
  const otp = await question('\nEnter the OTP received on phone: ');
  rl.close();

  // STEP 3: Perform eKYC using this dedicated transactionID
  console.log('\nPerforming eKYC...');
  const ekycRequest: AuthRequestDTO = {
    individualId: individualId.trim(),
    individualIdType: 'FAN',
    otp: otp.trim(),
    transactionID
  };

  try {
    const response = await client.performEkyc(ekycRequest);
    console.log('\n✓ eKYC Result:');
    console.log(JSON.stringify(response, null, 2));

    if (response.kycStatus === true && response.identity) {
      console.log('\n✓ Identity data retrieved successfully');
    } else {
      console.log('\n✗ eKYC returned no data — check OTP or contact Fayda');
    }
  } catch (err: any) {
    console.error('\n✗ eKYC Failed:', err.message);
  }
})();
