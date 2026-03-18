/**
 * PRODUCTION - STEP 2: Authenticate with OTP
 *
 * Run Step 1 (prod:otp) first to get a transactionID.
 * The user must enter the real OTP received on their phone.
 *
 * REQUIRES VPN to be active (connecting to ida.fayda.et)
 *
 * Run: npm run prod:auth
 */

import * as readline from 'readline';
import { IdaClientFactory, AuthRequestDTO } from 'fayda-auth-client';
import { config } from './config';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (q: string) => new Promise<string>(resolve => rl.question(q, resolve));

(async () => {
  const client = IdaClientFactory.createClient(config);

  const individualId   = await question('Enter the FAN (same as Step 1): ');
  const transactionID  = await question('Enter the transactionID from Step 1: ');
  const otp            = await question('Enter the OTP received on phone: ');
  rl.close();

  const request: AuthRequestDTO = {
    individualId: individualId.trim(),
    individualIdType: 'FAN',
    otp: otp.trim(),
    transactionID: transactionID.trim()
  };

  console.log('\nSending authentication request to production...');

  try {
    const response = await client.authenticate(request);
    console.log('\n✓ Authentication Result:');
    console.log(JSON.stringify(response, null, 2));

    if (response.response?.authStatus === true) {
      console.log('\n✓ User is VERIFIED');
      console.log('authToken (save this):', response.response.authToken);
    } else {
      console.log('\n✗ Authentication failed — check OTP or transactionID');
    }
  } catch (err: any) {
    console.error('\n✗ Authentication Failed:', err.message);
  }
})();
