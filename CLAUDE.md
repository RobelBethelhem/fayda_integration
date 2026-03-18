# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run build   # Compile TypeScript to dist/
npm run dev     # Run dev server via ts-node (no build needed)
npm start       # Run compiled server from dist/server.js
```

No test or lint commands are configured.

## Architecture

This is a thin Express.js wrapper around the `fayda-auth-client` SDK, providing REST endpoints for Fayda IDA (Identity Authentication) — OTP-based identity verification and eKYC used by Zemen Bank.

**Request flow:**
```
HTTP Client → Express (server.ts) → fayda-auth-client SDK → Fayda backend (https://api-internal.oracle1.fayda.et)
```

**Three endpoints (all POST):**
- `/request-otp` — initiates OTP; stores `transactionId` in in-memory `txnStore` keyed by `individualId`
- `/authenticate` — authenticates with OTP; requires prior OTP request (looks up `txnStore`)
- `/perform-ekyc` — fetches identity data; also requires prior OTP request

**Key files:**
- `src/server.ts` — Express app, endpoint handlers, in-memory `txnStore`
- `src/config.ts` — hardcoded credentials, URLs, and key paths (staging environment)
- `src/index.ts` — standalone example script for manual testing
- `keys/` — PKCS12 key and certificate used by the SDK for RSA-OAEP encryption and JWT signing

**SDK usage pattern:**
```ts
const client = IdaClientFactory.createIdaClient(config);
const response = await client.requestOtp(dto);
```

The SDK handles all cryptographic operations (RSA-OAEP encryption, JWT signing, AES-GCM decryption) internally using the keys in `keys/`.

## Configuration

All config is hardcoded in `src/config.ts` — no `.env` file. The P12 password is `zemenqwertyXSW@`. The app targets the staging environment.
