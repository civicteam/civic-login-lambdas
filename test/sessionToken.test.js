/* eslint-disable no-unused-expressions, no-console */

const { expect } = require('chai');
const session = require('../src/sessionToken');

const configSession = {
  issuer: '',
  audience: '',
  subject: '',
  pubKey: '',
  prvKey: '',
};
const sessionToken = session(configSession);
describe('SessionToken Functions', function test() {
  this.timeout(10000);

  it('create a valid session token', async () => {
    const origUserId = 'userid-1';
    const token = await sessionToken.create(origUserId, '1m');
    expect(token).to.not.be.undefined;
    expect(token).to.be.a('string');
    const userId = await sessionToken.validate(token);
    expect(origUserId).to.equal(userId);
    const verified = await sessionToken.test.verify(token, 60)
    expect(verified).to.be.true;
  });

  it('validate an expired session token', async () => {
    const origUserId = 'userid-1';
    const token = await sessionToken.create(origUserId, '1s');
    expect(token).to.not.be.undefined;
    expect(token).to.be.a('string');
    const userId = await sessionToken.validate(token);
    setTimeout(() => {
      expect(origUserId).to.equal(userId);
      expect(sessionToken.test.verify(token, 1)).to.be.true;
    }, 3500);
  });

  it('validate an session token from event', async () => {
    const origUserId = 'userid-1';
    const token = await sessionToken.create(origUserId, '1m');
    expect(token).to.not.be.undefined;
    expect(token).to.be.a('string');
    const userId = await sessionToken.validateFromEvent({ headers: { Authorization: token } });
    setTimeout(() => {
      expect(origUserId).to.equal(userId);
      expect(sessionToken.test.verify(token, 60)).to.be.true;
    }, 3500);
  });

  it('renew an session token from event', async () => {
    const origUserId = 'userid-1';
    const token = await sessionToken.create(origUserId, '1m');
    expect(token).to.not.be.undefined;
    expect(token).to.be.a('string');
    const newToken = await sessionToken.keepAliveFromEvent({ headers: { Authorization: token } });
    setTimeout(() => {
      expect(sessionToken.test.verify(newToken, 60)).to.be.true;
    }, 3500);
  });
});
