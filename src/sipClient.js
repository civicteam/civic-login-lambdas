const civicSip = require('civic-sip-api');

const exchangeCode = (optionsIn, authToken) => {
  const options = {
    appId: optionsIn.appId,
    appSecret: optionsIn.appSecret,
    prvKey: optionsIn.prvKey,
  };

  if (optionsIn.env !== 'prod') {
    options.env = optionsIn.env;
    options.api = optionsIn.api;
  }

  const civicClient = civicSip.newClient(options);
  return civicClient.exchangeCode(authToken);
};

module.exports = {
  exchangeCode,
};
