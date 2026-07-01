function getAdminCredentials() {
  return {
    email: process.env.ADMIN_EMAIL || 'admin@freshbites.ke',
    password: process.env.ADMIN_PASSWORD || 'FreshBites2026!',
    name: 'Fresh Bites Admin',
  };
}

module.exports = {
  getAdminCredentials,
};
