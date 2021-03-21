import { FastifyInstance, RouteHandlerMethod, FastifySchema } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

const name = 'auth';

const router =  function (server: FastifyInstance, _: any, next: any) {

  const postSchema: FastifySchema = {
    body: {
      type: 'object',
      required: ['name', 'email'],
      properties: {
        name: { type: 'string' },
        email: { type: 'string' },
      },
    },
  };

  const postHandler: RouteHandlerMethod = async (request, reply) => {
    try {
      const body = request.body as {name: string, email: string};
      const payload = {
        name: body.name,
        email: body.email,
      };
      const token = server.jwt.sign(payload);
      reply.send(token);
    } catch (e) {
      throw e;
    }
  };

  const getHandler: RouteHandlerMethod = async (request, reply) => {
    reply.send(request.user);
  };

  server.post(`/${name}/signin`,  {
    schema: postSchema,
    handler: postHandler,
  });

  server.get(`/${name}/session`, {
    handler: getHandler,
  });

  next();
};

export default fastifyPlugin(router, {
  name,
  fastify: '3.x',
});
