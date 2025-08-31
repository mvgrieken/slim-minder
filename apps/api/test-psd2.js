#!/usr/bin/env node

// Test script voor PSD2 configuratie
require('dotenv').config({ path: '.env.local' });

console.log('🔍 PSD2 Configuration Test');
console.log('==========================');

// Check environment variables
const requiredVars = [
  'TINK_CLIENT_ID',
  'TINK_CLIENT_SECRET',
  'TINK_REDIRECT_URI',
  'TINK_ENVIRONMENT'
];

let allGood = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    console.log(`❌ ${varName}: MISSING`);
    allGood = false;
  } else if (value.includes('your-') || value.includes('placeholder')) {
    console.log(`⚠️  ${varName}: PLACEHOLDER (${value.substring(0, 20)}...)`);
    allGood = false;
  } else {
    console.log(`✅ ${varName}: OK (${value.substring(0, 20)}...)`);
  }
});

console.log('\n📋 Configuration Summary:');
console.log(`Environment: ${process.env.TINK_ENVIRONMENT || 'NOT SET'}`);
console.log(`Redirect URI: ${process.env.TINK_REDIRECT_URI || 'NOT SET'}`);

if (allGood) {
  console.log('\n🎉 PSD2 Configuration looks good!');
  console.log('You can now test the bank connection.');
} else {
  console.log('\n❌ Please fix the configuration issues above.');
  console.log('Make sure to:');
  console.log('1. Create a Tink account at https://console.tink.com/');
  console.log('2. Create a project and get your credentials');
  console.log('3. Update .env.local with real values');
}

console.log('\n🚀 To test the API:');
console.log('npm run dev');
console.log('curl -X POST http://localhost:4000/api/bank/connect \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -H "x-sm-user-id: test-user" \\');
console.log('  -d \'{"provider": "tink", "redirectUrl": "http://localhost:3000/api/bank/callback", "permissions": ["accounts", "transactions"]}\'');
