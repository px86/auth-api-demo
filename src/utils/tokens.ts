import crypto from 'node:crypto';
import { User } from '../models/user.model';
import { Document, Types } from 'mongoose';
import * as jwt from 'jsonwebtoken';

const secret = process.env.SECRET_TOKEN || '';
type UserType = Document<unknown, any, User> & User & { _id: Types.ObjectId };

export default async function genTokens(user: UserType) {
  const payload = { username: user.username };

  const access_token = jwt.sign(
    payload,
    secret,
    { expiresIn: '3h' }
  );

  user.uuid = crypto.randomUUID();
  user.save();

  const refresh_token = jwt.sign(
    { uuid: user.uuid },
    secret,
    { expiresIn: '1d' }
  );

  return { access_token, refresh_token };
}
