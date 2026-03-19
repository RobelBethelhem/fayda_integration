export const config = {
  'fayda.base.url': 'https://ida.fayda.et',
  'fayda.partner.id': 'fayda-ethswitch-partner-zemen-bank',
  'fayda.env': 'Production',
  'partnerId': 'fayda-ethswitch-partner-zemen-bank',
  'partnerApiKey': 'fayda-ethswitch-partner-zemen-bank-api',
  'mispLicenseKey': 'Zp4mQXtH9aCk2RydF7nWjL3uVbPSq8gTmhK1xDeNfUYr0BwCsGt',
  'ida.reference.id': 'PARTNER',
  'p12.path': './Production_FAYDA/keys',
  'p12.password': 'zemenqwertyXSW@',
  'ida.ssl.verify': 'false',
  'ida.otp.url': '${fayda.base.url}/idauthentication/v1/otp/${mispLicenseKey}/${partnerId}/${partnerApiKey}',
  'ida.auth.url': '${fayda.base.url}/idauthentication/v1/auth/${mispLicenseKey}/${partnerId}/${partnerApiKey}',
  'ida.ekyc.url': '${fayda.base.url}/idauthentication/v1/kyc/${mispLicenseKey}/${partnerId}/${partnerApiKey}',
  'ida.certificate.url': '${fayda.base.url}/mosip-certs/ida-partner.cer'
};
