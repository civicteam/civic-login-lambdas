/* eslint-disable no-unused-expressions, no-console */

// todo fix this
process.env.STAGE = 'dev';
process.env.IS_OFFLINE = true;

const { assert } = require('chai');
const sessionToken = require('../sessionToken');

describe('SessionToken Functions', function test() {
  this.timeout(10000);

  it('create a valid session token', (done) => {
    const origUserId = 'userid-1';
    const token = sessionToken.create(origUserId, '1m');
    assert(token, 'token not created');
    // console.log(token);
    const userId = sessionToken.validate(token);
    // console.log(userId);
    assert(origUserId === userId, 'no valid user id');

    assert(sessionToken.test.verify(token, 60), 'token not valid');
    done();
  });

  it('validate an expired session token', (done) => {
    const origUserId = 'userid-1';
    const token = sessionToken.create(origUserId, '1s');
    assert(token, 'token not created');
    // console.log(token);
    const userId = sessionToken.validate(token);
    // console.log(userId);
    assert(origUserId === userId, 'no valid user id');

    setTimeout(() => {
      assert(!sessionToken.test.verify(token, 1), 'token valid');
      done();
    }, 3500);
  });

  it('validate an session token from event', (done) => {
    const origUserId = 'userid-1';
    const token = sessionToken.create(origUserId, '1m');
    assert(token, 'token not created');
    // console.log(token);
    const userId = sessionToken.validateFromEvent({ headers: { Authorization: token } });
    // console.log(userId);
    assert(origUserId === userId, 'no valid user id');

    assert(sessionToken.test.verify(token, 60), 'token not valid');
    done();
  });

  it('renew an session token from event', (done) => {
    const origUserId = 'userid-1';
    const token = sessionToken.create(origUserId, '1m');
    assert(token, 'token not created');
    // console.log(token);
    const newToken = sessionToken.keepAliveFromEvent({ headers: { Authorization: token } });

    assert(sessionToken.test.verify(newToken, 60), 'new token not valid');
    done();
  });
});
