const { comparePassword, hashPassword, serializeUser, signAuthToken } = require('../utils/auth');
const { createUser, findUserByEmail, updateUser } = require('../repositories/supabaseRepository');

async function login(req, res) {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  const user = await findUserByEmail(email);

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

  const updatedUser = await updateUser(user.id, { lastLoginAt: new Date().toISOString() });

  const token = signAuthToken(updatedUser);

  return res.json({
    success: true,
    message: `${updatedUser.role === 'admin' ? 'Admin' : 'User'} login successful.`,
    data: {
      token,
      ...serializeUser(updatedUser),
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

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'An account with that email already exists.',
    });
  }

  const passwordHash = await hashPassword(password);
  const user = await createUser({
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
