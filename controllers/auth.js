const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const genTokens = require('../util/gentokens.js');

module.exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!password || password.length < 8)
      throw new Erro('password too short, minimum length is 8');
    const hashPassword = await bcrypt.hash(password, 8);
    const user = await User.create( { username, password: hashPassword });
    user.save();
    res.status(200).json({ message: `user ${username} created successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.status(404).json({ message: `user ${username} not found` });

    if (false === await bcrypt.compare(password, user.password))
      return res.status(401).json({ message: 'incorrect password' });

    const tokens = await genTokens(user);
    res.status(200).json(tokens);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;
    jwt.verify(refresh_token, process.env.TOKEN_SECRET, async (err, uuid_obj) => {
      if (err) return res.sendStatus(401);
      const user = await User.findOne({ uuid: uuid_obj.uuid });
      if (!user) return res.sendStatus(401);

      const tokens = await genTokens(user);
      res.status(200).json(tokens);
    })
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
