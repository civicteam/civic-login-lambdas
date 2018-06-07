const createError = require('http-errors');
const co = require('co');
const sipClient = require('./sipClient');
const util = require('./util');

const sessionTokenFactory = require('./sessionToken');
const responseFactory = require('./response');

function isFunction(functionToCheck) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

module.exports = (loggerInstance, config, loginCallback) => {
  function loggerInstanceOrConsole(logger) {
    if (typeof logger.info === 'function' && typeof logger.warn === 'function' && typeof logger.error === 'function') {
      return logger;
    }
    return {
      error: (...args) => console.error(...args),
      warn: (...args) => console.warn(...args),
      info: (...args) => console.info(...args),
      debug: (...args) => console.info(...args)
    };
  }

  function handleLoginError(loginError) {
    logger.error(loginError);
    if (!!loginError.status) {
      if (loginError.status === 401) {
        return Promise.reject(createError(loginError.status, 'Unauthorized'));
      } else {
        // this is already an http error, just throw it
        return Promise.reject(createError(loginError.status, 'Login Error'));
      }
    } else {
      // default error is 500
      return Promise.reject(createError(500, 'Unauthorized'));
    }
  }

  function validateAndCallLoginCallback(loginCallback, ...args) {
    if (!isFunction(loginCallback)) return {};

    try {
      return loginCallback(...args);
    } catch (loginError) {
      return handleLoginError(loginError);
    }
  }

  const logger = loggerInstanceOrConsole(loggerInstance);
  const response = responseFactory(logger);
  const sessionToken = sessionTokenFactory(config.sessionToken, logger);

  /**
   * @api {post} admin/login  /../login (POST)
   * @apiDescription login into the admin portal
   * @apiName Login
   * @apiGroup _Admin_
   *
   * @apiParam (body) {String} authToken token received from civic-sip-js
   *
   * @apiParamExample {json} example:
   *     {
   *       "authToken": "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpX..."
   *     }

   * @param {Object} event
   * @param {Object} context
   * @param {Function} callback
   */
  const login = (event, context, callback) => {
    if (event.source && event.source === 'serverless-plugin-warmup') {
      logger.info('WarmUP - Lambda is being kept warm!');
      return callback(null, 'Lambda is being kept warm!');
    }
    logger.info('event: ', event);

    return co(function*() {
      const body = JSON.parse(event.body) || {};

      const { authToken } = body;

      if (!authToken) {
        throw createError(401, 'no authToken provided');
      }

      let userData;
      try {
        logger.info('Token exchange for user data...');
        userData = yield sipClient.exchangeCode(config.app, authToken);
      } catch (err) {
        throw createError(400, `bad token: ${err.message ? err.message : err}`);
      }

      if (!userData) {
        throw createError('unable to get userData');
      }


      // delegate to the caller's login callback after validating the
      // auth token, to allow the caller to add custom business logic
      // or validation around login
      const loginCallbackResponse = yield validateAndCallLoginCallback(loginCallback, event, userData);
      const authUserId = util.getUserIdFromUserData(userData);
      const token = sessionToken.create(authUserId);

      return {
        sessionToken: token,
        ...loginCallbackResponse
      };
    })
      .then(payload => response.json(callback, payload, 200))
      .catch(error => {
        if (!!error.status) return response.error(callback, error);
        return response.error(callback, createError(500, 'Internal Server Error'));
      });
  };

  function getTokenFromEvent(event) {
    const token = sessionToken.keepAliveFromEvent(event);
    if (!token) {
      throw createError(400, 'token not valid');
    }
    return token;
  }

  /**
   * @api {post} admin/session  /../session (POST)
   * @apiDescription renew session token
   * @apiName Session
   * @apiGroup _Admin_
   *
   * @apiHeader (header) {String} authorization sessionToken
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "sessionToken": "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpX..."
   *     }
   *
   * @param {Object} event
   * @param {Object} context
   * @param {Function} callback
   */
  const keepAlive = (event, context, callback) => {
    if (event.source && event.source === 'serverless-plugin-warmup') {
      logger.info('WarmUP - Lambda is being kept warm!');
      return callback(null, 'Lambda is being kept warm!');
    }
    logger.info('event: ', event);

    try {
      const token = getTokenFromEvent(event);

      return response.json(
        callback,
        {
          sessionToken: token
        },
        200
      );
    } catch (err) {
      return response.error(callback, createError(401, 'Unauthorized'));
    }
  };

  /* http://docs.aws.amazon.com/apigateway/latest/developerguide
  /use-custom-authorizer.html#api-gateway-custom-authorizer-lambda-function-create */
  const generatePolicy = (principalId, effect, resource) => {
    const authResponse = {
      principalId
    };

    if (effect && resource) {
      authResponse.policyDocument = {
        Version: '2012-10-17', // default version
        Statement: [
          {
            Action: 'execute-api:Invoke', // default action
            Effect: effect,
            Resource: resource
          }
        ]
      };
    }

    return authResponse;
  };

  const sessionAuthorizer = (event, context, callback) => {
    const token = event.authorizationToken;
    if (!token) {
      logger.warn('no token provided', event.headers);
      return callback('Unauthorized');
    }

    let userId;
    try {
      userId = sessionToken.validate(token);
    } catch (err) {
      logger.error('session token validate error: ', token, err);
      return response.error(callback, createError(401, 'Unauthorized'));
    }

    if (!userId) {
      logger.warn('no user found for token: ', token, event.headers);
      return response.error(callback, createError(401, 'Unauthorized'));
    }

    const authResponse = generatePolicy('user', 'Allow', event.methodArn);
    authResponse.context = {
      userId
    };
    return callback(null, authResponse);
  };

  return {
    login,
    keepAlive,
    sessionAuthorizer,
    sipClient
  };
};
