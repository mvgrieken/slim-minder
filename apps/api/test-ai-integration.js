#!/usr/bin/env node

/**
 * AI Integration Test Script
 * 
 * This script tests the AI service integration with OpenAI and Anthropic
 * Run with: node test-ai-integration.js
 */

const { aiService } = require('./dist/services/ai');

async function testAIService() {
  console.log('🤖 Testing AI Service Integration...\n');

  // Test 1: Check provider status
  console.log('1. Checking AI provider status...');
  const status = aiService.getProviderStatus();
  console.log('   Provider:', status.provider);
  console.log('   Available:', status.available);
  console.log('   Has API Key:', status.hasApiKey);
  console.log('');

  // Test 2: Generate AI response
  console.log('2. Testing AI response generation...');
  const testMessage = 'Hoe kan ik geld besparen op mijn boodschappen?';
  const testContext = {
    budgetSummary: [
      { category: 'Boodschappen', limit: 300, spent: 250, remaining: 50 }
    ],
    recentTransactions: [
      { amount: 45.50, description: 'Albert Heijn', category: 'Boodschappen', date: '2024-01-15' }
    ],
    goals: [
      { title: 'Vakantie spaarrekening', targetAmount: 2000, deadline: '2024-12-31' }
    ]
  };

  try {
    const response = await aiService.generateResponse(testMessage, testContext);
    console.log('   ✅ AI Response generated successfully!');
    console.log('   Provider:', response.provider);
    console.log('   Model:', response.model);
    console.log('   Tokens used:', response.tokensUsed);
    console.log('   Message length:', response.message.length);
    console.log('   Suggestions count:', response.suggestions.length);
    console.log('');
    console.log('   📝 Response:');
    console.log('   ' + response.message);
    console.log('');
    console.log('   💡 Suggestions:');
    response.suggestions.forEach((suggestion, index) => {
      console.log(`   ${index + 1}. ${suggestion}`);
    });
  } catch (error) {
    console.log('   ❌ AI Response generation failed:');
    console.log('   Error:', error.message);
  }

  console.log('\n🎉 AI Integration test completed!');
}

// Run the test
testAIService().catch(console.error);
