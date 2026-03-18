import { IdaClientFactory, OtpRequestDTO } from 'fayda-auth-client';
import { config } from './config';

(async () => {
  const client = IdaClientFactory.createClient(config);

  const otpRequest: OtpRequestDTO = {
    individualId: '8278536921561472',
    individualIdType: 'FAN',
    otpChannel: ['EMAIL','PHONE']
  };

  const otpResponse = await client.requestOtp(otpRequest);
  console.log('OTP Response:', otpResponse);
})();