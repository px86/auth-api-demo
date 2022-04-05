import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from 'config';

const tokenSecret = config.get<string>('tokenSecret');

export default function(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.sendStatus(401);
  }
  jwt.verify(token, tokenSecret, (err, user) => {
    if (err) return res.sendStatus(401);
    res.locals.user = user;
    return next();
  });
};
