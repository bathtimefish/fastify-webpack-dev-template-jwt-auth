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
    handler: getAllHandler,
  });

  server.get(`/${name}/:userId`, {
    schema: getOneSchema,
    handler: getOneHandler,
  });

  server.post(`/${name}`,  {
    schema: postSchema,
    handler: postHandler,
  });

  server.patch(`/${name}/:userId`,  {
    schema: patchSchema,
    handler: patchHandler,
  });

  server.delete(`/${name}/:userId`,  {
    schema: deleteSchema,
    handler: deleteHandler,
  });

  next();
};

export default fastifyPlugin(router, {
  name,
  fastify: '3.x',
});
