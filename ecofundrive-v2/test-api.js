import Anthropic from '@anthropic-ai/sdk';
import * as dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

async function testAPI() {
  console.log('Testing Claude API...\n');

  const models = [
    'claude-3-5-sonnet-20241022',
    'claude-3-5-sonnet-20240620',
    'claude-3-opus-20240229',
    'claude-3-sonnet-20240229',
    'claude-3-haiku-20240307'
  ];

  for (const model of models) {
    try {
      console.log(`Testing: ${model}...`);
      const response = await anthropic.messages.create({
        model: model,
        max_tokens: 10,
        messages: [{
          role: "user",
          content: "test"
        }]
      });
      console.log(`✅ ${model} WORKS!\n`);
      break;
    } catch (error) {
      console.log(`❌ ${model}: ${error.message}\n`);
    }
  }
}

testAPI();
