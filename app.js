const mongoose = require('mongoose');
const express = require('express');

const authRouter = require('./routes/auth.js');
const authMiddleware = require('./middlewares/authenticate.js');

try {
  require('dotenv').config();
} catch (_err) {}

const { port=8000 } = process.env;

app = express();
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/user', authMiddleware, (req, res) => {
  res.status(200).json({ message: `hello ${req.user.username}` });
});

run()
async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    app.listen(process.env.PORT, () => {
      console.log(`Server listening at port ${process.env.PORT}`);
    });
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
