import { FastifyInstance, RouteHandlerMethod, FastifySchema } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import nodeFetch from 'node-fetch';

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
    // @ts-ignore
    preValidation: [server.authenticate],
    handler: getHandler,
  });

  server.get(`/${name}/google/callback`, async function (request, reply) {
    const self = this as any;
    /* tslint:disable:max-line-length */
    self.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request, async (err: any, result: any) => {
      if (err) {
        console.error(`GoogleAuthError: ${err}`);
        reply.redirect(303, `${process.env.UI_AUTH_URL}`);
      }
      console.log(result);
      /* tslint:disable:max-line-length */
      const url = 'https://people.googleapis.com/v1/people/me?personFields=emailAddresses,names';
      const options = {
        method: 'get',
        headers: {
          Authorization: `Bearer ${result.access_token}`,
        },
      };
      const res = await nodeFetch(url, options);
      const people = await res.json();
      console.log(people);
      const payload = {
        name: people.names[0].displayName,
        email: people.emailAddresses[0].value,
      };
      const token = server.jwt.sign(payload);
      console.log(token);
      const redirectUrl = `${process.env.UI_AUTH_URL}?t=${token}`;
      reply.redirect(303, redirectUrl);
    });
  });

  next();
};

export default fastifyPlugin(router, {
  name,
  fastify: '3.x',
});
