const { expect } = require('chai');
const winston = require('winston');
const response = require('../src/response');

describe('Response Functions', () => {
  const { error, errorJson, errorNoCors, json, jsonNoCors } = response(winston);
  let data;
  const callback = (callbackError, callbackResponse) => {
    data = callbackResponse;
  };

  it('should parse error response', () => {
    error(callback, 'data', 400);

    expect(data.statusCode).to.equal(400);
    expect(data.body).to.equal('data');
  });

  it('should parse errorJson response', () => {
    errorJson(callback, 'sampleMessage', 400, 'sampleError', 'sampleContext');
    expect(data.statusCode).to.equal(400);
    expect(JSON.parse(data.body).message).to.equal('sampleMessage');
    expect(JSON.parse(data.body).error).to.equal('sampleError');
  });

  it('should parse errorNoJson response', () => {
    errorNoCors(callback, 'sampleData', 400, 'sampleOrigin');

    expect(data.statusCode).to.equal(400);
    expect(data.body).to.equal('"sampleData"');
    expect(data.headers['Access-Control-Allow-Credentials']).to.equal(true);
  });

  it('should parse json response', () => {
    json(callback, 'sampleData', 200);

    expect(data.statusCode).to.equal(200);
    expect(data.body).to.equal('"sampleData"');
    expect(data.headers['Access-Control-Allow-Credentials']).to.equal(true);
    expect(data.headers['Access-Control-Allow-Origin']).to.equal('*');
  });

  it('should parse jsonNoCors response', () => {
    jsonNoCors(callback, 'sampleData', 200, 'sampleOrigin');

    expect(data.statusCode).to.equal(200);
    expect(data.body).to.equal('"sampleData"');
    expect(data.headers['Access-Control-Allow-Credentials']).to.equal(true);
    expect(data.headers['Content-Type']).to.equal('application/json');
  });
});
