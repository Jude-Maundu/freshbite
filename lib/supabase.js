const { createClient } = require('@supabase/supabase-js');

let supabaseClient;

function getSupabaseUrl() {
  return process.env.SUPABASE_URL || '';
}

function getSupabaseServiceKey() {
  return process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
}

function getSupabaseAdmin() {
  if (!supabaseClient) {
    const url = getSupabaseUrl();
    const key = getSupabaseServiceKey();

    if (!url || !key) {
      throw new Error(
        'Supabase is not configured. Set SUPABASE_URL and SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY).'
      );
    }

    supabaseClient = createClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return supabaseClient;
}

module.exports = {
  getSupabaseAdmin,
};
