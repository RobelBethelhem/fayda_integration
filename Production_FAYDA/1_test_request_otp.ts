/**
 * PRODUCTION - STEP 1: Request OTP
 *
 * BEFORE RUNNING — make sure these two files exist in Production_FAYDA/keys/:
 *   fayda-ethswitch-partner-zemen-bank-partner.cer  ← move from project root
 *   fayda-ethswitch-partner-zemen-bank-partner.p12  ← copy & rename from keys/fayda-partner-zemen-bank-partner.p12
 *
 * REQUIRES VPN to be active (connecting to ida.fayda.et)
 *
 * Run: npm run prod:otp
 */

import * as readline from 'readline';
import { IdaClientFactory, OtpRequestDTO } from 'fayda-auth-client';
import { config } from './config';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (q: string) => new Promise<string>(resolve => rl.question(q, resolve));

(async () => {
  const client = IdaClientFactory.createClient(config);

  const individualId = await question('Enter the FAN (16-digit Fayda ID): ');
  rl.close();

  const request: OtpRequestDTO = {
    individualId: individualId.trim(),
    individualIdType: 'FAN',
    otpChannel: ['PHONE', 'EMAIL']
  };

  console.log('\nSending OTP request to production...');

  try {
    const response = await client.requestOtp(request);
    console.log('\n✓ OTP Request Success!');
    console.log('Transaction ID:', response.transactionID);
    console.log('Full Response:', JSON.stringify(response, null, 2));
    console.log('\n→ OTP sent to the user\'s registered phone/email.');
    console.log('→ Copy the transactionID above and use it in Step 2 (prod:auth).');
  } catch (err: any) {
    console.error('\n✗ OTP Request Failed:', err.message);
  }
})();
