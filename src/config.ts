export const config = {
  'fayda.base.url': 'https://api-internal.oracle1.fayda.et',
  'fayda.partner.id': 'fayda-partner-zemen-bank',
  'fayda.env': 'Staging',
  'partnerId': 'fayda-partner-zemen-bank',
  'partnerApiKey': 'fayda-partner-zemen-bank-api',
  'mispLicenseKey': 'jq8Ta9gRaETEpbBiaOipDDylI0rA5JfhAfirZxFANw2Wj4cQ6n',
  'ida.reference.id': 'PARTNER',
  'p12.path': './keys',
  'p12.password': 'zemenqwertyXSW@',
  'ida.ssl.verify': 'false',
  'ida.otp.url': '${fayda.base.url}/idauthentication/v1/otp/${mispLicenseKey}/${partnerId}/${partnerApiKey}',
  'ida.auth.url': '${fayda.base.url}/idauthentication/v1/auth/${mispLicenseKey}/${partnerId}/${partnerApiKey}',
  'ida.ekyc.url': '${fayda.base.url}/idauthentication/v1/kyc/${mispLicenseKey}/${partnerId}/${partnerApiKey}',
  'ida.certificate.url': '${fayda.base.url}/mosip-certs/ida-partner.cer'
};