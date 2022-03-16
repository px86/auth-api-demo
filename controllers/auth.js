const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../util/database.js').getDB();
const users = db.collection('users');

const saltRounds = 10;

module.exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await users.findOne({ username });
  if (user !== null && await bcrypt.compare(password, user.password)) {
//    const token = jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
    const token = jwt.sign(username, process.env.TOKEN_SECRET, { });
    res.status(200).json(token);
  } else {
    res.status(404).json({ error: 'incorrect credentials' });
  }
};

module.exports.signup = async (req, res) => {
  const { username, password } = req.body;
  const user = await users.findOne({ username });
  if (user === null) {
    try {
      const hash = await bcrypt.hash(password, saltRounds);
      const user = await users.insertOne({ username, password: hash });
      res.status(200).json({ message: 'user created successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'internal server error' });
    }
  } else {
    res.status(404).json({ error: 'username is already taken' });
  }
};
