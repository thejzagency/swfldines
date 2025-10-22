// Environment Configuration with Validation
// This file ensures the correct database is always used

const PRODUCTION_CONFIG = {
  SUPABASE_URL: 'https://wiosivnwuqroaoqojlse.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indpb3Npdm53dXFyb2FvcW9qbHNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5NDAyMTcsImV4cCI6MjA3NTUxNjIxN30.EInS_XMnQlyxJ8o6h1V_1RUbyFTQA7JSvulODMMUxaw',
  DATABASE_ID: 'wiosivnwuqroaoqojlse'
} as const;

function validateEnvironment() {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const isWrongDatabase = envUrl && !envUrl.includes(PRODUCTION_CONFIG.DATABASE_ID);

  if (isWrongDatabase) {
    console.warn('⚠️ WARNING: .env file contains WRONG database credentials!');
    console.warn('📍 .env database:', envUrl);
    console.warn('✅ Using CORRECT hardcoded production database:', PRODUCTION_CONFIG.SUPABASE_URL);
  }

  return {
    supabaseUrl: PRODUCTION_CONFIG.SUPABASE_URL,
    supabaseAnonKey: PRODUCTION_CONFIG.SUPABASE_ANON_KEY,
    stripePublishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
    siteUrl: import.meta.env.VITE_SITE_URL || 'https://www.swfldines.com',
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD
  };
}

export const env = validateEnvironment();

export function logEnvironmentStatus() {
  console.log('🚀 SW Florida Dines - Environment Configuration');
  console.log('✅ Database ID:', PRODUCTION_CONFIG.DATABASE_ID);
  console.log('🌐 URL:', env.supabaseUrl);
  console.log('📦 Mode:', env.isProduction ? 'Production' : 'Development');
  console.log('🔒 Stripe:', env.stripePublishableKey ? 'Configured' : 'Not configured');
}
