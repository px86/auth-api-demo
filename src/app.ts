import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
require('dotenv').config();
import config from 'config';


import authRouter from './routes/auth.route';
import authMiddleware from './middlewares/authuser.middleware';

const app = express();
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/user', authMiddleware, (_req: Request, res: Response) => {
    res.status(200).json({
	message: `hello ${res.locals.user.username}`
    });
});

main()
async function main(): Promise<void> {
  try {
    const port = config.get<number>('port');
    const dbURI = config.get<string>('dbURI');
    await mongoose.connect(dbURI);
      app.listen(port, () => {
	  console.log(`Server listening at port ${port}`);
      });
  } catch (err: any) {
      console.error(err);
      process.exit(1);
  }
}
