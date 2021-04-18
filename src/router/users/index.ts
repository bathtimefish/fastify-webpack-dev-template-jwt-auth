import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { getAllHandler } from './getAll';
import { getOneSchema, getOneHandler } from './getOne';
import { postSchema, postHandler } from './post';
import { patchSchema, patchHandler } from './patch';
import { deleteSchema, deleteHandler } from './delete';

const name = 'users';

const router =  function (server: FastifyInstance, _: any, next: any) {

  server.get(`/${name}`,  {
    // @ts-ignore
    preValidation: [server.authenticate],
    handler: getAllHandler,
  });

  server.get(`/${name}/:userId`, {
    // @ts-ignore
    preValidation: [server.authenticate],
    schema: getOneSchema,
    handler: getOneHandler,
  });

  server.post(`/${name}`,  {
    // @ts-ignore
    preValidation: [server.authenticate],
    schema: postSchema,
    handler: postHandler,
  });

  server.patch(`/${name}/:userId`,  {
    // @ts-ignore
    preValidation: [server.authenticate],
    schema: patchSchema,
    handler: patchHandler,
  });

  server.delete(`/${name}/:userId`,  {
    // @ts-ignore
    preValidation: [server.authenticate],
    schema: deleteSchema,
    handler: deleteHandler,
  });

  next();
};

export default fastifyPlugin(router, {
  name,
  fastify: '3.x',
});
