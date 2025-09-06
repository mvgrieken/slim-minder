#!/usr/bin/env node

/**
 * AI Model Comparison Test Script
 * 
 * This script tests different AI models to compare performance
 * Run with: node test-model-comparison.js
 */

const { aiService } = require('./dist/services/ai');

async function testModel(modelName, testMessage, testContext) {
  console.log(`\n🧪 Testing ${modelName}...`);
  
  // Temporarily override the model
  const originalModel = process.env.OPENAI_MODEL || process.env.ANTHROPIC_MODEL;
  if (modelName.includes('gpt')) {
    process.env.OPENAI_MODEL = modelName;
  } else if (modelName.includes('claude')) {
    process.env.ANTHROPIC_MODEL = modelName;
  }

  try {
    const startTime = Date.now();
    const response = await aiService.generateResponse(testMessage, testContext);
    const endTime = Date.now();
    
    console.log(`   ✅ Response generated in ${endTime - startTime}ms`);
    console.log(`   Provider: ${response.provider}`);
    console.log(`   Model: ${response.model}`);
    console.log(`   Tokens used: ${response.tokensUsed}`);
    console.log(`   Response length: ${response.message.length} chars`);
    console.log(`   Suggestions: ${response.suggestions.length}`);
    
    // Show first 100 characters of response
    const preview = response.message.substring(0, 100) + (response.message.length > 100 ? '...' : '');
    console.log(`   Preview: "${preview}"`);
    
    return {
      model: modelName,
      responseTime: endTime - startTime,
      tokensUsed: response.tokensUsed,
      responseLength: response.message.length,
      suggestions: response.suggestions.length
    };
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return {
      model: modelName,
      error: error.message
    };
  } finally {
    // Restore original model
    if (originalModel) {
      if (modelName.includes('gpt')) {
        process.env.OPENAI_MODEL = originalModel;
      } else if (modelName.includes('claude')) {
        process.env.ANTHROPIC_MODEL = originalModel;
      }
    }
  }
}

async function compareModels() {
  console.log('🤖 AI Model Comparison Test\n');

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

  // Models to test
  const models = [
    'gpt-5',
    'gpt-4o', 
    'gpt-4-turbo',
    'gpt-4',
    'claude-3-5-sonnet-20241022',
    'claude-3-opus-20240229',
    'claude-3-sonnet-20240229'
  ];

  const results = [];

  for (const model of models) {
    const result = await testModel(model, testMessage, testContext);
    results.push(result);
    
    // Wait a bit between requests to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Summary
  console.log('\n📊 Model Comparison Summary:');
  console.log('='.repeat(80));
  console.log('Model'.padEnd(30) + 'Response Time'.padEnd(15) + 'Tokens'.padEnd(10) + 'Length'.padEnd(10) + 'Status');
  console.log('-'.repeat(80));
  
  results.forEach(result => {
    if (result.error) {
      console.log(result.model.padEnd(30) + 'N/A'.padEnd(15) + 'N/A'.padEnd(10) + 'N/A'.padEnd(10) + 'ERROR');
    } else {
      console.log(
        result.model.padEnd(30) + 
        `${result.responseTime}ms`.padEnd(15) + 
        result.tokensUsed.toString().padEnd(10) + 
        result.responseLength.toString().padEnd(10) + 
        'SUCCESS'
      );
    }
  });

  console.log('\n🎉 Model comparison completed!');
}

// Run the comparison
compareModels().catch(console.error);
