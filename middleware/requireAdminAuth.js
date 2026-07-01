const { readCollection } = require('../utils/fileStore');

async function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Admin authentication required.',
    });
  }

  const sessions = await readCollection('adminSessions.json', []);
  const session = sessions.find((entry) => entry.token === token);

  if (!session) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired admin session.',
    });
  }

  req.admin = session;
  return next();
}

module.exports = requireAdminAuth;
