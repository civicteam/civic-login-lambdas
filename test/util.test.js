const { expect } = require('chai');

const util = require('../src/util');

const userData = {
  data: [
    {
      label: 'contact.personal.email',
      value: 'myemail@yahoo.com',
      isValid: true,
      isOwner: true,
    },
    {
      label: 'contact.personal.phoneNumber',
      value: '+44 555666333',
      isValid: true,
      isOwner: true,
    },
  ],
  userId: '2a4243e4a9418d3f545b7d0f68c822197a9e24beeceea3b7ade7aa82bf662650',
};

describe('util.js', () => {
  it('should extract email address from userData received from authToken', () => {
    const email = util.getEmailFromUserData(userData);

    expect(email.value).to.equal('myemail@yahoo.com', 'can not get valid email from userData');
    expect(util.getEmailFromUserData({ data: [{ label: 'some random', value: 'value' }] })).to.equal(
      undefined,
      'no valid items in array returns undefined'
    );
    expect(util.getEmailFromUserData({ data: 'dfdfdf' })).to.equal(undefined, 'no array returns undefined');
    expect(util.getEmailFromUserData({})).to.equal(undefined, 'empty object returns undefined');
    expect(util.getEmailFromUserData(undefined)).to.equal(undefined, 'undefined returns undefined');
  });

  it('should extract userId from userData', () => {
    const userId = util.getUserIdFromUserData(userData);

    expect(userId).to.equal(
      '2a4243e4a9418d3f545b7d0f68c822197a9e24beeceea3b7ade7aa82bf662650',
      'can not get valid userId from userData'
    );
    expect(util.getUserIdFromUserData({})).to.equal(undefined, 'empty object returns undefined');
    expect(util.getUserIdFromUserData(undefined)).to.equal(undefined, 'undefined returns undefined');
  });
});
