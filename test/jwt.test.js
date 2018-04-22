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

  it('should createToken', () => {
    const data = createToken('sampleIssuer', 'sampleAudience', 'sampleSubject', '10h', 'samplePayload', 'samplePrvKeyHex');
    token = data;

    expect(data).to.include('eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9');
  });

  it.skip('should verify token', () => {
    verify(token);
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

  it.skip('should verifyPartnerToken', () => {
    verifyPartnerToken(partnerToken, 'samplePrvKeyHex');
  });
});
