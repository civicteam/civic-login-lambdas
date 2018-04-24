module.exports = (logger) => {
  const json = (callback, data, statusCode) => {
    // TODO: may have to do this - if returning json or non-html data, then return the HTML wrapped in JSON to preserve encoding
    // callback(null, { data: html });
    const response = {
      statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    callback(null, response);
  };

  const jsonNoCors = (callback, data, statusCode, origin) => {
    const response = {
      statusCode,
      headers: {
        'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    // allow for specific origins if provided
    if (origin) {
      response.headers['Access-Control-Allow-Origin'] = origin;
    }

    callback(null, response);
  };

  const error = (callback, data, statusCode) => {
    let body = data;
    if (typeof data === 'object') {
      body = data.message;
    }
    const response = {
      statusCode,
      body,
    };

    logger.error('Error: ', JSON.stringify(response));
    if (callback) {
      callback(null, response);
    }
  };

  const errorNoCors = (callback, data, statusCode, origin) => {
    const response = {
      statusCode,
      headers: {
        'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    logger.error(JSON.stringify(response));

    // allow for specific origins if provided
    if (origin) {
      response.headers['Access-Control-Allow-Origin'] = origin;
    }

    callback(null, response);
  };

  const errorJson = (callback, message, statusCode = 400, error, context) => {
    logger.error(message);
    const data = {
      statusCode,
      message,
      error,
    };
    if (typeof message === 'object') {
      data.message = message.message;
    }

    if (!data.error) {
      data.error = data.message;
    }

    return json(callback, data, statusCode, context);
  };

  return {
    error,
    errorJson,
    errorNoCors,
    json,
    jsonNoCors,
  };
};
