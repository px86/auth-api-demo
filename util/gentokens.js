const crypto = require('crypto');
const jwt = require('jsonwebtoken');

module.exports =  async function genTokens(user) {
  const payload = { username: user.username };

  const access_token = jwt.sign(
    payload,
    process.env.TOKEN_SECRET,
    { expiresIn: 60 } // TODO: change it
  );

  user.uuid = crypto.randomUUID();
  user.save();

  const refresh_token = jwt.sign(
    { uuid: user.uuid },
    process.env.TOKEN_SECRET,
    { expiresIn: '1d' } // TODO: find resonable duration
  );

  return { access_token, refresh_token };
}
