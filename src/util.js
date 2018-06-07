const _ = require('lodash');

const getEmailFromUserData = userData => {
  if (userData && _.isArray(userData.data)) {
    return _.find(userData.data, { label: 'contact.personal.email' });
  }

  return undefined;
};

const getUserIdFromUserData = userData => userData && userData.userId;

module.exports = {
  getEmailFromUserData,
  getUserIdFromUserData
};
