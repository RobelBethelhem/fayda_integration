import express from 'express';
import bodyParser from 'body-parser';
import {
  IdaClientFactory,
  OtpRequestDTO,
  AuthRequestDTO
} from 'fayda-auth-client';
import { config } from './config';

const app = express();
app.use(bodyParser.json());

const port = 3000;


const client = IdaClientFactory.createClient(config);

const txnStore: Record<string, string> = {};

// --- OTP Endpoint ---
app.post('/request-otp', async (req, res) => {
  try {
    const otpRequest: OtpRequestDTO = req.body;

    const response = await client.requestOtp(otpRequest);

    // store transactionID using individualId
    if (response.transactionID) {
      txnStore[otpRequest.individualId] = response.transactionID;
    }

    res.json({
      message: 'OTP sent successfully',
      transactionID: response.transactionID,
      fullResponse: response
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- Authentication Endpoint ---
app.post('/authenticate', async (req, res) => {
  try {
    const authRequest: AuthRequestDTO = req.body;

  
    const txnId = txnStore[authRequest.individualId as string];

    if (!txnId) {
      return res.status(400).json({
        error: 'No OTP transaction found. Call /request-otp first.'
      });
    }

    authRequest.transactionID = txnId;

    const response = await client.authenticate(authRequest);

    res.json(response);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- eKYC Endpoint ---
app.post('/perform-ekyc', async (req, res) => {
  try {
    const ekycRequest: AuthRequestDTO = req.body;

    const txnId = txnStore[ekycRequest.individualId as string];

    if (!txnId) {
      return res.status(400).json({
        error: 'No OTP transaction found. Call /request-otp first.'
      });
    }

    ekycRequest.transactionID = txnId;

    const response = await client.performEkyc(ekycRequest);

    res.json(response);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(port, () => {
  console.log(`Fayda demo app running at http://localhost:${port}`);
});