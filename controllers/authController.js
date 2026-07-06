const User = require('../models/userModel');
const { comparePassword, hashPassword, serializeUser, signAuthToken } = require('../utils/auth');

async function login(req, res) {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  const user = await User.findOne({ email });

  if (!user || user.status !== 'active') {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials.',
    });
  }

  const isValidPassword = await comparePassword(password, user.passwordHash);

  if (!isValidPassword) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials.',
    });
  }

  user.lastLoginAt = new Date();
  await user.save();

  const token = signAuthToken(user);

  return res.json({
    success: true,
    message: `${user.role === 'admin' ? 'Admin' : 'User'} login successful.`,
    data: {
      token,
      ...serializeUser(user),
    },
  });
}

async function register(req, res) {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  const name = String(req.body.name || '').trim();
  const phone = String(req.body.phone || '').trim();

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and password are required.',
    });
  }

  const existingUser = await User.findOne({ email }).lean();

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'An account with that email already exists.',
    });
  }

  const passwordHash = await hashPassword(password);
  const user = await User.create({
    name,
    email,
    phone,
    passwordHash,
    role: 'customer',
    status: 'active',
  });

  const token = signAuthToken(user);

  return res.status(201).json({
    success: true,
    message: 'Account created successfully.',
    data: {
      token,
      ...serializeUser(user),
    },
  });
}

module.exports = {
  login,
  register,
};
