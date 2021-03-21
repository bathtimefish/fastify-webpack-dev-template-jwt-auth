import { FastifySchema, RouteHandlerMethod } from 'fastify';
import boom from '@hapi/boom';

import dummyResponse from './dummyResponse';
const users: IServer.user[] = dummyResponse as any;

export const patchSchema: FastifySchema = {
  params: {
    type: 'object',
    properties: {
      userId: { type: 'integer' },
    },
  },
  body: {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string' },
      address: { type: 'string' },
      birthday: { type: 'string' },
      sex: { type: 'string', enum: ['man', 'woman'] },
    },
  },
};

export const patchHandler: RouteHandlerMethod = async (req, rep) => {
  try {
    const body = req.body as any;
    const patch: IServer.user = {
      id: body.id,
      name: body.name,
      address: body.address,
      birthday: body.birthday,
      sex: body.sex,
    };
    const p = req.params as any;
    const user = users.find((u) => { return u.id === p.userId; });
    if (!user) throw boom.notFound();
    user.name = patch.name || user.name;
    user.address = patch.address || user.address;
    user.birthday = patch.birthday || user.birthday;
    user.sex = patch.sex || user.sex;
    rep.send(user);
  } catch (e) {
    throw boom.internal(e);
  }
};
