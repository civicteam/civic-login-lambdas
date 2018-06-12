const { expect } = require('chai');
const sinon = require('sinon');
const civicSip = require('civic-sip-api');
const sipClient = require('../src/sipClient');

const { response } = require('./assets/tests.json').sipClientTest;

describe('sip Client Functions', () => {
  const configIn = {
    appId: 'sampleAppId',
    appSecret: 'sampleAppSecret',
    prvKey: 'samplePrvKey',
    env: '',
    api: ''
  };

  const authToken = response;

  before(() => {
    const stubClient = {
      exchangeCode: sinon
        .stub()
        .withArgs(authToken)
        .returns({
          data: 'data',
          userId: 'userId'
        })
    };

    sinon
      .stub(civicSip, 'newClient')
      .withArgs(configIn)
      .returns(stubClient);
  });

  after(() => {
    civicSip.newClient.restore();
  });

  it('should exchangeCode', async () => {
    const data = await sipClient.exchangeCode(configIn, authToken);
    expect(data.data).to.equal('data');
    expect(data.userId).to.equal('userId');
  });
});
