import { createClient } from '@supabase/supabase-js';

// PRODUCTION DATABASE: wiosivnwuqroaoqojlse
// Last verified: 2025-10-28
const supabaseUrl = 'https://wiosivnwuqroaoqojlse.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indpb3Npdm53dXFyb2FvcW9qbHNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5NDAyMTcsImV4cCI6MjA3NTUxNjIxN30.EInS_XMnQlyxJ8o6h1V_1RUbyFTQA7JSvulODMMUxaw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});