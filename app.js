const express = require('express');
const mongoConnect = require('./util/database.js').mongoConnect;
const authMiddleware = require('./middlewares/authenticate.js');

try {
  const dotenv = require('dotenv');
  dotenv.config();
} catch (_err) {}
const { port=8000 } = process.env;

app = express();
app.use(express.json());

mongoConnect(() => {
  const router = require('./routes/auth.js');
  app.use('/api/user', router);

  // Protected route
  app.get('/user', authMiddleware, (_req, res) => {
    return res.json({ message: 'hello world' });
  })

  app.listen(port, () => {
    console.log(`Server is listening at ${port}`);
  });
});
