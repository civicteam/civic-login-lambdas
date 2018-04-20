/* eslint-disable no-unused-expressions, no-console, max-len  */
const { expect } = require('chai');
const uuidV4 = require('uuid/v4');
const handler = require('../src/index');

const co = require('co');
const jwt = require('../src/jwt');
// const hostedServices = require('../lib/HostedServices').hostedServices;

const authCode = uuidV4();
const appId = 'HkEQPA4YZ';

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

const scopeRequest = {};
const userPartner = {};
const partner = {};
const appPartner = {};
const keys = {};

const validScopeRequest = {
  authCode,
  uuid: uuidV4(),
  response: '{"userId": "c6d5795f8a059ea5ad29a33a60f8b402a172c3e0bbe50fd230ae8e0303609b51", "attestations": [{ "label": "contact.personal.email", "data": { "label": "contact.personal.email", "value": "stewart@civic.com", "salt": "22fe29019f00d65fd6e77c7f5d0ef447c962cc2c8518697fdc79ec65bf5b89ab", "hash": "c0ec965ae6a1ea02a4f641af5daa85f9f8216475472e2895151d44c26442c442", "proof": [{ "right": "2a5de832ccc0d88113e4a61cc705dee4159d84f53b094dfb30149b71f4a857ff" }, { "left": "356f17c4dec59fa3c71f7fe89b722e6b6ddd06bfc2cdc83a92d5a7b20b11fbbc" }, { "right": "a6cfafc548e991cb42132f127dbdf81faef59032b1061be3559a908ab63b6a29" }, { "right": "0c0ce95debb978f7f6bb08a7cb9d3d5004960f9879213819da2a5d8ee0948286" }] }, "attnData": "9d20621129e93177178d3bd87be852fae37276ae15f9625536d2bf17ddd58091", "attnLabel": "attCivicBasic", "attn": { "attestation": { "request": { "clientId": "bbb123bbb123", "url": "http://localhost:3001/dev/scopeRequest/2c3ab8f6-3069-42cf-8152-ecca6e3bd09d/callback", "label": "attCivicBasic", "signature": "3045022100e9888ce09d8f2ec7b5f5b40f38cba7d459d807c69b47b03a77c6579260e577b2022071742d3751b638abd2e65f76af7f2cd1348901887cb191310d92c73f22e32bb4" }, "attestation": { "cosigners": [{ "xpub": "xpub661MyMwAqRbcGWqz8mWY7A72pgua8KBiE4Vuj5TmnMcvNpxTzZsCoJqfGrcsz528Z4qyG9rEVmpr1zWxuTmQDyaDY4BUkCX3L6rmvE6Svse" }, { "xpub": "xpub661MyMwAqRbcFgT4S5aRfUiR4DAbipHSSYinYUTQqvEC4su2QevBkUcvDQDkzK3uiB3e5bfqYjje4XPdR93nbeZQGg48zph9eMvHizCQE6R" }], "tx": "010000000001013c09c09d0e1c9acec5a2f980d43e055ac7be2072b9e0d81b774d7973d35063400200000023220020b3cbc1ea1d042464311b1e4380c9e931f512b8616061bdcbc82396992f338ba2ffffffff05551500000000000017a91450c1cdfc2cf3cd26d4b93a584a7847cc633a10dc87551500000000000017a914ed954b52cb9811cc5dc6dc2f5e9da459a202e73787551500000000000017a9146662eab8a5438e429dea4e321a238d8f77555f43876ea360000000000017a914ee1f7d332baa07a4311bab20625fd6955a82d20987551500000000000017a914fbf03ba04196dd25fac35ec21c16f9623bcae59b870400483045022100839178fae0498b7104f7284208560688fc8877dc63742f77cd1ca74b435b9ead02201d13c6676c1c5f0dd807de961afba038d92a638a1afb6d8fefd059df4cd89f8701473044022027efdcd05049e4d5e7bdde0a01345f9b57317007d8e9968ebf570cbc8538dc22022049bc36e7471e40e00fe52af0067d8b1a2a34503716b44576715834b5f54764310169522102db7fc7db5dfe71824629ad3b3a994321799ed08506c43a65ecba213392dcb9a0210225bd617137dc72dd43cff4152d160dfe52399d4a852fbba5c6f8d65f9c56c05d2103f97a39989525eb5eedecca2946376c4b7f02365d7759f98e16dd5a239e643d5453ae00000000", "type": "permanent", "subject": { "label": "attCivicBasic", "data": "9d20621129e93177178d3bd87be852fae37276ae15f9625536d2bf17ddd58091", "xpub": "xpub661MyMwAqRbcFicU35hHYgpZwQDtGLYucWqAPTLGhya4rAzEBjGgkcJy4Qt5vRpJ8WzKNSPMWX3YPZ7FZEaYnqTwY9jzLjWvbbzEQJerGht", "signature": "3045022100c217fcca2dad21e404fe1168ad42876688ab2afa1f700f098e1b3fb4510dcddf022026237e36404e00b93ccbde9b85aec5ce4cabb01670923ce6531cab0bf8a7c8a8" }, "authority": { "xpub": "xpub661MyMwAqRbcEcNFQXdFJJHkaCvSsqvh6MT4zwZGG1mJQk9CPMnzV8BkAfUhqbFPeLavqk2dMb4j4ac4cqnfyu8xspwjGe7wTzTKgvReXgf", "path": "/0/0/11/1221" }, "network": "bitcoin" } } } }, { "label": "contact.personal.phoneNumber", "data": { "label": "contact.personal.phoneNumber", "value": "+27 823547259", "salt": "7c02ea3b9f3a156c7b59297a28b62465e2a9dd34aa7e4a87cee68af759fd0185", "hash": "2a5de832ccc0d88113e4a61cc705dee4159d84f53b094dfb30149b71f4a857ff", "proof": [{ "left": "c0ec965ae6a1ea02a4f641af5daa85f9f8216475472e2895151d44c26442c442" }, { "left": "356f17c4dec59fa3c71f7fe89b722e6b6ddd06bfc2cdc83a92d5a7b20b11fbbc" }, { "right": "a6cfafc548e991cb42132f127dbdf81faef59032b1061be3559a908ab63b6a29" }, { "right": "0c0ce95debb978f7f6bb08a7cb9d3d5004960f9879213819da2a5d8ee0948286" }] }, "attnData": "9d20621129e93177178d3bd87be852fae37276ae15f9625536d2bf17ddd58091", "attnLabel": "attCivicBasic", "attn": { "attestation": { "request": { "clientId": "bbb123bbb123", "url": "http://localhost:3001/dev/scopeRequest/2c3ab8f6-3069-42cf-8152-ecca6e3bd09d/callback", "label": "attCivicBasic", "signature": "3045022100e9888ce09d8f2ec7b5f5b40f38cba7d459d807c69b47b03a77c6579260e577b2022071742d3751b638abd2e65f76af7f2cd1348901887cb191310d92c73f22e32bb4" }, "attestation": { "cosigners": [{ "xpub": "xpub661MyMwAqRbcGWqz8mWY7A72pgua8KBiE4Vuj5TmnMcvNpxTzZsCoJqfGrcsz528Z4qyG9rEVmpr1zWxuTmQDyaDY4BUkCX3L6rmvE6Svse" }, { "xpub": "xpub661MyMwAqRbcFgT4S5aRfUiR4DAbipHSSYinYUTQqvEC4su2QevBkUcvDQDkzK3uiB3e5bfqYjje4XPdR93nbeZQGg48zph9eMvHizCQE6R" }], "tx": "010000000001013c09c09d0e1c9acec5a2f980d43e055ac7be2072b9e0d81b774d7973d35063400200000023220020b3cbc1ea1d042464311b1e4380c9e931f512b8616061bdcbc82396992f338ba2ffffffff05551500000000000017a91450c1cdfc2cf3cd26d4b93a584a7847cc633a10dc87551500000000000017a914ed954b52cb9811cc5dc6dc2f5e9da459a202e73787551500000000000017a9146662eab8a5438e429dea4e321a238d8f77555f43876ea360000000000017a914ee1f7d332baa07a4311bab20625fd6955a82d20987551500000000000017a914fbf03ba04196dd25fac35ec21c16f9623bcae59b870400483045022100839178fae0498b7104f7284208560688fc8877dc63742f77cd1ca74b435b9ead02201d13c6676c1c5f0dd807de961afba038d92a638a1afb6d8fefd059df4cd89f8701473044022027efdcd05049e4d5e7bdde0a01345f9b57317007d8e9968ebf570cbc8538dc22022049bc36e7471e40e00fe52af0067d8b1a2a34503716b44576715834b5f54764310169522102db7fc7db5dfe71824629ad3b3a994321799ed08506c43a65ecba213392dcb9a0210225bd617137dc72dd43cff4152d160dfe52399d4a852fbba5c6f8d65f9c56c05d2103f97a39989525eb5eedecca2946376c4b7f02365d7759f98e16dd5a239e643d5453ae00000000", "type": "permanent", "subject": { "label": "attCivicBasic", "data": "9d20621129e93177178d3bd87be852fae37276ae15f9625536d2bf17ddd58091", "xpub": "xpub661MyMwAqRbcFicU35hHYgpZwQDtGLYucWqAPTLGhya4rAzEBjGgkcJy4Qt5vRpJ8WzKNSPMWX3YPZ7FZEaYnqTwY9jzLjWvbbzEQJerGht", "signature": "3045022100c217fcca2dad21e404fe1168ad42876688ab2afa1f700f098e1b3fb4510dcddf022026237e36404e00b93ccbde9b85aec5ce4cabb01670923ce6531cab0bf8a7c8a8" }, "authority": { "xpub": "xpub661MyMwAqRbcEcNFQXdFJJHkaCvSsqvh6MT4zwZGG1mJQk9CPMnzV8BkAfUhqbFPeLavqk2dMb4j4ac4cqnfyu8xspwjGe7wTzTKgvReXgf", "path": "/0/0/11/1221" }, "network": "bitcoin" } } } }], "status": "resolved" }', // eslint-disable-line
  appId,
  browserFlowEnabled: false,
};

const loginAndGetUserId = token => co(function* coWrapper() {
  const login = yield new Promise((resolve) => {
    handler.login({
      body: JSON.stringify({
        authToken: token,
      }),
    }, {}, (err, response) => {
      resolve(response);
    });
  });
  const authResp = yield new Promise((resolve) => {
    handler.sessionAuthorizer({
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

      // partnerDoc = yield partner.insert({
      //   browserFlowEnabled: false,
      //   primaryDomain: 'test.com',
      //   // domains: [],
      //   // logo: '',
      //   name: 'test',
      // // primaryColor: '',
      // // pubKey: '',
      // // secondaryColor: '',
      // // secret: '',
      // });
      // yield userPartner.insert({
      //   email: 'stewart@test.com',
      //   appId: partnerDoc.appId,
      //   authUserId: '2a4243e4a9418d3f545b7d0f68c822197a9e24beeceea3b7ade7aa82bf662650',
      // });
    }).then(done, done);
  });

  it('check for a domain in use', (done) => {
    handler.domainInUse({
      body: JSON.stringify({
        domain: 'https://www.domaininuse.com',
      }),
    }, {}, (err, response) => {
      expect(response.statusCode).to.equal(200);
      expect(JSON.parse(response.body).valid).to.equal(false);
      done();
    });
  });

  it('check for a domain not in use', (done) => {
    handler.domainInUse({
      body: JSON.stringify({
        domain: 'https://www.test-should-be-available.com',
      }),
    }, {}, (err, response) => {
      expect(response.statusCode).to.equal(200);
      expect(JSON.parse(response.body).valid).to.equal(true);
      done();
    });
  });

  it('login successfully given a valid authToken - new user', (done) => {
    co(function* coWrapper() {
      const response = yield new Promise((resolve) => {
        handler.login({
          body: JSON.stringify({
            authToken: event.response,
          }),
        }, {}, (err, res) => {
          resolve(res);
        });
      });
      // console.log(response, event);
      expect(response.statusCode).to.equal(200);
      expect(JSON.parse(response.body)).to.be.an('object');
      expect(JSON.parse(response.body).sessionToken).to.be.an('string');
      expect(JSON.parse(response.body).isRegistered).to.equal(false);
    }).then(done, done);
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
        handler.login({
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
        handler.keepAlive({
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
      // console.log(login, keepAlive);
      expect(keepAlive.statusCode).to.equal(200);
      expect(JSON.parse(keepAlive.body)).to.be.an('object');
      expect(JSON.parse(keepAlive.body).sessionToken).to.be.an('string');
      expect(JSON.parse(keepAlive.body).sessionToken).to.be.not.equal(login.sessionToken);
    }).then(done, done);
  });

  it('register given a valid sessionToken', (done) => {
    co(function* coWrapper() {
      const login = yield loginAndGetUserId(event.response);
      const register = yield new Promise((resolve) => {
        handler.register({
          headers: {
            Authorization: login.sessionToken,
          },
          requestContext: {
            authorizer: {
              userId: login.userId,
            },
          },
          body: JSON.stringify({
            name: 'sign up test',
            primaryDomain: 'https://blahhhh.com',
            primaryContactName: 'John',
            primaryContactEmail: 'someone@civic.com',
            primaryContactPhoneNumber: '+15595496152',
          }),
        }, {}, (err, response) => {
          resolve(response);
        });
      });
      // console.log(register);
      expect(register.statusCode).to.equal(200);
    }).then(done, done);
  });

  it('update partner given a valid sessionToken', (done) => {
    co(function* coWrapper() {
      const login = yield loginAndGetUserId(event.response);
      // expect(login.statusCode).to.equal(200);
      // const register = yield new Promise((resolve) => {
      //   handler.register({
      //     headers: {
      //       Authorization: JSON.parse(login.body).sessionToken,
      //     },
      //     body: JSON.stringify({
      //       name: 'sign up test',
      //       primaryDomain: 'testUpdate.com',
      //     }),
      //   }, {}, (err, response) => {
      //     resolve(response);
      //   });
      // });
      // console.log(register);
      // expect(register.statusCode).to.equal(200);

      const update = yield new Promise((resolve) => {
        handler.partnerUpdate({
          headers: {
            Authorization: login.sessionToken,
          },
          requestContext: {
            authorizer: {
              userId: login.userId,
            },
          },
          body: JSON.stringify({
            name: 'sign up test 2',
            primaryDomain: 'test.com',
            primaryContactName: 'John',
            primaryContactEmail: 'someone@civic.com',
            primaryContactPhoneNumber: '+15595496152',
          }),
        }, {}, (err, response) => {
          resolve(response);
        });
      });
      // console.log(update);
      expect(update.statusCode).to.equal(200);
    }).then(done, done);
  });

  it.skip('deleteAll given a valid sessionToken', (done) => {
    co(function* coWrapper() {
      const login = yield loginAndGetUserId(event.response);
      const register = yield new Promise((resolve) => {
        handler.deleteAll({
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
      // console.log(register);
      expect(register.statusCode).to.equal(200);
    }).then(done, done);
  });

  it('insert and modify an app', (done) => {
    co(function* coWrapper() {
      const login = yield loginAndGetUserId(event.response);
      const app = yield new Promise((resolve) => {
        handler.appPost({
          headers: {
            Authorization: login.sessionToken,
          },
          requestContext: {
            authorizer: {
              userId: login.userId,
            },
          },
          body: JSON.stringify({
            name: 'test app',
            domains: ['https://www.myapp.com', 'https://localhost:3000'],
            browserFlowEnabled: false,
            logo: 'https://www.mylogourl.com/some.jpg',
          }),
        }, {}, (err, response) => {
          resolve(response);
        });
      });
      // console.log(app);
      expect(app.statusCode).to.equal(200);
      expect(JSON.parse(app.body)).to.be.an('object');
      expect(JSON.parse(app.body).name).to.equal('test app');
      const { applicationId } = JSON.parse(app.body);
      const appUpdated = yield new Promise((resolve) => {
        handler.appUpdate({
          headers: {
            Authorization: login.sessionToken,
          },
          requestContext: {
            authorizer: {
              userId: login.userId,
            },
          },
          body: JSON.stringify({
            name: 'test app updated',
            domains: ['http://myapp.com', 'https://localhost:3000'],
            browserFlowEnabled: false,
            logo: 'https://www.mylogourl.com/some.jpg',
          }),
          pathParameters: {
            id: applicationId,
          },
        }, {}, (err, response) => {
          resolve(response);
        });
      });
      expect(appUpdated.statusCode).to.equal(200);
      expect(JSON.parse(appUpdated.body)).to.be.an('object');
      expect(JSON.parse(appUpdated.body).applicationId).to.equal(applicationId);
      expect(JSON.parse(appUpdated.body).partnerAppId).to.equal(JSON.parse(app.body).partnerAppId);
      expect(JSON.parse(appUpdated.body).name).to.equal('test app updated');

      const appGet = yield new Promise((resolve) => {
        handler.appGetById({
          headers: {
            Authorization: login.sessionToken,
          },
          requestContext: {
            authorizer: {
              userId: login.userId,
            },
          },
          pathParameters: {
            id: applicationId,
          },
        }, {}, (err, response) => {
          resolve(response);
        });
      });
      expect(appGet.statusCode).to.equal(200);
      expect(JSON.parse(appGet.body)).to.be.an('object');
      expect(JSON.parse(appGet.body).applicationId).to.equal(applicationId);
    }).then(done, done);
  });

  it('get apps', (done) => {
    co(function* coWrapper() {
      const login = yield loginAndGetUserId(event.response);
      const apps = yield new Promise((resolve) => {
        handler.appGet({
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
      // console.log(apps);
      expect(JSON.parse(apps.body)).to.be.an('array');
    }).then(done, done);
  });

  it('add and remove an key for an app', (done) => {
    co(function* coWrapper() {
      const login = yield loginAndGetUserId(event.response);
      const app = yield new Promise((resolve) => {
        handler.appPost({
          headers: {
            Authorization: login.sessionToken,
          },
          requestContext: {
            authorizer: {
              userId: login.userId,
            },
          },
          body: JSON.stringify({
            name: 'test key app',
            domains: ['https://www.myapp.com'],
            browserFlowEnabled: false,
            logo: 'https://www.mylogourl.com/some.jpg',
          }),
        }, {}, (err, response) => {
          resolve(response);
        });
      });
      // console.log(app);
      expect(app.statusCode).to.equal(200);
      const { applicationId } = JSON.parse(app.body);
      const encrypted = keys.encryptForPartner('secret');
      const appUpdated = yield new Promise((resolve) => {
        handler.appAddKey({
          headers: {
            Authorization: login.sessionToken,
          },
          requestContext: {
            authorizer: {
              userId: login.userId,
            },
          },
          body: JSON.stringify({
            pubKey: 'pubKey',
            secret: encrypted,
            encPubKey: 'encPubKey',
            encrypted: true,
          }),
          pathParameters: {
            id: applicationId,
          },
        }, {}, (err, response) => {
          resolve(response);
        });
      });
      // console.log(appUpdated);
      expect(appUpdated.statusCode).to.equal(200);
      expect(JSON.parse(appUpdated.body)).to.be.an('object');
      expect(JSON.parse(appUpdated.body).applicationId).to.equal(applicationId);
      const appRevokeKey = yield new Promise((resolve) => {
        handler.appRevokeKey({
          headers: {
            Authorization: login.sessionToken,
          },
          requestContext: {
            authorizer: {
              userId: login.userId,
            },
          },
          body: JSON.stringify({
            pubKey: 'pubKey',
            encPubKey: 'encPubKey',
            validFor: 60,
          }),
          pathParameters: {
            id: applicationId,
          },
        }, {}, (err, response) => {
          resolve(response);
        });
      });
      // console.log(appRevokeKey);
      expect(appRevokeKey.statusCode).to.equal(200);
      expect(JSON.parse(appRevokeKey.body)).to.be.an('object');
      expect(JSON.parse(appRevokeKey.body).applicationId).to.equal(applicationId);
      const appRemoveKey = yield new Promise((resolve) => {
        handler.appRemoveKey({
          headers: {
            Authorization: login.sessionToken,
          },
          requestContext: {
            authorizer: {
              userId: login.userId,
            },
          },
          body: JSON.stringify({
            pubKey: 'pubKey',
            encPubKey: 'encPubKey',
          }),
          pathParameters: {
            id: applicationId,
          },
        }, {}, (err, response) => {
          resolve(response);
        });
      });
      // console.log(appRemoveKey);
      expect(appRemoveKey.statusCode).to.equal(200);
      expect(JSON.parse(appRemoveKey.body)).to.be.an('object');
      expect(JSON.parse(appRemoveKey.body).applicationId).to.equal(applicationId);
      const apps = yield new Promise((resolve) => {
        handler.appGet({
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
      // console.log(apps);
      expect(JSON.parse(apps.body)).to.be.an('array');
    }).then(done, done);
  });

  it('regenerate a key for an app', (done) => {
    co(function* coWrapper() {
      const login = yield loginAndGetUserId(event.response);
      const app = yield new Promise((resolve) => {
        handler.appPost({
          headers: {
            Authorization: login.sessionToken,
          },
          requestContext: {
            authorizer: {
              userId: login.userId,
            },
          },
          body: JSON.stringify({
            name: 'test key app 2',
            domains: ['https://www.myapp.com'],
            browserFlowEnabled: false,
            logo: 'https://www.mylogourl.com/some.jpg',
          }),
        }, {}, (err, response) => {
          resolve(response);
        });
      });
      // console.log(app);
      expect(app.statusCode).to.equal(200);
      const { applicationId } = JSON.parse(app.body);
      const encrypted = keys.encryptForPartner('secret');
      const appUpdated = yield new Promise((resolve) => {
        handler.appAddKey({
          headers: {
            Authorization: login.sessionToken,
          },
          requestContext: {
            authorizer: {
              userId: login.userId,
            },
          },
          body: JSON.stringify({
            pubKey: 'pubKey',
            secret: encrypted,
            encPubKey: 'encPubKey',
            encrypted: true,
          }),
          pathParameters: {
            id: applicationId,
          },
        }, {}, (err, response) => {
          resolve(response);
        });
      });
      // console.log(appUpdated);
      expect(appUpdated.statusCode).to.equal(200);
      expect(JSON.parse(appUpdated.body)).to.be.an('object');
      expect(JSON.parse(appUpdated.body).applicationId).to.equal(applicationId);
      const appRegenerateKey = yield new Promise((resolve) => {
        handler.appRegenerateKey({
          headers: {
            Authorization: login.sessionToken,
          },
          requestContext: {
            authorizer: {
              userId: login.userId,
            },
          },
          body: JSON.stringify({
            pubKey: 'pubKey2',
            secret: encrypted,
            encPubKey: 'encPubKey2',
            encrypted: true,
            validFor: 3600,
          }),
          pathParameters: {
            id: applicationId,
          },
        }, {}, (err, response) => {
          resolve(response);
        });
      });
      // console.log(appRegenerateKey);
      expect(appRegenerateKey.statusCode).to.equal(200);
      expect(JSON.parse(appRegenerateKey.body)).to.be.an('object');
      expect(JSON.parse(appRegenerateKey.body).applicationId).to.equal(applicationId);
      const apps = yield new Promise((resolve) => {
        handler.appGet({
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
      // console.log(apps);
      expect(JSON.parse(apps.body)).to.be.an('array');
    }).then(done, done);
  });

  it('promote an app', (done) => {
    co(function* coWrapper() {
      const login = yield loginAndGetUserId(event.response);
      const app = yield new Promise((resolve) => {
        handler.appPost({
          headers: {
            Authorization: login.sessionToken,
          },
          requestContext: {
            authorizer: {
              userId: login.userId,
            },
          },
          body: JSON.stringify({
            name: 'test key app',
            domains: ['https://www.myapp.com'],
            browserFlowEnabled: false,
            logo: 'https://www.mylogourl.com/some.jpg',
          }),
        }, {}, (err, response) => {
          resolve(response);
        });
      });
      // console.log(app);
      expect(app.statusCode).to.equal(200);
      const { applicationId } = JSON.parse(app.body);
      const appPromoteRequest = yield new Promise((resolve) => {
        handler.appPromoteRequest({
          headers: {
            Authorization: login.sessionToken,
          },
          requestContext: {
            authorizer: {
              userId: login.userId,
            },
          },
          pathParameters: {
            id: applicationId,
          },
        }, {}, (err, response) => {
          resolve(response);
        });
      });
      // console.log(appPromoteRequest);
      expect(appPromoteRequest.statusCode).to.equal(200);
      expect(JSON.parse(appPromoteRequest.body)).to.be.an('object');
      expect(JSON.parse(appPromoteRequest.body).applicationId).to.equal(applicationId);

      yield appPartner.approve(applicationId, JSON.parse(appPromoteRequest.body).partnerAppId);

      const appPromoted = yield new Promise((resolve) => {
        handler.appPromote({
          headers: {
            Authorization: login.sessionToken,
          },
          requestContext: {
            authorizer: {
              userId: login.userId,
            },
          },
          pathParameters: {
            id: applicationId,
          },
        }, {}, (err, response) => {
          resolve(response);
        });
      });
      // console.log(appPromoted);
      expect(appPromoted.statusCode).to.equal(200);
      expect(JSON.parse(appPromoted.body)).to.be.an('object');
      expect(JSON.parse(appPromoted.body).applicationId).to.equal(applicationId);
      const appDemoted = yield new Promise((resolve) => {
        handler.appDemote({
          headers: {
            Authorization: login.sessionToken,
          },
          requestContext: {
            authorizer: {
              userId: login.userId,
            },
          },
          pathParameters: {
            id: applicationId,
          },
        }, {}, (err, response) => {
          resolve(response);
        });
      });
      // console.log(appDemoted);
      expect(appDemoted.statusCode).to.equal(200);
      expect(JSON.parse(appDemoted.body)).to.be.an('object');
      expect(JSON.parse(appDemoted.body).applicationId).to.equal(applicationId);
    }).then(done, done);
  });

  it('delete an app', (done) => {
    co(function* coWrapper() {
      const login = yield loginAndGetUserId(event.response);
      const app = yield new Promise((resolve) => {
        handler.appPost({
          headers: {
            Authorization: login.sessionToken,
          },
          requestContext: {
            authorizer: {
              userId: login.userId,
            },
          },
          body: JSON.stringify({
            name: 'test delete app',
            domains: ['https://www.myapp.com'],
            browserFlowEnabled: false,
            logo: 'https://www.mylogourl.com/some.jpg',
          }),
        }, {}, (err, response) => {
          resolve(response);
        });
      });
      // console.log(app);
      expect(app.statusCode).to.equal(200);
      const { applicationId } = JSON.parse(app.body);
      const appDelete = yield new Promise((resolve) => {
        handler.appDelete({
          headers: {
            Authorization: login.sessionToken,
          },
          requestContext: {
            authorizer: {
              userId: login.userId,
            },
          },
          pathParameters: {
            id: applicationId,
          },
        }, {}, (err, response) => {
          resolve(response);
        });
      });
      // console.log(appDelete);
      expect(appDelete.statusCode).to.equal(200);
    }).then(done, done);
  });

  it('suspends an app', (done) => {
    co(function* coWrapper() {
      const login = yield loginAndGetUserId(event.response);
      const app = yield new Promise((resolve) => {
        handler.appPost({
          headers: {
            Authorization: login.sessionToken,
          },
          requestContext: {
            authorizer: {
              userId: login.userId,
            },
          },
          body: JSON.stringify({
            name: 'test suspend app',
            domains: ['https://www.myapp.com'],
            browserFlowEnabled: false,
            logo: 'https://www.mylogourl.com/some.jpg',
          }),
        }, {}, (err, response) => {
          resolve(response);
        });
      });
      expect(app.statusCode).to.equal(200);
      const { applicationId } = JSON.parse(app.body);

      const appPromoteRequest = yield new Promise((resolve) => {
        handler.appPromoteRequest({
          headers: {
            Authorization: login.sessionToken,
          },
          requestContext: {
            authorizer: {
              userId: login.userId,
            },
          },
          pathParameters: {
            id: applicationId,
          },
        }, {}, (err, response) => {
          resolve(response);
        });
      });
      // console.log(appPromoteRequest);
      expect(appPromoteRequest.statusCode).to.equal(200);

      yield appPartner.approve(applicationId, JSON.parse(app.body).partnerAppId);

      const appPromoted = yield new Promise((resolve) => {
        handler.appPromote({
          headers: {
            Authorization: login.sessionToken,
          },
          requestContext: {
            authorizer: {
              userId: login.userId,
            },
          },
          pathParameters: {
            id: applicationId,
          },
        }, {}, (err, response) => {
          resolve(response);
        });
      });
      expect(appPromoted.statusCode).to.equal(200);
      const appSuspend = yield new Promise((resolve) => {
        handler.appSuspend({
          headers: {
            Authorization: login.sessionToken,
          },
          requestContext: {
            authorizer: {
              userId: login.userId,
            },
          },
          pathParameters: {
            id: applicationId,
          },
          body: JSON.stringify({ value: true }),
        }, {}, (err, response) => {
          resolve(response);
        });
      });
      expect(appSuspend.statusCode).to.equal(200);
    }).then(done, done);
  });

  it('unsuspends an app', (done) => {
    co(function* coWrapper() {
      const login = yield loginAndGetUserId(event.response);
      const app = yield new Promise((resolve) => {
        handler.appPost({
          headers: {
            Authorization: login.sessionToken,
          },
          requestContext: {
            authorizer: {
              userId: login.userId,
            },
          },
          body: JSON.stringify({
            name: 'test suspend app',
            domains: ['https://www.myapp.com'],
            browserFlowEnabled: false,
            logo: 'https://www.mylogourl.com/some.jpg',
          }),
        }, {}, (err, response) => {
          resolve(response);
        });
      });
      expect(app.statusCode).to.equal(200);
      const { applicationId } = JSON.parse(app.body);

      const appPromoteRequest = yield new Promise((resolve) => {
        handler.appPromoteRequest({
          headers: {
            Authorization: login.sessionToken,
          },
          requestContext: {
            authorizer: {
              userId: login.userId,
            },
          },
          pathParameters: {
            id: applicationId,
          },
        }, {}, (err, response) => {
          resolve(response);
        });
      });
      // console.log(appPromoteRequest);
      expect(appPromoteRequest.statusCode).to.equal(200);

      yield appPartner.approve(applicationId, JSON.parse(app.body).partnerAppId);

      const appPromoted = yield new Promise((resolve) => {
        handler.appPromote({
          headers: {
            Authorization: login.sessionToken,
          },
          requestContext: {
            authorizer: {
              userId: login.userId,
            },
          },
          pathParameters: {
            id: applicationId,
          },
        }, {}, (err, response) => {
          resolve(response);
        });
      });
      expect(appPromoted.statusCode).to.equal(200);

      const appSuspend = yield new Promise((resolve) => {
        handler.appSuspend({
          headers: {
            Authorization: login.sessionToken,
          },
          requestContext: {
            authorizer: {
              userId: login.userId,
            },
          },
          pathParameters: {
            id: applicationId,
          },
          body: JSON.stringify({ value: true }),
        }, {}, (err, response) => {
          resolve(response);
        });
      });
      expect(appSuspend.statusCode).to.equal(200);

      const appUnSuspend = yield new Promise((resolve) => {
        handler.appSuspend({
          headers: {
            Authorization: login.sessionToken,
          },
          requestContext: {
            authorizer: {
              userId: login.userId,
            },
          },
          pathParameters: {
            id: applicationId,
          },
          body: JSON.stringify({ value: false }),
        }, {}, (err, response) => {
          resolve(response);
        });
      });
      expect(appUnSuspend.statusCode).to.equal(200);
    }).then(done, done);
  });

  it('does not allow an invalid value for suspension of an app', (done) => {
    co(function* coWrapper() {
      const login = yield loginAndGetUserId(event.response);
      const app = yield new Promise((resolve) => {
        handler.appPost({
          headers: {
            Authorization: login.sessionToken,
          },
          requestContext: {
            authorizer: {
              userId: login.userId,
            },
          },
          body: JSON.stringify({
            name: 'test suspend app',
            domains: ['https://www.myapp.com'],
            browserFlowEnabled: false,
            logo: 'https://www.mylogourl.com/some.jpg',
          }),
        }, {}, (err, response) => {
          resolve(response);
        });
      });
      expect(app.statusCode).to.equal(200);
      const { applicationId } = JSON.parse(app.body);
      const appSuspend = yield new Promise((resolve) => {
        handler.appSuspend({
          headers: {
            Authorization: login.sessionToken,
          },
          requestContext: {
            authorizer: {
              userId: login.userId,
            },
          },
          pathParameters: {
            id: applicationId,
          },
          body: JSON.stringify({ value: 'somethingelse' }),
        }, {}, (err, response) => {
          resolve(response);
        });
      });
      expect(appSuspend.statusCode).to.equal(400);
    }).then(done, done);
  });

  it('get/list users', (done) => {
    co(function* coWrapper() {
      const login = yield loginAndGetUserId(event.response);
      const users = yield new Promise((resolve) => {
        handler.teamUsersList(
          {
            headers: {
              Authorization: login.sessionToken,
            },
            requestContext: {
              authorizer: {
                userId: login.userId,
              },
            },
          },
          {},
          (err, response) => {
            resolve(response);
          },
        );
      });
      // console.log(users);
      expect(JSON.parse(users.body)).to.be.an('array');
    }).then(done, done);
  });

  it('creates/invite/updates/deletes a new user', (done) => {
    co(function* coWrapper() {
      const login = yield loginAndGetUserId(event.response);
      const newUser = yield new Promise((resolve) => {
        handler.teamUsersCreate({
          headers: {
            Authorization: login.sessionToken,
          },
          requestContext: {
            authorizer: {
              userId: login.userId,
            },
          },
          body: JSON.stringify({
            email: 'savio+unittest1@civic.com',
            role: 'ADMIN',
          }),
        }, {}, (err, response) => {
          resolve(response);
        });
      });
      // console.log(newUser);
      expect(newUser.statusCode).to.equal(200);
      expect(JSON.parse(newUser.body)).to.be.an('object');
      expect(JSON.parse(newUser.body).email).to.equal('savio+unittest1@civic.com');
      expect(JSON.parse(newUser.body).role).to.equal('ADMIN');

      const { userId } = JSON.parse(newUser.body);

      const userUpdated = yield new Promise((resolve) => {
        handler.teamUsersUpdate({
          headers: {
            Authorization: login.sessionToken,
          },
          requestContext: {
            authorizer: {
              userId: login.userId,
            },
          },
          body: JSON.stringify({
            role: 'DEVELOPER',
          }),
          pathParameters: {
            id: userId,
          },
        }, {}, (err, response) => {
          resolve(response);
        });
      });
      expect(userUpdated.statusCode).to.equal(200);
      expect(JSON.parse(userUpdated.body)).to.be.an('object');
      expect(JSON.parse(userUpdated.body).userId).to.equal(userId);
      expect(JSON.parse(userUpdated.body).role).to.equal('DEVELOPER');

      const userDeleted = yield new Promise((resolve) => {
        handler.teamUsersUpdate({
          headers: {
            Authorization: login.sessionToken,
          },
          requestContext: {
            authorizer: {
              userId: login.userId,
            },
          },
          body: JSON.stringify({}),
          pathParameters: {
            id: userId,
          },
        }, {}, (err, response) => {
          resolve(response);
        });
      });
      expect(userDeleted.statusCode).to.equal(200);
    }).then(done, done);
  });
});
