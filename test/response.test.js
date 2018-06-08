const { expect } = require('chai');
const winston = require('winston');
const createError = require('http-errors');
const response = require('../src/response');

describe('Response Functions', () => {
  const { error, json } = response(winston);
  let dataResponse;
  let errorResponse;
  const callback = (callbackError, callbackResponse) => {
    dataResponse = callbackResponse;
    errorResponse = callbackError;
  };

  it('should parse error response', () => {
    const errorMessage = 'some error';

    error(callback, createError(400, errorMessage));

    expect(errorResponse).to.equal('Unauthorized');

    // Consider reenabling once
    // https://forums.aws.amazon.com/thread.jspa?threadID=226689 is resolved
    // expect(errorResponse.statusCode).to.equal(400);
    // expect(errorResponse.message).to.equal(errorMessage);
  });

  it('should parse json response', () => {
    json(callback, 'sampleData', 200);

    expect(dataResponse.statusCode).to.equal(200);
    expect(dataResponse.body).to.equal('"sampleData"');
    expect(dataResponse.headers['Access-Control-Allow-Credentials']).to.equal(true);
    expect(dataResponse.headers['Access-Control-Allow-Origin']).to.equal('*');
  });
});
