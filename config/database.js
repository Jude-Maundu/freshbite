const { getSupabaseAdmin } = require('../lib/supabase');

async function connectDatabase() {
  getSupabaseAdmin();
  return true;
}

module.exports = {
  connectDatabase,
};
