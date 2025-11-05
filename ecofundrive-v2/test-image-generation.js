// ═══════════════════════════════════════════════════════════
// TEST IMAGE GENERATION WITH FLUX PRO API
// ═══════════════════════════════════════════════════════════

import 'dotenv/config';
import { generateHeroImage } from './src/lib/fluxpro.ts';

console.log('🧪 Testing Flux Pro image generation...\n');

// Test with a simple keyword
const testKeyword = 'club-55-saint-tropez';
const testCategory = 'beaches';

console.log(`📋 Test parameters:`);
console.log(`   Keyword: ${testKeyword}`);
console.log(`   Category: ${testCategory}`);
console.log(`   API Token: ${process.env.REPLICATE_API_TOKEN ? '✅ Found' : '❌ Missing'}\n`);

if (!process.env.REPLICATE_API_TOKEN) {
  console.error('❌ REPLICATE_API_TOKEN not found in .env file');
  process.exit(1);
}

console.log('🚀 Starting image generation...\n');

try {
  const result = await generateHeroImage(testCategory, testKeyword);

  console.log('\n📊 RESULT:');
  console.log(JSON.stringify(result, null, 2));

  if (result.success) {
    console.log('\n✅ TEST PASSED - Image generation successful!');
    console.log(`   Filename: ${result.filename}`);
    console.log(`   URL: ${result.url}`);
  } else {
    console.log('\n❌ TEST FAILED - Image generation failed');
    console.log(`   Error: ${result.error}`);
    process.exit(1);
  }

} catch (error) {
  console.error('\n❌ TEST CRASHED:', error.message);
  console.error(error);
  process.exit(1);
}
