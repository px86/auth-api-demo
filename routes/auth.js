const router = require('express').Router();
const { register, login, refreshToken } = require('../controllers/auth.js');

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);

module.exports = router;
