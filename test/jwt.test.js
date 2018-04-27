const { expect } = require('chai');
const jwt = require('../src/jwt');
const {
  partnerToken, HEX_PRVKEY, HEX_PUBKEY, PARTNER_SERVICES_HEX_KEY,
} = require('../assets/tests').JwtTest;

describe('JWT Functions', () => {
  const {
    createToken,
    decode,
    createCivicExt,
    createPartnerToken,
    verifyPartnerToken,
  } = jwt;
  let token = '';

  it('should createToken', () => {
    const data = createToken('sampleIssuer', 'sampleAudience', 'sampleSubject', '10h', 'samplePayload', 'samplePrvKeyHex');
    token = data;

    expect(data).to.include('eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9');
  });

  /**
   * 1. load public key HEX_PUBKEY_NIST into ECDSA object from hex string.
   * 2. retrieve PEM format of key.
   * 3. verify JWT Token signed with HEX_PRVKEY_NIST.
   */
  it('should verify a JWT token issued for a partner using ES256k key', async () => {
    const sampleToken = createPartnerToken('civic-sip-partner-service', 'https://api.civic.com/sip/', 'aaa123', '0m', { status: 'Test' }, HEX_PRVKEY);

    const result = await verifyPartnerToken(sampleToken, HEX_PUBKEY);

    expect(result).to.equals(true);
  });

  it('should verify the partner token', () => {
    const result = verifyPartnerToken(partnerToken, PARTNER_SERVICES_HEX_KEY);
    expect(result).to.equal(true);
  });

  it('should decode token', () => {
    const data = decode(token);
    const stringifiedData = JSON.stringify(data);

    expect(stringifiedData).to.include('sampleIssuer');
    expect(stringifiedData).to.include('sampleAudience');
    expect(stringifiedData).to.include('sampleSubject');
    expect(stringifiedData).to.include('samplePayload');
  });

  it('should createCivicExt', () => {
    const data = createCivicExt('sampleBodyObject', 'sampleAccessSecret');

    expect(data).to.equal('rOoDiZWsb0nh5Y8sMBPMd3jz0HZGC9PzxiBO5gTolU8=');
  });

  it('should createPartnerToken', () => {
    const data = createPartnerToken('sampleIssuer', 'sampleAudience', 'sampleSubject', '10h', 'samplePayload', 'samplePrvKeyHex');
    expect(data).to.include('eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ');
  });
});
