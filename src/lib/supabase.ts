import { createClient } from '@supabase/supabase-js';
import { env, logEnvironmentStatus } from '../config/env';

const supabaseUrl = env.supabaseUrl;
const supabaseAnonKey = env.supabaseAnonKey;

logEnvironmentStatus();

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

supabase.from('restaurants').select('count', { count: 'exact', head: true })
  .then(({ count, error }) => {
    if (error) {
      console.error('❌ Database connection error:', error);
    } else {
      console.log('✅ Database connected - Restaurant count:', count);
    }
  });