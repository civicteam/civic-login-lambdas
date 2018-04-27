const { expect } = require('chai');
const sipClient = require('../src/sipClient');
const { response } = require('../assets/tests.json').sipClientTest;

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
        value: 'stewart@civic.com',
        isValid: true,
        isOwner: true
      },
      {
        label: 'contact.personal.phoneNumber',
        value: '+44 111222333',
        isValid: true,
        isOwner: true
      }
    ],
    userId: '2a4243e4a9418d3f545b7d0f68c822197a9e24beeceea3b7ade7aa82bf662650'
  };

  it('should exchangeCode', async () => {
    const configIn = {
      appId: 'sampleAppId',
      appSecret: 'sampleAppSecret',
      prvKey: 'samplePrvKey',
      env: '',
      api: ''
    };
    const data = await sipClient.exchangeCode(configIn, event.response);
    expect(data.data).to.equal('data');
    expect(data.userId).to.equal('userId');
  });

  it('should extract email address from userData received from authToken', () => {
    const email = sipClient.getEmailFromUserData(userData);

    expect(email.value).to.equal('stewart@civic.com', 'can not get valid email from userData');
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
