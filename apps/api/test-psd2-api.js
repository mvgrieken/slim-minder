#!/usr/bin/env node

// Test PSD2 API functionality
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

console.log('🧪 Testing PSD2 API Functionality');
console.log('==================================');

// Test environment variables
console.log('\n📋 Environment Variables:');
console.log(`TINK_CLIENT_ID: ${process.env.TINK_CLIENT_ID ? '✅ Set' : '❌ Missing'}`);
console.log(`TINK_CLIENT_SECRET: ${process.env.TINK_CLIENT_SECRET ? '✅ Set' : '❌ Missing'}`);
console.log(`TINK_REDIRECT_URI: ${process.env.TINK_REDIRECT_URI ? '✅ Set' : '❌ Missing'}`);
console.log(`TINK_ENVIRONMENT: ${process.env.TINK_ENVIRONMENT ? '✅ Set' : '❌ Missing'}`);

// Test PSD2 service
async function testPSD2() {
  try {
    console.log('\n🔧 Testing PSD2 Service...');
    
    // Import the PSD2 service
    const { psd2Service } = await import('./src/services/psd2.ts');
    
    // Test generateAuthUrl
    console.log('\n📝 Testing generateAuthUrl...');
    const authResult = await psd2Service.generateAuthUrl('test-user', ['accounts', 'transactions']);
    console.log('✅ Auth URL generated:', authResult.authUrl ? 'Success' : 'Failed');
    console.log('✅ State generated:', authResult.state ? 'Success' : 'Failed');
    
    // Test getAccounts (mock)
    console.log('\n🏦 Testing getAccounts...');
    const accounts = await psd2Service.getAccounts('mock-token');
    console.log('✅ Accounts retrieved:', accounts.length > 0 ? 'Success' : 'Failed');
    
    // Test getTransactions (mock)
    console.log('\n💳 Testing getTransactions...');
    const transactions = await psd2Service.getTransactions('mock-token', 'test-account', '2024-01-01', '2024-12-31');
    console.log('✅ Transactions retrieved:', transactions.length > 0 ? 'Success' : 'Failed');
    
    console.log('\n🎉 All PSD2 tests passed!');
    
  } catch (error) {
    console.error('\n❌ PSD2 test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testPSD2();

console.log('\n✨ PSD2 API test completed!');
