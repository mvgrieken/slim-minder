#!/usr/bin/env node

/**
 * AI Setup Script
 * 
 * This script helps set up AI providers for Slim Minder
 * Run with: node scripts/setup-ai.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupAI() {
  console.log('🤖 Slim Minder AI Setup\n');
  console.log('This script will help you configure AI providers for your Slim Minder app.\n');

  // Check if .env file exists
  const envPath = path.join(__dirname, '..', 'apps', 'api', '.env');
  const envExamplePath = path.join(__dirname, '..', 'env.example');
  
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  } else if (fs.existsSync(envExamplePath)) {
    envContent = fs.readFileSync(envExamplePath, 'utf8');
    console.log('📄 Using env.example as template...\n');
  } else {
    console.log('❌ No .env or env.example file found!');
    process.exit(1);
  }

  // OpenAI Setup
  console.log('🔵 OpenAI Configuration');
  const hasOpenAI = envContent.includes('OPENAI_API_KEY=your-openai-api-key') || 
                    envContent.includes('OPENAI_API_KEY=');
  
  if (hasOpenAI) {
    const openaiKey = await question('Enter your OpenAI API key (or press Enter to skip): ');
    if (openaiKey.trim()) {
      envContent = envContent.replace(
        /OPENAI_API_KEY=.*/,
        `OPENAI_API_KEY=${openaiKey.trim()}`
      );
      
      const openaiModel = await question('Enter OpenAI model (default: gpt-4, options: gpt-5, gpt-4o, gpt-4-turbo, gpt-4, gpt-3.5-turbo): ');
      const model = openaiModel.trim() || 'gpt-4';
      envContent = envContent.replace(
        /OPENAI_MODEL=.*/,
        `OPENAI_MODEL=${model}`
      );
      
      console.log('✅ OpenAI configured!\n');
    } else {
      console.log('⏭️  Skipping OpenAI configuration\n');
    }
  }

  // Anthropic Setup
  console.log('🟣 Anthropic Configuration');
  const hasAnthropic = envContent.includes('ANTHROPIC_API_KEY=your-anthropic-api-key') || 
                       envContent.includes('ANTHROPIC_API_KEY=');
  
  if (hasAnthropic) {
    const anthropicKey = await question('Enter your Anthropic API key (or press Enter to skip): ');
    if (anthropicKey.trim()) {
      envContent = envContent.replace(
        /ANTHROPIC_API_KEY=.*/,
        `ANTHROPIC_API_KEY=${anthropicKey.trim()}`
      );
      
      const anthropicModel = await question('Enter Anthropic model (default: claude-3-sonnet-20240229, options: claude-3-5-sonnet-20241022, claude-3-5-haiku-20241022, claude-3-opus-20240229): ');
      const model = anthropicModel.trim() || 'claude-3-sonnet-20240229';
      envContent = envContent.replace(
        /ANTHROPIC_MODEL=.*/,
        `ANTHROPIC_MODEL=${model}`
      );
      
      console.log('✅ Anthropic configured!\n');
    } else {
      console.log('⏭️  Skipping Anthropic configuration\n');
    }
  }

  // Save .env file
  const finalEnvPath = path.join(__dirname, '..', 'apps', 'api', '.env');
  fs.writeFileSync(finalEnvPath, envContent);
  console.log('💾 Configuration saved to apps/api/.env');

  // Test configuration
  console.log('\n🧪 Testing AI configuration...');
  try {
    // Load environment variables
    require('dotenv').config({ path: finalEnvPath });
    
    const { aiService } = require('../apps/api/dist/services/ai');
    const status = aiService.getProviderStatus();
    
    console.log('📊 AI Provider Status:');
    console.log(`   Provider: ${status.provider}`);
    console.log(`   Available: ${status.available}`);
    console.log(`   Has API Key: ${status.hasApiKey}`);
    
    if (status.available) {
      console.log('\n🎉 AI setup completed successfully!');
      console.log('You can now use the AI coach in your Slim Minder app.');
    } else {
      console.log('\n⚠️  AI setup completed, but no providers are available.');
      console.log('The app will use mock responses until you configure API keys.');
    }
  } catch (error) {
    console.log('\n❌ Error testing AI configuration:');
    console.log(error.message);
    console.log('\nMake sure to build the API first: npm run build:api');
  }

  rl.close();
}

// Run setup
setupAI().catch(console.error);
