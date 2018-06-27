const { promisify } = require('util');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const uuidV4 = require('uuid/v4');
const sinon = require('sinon');
const Winston = require('winston');

const civicSip = require('civic-sip-api');
const createError = require('http-errors');

const logger = Winston;
const handler = require('../src/index');
const jwt = require('../src/jwt');
const LoginData = require('../src/loginData');
const { appId, config } = require('./assets/tests').indexTest;

chai.use(chaiAsPromised);
const { expect } = chai;
const authCode = uuidV4();

const payload = {
  codeToken: authCode
};

const authToken = jwt.createToken('my-service', 'hosted-url', appId, '10m', payload, 'hosted-expiry');

const sampleWarmEvent = {
  event: 'event',
  type: 'code',
  response: authToken,
  source: 'serverless-plugin-warmup'
};

const stubCivicClient = {
  exchangeCode: () => ({
    data: 'data',
    userId: 'userId'
  })
};

const stubCivicClientInvalidToken = {
  exchangeCode: () => {
    throw Error('Some token error');
  }
};

const loginHandler = handler(logger, config, () => {});
const loginPromise = promisify(loginHandler.login);

const loginAndGetUserId = async token => {
  const login = await loginPromise(
    {
      body: JSON.stringify({
        authToken: token
      })
    },
    {}
  );

  let authResp = null;
  await loginHandler.sessionAuthorizer(
    {
      authorizationToken: JSON.parse(login.body).sessionToken
    },
    {},
    (err, response) => {
      authResp = response;
    }
  );

  return {
    userId: authResp.context.userId,
    sessionToken: JSON.parse(login.body).sessionToken
  };
};

describe('Login Handler Functions', () => {
  const validLoginEvent = {
    body: JSON.stringify({
      authToken
    })
  };

  const loginEventMissingAuthToken = {
    body: JSON.stringify({})
  };

  describe('login', () => {
    it('should keep lambda warm with source event', async () => {
      const response = await loginPromise(sampleWarmEvent, {});
      expect(response).to.equal('Lambda is being kept warm!');
    });

    it('should reject login with no auth Token', () => {
      const responsePromise = loginPromise(loginEventMissingAuthToken, {});

      return expect(responsePromise).to.eventually.have.property('statusCode', 401);
    });

    describe('with an invalid token', () => {
      before(() => {
        sinon.stub(civicSip, 'newClient').returns(stubCivicClientInvalidToken);
      });

      after(() => {
        civicSip.newClient.restore();
      });

      it('returns an error on an unverified token', () => {
        const responsePromise = loginPromise(validLoginEvent, {});

        return expect(responsePromise).to.eventually.have.property('statusCode', 400);
      });
    });

    describe('with a valid token', () => {
      before(() => {
        sinon.stub(civicSip, 'newClient').returns(stubCivicClient);
      });

      after(() => {
        civicSip.newClient.restore();
      });

      it('login successfully given a valid authToken', async () => {
        const response = await loginPromise(validLoginEvent, {});
        expect(response.statusCode).to.equal(200);
        expect(JSON.parse(response.body)).to.be.an('object');
        expect(JSON.parse(response.body).sessionToken).to.be.an('string');
      });

      it('should delegate to the login callback to perform any business logic related to login', async () => {
        const loginCallback = sinon.stub().returns(Promise.resolve({}));
        const loginHandlerWithCallback = handler(logger, config, loginCallback);

        await promisify(loginHandlerWithCallback.login)(validLoginEvent, {});

        expect(loginCallback.called).to.equal(true);
      });

      it('should handle a null response from the login callback', async () => {
        const loginCallback = sinon.stub().returns(null);
        const loginHandlerWithCallback = handler(logger, config, loginCallback);

        const response = await promisify(loginHandlerWithCallback.login)(validLoginEvent, {});
        expect(response.statusCode).to.equal(200);
      });

      it('should throw an error if the login callback fails with some random error', async () => {
        const loginCallback = sinon.stub().throws(Error('some error occurred during login'));
        const loginHandlerWithCallback = handler(logger, config, loginCallback);

        const response = await promisify(loginHandlerWithCallback.login)(validLoginEvent, {});

        expect(response.statusCode).to.equal(500);
      });

      it('should rethrow the error from the login callback if it has a status', async () => {
        const loginCallback = sinon.stub().throws(createError(401, 'some error occurred during login'));
        const loginHandlerWithCallback = handler(logger, config, loginCallback);

        const response = await promisify(loginHandlerWithCallback.login)(validLoginEvent, {});

        expect(response.statusCode).to.equal(401);
      });

      it('should handle a rejected promise by the login callback the same as a thrown error', async () => {
        const rejectedPromise = Promise.reject(createError(401, 'some error occurred during login'));

        const loginCallback = sinon.stub().returns(rejectedPromise);
        const loginHandlerWithCallback = handler(logger, config, loginCallback);

        const response = await promisify(loginHandlerWithCallback.login)(validLoginEvent, {});

        expect(response.statusCode).to.equal(401);
      });

      it('should add any result from the login callback to the login response body', async () => {
        const loginCallbackResult = {
          someKey: 'someValue'
        };
        const loginCallback = sinon.stub().returns(Promise.resolve(loginCallbackResult));
        const loginHandlerWithCallback = handler(logger, config, loginCallback);

        const response = await promisify(loginHandlerWithCallback.login)(validLoginEvent, {});

        const bodyJSON = JSON.parse(response.body);
        expect(bodyJSON.someKey).to.equal(loginCallbackResult.someKey);
      });

      // eslint-disable-next-line max-len
      it('should add LoginData.loginResponse to the login response if the callback result is of type LoginData', async () => {
        const loginCallbackResult = new LoginData(
          {
            loginKey: 'loginValue'
          },
          {
            sessionTokenKey: 'sessionTokenValue'
          }
        );
        const loginCallback = sinon.stub().returns(Promise.resolve(loginCallbackResult));
        const loginHandlerWithCallback = handler(logger, config, loginCallback);

        const response = await promisify(loginHandlerWithCallback.login)(validLoginEvent, {});

        const bodyJSON = JSON.parse(response.body);
        expect(bodyJSON.loginKey).to.equal(loginCallbackResult.loginResponse.loginKey);
      });

      it(
        'should add LoginData.sessionTokenContents to the session token if the' +
          'callback result is of type LoginData',
        async () => {
          const loginCallbackResult = new LoginData(
            {
              loginKey: 'loginValue'
            },
            {
              sessionTokenKey: 'sessionTokenValue'
            }
          );
          const loginCallback = sinon.stub().returns(Promise.resolve(loginCallbackResult));
          const loginHandlerWithCallback = handler(logger, config, loginCallback);

          const response = await promisify(loginHandlerWithCallback.login)(validLoginEvent, {});

          const bodyJSON = JSON.parse(response.body);
          const token = bodyJSON.sessionToken;

          const decodedData = jwt.decode(token).payloadObj.data;
          expect(decodedData.sessionTokenKey).to.equal(loginCallbackResult.sessionTokenContents.sessionTokenKey);
        }
      );
    });
  });

  describe('the keepAlive service', () => {
    before(() => {
      sinon.stub(civicSip, 'newClient').returns(stubCivicClient);
    });

    after(() => {
      civicSip.newClient.restore();
    });

    const keepAlive = (event, context) =>
      new Promise(resolve => {
        loginHandler.keepAlive(event, context, (error, response) => {
          // resolve rather than reject here as we still produce an http response
          if (error) resolve(error);
          resolve(response);
        });
      });

    it('should keep lambda warm with source event', async () => {
      const response = await keepAlive(sampleWarmEvent, {}, (err, res) => res);
      expect(response).to.equal('Lambda is being kept warm!');
    });

    it('should renew a valid sessionToken', async () => {
      const login = await loginAndGetUserId(authToken);
      const keepAliveResponse = await keepAlive({
        headers: {
          Authorization: login.sessionToken
        },
        requestContext: {
          authorizer: {
            userId: login.userId
          }
        }
      });
      expect(keepAliveResponse.statusCode).to.equal(200);
      expect(JSON.parse(keepAliveResponse.body)).to.be.an('object');
      expect(JSON.parse(keepAliveResponse.body).sessionToken).to.be.a('string');
      expect(JSON.parse(keepAliveResponse.body).sessionToken).to.be.not.equal(login.sessionToken);
    });

    it('should not renew a missing session token', async () => {
      const keepAliveResponse = await keepAlive({
        headers: {
          Authorization: ''
        },
        requestContext: {
          authorizer: {
            userId: ''
          }
        }
      });

      expect(keepAliveResponse.statusCode).to.equal(401);
      expect(JSON.parse(keepAliveResponse.body).message).to.deep.equal('Unauthorized');
    });
  });

  describe('the session authorizer', () => {
    before(() => {
      sinon.stub(civicSip, 'newClient').returns(stubCivicClient);
    });

    after(() => {
      civicSip.newClient.restore();
    });

    const sessionAuthorizer = event =>
      new Promise(resolve => {
        loginHandler.sessionAuthorizer(event, {}, (error, response) => {
          // resolve rather than reject here as we still produce an http response
          if (error) resolve(error);

          resolve(response);
        });
      });

    it('should authorize a valid sessionToken', async () => {
      const loginResponse = await loginAndGetUserId(authToken);
      const sessionAuthorizerResponse = await sessionAuthorizer({
        authorizationToken: loginResponse.sessionToken
      });

      expect(sessionAuthorizerResponse.principalId).to.equal('user');
    });

    it('should return a 401 on an invalid sessionToken', async () => {
      const response = await sessionAuthorizer({
        authorizationToken: 'invalid'
      });

      expect(response).to.equal('Unauthorized');

      // Consider reenabling once
      // https://forums.aws.amazon.com/thread.jspa?threadID=226689 is resolved
      // expect(response.statusCode).to.equal(401);
    });

    it('should return a 401 on a missing sessionToken', async () => {
      const response = await sessionAuthorizer({});

      expect(response).to.equal('Unauthorized');

      // Consider reenabling once
      // https://forums.aws.amazon.com/thread.jspa?threadID=226689 is resolved
      // expect(response.statusCode).to.equal(401);
    });
  });
});
