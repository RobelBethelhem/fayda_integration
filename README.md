# Fayda Auth Client - JavaScript/TypeScript

A JavaScript/TypeScript SDK for integrating with Fayda IDA (Identity Authentication) services, providing OTP, Authentication, and eKYC functionality.

## Features

- **Framework Agnostic** - Works with any Node.js application
- **TypeScript Support** - Full TypeScript definitions included
- **Easy Integration** - Simple factory pattern for instantiation
- **Complete API Support** - OTP, Authentication, and eKYC endpoints
- **Cryptographic Security** - RSA-OAEP encryption, AES-GCM decryption, and JWT signing
- **PKCS12 Key Support** - Secure key and certificate management

## Installation

```bash
npm install fayda-auth-client@1.0.5
```

Endpoints
1. Request OTP

URL:

POST http://localhost:3000/request-otp

Request Body:

{
  "individualId": "8278536921561472",
  "individualIdType": "FAN",
  "otpChannel": ["EMAIL", "PHONE"]
}

Note: The default OTP value for testing is "111111".

2. Perform eKYC

URL:

POST http://localhost:3000/perform-ekyc

Request Body:

{
  "individualId": "8278536921561472",
  "individualIdType": "FAN",
  "otp": "111111"
}

Response ekyc data
3. Authenticate

URL:

POST http://localhost:3000/authenticate

Request Body:

{
  "individualId": "8278536921561472",
  "individualIdType": "FAN",
  "otp": "111111"
}

Response:
authToken(psut) token  (yes or no)