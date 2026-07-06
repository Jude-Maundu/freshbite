const express = require('express');
const { login, register } = require('../controllers/authController');
const requireAuth = require('../middleware/requireAuth');
const { serializeUser } = require('../utils/auth');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', requireAuth, (req, res) =>
  res.json({
    success: true,
    data: serializeUser(req.user),
  })
);

module.exports = router;
