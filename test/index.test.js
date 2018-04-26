const { expect } = require('chai');
const uuidV4 = require('uuid/v4');
const handler = require('../src/index');
const sinon = require('sinon');
const Winston = require('winston');
const civicSip = require('civic-sip-api');

const { appId, config } = require('../assets/tests');

const logger = Winston;

const co = require('co');
const jwt = require('../src/jwt');

const authCode = uuidV4();

const sandbox = sinon.createSandbox();
const payload = {
  codeToken: authCode,
};


const authResponse = jwt.createToken(
  'civic-sip-hosted-service',
  'hostedServices.SIPHostedService.base_url',
  appId,
  '10m',
  payload,
  'hostedServices.SIPHostedService.hexprv',
);

const event = {
  event: 'scoperequest:data-received',
  type: 'code',
  response: authResponse,
};

const sampleWarmEvent = {
  event: 'scoperequest:data-received',
  type: 'code',
  response: authResponse,
  source: 'serverless-plugin-warmup',
};

const scopeRequest = {
  save: () => {},
  update: () => {},
};

const userPartner = {
  findByEmail: () => {},
  delete: () => {},
};

const partner = {
  findByDomain: () => {},
  delete: () => {},
  insert: () => {},
};
const appPartner = {
  findByAppPartner: () => {},
};
const simpleExchangeCodeResponse = {};

simpleExchangeCodeResponse.exchangeCode = () => ({
  data: 'data',
  userId: 'userId',
});

const samplePromise = Promise.resolve(('Sample Promise'));
sandbox.stub(scopeRequest, 'save').returns(samplePromise);
sandbox.stub(userPartner, 'findByEmail').returns({});
sandbox.stub(userPartner, 'delete').returns({});
sandbox.stub(partner, 'findByDomain').returns({});
sandbox.stub(partner, 'delete').returns({});
sandbox.stub(partner, 'insert').returns({});
sandbox.stub(appPartner, 'findByAppPartner').returns({});
sandbox.stub(civicSip, 'newClient').returns(simpleExchangeCodeResponse);

const loginHandler = handler(logger, config, (err, response) => response);

const validScopeRequest = {
  authCode,
  uuid: uuidV4(),
  response: config.response,
  appId,
  browserFlowEnabled: false,
};

const loginAndGetUserId = token => new Promise((resolve, reject) => {
  const login = new Promise((resolveLogin) => {
    loginHandler.login({
      body: JSON.stringify({
        authToken: token,
      }),
    }, {}, (err, response) => {
      resolveLogin(response);
    });
  });

  login.then((val) => {
    const authResp = new Promise((resolveAuth) => {
      loginHandler.sessionAuthorizer({
        authorizationToken: JSON.parse(val.body).sessionToken,
      }, {}, (err, response) => {
        resolveAuth(response);
      });
    });

    authResp.then((authResVal) => {
      resolve({
        userId: authResVal.context.userId,
        sessionToken: JSON.parse(val.body).sessionToken,
      });
    });
  }).catch((err) => {
    reject(err);
  });
});


describe('Partner Handler Functions', () => {
  before((done) => {
    co(function* coWrapper() {
      yield scopeRequest.save(validScopeRequest);

      const user2 = yield userPartner.findByEmail('savio+unittest1@civic.com');
      if (user2) {
        yield userPartner.delete(user2.userId);
      }

      const user = yield userPartner.findByEmail('stewart@test.com');
      if (user) {
        yield userPartner.delete(user.userId);
      }
      const user1 = yield userPartner.findByEmail('stewart@civic.com');
      if (user1) {
        yield userPartner.delete(user1.userId);
      }
      const partnerDoc = yield partner.findByDomain('test.com');
      if (partnerDoc) {
        yield partner.delete(partnerDoc.appId);
        const apps = yield appPartner.findByAppPartner(partnerDoc.appId);
        if (apps) {
          for (let i = 0; i < apps.length; i += 1) {
            const app = apps[i];
            yield appPartner.delete(app.applicationId);
          }
        }
      }

      const partnerDoc2 = yield partner.findByDomain('civic.com');
      if (partnerDoc2) {
        yield partner.delete(partnerDoc2.appId);
      }

      const partnerDoc3 = yield partner.findByDomain('domaininuse.com');
      if (partnerDoc3) {
        yield partner.delete(partnerDoc3.appId);
      }

      yield partner.insert({
        browserFlowEnabled: false,
        primaryDomain: 'domaininuse.com',
        name: 'test',
        primaryContactName: 'John',
        primaryContactEmail: 'someone@civic.com',
        primaryContactPhoneNumber: '+15595496152',
      }, {
        email: 'someuser@domaininuse.com',
      });
    }).then(done, done);
  });

  it('login successfully given a valid authToken - new user', async () => {
    await co(function* coWrapper() {
      const response = yield new Promise((resolve) => {
        loginHandler.login({
          body: JSON.stringify({
            authToken: event.response,
          }),
        }, {}, (err, res) => {
          resolve(res);
        });
      });
      expect(response.statusCode).to.equal(200);
      expect(JSON.parse(response.body)).to.be.an('object');
      expect(JSON.parse(response.body).sessionToken).to.be.an('string');
    });
  });

  it('keep lambda warm with source event', async () => {
    await co(function* coWrapper() {
      const response = yield new Promise((resolve) => {
        loginHandler.login(sampleWarmEvent, {}, (err, res) => {
          resolve(res);
        });
      });
      expect(response).to.equal('Lambda is being kept warm!');
    });
  });

  it('reject login with no auth Token', async () => {
    await co(function* coWrapper() {
      const response = yield new Promise((resolve) => {
        loginHandler.login({
          body: JSON.stringify({
          }),
        }, {}, (err, res) => {
          resolve(res);
        });
      });
      expect(response.statusCode).to.equal(400);
      expect(JSON.parse(response.body).message).to.equal('no authToken provided');
    });
  });

  it('login successfully given a valid authToken - existing user', (done) => {
    co(function* coWrapper() {
      const user = yield userPartner.findByEmail('stewart@civic.com');
      if (!user) {
        yield userPartner.insert({
          email: 'stewart@civic.com',
        });
      }
      const response = yield new Promise((resolve) => {
        loginHandler.login({
          body: JSON.stringify({
            authToken: event.response,
          }),
        }, {}, (err, res) => {
          resolve(res);
        });
      });
      expect(response.statusCode).to.equal(200);
      expect(JSON.parse(response.body)).to.be.an('object');
      expect(JSON.parse(response.body).sessionToken).to.be.an('string');
    }).then(done, done);
  });

  it('renew a valid sessionToken', async () => {
    const login = await loginAndGetUserId(event.response);
    const keepAliveWrapper = new Promise((resolve) => {
      loginHandler.keepAlive({
        headers: {
          Authorization: login.sessionToken,
        },
        requestContext: {
          authorizer: {
            userId: login.userId,
          },
        },
      }, {}, (err, response) => {
        resolve(response);
      });
    });
    const keepAlive = await keepAliveWrapper;
    expect(keepAlive.statusCode).to.equal(200);
    expect(JSON.parse(keepAlive.body)).to.be.an('object');
    expect(JSON.parse(keepAlive.body).sessionToken).to.be.an('string');
    expect(JSON.parse(keepAlive.body).sessionToken).to.be.not.equal(login.sessionToken);
  });

  it('renew a without sessionToken', async () => {
    const keepAliveWrapper = new Promise((resolve) => {
      loginHandler.keepAlive({
        headers: {
          Authorization: '',
        },
        requestContext: {
          authorizer: {
            userId: '',
          },
        },
      }, {}, (err, response) => {
        resolve(response);
      });
    });
    const keepAlive = await keepAliveWrapper;
    expect(keepAlive.statusCode).to.equal(401);
    expect(JSON.parse(keepAlive.body).message).to.deep.equal('Unauthorized');
  });
});
