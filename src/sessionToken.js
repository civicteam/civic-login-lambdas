const uuidV4 = require('uuid/v4');
const jwt = require('./jwt');

const JWT_EXPIRATION = '10m'; // 10 minutes
const JWT_GRACE_PERIOD = 60; // 1 minutes

module.exports = (sessionConfig) => {
  const create = (userId, expiration = JWT_EXPIRATION) => {
    const payload = {
      sessionId: uuidV4(),
      userId,
    };
    return jwt.createToken(sessionConfig.issuer, sessionConfig.audience, sessionConfig.subject, expiration, payload, sessionConfig.prvKey);
  };

  const verify = (jwToken, gracePeriod = JWT_GRACE_PERIOD) => jwt.verify(jwToken, sessionConfig.pubKey, { gracePeriod });

  const validate = (token) => {
    if (!token || !verify(token)) {
      console.warn('Validate: No token found or token unverified - ', token);
      return false;
    }
    const decoded = jwt.decode(token);

    if (decoded && decoded.payloadObj && decoded.payloadObj.data) {
      return decoded.payloadObj.data.userId;
    }
    console.warn('Validate decode: payload not decoded - ', decoded);
    return false;
  };

  const keepAlive = (token, expiration = JWT_EXPIRATION) => {
    const userId = validate(token);
    if (!userId) {
      return false;
    }
    return create(userId, expiration);
  };

  const validateFromEvent = (event) => {
    if (!event || !event.headers || !event.headers.Authorization) {
      return false;
    }
    const token = event.headers.Authorization;

    return validate(token);
  };

  const keepAliveFromEvent = (event) => {
    if (!event || !event.headers) {
      return false;
    }
    const token = event.headers.Authorization;

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
      verify,
    },
  };
};
