const { v4: uuidv4 } = require('uuid');
const { getAdminCredentials } = require('../models/adminModel');
const { readCollection, writeCollection } = require('../utils/fileStore');

const login = async (req, res) => {
  const { email, password } = req.body;
  const admin = getAdminCredentials();

  if (email !== admin.email || password !== admin.password) {
    return res.status(401).json({
      success: false,
      message: 'Invalid admin credentials.',
    });
  }

  const token = uuidv4();
  const sessions = await readCollection('adminSessions.json', []);
  const session = {
    token,
    email: admin.email,
    role: 'admin',
    name: admin.name,
    createdAt: new Date().toISOString(),
  };

  await writeCollection('adminSessions.json', [...sessions, session]);

  return res.json({
    success: true,
    message: 'Admin login successful.',
    data: session,
  });
};

const register = async (req, res) => {
  return res.status(501).json({
    success: false,
    message: 'Customer registration is not implemented in this version.',
  });
};

module.exports = {
  login,
  register,
};
