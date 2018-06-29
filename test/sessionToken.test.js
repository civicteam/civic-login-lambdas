/* eslint-disable no-unused-expressions */

const { expect } = require('chai');
const session = require('../src/sessionToken');
const { config } = require('./assets/tests').indexTest;

// this proxy intercepts all function calls, and returns a function that does nothing,
// thereby switching off logging.
const silentLogger = new Proxy({}, { get: () => () => {} } );
const sessionToken = session(config.sessionToken, silentLogger);

describe('SessionToken Functions', () => {

  it('should set the user Id as the token subject', () => {
    const origUserId = 'userid-1';
    const token = sessionToken.create(origUserId, '1m');
    const userId = sessionToken.validate(token);
    expect(origUserId).to.equal(userId);
  });

  it('should create a valid session token from an object containing a user Id', () => {
    const origUserId = 'userid-1';
    const sessionTokenContents = {
      userId: origUserId
    };
    const token = sessionToken.create(sessionTokenContents, '1m');
    expect(token).to.be.a('string');
    expect(sessionToken.validate(token)).not.to.be.false;
  });

  it('should fail to validate an expired session token', () => {
    const origUserId = 'userid-1';
    const token = sessionToken.create(origUserId, '-1d');
    expect(sessionToken.validate(token)).to.be.false;
  });

  it('should validate an session token from event', () => {
    const origUserId = 'userid-1';
    const token = sessionToken.create(origUserId, '1m');
    const userId = sessionToken.validateFromEvent({ headers: { Authorization: token } });
    expect(origUserId).to.equal(userId);
  });

  it('should renew an session token from event', () => {
    const origUserId = 'userid-1';
    const token = sessionToken.create(origUserId, '1m');
    const newToken = sessionToken.keepAliveFromEvent({ headers: { Authorization: token } });
    expect(sessionToken.validate(newToken)).not.to.be.false;
  });
});
