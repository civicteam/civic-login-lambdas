/* eslint-disable max-len  */
const { expect } = require('chai');
const jwt = require('../src/jwt');

describe('JWT Functions', () => {
  const { createToken, decode } = jwt;
  let token = '';

  it('should createToken', () => {
    const data = createToken(
      'sampleIssuer',
      'sampleAudience',
      'sampleSubject',
      '10h',
      'samplePayload',
      'samplePrvKeyHex'
    );
    token = data;

    expect(data).to.include('eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9');
  });

  it('should decode token', () => {
    const data = decode(token);
    const stringifiedData = JSON.stringify(data);

    expect(stringifiedData).to.include('sampleIssuer');
    expect(stringifiedData).to.include('sampleAudience');
    expect(stringifiedData).to.include('sampleSubject');
    expect(stringifiedData).to.include('samplePayload');
  });
});
