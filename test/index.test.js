/* eslint-disable no-unused-expressions, no-console, max-len  */
const { expect } = require('chai');
const uuidV4 = require('uuid/v4');
const handler = require('../src/index');
const sinon = require('sinon');
const Winston = require('winston');
const civicSip = require('civic-sip-api');

const logger = Winston;

const co = require('co');
const jwt = require('../src/jwt');
// const hostedServices = require('../lib/HostedServices').hostedServices;

const authCode = uuidV4();
const appId = 'HkEQPA4YZ';
const sandbox = sinon.createSandbox();
const payload = {
  codeToken: authCode,
};

const config = {
  app: {
    appId: 'HkEQPA4YZ',
    appSecret: '',
    prvKey: '',
  },
  sessionToken: {
    issuer: '',
    audience: '',
    subject: '',
    pubKey: '',
    prvKey: '',
  },
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

const loginHandler = handler(logger, config);

const validScopeRequest = {
  authCode,
  uuid: uuidV4(),
  response: '{"userId": "c6d5795f8a059ea5ad29a33a60f8b402a172c3e0bbe50fd230ae8e0303609b51", "attestations": [{ "label": "contact.personal.email", "data": { "label": "contact.personal.email", "value": "stewart@civic.com", "salt": "22fe29019f00d65fd6e77c7f5d0ef447c962cc2c8518697fdc79ec65bf5b89ab", "hash": "c0ec965ae6a1ea02a4f641af5daa85f9f8216475472e2895151d44c26442c442", "proof": [{ "right": "2a5de832ccc0d88113e4a61cc705dee4159d84f53b094dfb30149b71f4a857ff" }, { "left": "356f17c4dec59fa3c71f7fe89b722e6b6ddd06bfc2cdc83a92d5a7b20b11fbbc" }, { "right": "a6cfafc548e991cb42132f127dbdf81faef59032b1061be3559a908ab63b6a29" }, { "right": "0c0ce95debb978f7f6bb08a7cb9d3d5004960f9879213819da2a5d8ee0948286" }] }, "attnData": "9d20621129e93177178d3bd87be852fae37276ae15f9625536d2bf17ddd58091", "attnLabel": "attCivicBasic", "attn": { "attestation": { "request": { "clientId": "bbb123bbb123", "url": "http://localhost:3001/dev/scopeRequest/2c3ab8f6-3069-42cf-8152-ecca6e3bd09d/callback", "label": "attCivicBasic", "signature": "3045022100e9888ce09d8f2ec7b5f5b40f38cba7d459d807c69b47b03a77c6579260e577b2022071742d3751b638abd2e65f76af7f2cd1348901887cb191310d92c73f22e32bb4" }, "attestation": { "cosigners": [{ "xpub": "xpub661MyMwAqRbcGWqz8mWY7A72pgua8KBiE4Vuj5TmnMcvNpxTzZsCoJqfGrcsz528Z4qyG9rEVmpr1zWxuTmQDyaDY4BUkCX3L6rmvE6Svse" }, { "xpub": "xpub661MyMwAqRbcFgT4S5aRfUiR4DAbipHSSYinYUTQqvEC4su2QevBkUcvDQDkzK3uiB3e5bfqYjje4XPdR93nbeZQGg48zph9eMvHizCQE6R" }], "tx": "010000000001013c09c09d0e1c9acec5a2f980d43e055ac7be2072b9e0d81b774d7973d35063400200000023220020b3cbc1ea1d042464311b1e4380c9e931f512b8616061bdcbc82396992f338ba2ffffffff05551500000000000017a91450c1cdfc2cf3cd26d4b93a584a7847cc633a10dc87551500000000000017a914ed954b52cb9811cc5dc6dc2f5e9da459a202e73787551500000000000017a9146662eab8a5438e429dea4e321a238d8f77555f43876ea360000000000017a914ee1f7d332baa07a4311bab20625fd6955a82d20987551500000000000017a914fbf03ba04196dd25fac35ec21c16f9623bcae59b870400483045022100839178fae0498b7104f7284208560688fc8877dc63742f77cd1ca74b435b9ead02201d13c6676c1c5f0dd807de961afba038d92a638a1afb6d8fefd059df4cd89f8701473044022027efdcd05049e4d5e7bdde0a01345f9b57317007d8e9968ebf570cbc8538dc22022049bc36e7471e40e00fe52af0067d8b1a2a34503716b44576715834b5f54764310169522102db7fc7db5dfe71824629ad3b3a994321799ed08506c43a65ecba213392dcb9a0210225bd617137dc72dd43cff4152d160dfe52399d4a852fbba5c6f8d65f9c56c05d2103f97a39989525eb5eedecca2946376c4b7f02365d7759f98e16dd5a239e643d5453ae00000000", "type": "permanent", "subject": { "label": "attCivicBasic", "data": "9d20621129e93177178d3bd87be852fae37276ae15f9625536d2bf17ddd58091", "xpub": "xpub661MyMwAqRbcFicU35hHYgpZwQDtGLYucWqAPTLGhya4rAzEBjGgkcJy4Qt5vRpJ8WzKNSPMWX3YPZ7FZEaYnqTwY9jzLjWvbbzEQJerGht", "signature": "3045022100c217fcca2dad21e404fe1168ad42876688ab2afa1f700f098e1b3fb4510dcddf022026237e36404e00b93ccbde9b85aec5ce4cabb01670923ce6531cab0bf8a7c8a8" }, "authority": { "xpub": "xpub661MyMwAqRbcEcNFQXdFJJHkaCvSsqvh6MT4zwZGG1mJQk9CPMnzV8BkAfUhqbFPeLavqk2dMb4j4ac4cqnfyu8xspwjGe7wTzTKgvReXgf", "path": "/0/0/11/1221" }, "network": "bitcoin" } } } }, { "label": "contact.personal.phoneNumber", "data": { "label": "contact.personal.phoneNumber", "value": "+27 823547259", "salt": "7c02ea3b9f3a156c7b59297a28b62465e2a9dd34aa7e4a87cee68af759fd0185", "hash": "2a5de832ccc0d88113e4a61cc705dee4159d84f53b094dfb30149b71f4a857ff", "proof": [{ "left": "c0ec965ae6a1ea02a4f641af5daa85f9f8216475472e2895151d44c26442c442" }, { "left": "356f17c4dec59fa3c71f7fe89b722e6b6ddd06bfc2cdc83a92d5a7b20b11fbbc" }, { "right": "a6cfafc548e991cb42132f127dbdf81faef59032b1061be3559a908ab63b6a29" }, { "right": "0c0ce95debb978f7f6bb08a7cb9d3d5004960f9879213819da2a5d8ee0948286" }] }, "attnData": "9d20621129e93177178d3bd87be852fae37276ae15f9625536d2bf17ddd58091", "attnLabel": "attCivicBasic", "attn": { "attestation": { "request": { "clientId": "bbb123bbb123", "url": "http://localhost:3001/dev/scopeRequest/2c3ab8f6-3069-42cf-8152-ecca6e3bd09d/callback", "label": "attCivicBasic", "signature": "3045022100e9888ce09d8f2ec7b5f5b40f38cba7d459d807c69b47b03a77c6579260e577b2022071742d3751b638abd2e65f76af7f2cd1348901887cb191310d92c73f22e32bb4" }, "attestation": { "cosigners": [{ "xpub": "xpub661MyMwAqRbcGWqz8mWY7A72pgua8KBiE4Vuj5TmnMcvNpxTzZsCoJqfGrcsz528Z4qyG9rEVmpr1zWxuTmQDyaDY4BUkCX3L6rmvE6Svse" }, { "xpub": "xpub661MyMwAqRbcFgT4S5aRfUiR4DAbipHSSYinYUTQqvEC4su2QevBkUcvDQDkzK3uiB3e5bfqYjje4XPdR93nbeZQGg48zph9eMvHizCQE6R" }], "tx": "010000000001013c09c09d0e1c9acec5a2f980d43e055ac7be2072b9e0d81b774d7973d35063400200000023220020b3cbc1ea1d042464311b1e4380c9e931f512b8616061bdcbc82396992f338ba2ffffffff05551500000000000017a91450c1cdfc2cf3cd26d4b93a584a7847cc633a10dc87551500000000000017a914ed954b52cb9811cc5dc6dc2f5e9da459a202e73787551500000000000017a9146662eab8a5438e429dea4e321a238d8f77555f43876ea360000000000017a914ee1f7d332baa07a4311bab20625fd6955a82d20987551500000000000017a914fbf03ba04196dd25fac35ec21c16f9623bcae59b870400483045022100839178fae0498b7104f7284208560688fc8877dc63742f77cd1ca74b435b9ead02201d13c6676c1c5f0dd807de961afba038d92a638a1afb6d8fefd059df4cd89f8701473044022027efdcd05049e4d5e7bdde0a01345f9b57317007d8e9968ebf570cbc8538dc22022049bc36e7471e40e00fe52af0067d8b1a2a34503716b44576715834b5f54764310169522102db7fc7db5dfe71824629ad3b3a994321799ed08506c43a65ecba213392dcb9a0210225bd617137dc72dd43cff4152d160dfe52399d4a852fbba5c6f8d65f9c56c05d2103f97a39989525eb5eedecca2946376c4b7f02365d7759f98e16dd5a239e643d5453ae00000000", "type": "permanent", "subject": { "label": "attCivicBasic", "data": "9d20621129e93177178d3bd87be852fae37276ae15f9625536d2bf17ddd58091", "xpub": "xpub661MyMwAqRbcFicU35hHYgpZwQDtGLYucWqAPTLGhya4rAzEBjGgkcJy4Qt5vRpJ8WzKNSPMWX3YPZ7FZEaYnqTwY9jzLjWvbbzEQJerGht", "signature": "3045022100c217fcca2dad21e404fe1168ad42876688ab2afa1f700f098e1b3fb4510dcddf022026237e36404e00b93ccbde9b85aec5ce4cabb01670923ce6531cab0bf8a7c8a8" }, "authority": { "xpub": "xpub661MyMwAqRbcEcNFQXdFJJHkaCvSsqvh6MT4zwZGG1mJQk9CPMnzV8BkAfUhqbFPeLavqk2dMb4j4ac4cqnfyu8xspwjGe7wTzTKgvReXgf", "path": "/0/0/11/1221" }, "network": "bitcoin" } } } }], "status": "resolved" }', // eslint-disable-line
  appId,
  browserFlowEnabled: false,
};

const loginAndGetUserId = token => co(function* coWrapper() {
  const login = yield new Promise((resolve) => {
    loginHandler.login({
      body: JSON.stringify({
        authToken: token,
      }),
    }, {}, (err, response) => {
      resolve(response);
    });
  });
  const authResp = yield new Promise((resolve) => {
    loginHandler.sessionAuthorizer({
      authorizationToken: JSON.parse(login.body).sessionToken,
    }, {}, (err, response) => {
      resolve(response);
    });
  });

  return {
    userId: authResp.context.userId,
    sessionToken: JSON.parse(login.body).sessionToken,
  };
});


describe('Partner Handler Functions', function test() {
  this.timeout(10000);

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

  it.skip('reject login given an  invalid authToken - new user', async () => {
    await co(function* coWrapper() {
      const response = yield new Promise((resolve) => {
        loginHandler.login({
          body: JSON.stringify({
            authToken: { k: 'l' },
          }),
        }, {}, (err, res) => {
          resolve(res);
        });
      });
      expect(response.statusCode).to.equal(200);
      expect(JSON.parse(response.body)).to.be.an('object');
      expect(JSON.parse(response.body).sessionToken).to.be.a('string');
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

  it('renew a valid sessionToken', (done) => {
    co(function* coWrapper() {
      const login = yield loginAndGetUserId(event.response);
      const keepAlive = yield new Promise((resolve) => {
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
      expect(keepAlive.statusCode).to.equal(200);
      expect(JSON.parse(keepAlive.body)).to.be.an('object');
      expect(JSON.parse(keepAlive.body).sessionToken).to.be.an('string');
      expect(JSON.parse(keepAlive.body).sessionToken).to.be.not.equal(login.sessionToken);
    }).then(done, done);
  });
});
