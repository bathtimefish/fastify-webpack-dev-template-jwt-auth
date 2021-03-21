import fastify from 'fastify';
import fastifyCors from 'fastify-cors';
import fastifyStatic from 'fastify-static';
import path from 'path';
// @ts-ignore
import { FastifyJWT } from 'fastify-jwt';
import fastifyOauth2 from 'fastify-oauth2';

const server = fastify();
server.register(fastifyCors, {
  exposedHeaders: ['X-Total-Count'],
});
server.register(fastifyStatic, {
  root: path.join(__dirname, '../public'),
  prefix: '/',
});
server.register(require('fastify-boom'));
server.register(require('fastify-jwt'), {
  secret: 'supersecret',
  sign: {
    expiresIn: 60,  // token will expire for 60 seconds.
  },
});
server.register(fastifyOauth2, {
  name: 'googleOAuth2',
  scope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ],
  credentials: {
    client: {
      id: String(process.env.GOOGLE_AUTH_CLIEND_ID),
      secret: String(process.env.GOOGLE_AUTH_SECRET),
    },
    auth: fastifyOauth2.GOOGLE_CONFIGURATION,
  },
  startRedirectPath: '/auth/google',
  callbackUri: 'http://localhost:8080/auth/google/callback',
});

server.addHook('onRequest', async (request, _, done) => {
  try {
    if (/^\/auth\/google/.test(request.url)) {
      done();
    } else {
      await request.jwtVerify();
    }
  } catch (err) {
    throw err;
  }
});

server.get('/', async (_, rep) => {
  rep.sendFile('index.html');
});

// routers
server.register(require('./router/users'));
server.register(require('./router/auth'));

export default server;
