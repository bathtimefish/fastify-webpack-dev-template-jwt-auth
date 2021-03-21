import { FastifySchema, RouteHandlerMethod } from 'fastify';
import boom from '@hapi/boom';

import dummyResponse from './dummyResponse';
const users: IServer.user[] = dummyResponse as any;

export const deleteSchema: FastifySchema = {
  params: {
    type: 'object',
    properties: {
      userId: { type: 'integer' },
    },
  },
};

export const deleteHandler: RouteHandlerMethod = async (req, rep) => {
  try {
    const p = req.params as any;
    const user = users.find((u) => { return u.id === p.userId; });
    console.log(user);
    if (!user) throw boom.notFound();
    const deleted: IServer.user[] = [];
    for (const u of users) {
      if (u.id !== p.userId) deleted.push(u);
    }
    console.info('Deleted Users', JSON.stringify(deleted));
    rep.status(204).send();
  } catch (e) {
    throw e;
  }
};
