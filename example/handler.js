const authFactory = require('../src/index');
const loginUtils = require('../src/util');

const config = {
  login: {
    app: {
      appId: '*** The appId you receive when setting up your app on integrate.civic.com',
      pubKey: '*** Your signing public key from integrate.civic.com',
      encPubKey: '*** Your encryption public key from integrate.civic.com'
    },
    sessionToken: {
      issuer: 'my-app-session-token',
      audience: 'https://my-url',
      subject: 'my-app-session-token',
      prvKey: '*** Your session token private key',
      pubKey: '*** Your session token public key'
    }
  }
};

// Add any service-specific login business logic here.
// userData contains a list of information about the logging in user.
// The details it wil contain depends on the information you requested in the login process.
// see docs.civic.com for details.
//
// This is an example implementation that simply checks that userData
// contains an email address, and includes that in a response
// Acceptable return values are objects, promises or null.
// Any return values will be added to the login response to the client
function loginCallback(event, userData) {
  const emailObject = loginUtils.getEmailFromUserData(userData);

  if (!emailObject) {
    throw Error(`Unable to find email address from userData ${userData}`);
  }

  const email = emailObject.value;
  const userId = loginUtils.getUserIdFromUserData(userData);

  return {
    email,
    userId
  };
}

const authHandler = authFactory(console, config.login, loginCallback);

const hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event
    })
  };

  callback(null, response);
};

module.exports = {
  hello,
  login: authHandler.login,
  keepAlive: authHandler.keepAlive,
  sessionAuthorizer: authHandler.sessionAuthorizer
};
