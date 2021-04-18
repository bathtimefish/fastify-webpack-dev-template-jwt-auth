import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

export default fastifyPlugin(async (fastify: FastifyInstance, _: any) => {
  fastify.register(require('fastify-jwt'), {
    secret: String(process.env.APPSERVER_AUTH_SECRET),
    sign: {
      expiresIn: String(process.env.APPSERVER_AUTH_EXPIRED_IN),
    },
  });
  fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (e) {
      reply.send(e);
    }
  });
});
