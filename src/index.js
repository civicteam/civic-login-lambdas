const co = require('co');
const _ = require('lodash');
const sipClient = require('./sipClient');
const sessionTokenFactory = require('./sessionToken');
const responseFactory = require('./response');

module.exports = (logger, config, authCallback) => {
  const response = responseFactory(logger);
  const sessionToken = sessionTokenFactory(config.sessionToken);

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
   *
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

    return co(function* coWrapper() {
      const body = JSON.parse(event.body) || {};

      const { authToken } = body;

      if (!authToken) {
        throw new Error('no authToken provided');
      }

      let userData;
      try {
        logger.info('Token exchange for user data...');
        userData = yield sipClient.exchangeCode(config.app, authToken);
      } catch (err) {
        throw new Error(`bad token: ${err.message ? err.message : err}`);
      }

      if (!userData) {
        throw new Error('unable to get userData');
      }

      const authUserId = sipClient.getUserIdFromUserData(userData);

      if (authCallback) {
        let failureReason = authCallback(userData);
        if (failureReason != null) {
          throw new Error('Access Denied: ' + failureReason);
        }
      }

      //TODO needed?
      /*
      let userPartnerDoc = yield userPartner.findByEmail(email.value);

      if (!userPartnerDoc) {
        logger.info(`No item found for partner user, inserting by email: ${email.value}`);
        userPartnerDoc = yield userPartner.insert({
          email: email.value,
          authUserId,
          role: userPartner.userRoles.OWNER,
          status: userPartner.userStatuses.ACTIVE,
        }, null, null, getTrackMetaInfo(event));

        if (!userPartnerDoc) {
          throw new Error('user partner insert failed');
        }
      }
      */

      const token = sessionToken.create(authUserId);

      return {
        sessionToken: token,
      };
    }).then((payload) => {
      response.json(callback, payload, 200);
    }).catch(err => response.errorJson(callback, err));
  };

  function getTokenFromEvent(event) {
    const token = sessionToken.keepAliveFromEvent(event);
    if (!token) {
      throw new Error('token not valid');
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

      return response.json(callback, {
        sessionToken: token,
      }, 200);
    } catch (err) {
      return response.errorJson(callback, 'Unauthorized', 401);
    }
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
      return callback(JSON.stringify({ message: 'Unauthorized' }));
    }

    if (!userId) {
      logger.warn('no user found for token: ', token, event.headers);
      return callback('Unauthorized');
    }
    const authResponse = generatePolicy('user', 'Allow', event.methodArn);
    authResponse.context = {
      userId,
    };
    return callback(null, authResponse);
  };

  // http://docs.aws.amazon.com/apigateway/latest/developerguide/use-custom-authorizer.html#api-gateway-custom-authorizer-lambda-function-create
  const generatePolicy = (principalId, effect, resource) => {
    const authResponse = {
      principalId,
    };

    if (effect && resource) {
      authResponse.policyDocument = {
        Version: '2012-10-17', // default version
        Statement: [{
          Action: 'execute-api:Invoke', // default action
          Effect: effect,
          Resource: resource,
        }],
      };
    }

    return authResponse;
  };

  return {
    login,
    keepAlive,
    sessionAuthorizer,
    sipClient
  };
};