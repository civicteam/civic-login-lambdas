const { expect } = require('chai');
const sinon = require('sinon');
const co = require('co');
const civicSip = require('civic-sip-api');
const sipClient = require('../src/sipClient');

const config = {
  appPartner: {},
  env: '',
  api: '',
};

describe.only('sip Client Functions', function test() {
  this.timeout(10000);
  // todo make a long lived one or figure how todo dynamically..
  const event = { event: 'scoperequest:data-received', type: 'code', response: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzNjg2MTRhYS0yNWJhLTQxNzctYTE5OC0wODFjNTNjOWJiOWIiLCJpYXQiOjE1MDI0NjAwMjQuNDgyLCJleHAiOjE1MDI0NjE4MjQuNDgyLCJpc3MiOiJjaXZpYy1zaXAtaG9zdGVkLXNlcnZpY2UiLCJhdWQiOiJodHRwczovL2FwaS5jaXZpYy5jb20vc2lwLyIsInN1YiI6ImJiYjEyMyIsImRhdGEiOnsiY29kZVRva2VuIjoiMzMwOWIzNGEtOGE5Zi00MTcxLThkOGMtMjA3MzZjNjYxYmMwIn19.8xcT8ZVc4Rh3xcjB1iRNj0hHFPw_K2s1cwTz8BeFzYTZ1OoFpXGvEP4zWTckFPUTcn1e3YhRtzbjf7g1qRKn3A' };
  const userData = {
    data: [{
      label: 'contact.personal.email', value: 'stewart@civic.com', isValid: true, isOwner: true,
    },
    {
      label: 'contact.personal.phoneNumber', value: '+44 111222333', isValid: true, isOwner: true,
    }],
    userId: '2a4243e4a9418d3f545b7d0f68c822197a9e24beeceea3b7ade7aa82bf662650',
  };

  it('exchangeCode', (done) => {
    const sampleExchangeCodeResponse = {};
    sampleExchangeCodeResponse.exchangeCode = () => ({
      data: 'data',
      userId: 'userId',
    });
    sinon.stub(civicSip, 'newClient').returns(sampleExchangeCodeResponse);
    co(function* coWrapper() {
      const configIn = {
        appId: 'sampleAppId',
        appSecret: 'sampleAppSecret',
        prvKey: 'samplePrvKey',
        env: config.env,
        api: config.api,
      };
      const data = yield sipClient.exchangeCode(configIn, event.response);

      expect(data.data).to.equal('data');
      expect(data.userId).to.equal('userId');
    })
      .then(done)
      .catch((err) => {
        done(err);
      });
  });

  it('extract email address from userData received from authToken', () => {
    const email = sipClient.getEmailFromUserData(userData);

    expect(email.value).to.equal('stewart@civic.com', 'can not get valid email from userData');
    expect(sipClient.getEmailFromUserData({ data: [{ label: 'some random', value: 'value' }] })).to.equal(undefined, 'no valid items in array returns undefined');
    expect(sipClient.getEmailFromUserData({ data: 'dfdfdf' })).to.equal(undefined, 'no array returns undefined');
    expect(sipClient.getEmailFromUserData({})).to.equal(undefined, 'empty object returns undefined');
    expect(sipClient.getEmailFromUserData(undefined)).to.equal(undefined, 'undefined returns undefined');
  });

  it('extract userId from userData', () => {
    const userId = sipClient.getUserIdFromUserData(userData);

    expect(userId).to.equal('2a4243e4a9418d3f545b7d0f68c822197a9e24beeceea3b7ade7aa82bf662650', 'can not get valid userId from userData');
    expect(sipClient.getUserIdFromUserData({})).to.equal(undefined, 'empty object returns undefined');
    expect(sipClient.getUserIdFromUserData(undefined)).to.equal(undefined, 'undefined returns undefined');
  });
});
