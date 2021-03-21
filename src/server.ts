import fastify from 'fastify';
import fastifyCors from 'fastify-cors';
import fastifyStatic from 'fastify-static';
import path from 'path';
// @ts-ignore
import { FastifyJWT } from 'fastify-jwt';

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
});

server.addHook('onRequest', async (request, reply, done) => {
  try {
    if (request.url === '/auth/signin') {
      done();
    } else {
      await request.jwtVerify();
    }
  } catch (err) {
    reply.send(err);
  }
});

server.get('/', async (_, rep) => {
  rep.sendFile('index.html');
});

// routers
server.register(require('./router/users'));
server.register(require('./router/auth'));

export default server;
