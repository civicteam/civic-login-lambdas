module.exports = logger => {
  const json = (callback, data, statusCode) => {
    const response = {
      statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };

    return callback(null, response);
  };

  const error = (callback, httpError) => {
    const response = {
      statusCode: httpError.status,
      body: JSON.stringify({ message: httpError.message })
    };

    logger.error('Error: ', JSON.stringify(response));
    return callback(null, response);
  };

  return {
    error,
    json
  };
};
