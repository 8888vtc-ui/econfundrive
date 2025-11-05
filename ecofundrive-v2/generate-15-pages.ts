// ═══════════════════════════════════════════════════════════
// ECOFUNDRIVE V2.0 - GENERATE 15 TEST PAGES
// Tests the optimized claude.ts with caching system
// ═══════════════════════════════════════════════════════════

import fs from 'fs';
import path from 'path';
import { generatePageContent } from './src/lib/claude';
import { validatePage } from './src/lib/validator';

// Load keywords
const keywordsPath = './src/content/keywords/keywords-15-test.json';
const keywordsData = JSON.parse(fs.readFileSync(keywordsPath, 'utf-8'));
const keywords = keywordsData.keywords;

console.log('═══════════════════════════════════════════════════════════');
console.log('🚀 GÉNÉRATION DE 15 PAGES DE TEST - ECOFUNDRIVE V2.0');
console.log('═══════════════════════════════════════════════════════════\n');

console.log(`📊 Keywords chargés: ${keywords.length}`);
console.log(`📁 Output: dist/pages/\n`);

// Stats
const stats = {
  total: keywords.length,
  success: 0,
  failed: 0,
  cacheHits: 0,
  cacheMisses: 0,
  totalWords: 0,
  validationScores: [],
  startTime: Date.now(),
  estimatedCost: 0
};

// Create output directory
const outputDir = './dist/pages';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate pages
async function generateAllPages() {
  console.log('⏳ Génération en cours...\n');

  for (let i = 0; i < keywords.length; i++) {
    const keyword = keywords[i];
    const num = i + 1;

    console.log(`\n[${ num}/${keywords.length}] 🎯 ${keyword.keyword}`);
    console.log(`   Catégorie: ${keyword.category} | Langue: ${keyword.language} | Type: ${keyword.authority ? 'AUTHORITY' : 'STANDARD'}`);

    try {
      // Generate content with Claude API (with cache)
      const startGen = Date.now();
      const content = await generatePageContent(keyword);
      const genTime = Date.now() - startGen;

      stats.totalWords += content.wordcount || 0;

      // Estimate if it was a cache hit (< 500ms = likely cached)
      if (genTime < 500) {
        stats.cacheHits++;
        console.log(`   💾 Cache HIT (${genTime}ms) - 0€`);
      } else {
        stats.cacheMisses++;
        stats.estimatedCost += 0.20; // ~20 cents per generation
        console.log(`   🌐 API Call (${genTime}ms) - ~0.20€`);
      }

      // Build HTML page
      const html = buildHTMLPage(keyword, content);

      // Validate page
      const pageData = {
        html: html,
        url: keyword.url,
        keyword: keyword.keyword
      };

      const validation = validatePage(pageData, keyword.authority);
      stats.validationScores.push(validation.score);

      console.log(`   ✅ Validé: ${validation.score}/${validation.maxScore} (${validation.status})`);
      console.log(`   📝 ${content.wordcount || 'N/A'} mots | ${content.sections?.length || 0} sections`);

      // Save HTML file
      const filename = keyword.url.replace(/^\//, '').replace(/\//g, '_');
      const filepath = path.join(outputDir, filename);
      fs.writeFileSync(filepath, html, 'utf-8');

      // Save JSON metadata
      const metadataPath = filepath.replace('.html', '.meta.json');
      fs.writeFileSync(metadataPath, JSON.stringify({
        keyword: keyword,
        content: {
          title: content.title,
          wordcount: content.wordcount,
          sections: content.sections?.length
        },
        validation: validation,
        generated: new Date().toISOString(),
        cacheHit: genTime < 500
      }, null, 2), 'utf-8');

      stats.success++;

    } catch (error) {
      console.log(`   ❌ ERREUR: ${error.message}`);
      stats.failed++;
    }

    // Rate limiting (1 req/sec is handled in claude.ts)
    // But add a small delay between pages for safety
    if (i < keywords.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1100));
    }
  }

  printFinalStats();
}

// Build HTML page
function buildHTMLPage(keyword, content) {
  return `<!DOCTYPE html>
<html lang="${keyword.language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${content.metaTitle || content.title}</title>
    <meta name="description" content="${content.metaDescription}">
    <link rel="stylesheet" href="/css/style-premium.css">
</head>
<body>
    <article>
        <h1>${content.title}</h1>

        <div class="introduction">
            ${content.introduction}
        </div>

        ${content.sections.map(section => `
        <section>
            <h2>${section.title}</h2>
            ${section.subsections?.map(sub => `
            <div>
                <h3>${sub.title}</h3>
                ${sub.paragraphs.map(p => `<p>${p}</p>`).join('\n')}
            </div>
            `).join('\n')}
        </section>
        `).join('\n')}

        ${content.faq ? `
        <section class="faq">
            <h2>Questions Fréquentes</h2>
            ${content.faq.map(item => `
            <div class="faq-item">
                <h3>${item.question}</h3>
                <p>${item.answer}</p>
            </div>
            `).join('\n')}
        </section>
        ` : ''}

        ${content.conclusion ? `
        <div class="conclusion">
            ${content.conclusion}
        </div>
        ` : ''}
    </article>

    <script src="/js/main.js"></script>
    <script src="/js/cookies.js"></script>
    <script src="/js/tracking.js"></script>
</body>
</html>`;
}

// Print final statistics
function printFinalStats() {
  const totalTime = ((Date.now() - stats.startTime) / 1000).toFixed(1);
  const avgScore = (stats.validationScores.reduce((a, b) => a + b, 0) / stats.validationScores.length).toFixed(1);
  const avgWords = Math.round(stats.totalWords / stats.success);

  console.log('\n\n═══════════════════════════════════════════════════════════');
  console.log('📊 RAPPORT FINAL DE GÉNÉRATION');
  console.log('═══════════════════════════════════════════════════════════\n');

  console.log('⏱️  PERFORMANCE:');
  console.log(`   Temps total: ${totalTime}s`);
  console.log(`   Temps moyen par page: ${(parseFloat(totalTime) / stats.total).toFixed(1)}s`);
  console.log('');

  console.log('✅ SUCCÈS:');
  console.log(`   Pages générées: ${stats.success}/${stats.total}`);
  console.log(`   Échecs: ${stats.failed}`);
  console.log(`   Taux de succès: ${((stats.success / stats.total) * 100).toFixed(1)}%`);
  console.log('');

  console.log('💾 CACHE SYSTEM:');
  console.log(`   Cache HITS: ${stats.cacheHits}`);
  console.log(`   Cache MISS: ${stats.cacheMisses}`);
  console.log(`   Taux cache: ${stats.total > 0 ? ((stats.cacheHits / stats.total) * 100).toFixed(1) : 0}%`);
  console.log('');

  console.log('💰 COÛTS API:');
  console.log(`   Coût estimé: ~${stats.estimatedCost.toFixed(2)}€`);
  console.log(`   Économie cache: ~${(stats.cacheHits * 0.20).toFixed(2)}€`);
  console.log(`   Coût sans cache: ~${(stats.total * 0.20).toFixed(2)}€`);
  console.log(`   Économie: ${stats.total > 0 ? ((stats.cacheHits / stats.total) * 100).toFixed(0) : 0}%`);
  console.log('');

  console.log('📝 QUALITÉ:');
  console.log(`   Score moyen validation: ${avgScore}/18`);
  console.log(`   Total mots générés: ${stats.totalWords.toLocaleString()}`);
  console.log(`   Moyenne mots/page: ${avgWords}`);
  console.log('');

  console.log('📁 OUTPUT:');
  console.log(`   Répertoire: ${outputDir}/`);
  console.log(`   Fichiers HTML: ${stats.success}`);
  console.log(`   Fichiers metadata: ${stats.success}`);
  console.log('');

  console.log('═══════════════════════════════════════════════════════════');
  console.log('✅ GÉNÉRATION TERMINÉE !');
  console.log('═══════════════════════════════════════════════════════════\n');
}

// Run generation
generateAllPages().catch(error => {
  console.error('\n❌ ERREUR FATALE:', error);
  process.exit(1);
});
