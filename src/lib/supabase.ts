import { createClient } from '@supabase/supabase-js';

// Hardcoded to production database: wiosivnwuqroaoqojlse
const supabaseUrl = 'https://wiosivnwuqroaoqojlse.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indpb3Npdm53dXFyb2FvcW9qbHNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg1NzYxMzksImV4cCI6MjA0NDE1MjEzOX0.EtP5e2F9xZj8xVwE4lqW2R0VbFnHdZKUBEHGXGhT9zQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});