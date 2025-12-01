// Audit complet du site ECOFUNDRIVE avec DeepSeek v3
// Vérifie : Build, Structure, Liens, Images, CSS/JS inline, Responsive, SEO, Accessibilité

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

const OpenAI = require('openai');

// Configuration DeepSeek v3
const deepseekKey = process.env.DEEPSEEK_API_KEY;
const deepseek = deepseekKey ? new OpenAI({
  apiKey: deepseekKey,
  baseURL: 'https://api.deepseek.com'
}) : null;

const auditReport = {
  timestamp: new Date().toISOString(),
  build: {},
  structure: {},
  links: {},
  images: {},
  css: {},
  javascript: {},
  responsive: {},
  seo: {},
  accessibility: {},
  performance: {},
  errors: [],
  warnings: [],
  recommendations: []
};

// 1. Vérification Build
async function checkBuild() {
  console.log('🔨 Vérification du build...');
  try {
    const distExists = await fs.access('dist').then(() => true).catch(() => false);
    auditReport.build.distExists = distExists;
    
    if (distExists) {
      const files = await fs.readdir('dist');
      const htmlFiles = files.filter(f => f.endsWith('.html') || f.includes('index.html'));
      auditReport.build.htmlFiles = htmlFiles.length;
      auditReport.build.totalFiles = files.length;
    }
    
    // Test build
    try {
      execSync('npm run build', { stdio: 'pipe', timeout: 60000 });
      auditReport.build.buildSuccess = true;
    } catch (e) {
      auditReport.build.buildSuccess = false;
      auditReport.errors.push(`Build failed: ${e.message}`);
    }
  } catch (error) {
    auditReport.errors.push(`Build check error: ${error.message}`);
  }
}

// 2. Vérification Structure
async function checkStructure() {
  console.log('📁 Vérification de la structure...');
  const requiredFiles = [
    'src/layouts/BaseLayout.astro',
    'src/components/Header.astro',
    'src/components/Chatbot.astro',
    'src/components/WhatsAppButton.astro',
    'netlify/functions/chatbot.js',
    'astro.config.mjs',
    'netlify.toml'
  ];
  
  for (const file of requiredFiles) {
    try {
      await fs.access(file);
      auditReport.structure[file] = true;
    } catch {
      auditReport.structure[file] = false;
      auditReport.warnings.push(`Fichier manquant: ${file}`);
    }
  }
}

// 3. Vérification CSS/JS inline
async function checkInlineAssets() {
  console.log('🎨 Vérification CSS/JS inline...');
  try {
    const indexPath = 'dist/index.html';
    const html = await fs.readFile(indexPath, 'utf-8');
    
    // Vérifier CSS inline
    const hasInlineCSS = html.includes('<style>') || html.includes('<style ');
    const hasExternalCSS = html.includes('<link rel="stylesheet"');
    auditReport.css.inline = hasInlineCSS;
    auditReport.css.external = hasExternalCSS;
    
    if (hasExternalCSS) {
      auditReport.warnings.push('CSS externe détecté (devrait être inline)');
    }
    
    // Vérifier JS inline
    const hasInlineJS = html.includes('<script is:inline>') || html.includes('<script>');
    const hasExternalJS = html.match(/<script[^>]*src=["'][^"']+["']/);
    auditReport.javascript.inline = hasInlineJS;
    auditReport.javascript.external = hasExternalJS !== null;
    
    if (hasExternalJS) {
      auditReport.warnings.push('JavaScript externe détecté (devrait être inline)');
    }
    
    // Vérifier responsive
    const hasViewport = html.includes('viewport');
    const hasMediaQueries = html.includes('@media');
    auditReport.responsive.viewport = hasViewport;
    auditReport.responsive.mediaQueries = hasMediaQueries;
    
  } catch (error) {
    auditReport.errors.push(`Inline assets check error: ${error.message}`);
  }
}

// 4. Vérification Images
async function checkImages() {
  console.log('🖼️  Vérification des images...');
  try {
    const indexPath = 'dist/index.html';
    const html = await fs.readFile(indexPath, 'utf-8');
    
    // Extraire toutes les images
    const imgMatches = html.match(/<img[^>]+src=["']([^"']+)["']/g) || [];
    const images = imgMatches.map(m => {
      const srcMatch = m.match(/src=["']([^"']+)["']/);
      return srcMatch ? srcMatch[1] : null;
    }).filter(Boolean);
    
    auditReport.images.total = images.length;
    auditReport.images.paths = images.slice(0, 10); // Premières 10
    
    // Vérifier format WebP
    const webpImages = images.filter(img => img.includes('.webp'));
    auditReport.images.webpCount = webpImages.length;
    auditReport.images.webpPercentage = (webpImages.length / images.length * 100).toFixed(1);
    
  } catch (error) {
    auditReport.errors.push(`Images check error: ${error.message}`);
  }
}

// 5. Vérification SEO
async function checkSEO() {
  console.log('🔍 Vérification SEO...');
  try {
    const indexPath = 'dist/index.html';
    const html = await fs.readFile(indexPath, 'utf-8');
    
    const checks = {
      hasTitle: html.includes('<title>'),
      hasMetaDescription: html.includes('name="description"'),
      hasCanonical: html.includes('rel="canonical"'),
      hasSchemaOrg: html.includes('application/ld+json'),
      hasHreflang: html.includes('hreflang'),
      hasOpenGraph: html.includes('og:'),
      hasTwitterCard: html.includes('twitter:')
    };
    
    auditReport.seo = checks;
    
    const missing = Object.entries(checks).filter(([_, v]) => !v).map(([k]) => k);
    if (missing.length > 0) {
      auditReport.warnings.push(`SEO manquant: ${missing.join(', ')}`);
    }
    
  } catch (error) {
    auditReport.errors.push(`SEO check error: ${error.message}`);
  }
}

// 6. Vérification Accessibilité
async function checkAccessibility() {
  console.log('♿ Vérification accessibilité...');
  try {
    const indexPath = 'dist/index.html';
    const html = await fs.readFile(indexPath, 'utf-8');
    
    const checks = {
      hasLang: html.includes('lang='),
      hasAriaLabels: html.includes('aria-label'),
      hasAltImages: html.match(/<img[^>]+alt=["'][^"']+["']/),
      hasSkipLink: html.includes('skip-link') || html.includes('skip to'),
      hasSemanticHTML: html.includes('<main>') && html.includes('<header>') && html.includes('<footer>')
    };
    
    auditReport.accessibility = checks;
    
    const missing = Object.entries(checks).filter(([_, v]) => !v).map(([k]) => k);
    if (missing.length > 0) {
      auditReport.warnings.push(`Accessibilité manquante: ${missing.join(', ')}`);
    }
    
  } catch (error) {
    auditReport.errors.push(`Accessibility check error: ${error.message}`);
  }
}

// 7. Analyse DeepSeek v3
async function analyzeWithDeepSeek() {
  console.log('🤖 Analyse avec DeepSeek v3...');
  
  if (!deepseek) {
    auditReport.warnings.push('DeepSeek v3 non configuré - analyse IA ignorée');
    return;
  }
  
  try {
    // Lire les fichiers clés
    const baseLayout = await fs.readFile('src/layouts/BaseLayout.astro', 'utf-8').catch(() => '');
    const chatbot = await fs.readFile('netlify/functions/chatbot.js', 'utf-8').catch(() => '');
    const config = await fs.readFile('astro.config.mjs', 'utf-8').catch(() => '');
    
    const codeContext = `
BASE LAYOUT (extrait):
${baseLayout.substring(0, 2000)}

CHATBOT FUNCTION (extrait):
${chatbot.substring(0, 2000)}

ASTRO CONFIG:
${config}
    `;
    
    const prompt = `Tu es un expert en développement web et SEO. Analyse ce site Astro (ECOFUNDRIVE - VTC Côte d'Azur) et donne-moi :

1. **PROBLÈMES CRITIQUES** : Bugs, erreurs, fonctionnalités cassées
2. **PROBLÈMES MOBILE** : Responsive, touch targets, menu mobile
3. **PROBLÈMES PC** : Layout desktop, navigation
4. **OPTIMISATIONS** : Performance, SEO, accessibilité
5. **RECOMMANDATIONS** : Améliorations prioritaires

Réponds en français, sois concis et actionnable. Format :
- ❌ PROBLÈME : description
- ✅ SOLUTION : action concrète

Code analysé :
${codeContext}
    `;
    
    const response = await deepseek.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: 'Tu es un expert en audit de sites web, SEO, performance et accessibilité.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2000,
      temperature: 0.3
    });
    
    const analysis = response.choices[0].message.content;
    auditReport.deepseekAnalysis = analysis;
    
    // Extraire recommandations
    const recommendations = analysis.match(/- ✅ [^\n]+/g) || [];
    auditReport.recommendations.push(...recommendations.map(r => r.replace('- ✅ ', '')));
    
  } catch (error) {
    auditReport.errors.push(`DeepSeek analysis error: ${error.message}`);
  }
}

// 8. Vérification Performance
async function checkPerformance() {
  console.log('⚡ Vérification performance...');
  try {
    const indexPath = 'dist/index.html';
    const stats = await fs.stat(indexPath);
    const html = await fs.readFile(indexPath, 'utf-8');
    
    auditReport.performance = {
      htmlSize: (stats.size / 1024).toFixed(2) + ' KB',
      htmlLength: html.length,
      hasPreload: html.includes('rel="preload"'),
      hasCompression: html.includes('compressHTML'),
      inlineStylesheets: html.includes('<style>') && !html.includes('<link rel="stylesheet"')
    };
    
    if (stats.size > 200 * 1024) {
      auditReport.warnings.push('HTML trop volumineux (>200KB)');
    }
    
  } catch (error) {
    auditReport.errors.push(`Performance check error: ${error.message}`);
  }
}

// 9. Vérification Mobile/Desktop
async function checkResponsive() {
  console.log('📱 Vérification responsive...');
  try {
    const headerPath = 'src/components/Header.astro';
    const header = await fs.readFile(headerPath, 'utf-8');
    
    const checks = {
      hasMobileMenu: header.includes('nav-links-mobile') || header.includes('hamburger'),
      hasDesktopMenu: header.includes('nav-links-desktop'),
      hasMediaQueries: header.includes('@media') || header.includes('max-width'),
      hasTouchSupport: header.includes('touchend') || header.includes('touch')
    };
    
    auditReport.responsive = { ...auditReport.responsive, ...checks };
    
    const missing = Object.entries(checks).filter(([_, v]) => !v).map(([k]) => k);
    if (missing.length > 0) {
      auditReport.warnings.push(`Responsive manquant: ${missing.join(', ')}`);
    }
    
  } catch (error) {
    auditReport.errors.push(`Responsive check error: ${error.message}`);
  }
}

// Génération du rapport
async function generateReport() {
  const reportPath = 'AUDIT-COMPLET-SITE.json';
  const markdownPath = 'AUDIT-COMPLET-SITE.md';
  
  // JSON
  await fs.writeFile(reportPath, JSON.stringify(auditReport, null, 2));
  
  // Markdown
  const md = `# 🔍 Audit Complet du Site ECOFUNDRIVE

**Date** : ${new Date(auditReport.timestamp).toLocaleString('fr-FR')}

## 📊 Résumé

- ✅ **Build** : ${auditReport.build.buildSuccess ? 'SUCCÈS' : 'ÉCHEC'}
- 📁 **Structure** : ${Object.values(auditReport.structure).filter(v => v).length}/${Object.keys(auditReport.structure).length} fichiers présents
- 🎨 **CSS Inline** : ${auditReport.css.inline ? '✅' : '❌'}
- 💻 **JS Inline** : ${auditReport.javascript.inline ? '✅' : '❌'}
- 🖼️  **Images** : ${auditReport.images.total || 0} images (${auditReport.images.webpPercentage || 0}% WebP)
- 🔍 **SEO** : ${Object.values(auditReport.seo).filter(v => v).length}/${Object.keys(auditReport.seo).length} critères
- ♿ **Accessibilité** : ${Object.values(auditReport.accessibility).filter(v => v).length}/${Object.keys(auditReport.accessibility).length} critères
- 📱 **Responsive** : ${Object.values(auditReport.responsive).filter(v => v).length}/${Object.keys(auditReport.responsive).length} critères

## ❌ Erreurs (${auditReport.errors.length})

${auditReport.errors.map(e => `- ${e}`).join('\n') || 'Aucune erreur'}

## ⚠️ Avertissements (${auditReport.warnings.length})

${auditReport.warnings.map(w => `- ${w}`).join('\n') || 'Aucun avertissement'}

## 🤖 Analyse DeepSeek v3

${auditReport.deepseekAnalysis || 'Analyse non disponible (DeepSeek v3 non configuré)'}

## ✅ Recommandations

${auditReport.recommendations.map(r => `- ${r}`).join('\n') || 'Aucune recommandation'}

## 📈 Détails

### Build
\`\`\`json
${JSON.stringify(auditReport.build, null, 2)}
\`\`\`

### Performance
\`\`\`json
${JSON.stringify(auditReport.performance, null, 2)}
\`\`\`

### SEO
\`\`\`json
${JSON.stringify(auditReport.seo, null, 2)}
\`\`\`

### Responsive
\`\`\`json
${JSON.stringify(auditReport.responsive, null, 2)}
\`\`\`
`;
  
  await fs.writeFile(markdownPath, md);
  
  console.log('\n✅ Rapport généré :');
  console.log(`   - ${reportPath}`);
  console.log(`   - ${markdownPath}`);
}

// Main
async function main() {
  console.log('🚀 Démarrage de l\'audit complet...\n');
  
  await checkBuild();
  await checkStructure();
  await checkInlineAssets();
  await checkImages();
  await checkSEO();
  await checkAccessibility();
  await checkPerformance();
  await checkResponsive();
  await analyzeWithDeepSeek();
  await generateReport();
  
  console.log('\n✅ Audit terminé !');
  console.log(`\n📊 Résumé :`);
  console.log(`   - Erreurs : ${auditReport.errors.length}`);
  console.log(`   - Avertissements : ${auditReport.warnings.length}`);
  console.log(`   - Recommandations : ${auditReport.recommendations.length}`);
}

main().catch(console.error);

