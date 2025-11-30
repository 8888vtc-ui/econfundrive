// Script de migration automatique HTML vers Astro
const fs = require('fs');
const path = require('path');

// Liste des pages à migrer (sans extension .html)
const pagesToMigrate = [
  // Pages principales
  'a-propos',
  'tarifs',
  'reservation',
  'avis-clients',
  'guides',
  'mentions-legales-rgpd',
  // Pages VTC
  'vtc-nice',
  'vtc-cannes',
  'vtc-monaco',
  'vtc-saint-tropez',
  'vtc-antibes',
  'vtc-frejus-saint-raphael',
  'vtc-grasse',
  'vtc-menton',
  'vtc-sophia-antipolis',
  'vtc-villeneuve-loubet',
  // Pages transferts
  'transfert-nice-aeroport-cannes',
  'transfert-nice-aeroport-monaco',
  'transfert-nice-aeroport-saint-tropez',
  'transfert-cannes-saint-tropez',
  'transferts-longue-distance-paca',
  // Pages guides
  'guide-vtc-ou-taxi-aeroport-nice',
  'guide-vtc-longue-distance',
  'guide-vtc-festival-cannes',
  'guide-villages-perches-cote-d-azur',
  'guide-route-panoramique-nice-eze-monaco',
  'guide-que-faire-a-nice-1-3-jours',
  'guide-que-faire-a-cannes',
  'guide-monaco-en-une-journee',
  'guide-journee-famille-cote-d-azur',
  'guide-grand-prix-monaco-deplacements',
  'guide-decouvrir-saint-tropez-golfe',
  'guide-congres-cannes-deplacements',
  'guide-circulation-cote-d-azur-haute-saison'
];

function extractTitleAndDescription(htmlContent) {
  const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/i);
  const descMatch = htmlContent.match(/<meta name="description" content="(.*?)">/i);
  
  return {
    title: titleMatch ? titleMatch[1].replace(/&amp;/g, '&') : 'Page',
    description: descMatch ? descMatch[1] : 'Description'
  };
}

function extractCanonical(htmlContent) {
  const canonicalMatch = htmlContent.match(/<link rel="canonical" href="(.*?)">/i);
  return canonicalMatch ? canonicalMatch[1].replace('https://www.ecofundrive.com', '') : null;
}

function extractBodyContent(htmlContent) {
  // Extraire le contenu entre <main> et </main>
  const mainMatch = htmlContent.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch) {
    let content = mainMatch[1];
    // Nettoyer les chemins .html
    content = content.replace(/href="\/([^"]+)\.html/g, 'href="/$1');
    content = content.replace(/href="([^"]+)\.html/g, 'href="$1');
    return content;
  }
  return '';
}

function createAstroPage(htmlFile, outputPath) {
  try {
    const htmlContent = fs.readFileSync(htmlFile, 'utf-8');
    const { title, description } = extractTitleAndDescription(htmlContent);
    const canonical = extractCanonical(htmlContent) || `/${path.basename(htmlFile, '.html')}`;
    const bodyContent = extractBodyContent(htmlContent);
    
    const pageName = path.basename(htmlFile, '.html');
    const currentPage = pageName === 'index' ? 'index' : pageName;
    
    const astroContent = `---
import BaseLayout from '../layouts/BaseLayout.astro';

const title = "${title}";
const description = "${description}";
const canonical = "${canonical}";
---

<BaseLayout 
  title={title}
  description={description}
  currentPage="${currentPage}"
  canonical={canonical}
>
${bodyContent}
</BaseLayout>
`;

    // Créer le dossier si nécessaire
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, astroContent, 'utf-8');
    console.log(`✅ Migré: ${htmlFile} → ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`❌ Erreur pour ${htmlFile}:`, error.message);
    return false;
  }
}

// Migration
console.log('🚀 Migration HTML vers Astro\n');
console.log(`📋 ${pagesToMigrate.length} pages à migrer\n`);

let successCount = 0;
let failCount = 0;

pagesToMigrate.forEach(pageName => {
  const htmlFile = path.join(__dirname, `${pageName}.html`);
  const astroFile = path.join(__dirname, 'src', 'pages', `${pageName}.astro`);
  
  if (fs.existsSync(htmlFile)) {
    if (createAstroPage(htmlFile, astroFile)) {
      successCount++;
    } else {
      failCount++;
    }
  } else {
    console.log(`⚠️  Fichier non trouvé: ${htmlFile}`);
    failCount++;
  }
});

console.log(`\n📊 Résultat:`);
console.log(`   ✅ Réussies: ${successCount}`);
console.log(`   ❌ Échouées: ${failCount}`);
console.log(`\n✅ Migration terminée!`);

