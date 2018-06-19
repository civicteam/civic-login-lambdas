const _ = require('lodash');
const createError = require('http-errors');
const co = require('co');
const sipClient = require('./sipClient');
const util = require('./util');

const sessionTokenFactory = require('./sessionToken');
const responseFactory = require('./response');
const LoginData = require('./loginData');

function loggerInstanceOrConsole(logger) {
  if ([logger.info, logger.warn, logger.error].every(_.isFunction)) {
    // the logger is set up correctly
    return logger;
  }

  return {
    error: (...args) => console.error(...args),
    warn: (...args) => console.warn(...args),
    info: (...args) => console.info(...args),
    debug: (...args) => console.info(...args)
  };
}

function extractResponse(loginCallbackResponse, userData) {
  if (loginCallbackResponse instanceof LoginData) {
    return loginCallbackResponse;
  }
  const authUserId = util.getUserIdFromUserData(userData);
  return {
    sessionTokenContents: { userId: authUserId },
    loginResponse: loginCallbackResponse
  };
}

module.exports = (loggerInstance, config, loginCallback) => {
  const logger = loggerInstanceOrConsole(loggerInstance);
  const response = responseFactory(logger);
  const sessionToken = sessionTokenFactory(config.sessionToken, logger);

  function handleLoginError(loginError) {
    logger.error(loginError);
    if (loginError.status) {
      if (loginError.status === 401) {
        return Promise.reject(createError(loginError.status, 'Unauthorized'));
      }
      // this is already an http error, just throw it
      return Promise.reject(createError(loginError.status, 'Login Error'));
    }
    // default error is 500
    return Promise.reject(createError(500, 'Internal Server Error'));
  }

  function validateAndCallLoginCallback(...args) {
    if (!_.isFunction(loginCallback)) return {};

    try {
      const loginResult = loginCallback(...args);

      // wrap in a promise in case the result is not a promise
      return Promise.resolve(loginResult);
    } catch (loginError) {
      return handleLoginError(loginError);
    }
  }

  /**
   * Log in into the portal
   * @apiParam (body) {String} authToken token received from civic-sip-js
   * @apiParamExample {json} example:
   *     {
   *       "authToken": "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpX..."
   *     }
   * @param {Object} event The API Gateway event
   * @param {Object} context The AWS Lambda context object
   * @param {Function} callback Called with the login response or error
   */
  const login = (event, context, callback) => {
    if (event.source && event.source === 'serverless-plugin-warmup') {
      logger.info('WarmUP - Lambda is being kept warm!');
      callback(null, 'Lambda is being kept warm!');
      return;
    }
    co(function*() {
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
        throw createError(400, `bad token: ${err.message ? err.message : JSON.stringify(err)}`);
      }

      if (!userData) {
        throw createError(500, 'unable to get userData');
      }

      // delegate to the caller's login callback after validating the
      // auth token, to allow the caller to add custom business logic
      // or validation around login
      const loginCallbackResponse = yield validateAndCallLoginCallback(event, userData);
      const { sessionTokenContents, loginResponse } = extractResponse(loginCallbackResponse, userData);

      const token = sessionToken.create(sessionTokenContents);

      return _.assign(
        {},
        {
          sessionToken: token
        },
        loginResponse
      );
    })
      .then(payload => {
        response.json(callback, payload, 200);
      })
      .catch(error => {
        if (error.status) {
          response.error(callback, error);
          return;
        }

        logger.error(error);
        response.error(callback, createError(500, 'Internal Server Error'));
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
      logger.error('no token provided', event.headers);
      response.customAuthorizerError(callback, createError(401, 'Unauthorized'));
      return;
    }

    let userId;
    try {
      userId = sessionToken.validate(token);
    } catch (err) {
      logger.error('session token validate error: ', token, err);
      response.customAuthorizerError(callback, createError(401, 'Unauthorized'));
      return;
    }

    if (!userId) {
      logger.error('no user found for token: ', token, event.headers);
      response.customAuthorizerError(callback, createError(401, 'Unauthorized'));
      return;
    }

    const defaultResource = event.methodArn;
    const resource = config.sessionToken.resourceArn || defaultResource;

    const authResponse = generatePolicy('user', 'Allow', resource);
    authResponse.context = {
      userId
    };

    callback(null, authResponse);
  };

  return {
    login,
    keepAlive,
    sessionAuthorizer,
    sipClient
  };
};
