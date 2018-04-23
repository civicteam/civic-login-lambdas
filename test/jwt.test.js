const { expect } = require('chai');
const jwt = require('../src/jwt');

describe('JWT Functions', () => {
  const {
    createToken,
    verify,
    decode,
    createCivicExt,
    createPartnerToken,
    verifyPartnerToken,
  } = jwt;
  let token = '';
  let partnerToken = '';
  const HEX_PRVKEY = 'ee6f4f05a6f2b4005c19dfd0e9fcacd31c1c8f4102b51a62932934210ac7f9b0';
  const HEX_PUBKEY = '040a476f774d9b853825fa17dce901e4986452fbbc6d0503206d131bca993923cdc140485f127ee747efe0ca9a29a4998c34fea0e9c43b649e2d077dc6c9fb34dc';

  it('should createToken', () => {
    const data = createToken('sampleIssuer', 'sampleAudience', 'sampleSubject', '10h', 'samplePayload', 'samplePrvKeyHex');
    token = data;

    expect(data).to.include('eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9');
  });

  it.skip('should verify token', () => {
    verify(token);
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
    const PARTNER_SERVICES_HEX_KEY = '04b772fa849b79d810856173e0a4862c9c15bff5e5b8dfe3e1eced1592e33fbabb6a3117fd818860d37ef2f46170f2975c23ff7a4d2629cc3c5b504c2400d5ef1a';
    partnerToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJqdGkiOiJmODM2OWFjNy1hOWQyLTRmYzItYmFmZS00ZDY1ZmQwM2Y1M2QiLCJpYXQiOjE0OTcyOTYxMjMuNzQzLCJleHAiOjE0OTcyOTc5MjMuNzQzLCJpc3MiOiJjaXZpYy1zaXAtcGFydG5lci1zZXJ2aWNlIiwiYXVkIjoiaHR0cHM6Ly9hcGkuY2l2aWMuY29tL3NpcC8iLCJzdWIiOiJySmRBNzVPTVoiLCJkYXRhIjp7ImNsaWVudElkIjoickpkQTc1T01aIiwibmFtZSI6Indpa2lIb3ciLCJwcmltYXJ5Q29sb3IiOiJBODBCMDAiLCJ2ZXJpZmljYXRpb25MZXZlbCI6ImNpdmljQmFzaWMiLCJkZXNjcmlwdGlvbiI6IiRuYW1lIHdvdWxkIGxpa2UgdG8gYWNjZXNzIHRoZSBmb2xsb3dpbmcgZGF0YSBvbiB5b3VyIGlkZW50aXR5IiwibG9nbyI6Imh0dHBzOi8vd3d3Lndpa2lob3cuY29tL3NraW5zL293bC9pbWFnZXMvd2lraWhvd19sb2dvLnBuZyIsImNhbGxiYWNrVXJsIjoiaHR0cHM6Ly9waDR4NTgwODE1LmV4ZWN1dGUtYXBpLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tL2Rldi9zY29wZVJlcXVlc3QvMjU2ODNlZmMtNjQ2Yi00YTRlLTljZWItYmZlNGNmYTA5MzhhL2NhbGxiYWNrIiwic2Vjb25kYXJ5Q29sb3IiOiJGRkZGRkYifX0._JBAC6Ok4p2KbdkBBWH3SlfD9HbuUXN4GlxO27DY6USAqzFo0MVUBocAYeqtnEi0bzgEVLJ95C1KU3NfBM10kg';
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
    partnerToken = data;

    expect(data).to.include('eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ');
  });
});
