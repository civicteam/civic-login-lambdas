const { expect } = require('chai');
const winston = require('winston');
const createError = require('http-errors');
const response = require('../src/response');

describe('Response Functions', () => {
  const { error, json } = response(winston);
  let data;
  const callback = (callbackError, callbackResponse) => {
    data = callbackResponse;
  };

  it('should parse error response', () => {
    const errorMessage = 'some error';

    error(callback, createError(400, errorMessage));

    const parsedBody = JSON.parse(data.body);

    expect(data.statusCode).to.equal(400);
    expect(parsedBody.message).to.equal(errorMessage);
  });

  it('should parse json response', () => {
    json(callback, 'sampleData', 200);

    expect(data.statusCode).to.equal(200);
    expect(data.body).to.equal('"sampleData"');
    expect(data.headers['Access-Control-Allow-Credentials']).to.equal(true);
    expect(data.headers['Access-Control-Allow-Origin']).to.equal('*');
  });
});
