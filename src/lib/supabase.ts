import { createClient } from '@supabase/supabase-js';

// Hardcoded to production database: rpraqpxdrwbtgpxtbhie
const supabaseUrl = 'https://rpraqpxdrwbtgpxtbhie.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwcmFxcHhkcndidGdweHRiaGllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDI4MDMsImV4cCI6MjA3NTQ3ODgwM30.pi8k9bU3kdmtQKaNCMzmCgxyDib-pBEuoVNerc4nxaY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});