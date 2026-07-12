const { findUserById } = require('../repositories/supabaseRepository');
const { verifyAuthToken } = require('../utils/auth');

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.',
    });
  }

  try {
    const payload = verifyAuthToken(token);
    const user = await findUserById(payload.sub);

    if (!user || user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session.',
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session.',
    });
  }
}

module.exports = requireAuth;
