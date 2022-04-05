import bcrypt from 'bcrypt';
import config from 'config';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model';
import genTokens from '../utils/tokens';
import { Request, Response } from "express";

const tokenSecret = config.get<string>('tokenSecret');

export const register = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      username,
      password,
    } = req.body;

    if (!password || password.length < 8)
      throw new Error("password too short, minimum length is 8");

    const hashPassword = await bcrypt.hash(req.body.password, 8);
    const user = await UserModel.create(
      {
	firstName,
	lastName,
	email,
	username,
	password: hashPassword
      });
    user.save();
    res.status(200).json({ message: `user ${username} created successfully` });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });
    if (!user)
      return res.status(404).json({ message: `user ${username} not found` });

    if (false === (await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "incorrect password" });

    const tokens = await genTokens(user);
    res.status(200).json(tokens);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refresh_token } = req.body;
    jwt.verify(
      refresh_token,
      tokenSecret,
      async (err: any, uuid_obj: any) => {
        if (err) return res.sendStatus(401);
        const user = await UserModel.findOne({ uuid: uuid_obj.uuid });
        if (!user) return res.sendStatus(401);
        const tokens = await genTokens(user);
        res.status(200).json(tokens);
      }
    );
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
