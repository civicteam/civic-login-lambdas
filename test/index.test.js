const { expect } = require('chai');
const uuidV4 = require('uuid/v4');
const sinon = require('sinon');
const Winston = require('winston');
const civicSip = require('civic-sip-api');

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

const sandbox = sinon.createSandbox();
const simpleExchangeCodeResponse = {};

simpleExchangeCodeResponse.exchangeCode = () => ({
  data: 'data',
  userId: 'userId'
});

const loginHandler = handler(logger, config, (err, response) => response);

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
    sandbox.stub(civicSip, 'newClient').returns(simpleExchangeCodeResponse);
  });

  it('login successfully given a valid authToken - new user', async () => {
    const response = await loginHandler.login(
      {
        body: JSON.stringify({
          authToken: authResponse
        })
      },
      {},
      (err, res) => res
    );
    expect(response.statusCode).to.equal(200);
    expect(JSON.parse(response.body)).to.be.an('object');
    expect(JSON.parse(response.body).sessionToken).to.be.an('string');
  });

  it('should keep lambda warm with source event', async () => {
    const response = await loginHandler.login(sampleWarmEvent, {}, (err, res) => res);
    expect(response).to.equal('Lambda is being kept warm!');
  });

  it('should reject login with no auth Token', async () => {
    const response = await loginHandler.login(
      {
        body: JSON.stringify({})
      },
      {},
      (err, res) => res
    );
    expect(response.statusCode).to.equal(400);
    expect(JSON.parse(response.body).message).to.equal('no authToken provided');
  });

  it('should login successfully given a valid authToken - existing user', async () => {
    const response = await loginHandler.login(
      {
        body: JSON.stringify({
          authToken: authResponse
        })
      },
      {},
      (err, res) => res
    );
    expect(response.statusCode).to.equal(200);
    expect(JSON.parse(response.body)).to.be.an('object');
    expect(JSON.parse(response.body).sessionToken).to.be.an('string');
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
