#!/usr/bin/env node

// Environment variable validation script
// Run this before builds to ensure correct database connection

const fs = require('fs');
const path = require('path');

const CORRECT_SUPABASE_URL = 'https://wiosivnwuqroaoqojlse.supabase.co';
const CORRECT_SUPABASE_REF = 'wiosivnwuqroaoqojlse';

let currentUrl = process.env.VITE_SUPABASE_URL;
let currentKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('\n=== Environment Variable Validation ===\n');

// If env vars aren't in process.env, try loading from .env file
if (!currentUrl || !currentKey) {
  console.log('⚠️  Environment variables not in process.env, checking .env file...');

  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.+)/);
    const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/);

    if (urlMatch) currentUrl = urlMatch[1].trim();
    if (keyMatch) currentKey = keyMatch[1].trim();

    console.log('✓ Loaded from .env file');
  }
}

if (!currentUrl || !currentKey) {
  console.error('❌ ERROR: Supabase environment variables are missing!');
  console.log('Expected VITE_SUPABASE_URL:', CORRECT_SUPABASE_URL);
  console.log('\nPlease check:');
  console.log('1. Your .env file exists and contains the correct values');
  console.log('2. Netlify environment variables are set correctly');
  process.exit(1);
}

if (currentUrl !== CORRECT_SUPABASE_URL) {
  console.error('❌ ERROR: Wrong Supabase database!');
  console.log('Current:', currentUrl);
  console.log('Expected:', CORRECT_SUPABASE_URL);
  console.error('\nYour .env file or Netlify environment variables are pointing to the WRONG database!');
  process.exit(1);
}

// Validate the key contains the correct ref by decoding the JWT payload
try {
  const payload = currentKey.split('.')[1];
  const decoded = Buffer.from(payload, 'base64').toString('utf8');
  const keyData = JSON.parse(decoded);

  if (keyData.ref !== CORRECT_SUPABASE_REF) {
    console.error('❌ ERROR: Supabase key does not match the correct database!');
    console.log('Key ref:', keyData.ref);
    console.log('Expected ref:', CORRECT_SUPABASE_REF);
    process.exit(1);
  }
} catch (error) {
  console.warn('⚠️  Could not validate JWT format, but URL is correct');
}

console.log('✅ Environment variables are correct!');
console.log('Database:', CORRECT_SUPABASE_URL);
console.log('Reference:', CORRECT_SUPABASE_REF);
console.log('\n');
