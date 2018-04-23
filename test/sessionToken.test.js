/* eslint-disable no-unused-expressions, no-console */

// todo fix this
process.env.STAGE = 'dev';
process.env.IS_OFFLINE = true;

const { assert } = require('chai');
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
    const token = sessionToken.create(origUserId, '1m');
    assert(token, 'token not created');
    const userId = await sessionToken.validate(token);
    setTimeout(() => {
      assert(origUserId === userId, 'no valid user id');
      assert(sessionToken.test.verify(token, 60), 'token not valid');
    }, 3500);
  });

  it('validate an expired session token', async () => {
    const origUserId = 'userid-1';
    const token = sessionToken.create(origUserId, '0s');
    assert(token, 'token not created');
    const userId = await sessionToken.validate(token);
    setTimeout(() => {
      assert.strictEqual(origUserId, userId, 'no valid user id');
      assert(!sessionToken.test.verify(token, 1), 'token valid');
    }, 3500);
  });

  it('validate an session token from event', async () => {
    const origUserId = 'userid-1';
    const token = sessionToken.create(origUserId, '1m');
    assert(token, 'token not created');
    // console.log(token);
    const userId = await sessionToken.validateFromEvent({ headers: { Authorization: token } });
    // console.log(userId);
    setTimeout(() => {
      assert(origUserId === userId, 'no valid user id');

      assert(sessionToken.test.verify(token, 60), 'token not valid');
    }, 3500);
  });

  it('renew an session token from event', async () => {
    const origUserId = 'userid-1';
    const token = sessionToken.create(origUserId, '1m');
    assert(token, 'token not created');
    // console.log(token);
    const newToken = await sessionToken.keepAliveFromEvent({ headers: { Authorization: token } });
    setTimeout(() => {
      assert(sessionToken.test.verify(newToken, 60), 'new token not valid');
    }, 3500);
  });
});
