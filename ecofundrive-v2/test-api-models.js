// ═══════════════════════════════════════════════════════════
// ECOFUNDRIVE V2.0 - TEST API CLAUDE MODELS
// Tests tous les modèles disponibles pour trouver le bon
// ═══════════════════════════════════════════════════════════

import Anthropic from '@anthropic-ai/sdk';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Models to test (ordered by probability of success)
const modelsToTest = [
  'claude-3-5-sonnet-20241022',
  'claude-3-5-sonnet-20240620',
  'claude-3-opus-20240229',
  'claude-3-sonnet-20240229',
  'claude-3-haiku-20240307',
  'claude-2.1',
  'claude-2.0'
];

console.log('═══════════════════════════════════════════════════════════');
console.log('🔍 TEST API CLAUDE - ECOFUNDRIVE V2.0');
console.log('═══════════════════════════════════════════════════════════\n');

// Verify API key format
const apiKey = process.env.ANTHROPIC_API_KEY;
console.log('🔑 VÉRIFICATION CLÉ API:');
if (!apiKey) {
  console.log('   ❌ ERREUR: ANTHROPIC_API_KEY non trouvée dans .env\n');
  process.exit(1);
}

console.log(`   Format: ${apiKey.startsWith('sk-ant-') ? '✅' : '❌'} (commence par "sk-ant-")`);
console.log(`   Longueur: ${apiKey.length} caractères`);
console.log(`   Préfixe: ${apiKey.substring(0, 10)}...`);
console.log(`   Suffixe: ...${apiKey.substring(apiKey.length - 4)}\n`);

if (!apiKey.startsWith('sk-ant-')) {
  console.log('   ⚠️  ATTENTION: La clé ne commence pas par "sk-ant-", elle pourrait être invalide\n');
}

console.log('═══════════════════════════════════════════════════════════');
console.log('🧪 TEST DES MODÈLES');
console.log('═══════════════════════════════════════════════════════════\n');

const results = [];

// Test each model
async function testModel(modelName) {
  console.log(`[${results.length + 1}/${modelsToTest.length}] Testing: ${modelName}`);

  const startTime = Date.now();

  try {
    const response = await anthropic.messages.create({
      model: modelName,
      max_tokens: 10,
      messages: [{
        role: "user",
        content: "test"
      }]
    });

    const elapsed = Date.now() - startTime;
    const status = '✅ SUCCÈS';
    const error = null;

    console.log(`   ${status} (${elapsed}ms)`);
    console.log(`   Réponse: "${response.content[0].text}"`);
    console.log(`   Tokens: ${response.usage?.output_tokens || 'N/A'}\n`);

    results.push({ modelName, status, elapsed, error, response });

    return { success: true, modelName };

  } catch (error) {
    const elapsed = Date.now() - startTime;
    const status = '❌ ÉCHEC';
    const errorMsg = error.message;
    const errorType = error.error?.type || 'unknown';

    console.log(`   ${status} (${elapsed}ms)`);
    console.log(`   Erreur: ${errorMsg}`);
    console.log(`   Type: ${errorType}\n`);

    results.push({ modelName, status, elapsed, error: errorMsg, errorType });

    return { success: false, error: errorMsg };
  }
}

// Run tests sequentially
async function runTests() {
  for (const model of modelsToTest) {
    const result = await testModel(model);

    // Stop at first success to save API costs
    if (result.success) {
      console.log(`\n🎯 MODÈLE TROUVÉ: ${result.modelName}`);
      console.log('   Arrêt des tests (économie API).\n');
      break;
    }
  }

  printFinalReport();
}

// Print final report
function printFinalReport() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📊 RAPPORT FINAL');
  console.log('═══════════════════════════════════════════════════════════\n');

  console.log('📋 RÉSULTATS PAR MODÈLE:\n');

  const successModels = results.filter(r => r.status === '✅ SUCCÈS');
  const failedModels = results.filter(r => r.status === '❌ ÉCHEC');

  console.log('| Modèle | Status | Temps | Erreur |');
  console.log('|--------|--------|-------|--------|');

  results.forEach(r => {
    const model = r.modelName.padEnd(30);
    const status = r.status;
    const time = `${r.elapsed}ms`.padEnd(8);
    const error = r.error ? r.error.substring(0, 40) + '...' : '-';
    console.log(`| ${model} | ${status} | ${time} | ${error} |`);
  });

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('🔍 DIAGNOSTIC\n');

  if (successModels.length > 0) {
    console.log('✅ PROBLÈME RÉSOLU:\n');
    console.log(`   Un modèle fonctionnel a été trouvé: "${successModels[0].modelName}"\n`);
    console.log('📝 ACTION À FAIRE:\n');
    console.log('   1. Ouvrir: C:\\Users\\8888v\\ecofundrive le dernier\\ecofundrive-v2\\generate-simple.js');
    console.log(`   2. Ligne 110: Remplacer par model: "${successModels[0].modelName}"`);
    console.log('   3. Ouvrir: C:\\Users\\8888v\\ecofundrive le dernier\\ecofundrive-v2\\src\\lib\\claude.ts');
    console.log(`   4. Lignes 126 et 471: Remplacer par model: "${successModels[0].modelName}"`);
    console.log('   5. Relancer: node generate-simple.js\n');

  } else {
    console.log('❌ PROBLÈME IDENTIFIÉ:\n');
    console.log('   AUCUN modèle ne fonctionne avec cette clé API.\n');

    // Analyze error patterns
    const errorTypes = {};
    failedModels.forEach(r => {
      const type = r.errorType || 'unknown';
      errorTypes[type] = (errorTypes[type] || 0) + 1;
    });

    console.log('   Erreurs détectées:');
    Object.entries(errorTypes).forEach(([type, count]) => {
      console.log(`   - ${type}: ${count}/${failedModels.length}`);
    });

    const has404 = failedModels.some(r => r.error?.includes('404') || r.error?.includes('not_found'));
    const has401 = failedModels.some(r => r.error?.includes('401') || r.error?.includes('authentication'));
    const has403 = failedModels.some(r => r.error?.includes('403') || r.error?.includes('permission'));

    console.log('\n💡 CAUSES POSSIBLES:\n');

    if (has401) {
      console.log('   🔴 Clé API invalide ou expirée');
      console.log('      → Vérifier sur: https://console.anthropic.com/settings/keys');
      console.log('      → Créer une nouvelle clé si nécessaire\n');
    }

    if (has403) {
      console.log('   🔴 Accès API non autorisé');
      console.log('      → Votre compte n\'a peut-être pas accès à l\'API Messages');
      console.log('      → Vérifier votre plan sur: https://console.anthropic.com/settings/plans\n');
    }

    if (has404) {
      console.log('   🔴 Tous les modèles retournent 404');
      console.log('      → La clé API pourrait être pour une autre plateforme (Bedrock, Vertex AI)');
      console.log('      → Vérifier que c\'est bien une clé "Anthropic Console API"\n');
    }

    if (!apiKey.startsWith('sk-ant-')) {
      console.log('   🔴 Format de clé incorrect');
      console.log('      → Les clés Anthropic commencent par "sk-ant-"');
      console.log('      → Votre clé commence par: "' + apiKey.substring(0, 7) + '..."\n');
    }

    console.log('📋 ACTIONS RECOMMANDÉES:\n');
    console.log('   1. Aller sur: https://console.anthropic.com/settings/keys');
    console.log('   2. Vérifier que votre clé est active');
    console.log('   3. Si nécessaire, créer une NOUVELLE clé API');
    console.log('   4. Mettre à jour le fichier .env avec la nouvelle clé');
    console.log('   5. Relancer ce test: node test-api-models.js\n');
  }

  console.log('═══════════════════════════════════════════════════════════\n');
}

// Run all tests
runTests().catch(error => {
  console.error('\n❌ ERREUR FATALE:', error);
  process.exit(1);
});
