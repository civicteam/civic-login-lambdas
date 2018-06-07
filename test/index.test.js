const { expect } = require('chai');
const uuidV4 = require('uuid/v4');
const sinon = require('sinon');
const Winston = require('winston');
const civicSip = require('civic-sip-api');
const createError = require('http-errors');

const logger = Winston;
const handler = require('../src/index');
const { appId, config } = require('../assets/tests').indexTest;
const jwt = require('../src/jwt');

const authCode = uuidV4();

const payload = {
  codeToken: authCode
};

const authResponse = jwt.createToken('my-service', 'hosted-url', appId, '10m', payload, 'hosted-expiry');

const sampleWarmEvent = {
  event: 'event',
  type: 'code',
  response: authResponse,
  source: 'serverless-plugin-warmup'
};

const stubCivicClient = {
  exchangeCode: () => ({
    data: 'data',
    userId: 'userId'
  })
};

const loginHandler = handler(logger, config, x => x);

const loginAndGetUserId = async token => {
  const login = await loginHandler.login(
    {
      body: JSON.stringify({
        authToken: token
      })
    },
    {},
    (err, response) => response
  );

  const authResp = await loginHandler.sessionAuthorizer(
    {
      authorizationToken: JSON.parse(login.body).sessionToken
    },
    {},
    (err, response) => response
  );

  return {
    userId: authResp.context.userId,
    sessionToken: JSON.parse(login.body).sessionToken
  };
};

describe('Login Handler Functions', () => {
  before(() => {
    sinon.stub(civicSip, 'newClient').returns(stubCivicClient);
  });

  after(() => {
    civicSip.newClient.restore();
  });

  const validLoginEvent = {
    body: JSON.stringify({
      authToken: authResponse
    })
  };

  const loginEventMissingAuthToken = {
    body: JSON.stringify({})
  };

  const lambdaCallback = (err, res) => res;
  const lambdaContext = {};

  it('login successfully given a valid authToken - new user', async () => {
    const response = await loginHandler.login(validLoginEvent, lambdaContext, lambdaCallback);
    expect(response.statusCode).to.equal(200);
    expect(JSON.parse(response.body)).to.be.an('object');
    expect(JSON.parse(response.body).sessionToken).to.be.an('string');
  });

  it('should keep lambda warm with source event', async () => {
    const response = await loginHandler.login(sampleWarmEvent, {}, (err, res) => res);
    expect(response).to.equal('Lambda is being kept warm!');
  });

  it('should reject login with no auth Token', async () => {
    const response = await loginHandler.login(loginEventMissingAuthToken, lambdaContext, lambdaCallback);
    expect(response.statusCode).to.equal(401);
    expect(JSON.parse(response.body).message).to.equal('no authToken provided');
  });

  it('should login successfully given a valid authToken - existing user', async () => {
    const response = await loginHandler.login(validLoginEvent, lambdaContext, lambdaCallback);
    expect(response.statusCode).to.equal(200);
    expect(JSON.parse(response.body)).to.be.an('object');
    expect(JSON.parse(response.body).sessionToken).to.be.an('string');
  });

  it('should delegate to the login callback to perform any business logic related to login', async () => {
    const loginCallback = sinon.stub().returns(Promise.resolve({}));
    const loginHandlerWithCallback = handler(logger, config, loginCallback);

    await loginHandlerWithCallback.login(validLoginEvent, lambdaContext, lambdaCallback);

    expect(loginCallback.called).to.equal(true);
  });

  it('should handle a null response from the login callback', async () => {
    const loginCallback = sinon.stub().returns(null);
    const loginHandlerWithCallback = handler(logger, config, loginCallback);

    await loginHandlerWithCallback.login(validLoginEvent, lambdaContext, lambdaCallback);

    expect(loginCallback.called).to.equal(true);
  });

  it('should throw a 500 error if the login callback fails with some random error', async () => {
    const loginCallback = sinon.stub().throws(Error('some error occurred during login'));
    const loginHandlerWithCallback = handler(logger, config, loginCallback);

    const response = await loginHandlerWithCallback.login(validLoginEvent, lambdaContext, lambdaCallback);
    console.log(response);
    expect(response.statusCode).to.equal(500);
  });

  it('should rethrow the error from the login callback if it has a status', async () => {
    const loginCallback = sinon.stub().throws(createError(401, 'some error occurred during login'));
    const loginHandlerWithCallback = handler(logger, config, loginCallback);

    const response = await loginHandlerWithCallback.login(validLoginEvent, lambdaContext, lambdaCallback);
    expect(response.statusCode).to.equal(401);
  });

  it('should handle a rejected promise by the login callback the same as a thrown error', async () => {
    const rejectedPromise = Promise.reject(createError(401, 'some error occurred during login'));

    const loginCallback = sinon.stub().returns(rejectedPromise);
    const loginHandlerWithCallback = handler(logger, config, loginCallback);

    const response = await loginHandlerWithCallback.login(validLoginEvent, lambdaContext, lambdaCallback);
    expect(response.statusCode).to.equal(401);
  });

  it('should add any result from the login callback to the login response body', async () => {
    const loginCallbackResult = {
      someKey: 'someValue'
    };
    const loginCallback = sinon.stub().returns(Promise.resolve(loginCallbackResult));
    const loginHandlerWithCallback = handler(logger, config, loginCallback);

    const response = await loginHandlerWithCallback.login(validLoginEvent, lambdaContext, lambdaCallback);

    const bodyJSON = JSON.parse(response.body);
    expect(bodyJSON.someKey).to.equal(loginCallbackResult.someKey);
  });

  it('show renew a valid sessionToken', async () => {
    const login = await loginAndGetUserId(authResponse);
    const keepAliveWrapper = new Promise(resolve => {
      loginHandler.keepAlive(
        {
          headers: {
            Authorization: login.sessionToken
          },
          requestContext: {
            authorizer: {
              userId: login.userId
            }
          }
        },
        {},
        (err, response) => {
          resolve(response);
        }
      );
    });
    const keepAlive = await keepAliveWrapper;
    expect(keepAlive.statusCode).to.equal(200);
    expect(JSON.parse(keepAlive.body)).to.be.an('object');
    expect(JSON.parse(keepAlive.body).sessionToken).to.be.an('string');
    expect(JSON.parse(keepAlive.body).sessionToken).to.be.not.equal(login.sessionToken);
  });

  it('should not renew a missing session token', async () => {
    const keepAliveWrapper = loginHandler.keepAlive(
      {
        headers: {
          Authorization: ''
        },
        requestContext: {
          authorizer: {
            userId: ''
          }
        }
      },
      {},
      (err, response) => response
    );
    expect(keepAliveWrapper.statusCode).to.equal(401);
    expect(JSON.parse(keepAliveWrapper.body).message).to.deep.equal('Unauthorized');
  });
});
