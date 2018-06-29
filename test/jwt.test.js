const { expect } = require('chai');
const jwt = require('../src/jwt');

describe('JWT Functions', () => {
  const { createToken, decode } = jwt;
  const sampleToken =
    'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyM2M0Y2JhNC0xODNkLTQyZmItYTViNi05YWExZTJmODU3NT' +
    'UiLCJpYXQiOjE1MzAyNjQyODMuOTA2LCJleHAiOjE1MzAzMDAyODMuOTA2LCJpc3MiOiJzYW1wbGVJc3N1ZXIiLCJhdWQiO' +
    'iJzYW1wbGVBdWRpZW5jZSIsInN1YiI6InNhbXBsZVN1YmplY3QiLCJkYXRhIjoic2FtcGxlUGF5bG9hZCJ9.73uxeFtf_0E' +
    'iCElNZagwDqzfRWmWM6Cwvvwcxvm72Qzf7Wxupq83061wNkzotYrCUlqpgWe0pflYRGfLaS2SoA';

  it('should createToken', () => {
    const data = createToken(
      'sampleIssuer',
      'sampleAudience',
      'sampleSubject',
      '10h',
      'samplePayload',
      'samplePrvKeyHex'
    );

    expect(data).to.include('eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9');
  });

  it('should decode token', () => {
    const data = decode(sampleToken);
    const stringifiedData = JSON.stringify(data);

    expect(stringifiedData).to.include('sampleIssuer');
    expect(stringifiedData).to.include('sampleAudience');
    expect(stringifiedData).to.include('sampleSubject');
    expect(stringifiedData).to.include('samplePayload');
  });
});
