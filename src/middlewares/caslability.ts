import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { Ability } from '@casl/ability';

export default (request: any, response: Response, next: NextFunction) => {
  const token = request.headers['authorization'];
  if(typeof token !== 'string') {
    return response.status(401).send({});
  }
  const payload  = verify(token, process.env.JWT_SECRET || '');
  if(typeof payload === 'string') {
    return response.status(401).send({});
  }
  request.ability = new Ability(payload.abilities);
  request.userId = payload.userId;
  next();
};
