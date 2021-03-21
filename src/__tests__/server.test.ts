import server from '../server';
import nock from 'nock';
import nodeFetch from 'node-fetch';

describe('Index', () => {

  const baseUrl = 'http://localhost:8080';

  beforeAll(() => {
    server.listen(8080, '0.0.0.0', (err, address) => {
      if (err) {
        console.error(err);
        server.close();
      }
      console.log(`Fastify AppServer Example listening at ${address}`);
    });
  });

  beforeEach(() => {
    nock(baseUrl).get('/data').reply(400, {"statusCode":400,"error":"Bad Request","message":"Request has no parameter"});
    nock(baseUrl).get('/data?a=b').reply(200, {"statusCode":400,"error":"Bad Request","message":"`greet` was not founded"});
    nock(baseUrl).get('/data?greet=Fastify').reply(200, 'Hello Fastify');
    nock(baseUrl).post('/data', {
      param1: 'Hello',
      param2: 'Fastify',
    }).reply(200, {param1: 'Hello', param2: 'Fastify'});
    nock(baseUrl).post('/data', { param1: 'Hello', }).reply(400, {
      statusCode: 400,
      error: "Bad Request",
      message: 'param2 was not found',
    });
  });

  afterEach(() => {
    nock.cleanAll();
  });

  afterAll(() => {
    server.close().then(() => {
      // console.info('Server successfully closed');
    }, (e) => {
      console.error(`Got an error when server closed: ${e}`);
    });
  });

  it ('should return Fastify object', () => {
    expect(server).not.toBeUndefined();
  });

  it ('should return a greeting hello', async () => {
    const url = `${baseUrl}/data?greet=Fastify`;
    const res = await nodeFetch(url);
    const repText = await res.text();
    expect(repText).toEqual('Hello Fastify');
  });

  it ('should return an error if it has no parameter', async () => {
    let url = `${baseUrl}/data`;
    let res = await nodeFetch(url);
    let rep = await res.json();
    expect(rep.message).toEqual("Request has no parameter");
    url = `${baseUrl}/data?a=b`;
    res = await nodeFetch(url);
    rep = await res.json();
    expect(rep.message).toEqual("`greet` was not founded");
  });

  it ('should return a object which requested body', async () => {
    const body = {
      param1: 'Hello',
      param2: 'Fastify',
    };
    const url = `${baseUrl}/data`;
    const options = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    };
    const res = await nodeFetch(url, options);
    const rep = await res.json();
    expect(rep).toMatchObject(body);
  });

  it ('should return an error because the request has no params', async () => {
    const url = `${baseUrl}/data`;
    const body = { param1: 'Hello', };
    const options = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    };
    const res = await nodeFetch(url, options);
    const rep = await res.json();
    expect(rep.message).toBe('param2 was not found');
  });

});