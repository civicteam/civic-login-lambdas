/* eslint-disable max-len  */
const appId = 'HkEQPA4YZ';
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
    pubKey: '0403eaecceb589599323125f6cd891816eeccf785a931f816769bf36d34fa7a74f5e4ecf46cf30d170cb61cd21b33525b825f9e1641031fa1acd57654b4b552278',
    prvKey: 'b75e40dbc38af78efc99f78ef89d5f8884c45d188f7afe596bd981f8195131dc',
  },
  response: '{"userId": "c6d5795f8a059ea5ad29a33a60f8b402a172c3e0bbe50fd230ae8e0303609b51", "attestations": [{ "label": "contact.personal.email", "data": { "label": "contact.personal.email", "value": "stewart@civic.com", "salt": "22fe29019f00d65fd6e77c7f5d0ef447c962cc2c8518697fdc79ec65bf5b89ab", "hash": "c0ec965ae6a1ea02a4f641af5daa85f9f8216475472e2895151d44c26442c442", "proof": [{ "right": "2a5de832ccc0d88113e4a61cc705dee4159d84f53b094dfb30149b71f4a857ff" }, { "left": "356f17c4dec59fa3c71f7fe89b722e6b6ddd06bfc2cdc83a92d5a7b20b11fbbc" }, { "right": "a6cfafc548e991cb42132f127dbdf81faef59032b1061be3559a908ab63b6a29" }, { "right": "0c0ce95debb978f7f6bb08a7cb9d3d5004960f9879213819da2a5d8ee0948286" }] }, "attnData": "9d20621129e93177178d3bd87be852fae37276ae15f9625536d2bf17ddd58091", "attnLabel": "attCivicBasic", "attn": { "attestation": { "request": { "clientId": "bbb123bbb123", "url": "http://localhost:3001/dev/scopeRequest/2c3ab8f6-3069-42cf-8152-ecca6e3bd09d/callback", "label": "attCivicBasic", "signature": "3045022100e9888ce09d8f2ec7b5f5b40f38cba7d459d807c69b47b03a77c6579260e577b2022071742d3751b638abd2e65f76af7f2cd1348901887cb191310d92c73f22e32bb4" }, "attestation": { "cosigners": [{ "xpub": "xpub661MyMwAqRbcGWqz8mWY7A72pgua8KBiE4Vuj5TmnMcvNpxTzZsCoJqfGrcsz528Z4qyG9rEVmpr1zWxuTmQDyaDY4BUkCX3L6rmvE6Svse" }, { "xpub": "xpub661MyMwAqRbcFgT4S5aRfUiR4DAbipHSSYinYUTQqvEC4su2QevBkUcvDQDkzK3uiB3e5bfqYjje4XPdR93nbeZQGg48zph9eMvHizCQE6R" }], "tx": "010000000001013c09c09d0e1c9acec5a2f980d43e055ac7be2072b9e0d81b774d7973d35063400200000023220020b3cbc1ea1d042464311b1e4380c9e931f512b8616061bdcbc82396992f338ba2ffffffff05551500000000000017a91450c1cdfc2cf3cd26d4b93a584a7847cc633a10dc87551500000000000017a914ed954b52cb9811cc5dc6dc2f5e9da459a202e73787551500000000000017a9146662eab8a5438e429dea4e321a238d8f77555f43876ea360000000000017a914ee1f7d332baa07a4311bab20625fd6955a82d20987551500000000000017a914fbf03ba04196dd25fac35ec21c16f9623bcae59b870400483045022100839178fae0498b7104f7284208560688fc8877dc63742f77cd1ca74b435b9ead02201d13c6676c1c5f0dd807de961afba038d92a638a1afb6d8fefd059df4cd89f8701473044022027efdcd05049e4d5e7bdde0a01345f9b57317007d8e9968ebf570cbc8538dc22022049bc36e7471e40e00fe52af0067d8b1a2a34503716b44576715834b5f54764310169522102db7fc7db5dfe71824629ad3b3a994321799ed08506c43a65ecba213392dcb9a0210225bd617137dc72dd43cff4152d160dfe52399d4a852fbba5c6f8d65f9c56c05d2103f97a39989525eb5eedecca2946376c4b7f02365d7759f98e16dd5a239e643d5453ae00000000", "type": "permanent", "subject": { "label": "attCivicBasic", "data": "9d20621129e93177178d3bd87be852fae37276ae15f9625536d2bf17ddd58091", "xpub": "xpub661MyMwAqRbcFicU35hHYgpZwQDtGLYucWqAPTLGhya4rAzEBjGgkcJy4Qt5vRpJ8WzKNSPMWX3YPZ7FZEaYnqTwY9jzLjWvbbzEQJerGht", "signature": "3045022100c217fcca2dad21e404fe1168ad42876688ab2afa1f700f098e1b3fb4510dcddf022026237e36404e00b93ccbde9b85aec5ce4cabb01670923ce6531cab0bf8a7c8a8" }, "authority": { "xpub": "xpub661MyMwAqRbcEcNFQXdFJJHkaCvSsqvh6MT4zwZGG1mJQk9CPMnzV8BkAfUhqbFPeLavqk2dMb4j4ac4cqnfyu8xspwjGe7wTzTKgvReXgf", "path": "/0/0/11/1221" }, "network": "bitcoin" } } } }, { "label": "contact.personal.phoneNumber", "data": { "label": "contact.personal.phoneNumber", "value": "+27 823547259", "salt": "7c02ea3b9f3a156c7b59297a28b62465e2a9dd34aa7e4a87cee68af759fd0185", "hash": "2a5de832ccc0d88113e4a61cc705dee4159d84f53b094dfb30149b71f4a857ff", "proof": [{ "left": "c0ec965ae6a1ea02a4f641af5daa85f9f8216475472e2895151d44c26442c442" }, { "left": "356f17c4dec59fa3c71f7fe89b722e6b6ddd06bfc2cdc83a92d5a7b20b11fbbc" }, { "right": "a6cfafc548e991cb42132f127dbdf81faef59032b1061be3559a908ab63b6a29" }, { "right": "0c0ce95debb978f7f6bb08a7cb9d3d5004960f9879213819da2a5d8ee0948286" }] }, "attnData": "9d20621129e93177178d3bd87be852fae37276ae15f9625536d2bf17ddd58091", "attnLabel": "attCivicBasic", "attn": { "attestation": { "request": { "clientId": "bbb123bbb123", "url": "http://localhost:3001/dev/scopeRequest/2c3ab8f6-3069-42cf-8152-ecca6e3bd09d/callback", "label": "attCivicBasic", "signature": "3045022100e9888ce09d8f2ec7b5f5b40f38cba7d459d807c69b47b03a77c6579260e577b2022071742d3751b638abd2e65f76af7f2cd1348901887cb191310d92c73f22e32bb4" }, "attestation": { "cosigners": [{ "xpub": "xpub661MyMwAqRbcGWqz8mWY7A72pgua8KBiE4Vuj5TmnMcvNpxTzZsCoJqfGrcsz528Z4qyG9rEVmpr1zWxuTmQDyaDY4BUkCX3L6rmvE6Svse" }, { "xpub": "xpub661MyMwAqRbcFgT4S5aRfUiR4DAbipHSSYinYUTQqvEC4su2QevBkUcvDQDkzK3uiB3e5bfqYjje4XPdR93nbeZQGg48zph9eMvHizCQE6R" }], "tx": "010000000001013c09c09d0e1c9acec5a2f980d43e055ac7be2072b9e0d81b774d7973d35063400200000023220020b3cbc1ea1d042464311b1e4380c9e931f512b8616061bdcbc82396992f338ba2ffffffff05551500000000000017a91450c1cdfc2cf3cd26d4b93a584a7847cc633a10dc87551500000000000017a914ed954b52cb9811cc5dc6dc2f5e9da459a202e73787551500000000000017a9146662eab8a5438e429dea4e321a238d8f77555f43876ea360000000000017a914ee1f7d332baa07a4311bab20625fd6955a82d20987551500000000000017a914fbf03ba04196dd25fac35ec21c16f9623bcae59b870400483045022100839178fae0498b7104f7284208560688fc8877dc63742f77cd1ca74b435b9ead02201d13c6676c1c5f0dd807de961afba038d92a638a1afb6d8fefd059df4cd89f8701473044022027efdcd05049e4d5e7bdde0a01345f9b57317007d8e9968ebf570cbc8538dc22022049bc36e7471e40e00fe52af0067d8b1a2a34503716b44576715834b5f54764310169522102db7fc7db5dfe71824629ad3b3a994321799ed08506c43a65ecba213392dcb9a0210225bd617137dc72dd43cff4152d160dfe52399d4a852fbba5c6f8d65f9c56c05d2103f97a39989525eb5eedecca2946376c4b7f02365d7759f98e16dd5a239e643d5453ae00000000", "type": "permanent", "subject": { "label": "attCivicBasic", "data": "9d20621129e93177178d3bd87be852fae37276ae15f9625536d2bf17ddd58091", "xpub": "xpub661MyMwAqRbcFicU35hHYgpZwQDtGLYucWqAPTLGhya4rAzEBjGgkcJy4Qt5vRpJ8WzKNSPMWX3YPZ7FZEaYnqTwY9jzLjWvbbzEQJerGht", "signature": "3045022100c217fcca2dad21e404fe1168ad42876688ab2afa1f700f098e1b3fb4510dcddf022026237e36404e00b93ccbde9b85aec5ce4cabb01670923ce6531cab0bf8a7c8a8" }, "authority": { "xpub": "xpub661MyMwAqRbcEcNFQXdFJJHkaCvSsqvh6MT4zwZGG1mJQk9CPMnzV8BkAfUhqbFPeLavqk2dMb4j4ac4cqnfyu8xspwjGe7wTzTKgvReXgf", "path": "/0/0/11/1221" }, "network": "bitcoin" } } } }], "status": "resolved" }',
};

const partnerToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJqdGkiOiJmODM2OWFjNy1hOWQyLTRmYzItYmFmZS00ZDY1ZmQwM2Y1M2QiLCJpYXQiOjE0OTcyOTYxMjMuNzQzLCJleHAiOjE0OTcyOTc5MjMuNzQzLCJpc3MiOiJjaXZpYy1zaXAtcGFydG5lci1zZXJ2aWNlIiwiYXVkIjoiaHR0cHM6Ly9hcGkuY2l2aWMuY29tL3NpcC8iLCJzdWIiOiJySmRBNzVPTVoiLCJkYXRhIjp7ImNsaWVudElkIjoickpkQTc1T01aIiwibmFtZSI6Indpa2lIb3ciLCJwcmltYXJ5Q29sb3IiOiJBODBCMDAiLCJ2ZXJpZmljYXRpb25MZXZlbCI6ImNpdmljQmFzaWMiLCJkZXNjcmlwdGlvbiI6IiRuYW1lIHdvdWxkIGxpa2UgdG8gYWNjZXNzIHRoZSBmb2xsb3dpbmcgZGF0YSBvbiB5b3VyIGlkZW50aXR5IiwibG9nbyI6Imh0dHBzOi8vd3d3Lndpa2lob3cuY29tL3NraW5zL293bC9pbWFnZXMvd2lraWhvd19sb2dvLnBuZyIsImNhbGxiYWNrVXJsIjoiaHR0cHM6Ly9waDR4NTgwODE1LmV4ZWN1dGUtYXBpLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tL2Rldi9zY29wZVJlcXVlc3QvMjU2ODNlZmMtNjQ2Yi00YTRlLTljZWItYmZlNGNmYTA5MzhhL2NhbGxiYWNrIiwic2Vjb25kYXJ5Q29sb3IiOiJGRkZGRkYifX0._JBAC6Ok4p2KbdkBBWH3SlfD9HbuUXN4GlxO27DY6USAqzFo0MVUBocAYeqtnEi0bzgEVLJ95C1KU3NfBM10kg';

module.exports = {
  config,
  appId,
  partnerToken,
};
