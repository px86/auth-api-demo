const router = require('express').Router();
const auth = require('../controllers/auth.js');

router.post('/signup', auth.signup);
router.post('/login', auth.login);

module.exports = router;
