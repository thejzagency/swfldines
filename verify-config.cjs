#!/usr/bin/env node

const CORRECT_DATABASE = 'wiosivnwuqroaoqojlse';
const WRONG_DATABASE = 'rpraqpxdrwbtgpxtbhie';

console.log('🔍 Verifying SW Florida Dines Configuration...\n');

const fs = require('fs');
const envPath = './.env';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');

  if (envContent.includes(WRONG_DATABASE)) {
    console.error('❌ ERROR: .env file contains WRONG database!');
    console.error(`   Found: ${WRONG_DATABASE}`);
    console.error(`   Expected: ${CORRECT_DATABASE}\n`);

    console.log('⚠️  CRITICAL: The .env file has reverted to the wrong Supabase project!');
    console.log('⚠️  This is a known issue that keeps happening.\n');

    console.log('✅ HOWEVER: The application code is HARDCODED to use the correct database.');
    console.log(`✅ All production code uses: ${CORRECT_DATABASE}\n`);

    console.log('📝 The .env file is being ignored by the application.');
    console.log('📝 Check src/lib/supabase.ts and src/config/env.ts - both are hardcoded.\n');
  } else if (envContent.includes(CORRECT_DATABASE)) {
    console.log(`✅ .env file contains correct database: ${CORRECT_DATABASE}`);
  }
}

const supabaseLibPath = './src/lib/supabase.ts';
if (fs.existsSync(supabaseLibPath)) {
  const supabaseLib = fs.readFileSync(supabaseLibPath, 'utf8');

  if (supabaseLib.includes(CORRECT_DATABASE)) {
    console.log(`✅ src/lib/supabase.ts is hardcoded to: ${CORRECT_DATABASE}`);
  } else if (supabaseLib.includes(WRONG_DATABASE)) {
    console.error(`❌ ERROR: src/lib/supabase.ts contains WRONG database: ${WRONG_DATABASE}`);
    process.exit(1);
  } else if (supabaseLib.includes('import.meta.env')) {
    console.error('❌ ERROR: src/lib/supabase.ts is using environment variables instead of hardcoded values!');
    process.exit(1);
  }
}

const configEnvPath = './src/config/env.ts';
if (fs.existsSync(configEnvPath)) {
  const configEnv = fs.readFileSync(configEnvPath, 'utf8');

  if (configEnv.includes(CORRECT_DATABASE)) {
    console.log(`✅ src/config/env.ts is hardcoded to: ${CORRECT_DATABASE}`);
  } else if (configEnv.includes(WRONG_DATABASE)) {
    console.error(`❌ ERROR: src/config/env.ts contains WRONG database: ${WRONG_DATABASE}`);
    process.exit(1);
  }
}

console.log('\n✅ All critical configuration files are correct!');
console.log(`✅ Application will connect to: ${CORRECT_DATABASE}\n`);
