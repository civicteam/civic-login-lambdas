const { expect } = require('chai');
const sipClient = require('../src/sipClient');
const civicSip = require('civic-sip-api');
const { response } = require('../assets/tests.json').sipClientTest;
const sinon = require('sinon');

describe('sip Client Functions', () => {
  const event = {
    event: 'scoperequest:data-received',
    type: 'code',
    response
  };
  const userData = {
    data: [
      {
        label: 'contact.personal.email',
        value: 'myemail@yahoo.com',
        isValid: true,
        isOwner: true
      },
      {
        label: 'contact.personal.phoneNumber',
        value: '+44 555666333',
        isValid: true,
        isOwner: true
      }
    ],
    userId: '2a4243e4a9418d3f545b7d0f68c822197a9e24beeceea3b7ade7aa82bf662650'
  };

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
      exchangeCode: sinon.stub().withArgs(authToken).returns({
        data: 'data',
        userId: 'userId'
      })
    };

    sinon.stub(civicSip, 'newClient')
      .withArgs(configIn)
      .returns(stubClient);
  });

  after(() => {
    civicSip.newClient.restore()
  });

  it('should exchangeCode', async () => {

    const data = await sipClient.exchangeCode(configIn, authToken);
    expect(data.data).to.equal('data');
    expect(data.userId).to.equal('userId');
  });

  it('should extract email address from userData received from authToken', () => {
    const email = sipClient.getEmailFromUserData(userData);

    expect(email.value).to.equal('myemail@yahoo.com', 'can not get valid email from userData');
    expect(sipClient.getEmailFromUserData({ data: [{ label: 'some random', value: 'value' }] })).to.equal(
      undefined,
      'no valid items in array returns undefined'
    );
    expect(sipClient.getEmailFromUserData({ data: 'dfdfdf' })).to.equal(undefined, 'no array returns undefined');
    expect(sipClient.getEmailFromUserData({})).to.equal(undefined, 'empty object returns undefined');
    expect(sipClient.getEmailFromUserData(undefined)).to.equal(undefined, 'undefined returns undefined');
  });

  it('should extract userId from userData', () => {
    const userId = sipClient.getUserIdFromUserData(userData);

    expect(userId).to.equal(
      '2a4243e4a9418d3f545b7d0f68c822197a9e24beeceea3b7ade7aa82bf662650',
      'can not get valid userId from userData'
    );
    expect(sipClient.getUserIdFromUserData({})).to.equal(undefined, 'empty object returns undefined');
    expect(sipClient.getUserIdFromUserData(undefined)).to.equal(undefined, 'undefined returns undefined');
  });
});
