const { v4: uuid } = require('uuid');
const _ = require('lodash');
const jwt = require('./jwt');

const JWT_EXPIRATION = '10m'; // 10 minutes
const JWT_GRACE_PERIOD = 60; // 1 minutes

module.exports = (sessionConfig, logger) => {
  const create = (sessionTokenContents, expiration = JWT_EXPIRATION) => {
    // for backwards-compatibility and simplicity, assume that the sessionTokenContents
    // is simply the UserId if it is not an object
    const sessionTokenContentObj = _.isObject(sessionTokenContents)
      ? sessionTokenContents
      : { userId: sessionTokenContents };

    const payload = _.merge(
      {},
      {
        sessionId: uuid()
      },
      sessionTokenContentObj
    );

    return jwt.createToken(
      sessionConfig.issuer,
      sessionConfig.audience,
      sessionTokenContentObj.userId,
      expiration,
      payload,
      sessionConfig.prvKey
    );
  };

  const verify = (jwToken, gracePeriod = JWT_GRACE_PERIOD) =>
    jwt.verify(jwToken, sessionConfig.pubKey, { gracePeriod });

  const validate = token => {
    if (!token || !verify(token)) {
      logger.warn('Validate: No token found or token unverified - ', token);
      return false;
    }
    const decoded = jwt.decode(token);

    // the subject is the userID
    if (decoded && decoded.payloadObj && decoded.payloadObj.sub) {
      return decoded.payloadObj.sub;
    }
    logger.warn('Validate decode: payload not decoded - ', decoded);
    return false;
  };

  const keepAlive = (token, expiration = JWT_EXPIRATION) => {
    const userId = validate(token);
    if (!userId) {
      return false;
    }
    return create(userId, expiration);
  };

  const validateFromEvent = event => {
    if (!event || !event.headers) {
      return false;
    }
    // http sends authorization via lower case a, so need to make sure to check both cases
    const token = event.headers.Authorization ? event.headers.Authorization : event.headers.authorization;
    if (!token) {
      return false;
    }

    return validate(token);
  };

  const keepAliveFromEvent = event => {
    if (!event || !event.headers) {
      return false;
    }
    const token = event.headers.Authorization ? event.headers.Authorization : event.headers.authorization;

    return keepAlive(token);
  };

  return {
    create,
    keepAlive,
    validate,
    validateFromEvent,
    keepAliveFromEvent,
    // unit testing only
    test: {
      verify
    }
  };
};
