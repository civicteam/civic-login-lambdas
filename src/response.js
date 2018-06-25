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
    logger.error('Error reported to client: Unauthorized');

    // due to the way AWS handles errors in customAuthorizers, we log the *real*
    // error here but respond with 'Unauthorized'
    // https://forums.aws.amazon.com/thread.jspa?threadID=226689
    // return callback(null, response);

    callback('Unauthorized');
  };

  return {
    error,
    json
  };
};
