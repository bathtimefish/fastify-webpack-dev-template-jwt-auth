import { FastifySchema, RouteHandlerMethod } from 'fastify';
import boom from '@hapi/boom';

import dummyResponse from './dummyResponse';
const users: IServer.user[] = dummyResponse as any;

export const postSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['id', 'name'],
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
      address: { type: 'string' },
      birthday: { type: 'string' },
      sex: { type: 'string', enum: ['man', 'woman'] },
    },
  },
};

export const postHandler: RouteHandlerMethod = async (req, rep) => {
  try {
    const body = req.body as any;
    const user: IServer.user = {
      id: body.id,
      name: body.name,
      address: body.address,
      birthday: body.birthday,
      sex: body.sex,
    };
    users.push(user);
    rep.send(user);
  } catch (e) {
    throw boom.internal(e);
  }
};
