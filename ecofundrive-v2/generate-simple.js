// ═══════════════════════════════════════════════════════════
// ECOFUNDRIVE V2.0 - GENERATE 15 TEST PAGES (SIMPLE VERSION)
// Tests the optimized system with caching
// ═══════════════════════════════════════════════════════════

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Cache system (same as claude.ts optimization)
const responseCache = new Map();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour
const MIN_REQUEST_INTERVAL = 1000; // 1 second
let lastRequestTime = 0;

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
  startTime: Date.now(),
  estimatedCost: 0
};

// Create output directory
const outputDir = './dist/pages';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate content with caching
async function generateContent(keyword) {
  const cacheKey = `${keyword.id}-${keyword.language}-${keyword.category}-${keyword.keyword}`;
  const cached = responseCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return { content: cached.data, fromCache: true };
  }

  // Rate limiting
  const waitTime = MIN_REQUEST_INTERVAL - (Date.now() - lastRequestTime);
  if (waitTime > 0) {
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  lastRequestTime = Date.now();

  // Call Claude API
  const prompt = `Génère un article SEO complet pour:

Keyword: "${keyword.keyword}"
Langue: ${keyword.language === 'fr' ? 'Français' : 'English'}
Catégorie: ${keyword.category}
Ville/Zone: ${keyword.location}
Type: ${keyword.authority ? 'AUTHORITY (page premium)' : 'STANDARD (page classique)'}
Wordcount: ${keyword.wordcount} mots MINIMUM

Retourne au format JSON:
{
  "title": "Titre H1 optimisé SEO (50-70 caractères)",
  "metaTitle": "Meta title (50-60 caractères)",
  "metaDescription": "Meta description (150-160 caractères)",
  "introduction": "Introduction accrocheuse (200-250 mots)",
  "sections": [
    {
      "title": "Titre H2",
      "subsections": [
        {
          "title": "Titre H3",
          "paragraphs": ["Paragraphe 1 détaillé...", "Paragraphe 2..."]
        }
      ]
    }
  ],
  "faq": [
    {
      "question": "Question pertinente?",
      "answer": "Réponse détaillée (60-100 mots)"
    }
  ],
  "conclusion": "Conclusion avec CTA (100-150 mots)",
  "wordcount": ${keyword.wordcount}
}

IMPORTANT: Contenu premium, détaillé, exemples concrets, ton chaleureux.`;

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 8000,
    temperature: 0.7,
    messages: [{
      role: "user",
      content: prompt
    }]
  });

  const textContent = response.content[0].text;
  const cleanedText = textContent.replace(/^```json\n?/g, '').replace(/\n?```$/g, '').trim();
  const content = JSON.parse(cleanedText);

  // Store in cache
  responseCache.set(cacheKey, {
    data: content,
    timestamp: Date.now()
  });

  return { content, fromCache: false };
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
            `).join('\n') || ''}
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
</body>
</html>`;
}

// Generate all pages
async function generateAllPages() {
  console.log('⏳ Génération en cours...\n');

  for (let i = 0; i < keywords.length; i++) {
    const keyword = keywords[i];
    const num = i + 1;

    console.log(`\n[${num}/${keywords.length}] 🎯 ${keyword.keyword}`);
    console.log(`   Catégorie: ${keyword.category} | Langue: ${keyword.language} | Type: ${keyword.authority ? 'AUTHORITY' : 'STANDARD'}`);

    try {
      const startGen = Date.now();
      const { content, fromCache } = await generateContent(keyword);
      const genTime = Date.now() - startGen;

      stats.totalWords += content.wordcount || 0;

      if (fromCache) {
        stats.cacheHits++;
        console.log(`   💾 Cache HIT (${genTime}ms) - 0€`);
      } else {
        stats.cacheMisses++;
        stats.estimatedCost += 0.20;
        console.log(`   🌐 API Call (${genTime}ms) - ~0.20€`);
      }

      console.log(`   📝 ${content.wordcount || 'N/A'} mots | ${content.sections?.length || 0} sections`);

      // Build and save HTML
      const html = buildHTMLPage(keyword, content);
      const filename = keyword.url.replace(/^\//, '').replace(/\//g, '_');
      const filepath = path.join(outputDir, filename);
      fs.writeFileSync(filepath, html, 'utf-8');

      // Save metadata
      const metadataPath = filepath.replace('.html', '.meta.json');
      fs.writeFileSync(metadataPath, JSON.stringify({
        keyword: keyword,
        content: {
          title: content.title,
          wordcount: content.wordcount,
          sections: content.sections?.length
        },
        generated: new Date().toISOString(),
        cacheHit: fromCache
      }, null, 2), 'utf-8');

      stats.success++;

    } catch (error) {
      console.log(`   ❌ ERREUR: ${error.message}`);
      stats.failed++;
    }
  }

  printFinalStats();
}

// Print final statistics
function printFinalStats() {
  const totalTime = ((Date.now() - stats.startTime) / 1000).toFixed(1);
  const avgWords = Math.round(stats.totalWords / stats.success);

  console.log('\n\n═══════════════════════════════════════════════════════════');
  console.log('📊 RAPPORT FINAL DE GÉNÉRATION');
  console.log('═══════════════════════════════════════════════════════════\n');

  console.log('⏱️  PERFORMANCE:');
  console.log(`   Temps total: ${totalTime}s`);
  console.log(`   Temps moyen par page: ${(parseFloat(totalTime) / stats.total).toFixed(1)}s\n`);

  console.log('✅ SUCCÈS:');
  console.log(`   Pages générées: ${stats.success}/${stats.total}`);
  console.log(`   Échecs: ${stats.failed}`);
  console.log(`   Taux de succès: ${((stats.success / stats.total) * 100).toFixed(1)}%\n`);

  console.log('💾 CACHE SYSTEM:');
  console.log(`   Cache HITS: ${stats.cacheHits}`);
  console.log(`   Cache MISS: ${stats.cacheMisses}`);
  console.log(`   Taux cache: ${stats.total > 0 ? ((stats.cacheHits / stats.total) * 100).toFixed(1) : 0}%\n`);

  console.log('💰 COÛTS API:');
  console.log(`   Coût estimé: ~${stats.estimatedCost.toFixed(2)}€`);
  console.log(`   Économie cache: ~${(stats.cacheHits * 0.20).toFixed(2)}€`);
  console.log(`   Coût sans cache: ~${(stats.total * 0.20).toFixed(2)}€`);
  console.log(`   Économie: ${stats.total > 0 ? ((stats.cacheHits / stats.total) * 100).toFixed(0) : 0}%\n`);

  console.log('📝 QUALITÉ:');
  console.log(`   Total mots générés: ${stats.totalWords.toLocaleString()}`);
  console.log(`   Moyenne mots/page: ${avgWords}\n`);

  console.log('📁 OUTPUT:');
  console.log(`   Répertoire: ${outputDir}/`);
  console.log(`   Fichiers HTML: ${stats.success}`);
  console.log(`   Fichiers metadata: ${stats.success}\n`);

  console.log('═══════════════════════════════════════════════════════════');
  console.log('✅ GÉNÉRATION TERMINÉE !');
  console.log('═══════════════════════════════════════════════════════════\n');
}

// Run generation
generateAllPages().catch(error => {
  console.error('\n❌ ERREUR FATALE:', error);
  process.exit(1);
});
