const civicSip = require('civic-sip-api');
const _ = require('lodash');

const exchangeCode = (optionsIn, authToken) => {
  const options = {
    appId: optionsIn.appId,
    appSecret: optionsIn.appSecret,
    prvKey: optionsIn.prvKey
  };

  if (optionsIn.env !== 'prod') {
    options.env = optionsIn.env;
    options.api = optionsIn.api;
  }

  const civicClient = civicSip.newClient(options);
  return civicClient.exchangeCode(authToken);
};

const getEmailFromUserData = userData => {
  if (userData && _.isArray(userData.data)) {
    return _.find(userData.data, { label: 'contact.personal.email' });
  }

  return undefined;
};

const getUserIdFromUserData = userData => userData && userData.userId;

module.exports = {
  exchangeCode,
  getEmailFromUserData,
  getUserIdFromUserData
};
