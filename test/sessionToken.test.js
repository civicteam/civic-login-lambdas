/* eslint-disable no-unused-expressions */

const { expect } = require('chai');
const session = require('../src/sessionToken');
const { config } = require('../assets/tests').indexTest;

const sessionToken = session(config.sessionToken);
describe('SessionToken Functions', () => {
  it('create a valid session token', () => {
    const origUserId = 'userid-1';
    const token = sessionToken.create(origUserId, '1m');
    expect(token).to.not.be.undefined;
    expect(token).to.be.a('string');
    const userId = sessionToken.validate(token);
    expect(origUserId).to.equal(userId);
    expect(sessionToken.test.verify(token, 60)).to.be.true;
  });

  it('validate an expired session token', () => {
    const origUserId = 'userid-1';
    const token = sessionToken.create(origUserId, '1s');
    expect(token).to.not.be.undefined;
    expect(token).to.be.a('string');
    const userId = sessionToken.validate(token);
    expect(origUserId).to.equal(userId);
    expect(sessionToken.test.verify(token, 1)).to.be.true;
  });

  it('validate an session token from event', () => {
    const origUserId = 'userid-1';
    const token = sessionToken.create(origUserId, '1m');
    expect(token).to.not.be.undefined;
    expect(token).to.be.a('string');
    const userId = sessionToken.validateFromEvent({ headers: { Authorization: token } });
    expect(origUserId).to.equal(userId);
    expect(sessionToken.test.verify(token, 60)).to.be.true;
  });

  it('renew an session token from event', () => {
    const origUserId = 'userid-1';
    const token = sessionToken.create(origUserId, '1m');
    expect(token).to.not.be.undefined;
    expect(token).to.be.a('string');
    const newToken = sessionToken.keepAliveFromEvent({ headers: { Authorization: token } });
    expect(sessionToken.test.verify(newToken, 60)).to.be.true;
  });
});
