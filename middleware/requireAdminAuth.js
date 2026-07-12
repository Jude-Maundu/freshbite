const { findUserById } = require('../repositories/supabaseRepository');
const { verifyAuthToken } = require('../utils/auth');

async function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Admin authentication required.',
    });
  }

  try {
    const payload = verifyAuthToken(token);
    const user = await findUserById(payload.sub);

    if (!user || user.role !== 'admin' || user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired admin session.',
      });
    }

    req.admin = {
      id: String(user.id || user._id),
      email: user.email,
      role: user.role,
      name: user.name,
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired admin session.',
    });
  }
}

module.exports = requireAdminAuth;
