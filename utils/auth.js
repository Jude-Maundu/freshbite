const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function getJwtSecret() {
  return process.env.JWT_SECRET || 'fresh-bites-dev-secret';
}

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

async function comparePassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}

function signAuthToken(user) {
  const userId = user.id || user._id;

  return jwt.sign(
    {
      sub: String(userId),
      email: user.email,
      role: user.role,
      name: user.name,
    },
    getJwtSecret(),
    { expiresIn: TOKEN_EXPIRES_IN }
  );
}

function verifyAuthToken(token) {
  return jwt.verify(token, getJwtSecret());
}

function serializeUser(user) {
  const userId = user.id || user._id;

  return {
    id: String(userId),
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || '',
    status: user.status,
    createdAt: user.createdAt,
  };
}

module.exports = {
  hashPassword,
  comparePassword,
  signAuthToken,
  verifyAuthToken,
  serializeUser,
};
