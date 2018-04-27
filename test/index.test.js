const { expect } = require('chai');
const uuidV4 = require('uuid/v4');
const sinon = require('sinon');
const Winston = require('winston');
const civicSip = require('civic-sip-api');

const logger = Winston;

const co = require('co');
const handler = require('../src/index');
const { appId, config } = require('../assets/tests').indexTest;
const jwt = require('../src/jwt');

const authCode = uuidV4();

const payload = {
  codeToken: authCode
};

const authResponse = jwt.createToken('my-service', 'hosted-url', appId, '10m', payload, 'hosted-expiry');

const event = {
  event: 'scoperequest:data-received',
  type: 'code',
  response: authResponse
};

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

sandbox.stub(civicSip, 'newClient').returns(simpleExchangeCodeResponse);

const loginHandler = handler(logger, config, (err, response) => response);

const loginAndGetUserId = token =>
  new Promise((resolve, reject) => {
    const login = new Promise(resolveLogin => {
      loginHandler.login(
        {
          body: JSON.stringify({
            authToken: token
          })
        },
        {},
        (err, response) => {
          resolveLogin(response);
        }
      );
    });

    login
      .then(val => {
        const authResp = new Promise(resolveAuth => {
          loginHandler.sessionAuthorizer(
            {
              authorizationToken: JSON.parse(val.body).sessionToken
            },
            {},
            (err, response) => {
              resolveAuth(response);
            }
          );
        });

        authResp.then(authResVal => {
          resolve({
            userId: authResVal.context.userId,
            sessionToken: JSON.parse(val.body).sessionToken
          });
        });
      })
      .catch(err => {
        reject(err);
      });
  });

describe('Login Handler Functions', () => {
  it('login successfully given a valid authToken - new user', async () => {
    await co(function*() {
      const response = yield new Promise(resolve => {
        loginHandler.login(
          {
            body: JSON.stringify({
              authToken: event.response
            })
          },
          {},
          (err, res) => {
            resolve(res);
          }
        );
      });
      expect(response.statusCode).to.equal(200);
      expect(JSON.parse(response.body)).to.be.an('object');
      expect(JSON.parse(response.body).sessionToken).to.be.an('string');
    });
  });

  it('should keep lambda warm with source event', async () => {
    await co(function*() {
      const response = yield new Promise(resolve => {
        loginHandler.login(sampleWarmEvent, {}, (err, res) => {
          resolve(res);
        });
      });
      expect(response).to.equal('Lambda is being kept warm!');
    });
  });

  it('should reject login with no auth Token', async () => {
    await co(function*() {
      const response = yield new Promise(resolve => {
        loginHandler.login(
          {
            body: JSON.stringify({})
          },
          {},
          (err, res) => {
            resolve(res);
          }
        );
      });
      expect(response.statusCode).to.equal(400);
      expect(JSON.parse(response.body).message).to.equal('no authToken provided');
    });
  });

  it('should login successfully given a valid authToken - existing user', done => {
    co(function*() {
      const response = yield new Promise(resolve => {
        loginHandler.login(
          {
            body: JSON.stringify({
              authToken: event.response
            })
          },
          {},
          (err, res) => {
            resolve(res);
          }
        );
      });
      expect(response.statusCode).to.equal(200);
      expect(JSON.parse(response.body)).to.be.an('object');
      expect(JSON.parse(response.body).sessionToken).to.be.an('string');
    }).then(done, done);
  });

  it('show renew a valid sessionToken', async () => {
    const login = await loginAndGetUserId(event.response);
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

  it('should not renew a without sessionToken', async () => {
    const keepAliveWrapper = new Promise(resolve => {
      loginHandler.keepAlive(
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
        (err, response) => {
          resolve(response);
        }
      );
    });
    const keepAlive = await keepAliveWrapper;
    expect(keepAlive.statusCode).to.equal(401);
    expect(JSON.parse(keepAlive.body).message).to.deep.equal('Unauthorized');
  });
});
