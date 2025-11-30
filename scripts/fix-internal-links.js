const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Lire le rapport des liens cassés
const reportPath = path.join(__dirname, '..', 'internal-links-report.json');
if (!fs.existsSync(reportPath)) {
  console.error('❌ Rapport internal-links-report.json introuvable. Exécutez d\'abord check-internal-links.js');
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
const brokenLinks = report.brokenLinksDetails || [];

if (brokenLinks.length === 0) {
  console.log('✅ Aucun lien cassé à corriger !\n');
  process.exit(0);
}

// Mapping des corrections courantes
const commonFixes = {
  '/index': '/',
  '/accueil': '/',
  '/home': '/',
  '/services': '/services',
  '/a-propos': '/a-propos',
  '/contact': '/contact',
  '/reservation': '/reservation',
  '/tarifs': '/tarifs',
  '/avis-clients': '/avis-clients',
  '/vtc-nice': '/vtc-nice',
  '/vtc-cannes': '/vtc-cannes',
  '/vtc-monaco': '/vtc-monaco',
  '/vtc-saint-tropez': '/vtc-saint-tropez'
};

// Trouver la page la plus proche pour un lien cassé
function findClosestPage(brokenLink) {
  const normalized = brokenLink.normalized.toLowerCase();
  
  // Vérifier les corrections courantes
  if (commonFixes[brokenLink.normalized]) {
    return commonFixes[brokenLink.normalized];
  }
  
  // Chercher dans les pages existantes
  const existingPages = report.existingPages || [];
  
  // Chercher une correspondance partielle
  for (const page of existingPages) {
    const pageLower = page.toLowerCase();
    const linkLower = normalized;
    
    // Correspondance exacte sans extension
    if (pageLower === linkLower || pageLower === linkLower + '/') {
      return page;
    }
    
    // Correspondance partielle (contient le nom)
    if (linkLower.includes(pageLower.split('/').pop()) || 
        pageLower.includes(linkLower.split('/').pop())) {
      return page;
    }
  }
  
  // Par défaut, rediriger vers la page d'accueil
  return '/';
}

// Corriger les liens dans une page
function fixLinksInPage(filePath, brokenLinksForPage) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  brokenLinksForPage.forEach(({ original, normalized }) => {
    const replacement = findClosestPage({ normalized, original });
    
    if (replacement !== normalized) {
      // Remplacer le lien
      const escapedOriginal = original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`href=["']${escapedOriginal}["']`, 'gi');
      
      if (regex.test(content)) {
        content = content.replace(regex, `href="${replacement}"`);
        modified = true;
        console.log(`   ✅ ${original} → ${replacement}`);
      }
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
  
  return modified;
}

// Grouper les liens cassés par fichier
const linksByFile = {};
brokenLinks.forEach(({ file, original, normalized }) => {
  if (!linksByFile[file]) {
    linksByFile[file] = [];
  }
  linksByFile[file].push({ original, normalized });
});

console.log('\n🔧 CORRECTION DES LIENS INTERNES CASSÉS\n');
console.log('='.repeat(50));

let fixedCount = 0;
let totalFixed = 0;

Object.keys(linksByFile).forEach(filePath => {
  const pageName = path.basename(filePath, '.astro');
  const brokenLinksForPage = linksByFile[filePath];
  
  console.log(`\n📄 ${pageName} (${brokenLinksForPage.length} lien(s) à corriger):`);
  
  const fixed = fixLinksInPage(filePath, brokenLinksForPage);
  
  if (fixed) {
    fixedCount++;
    totalFixed += brokenLinksForPage.length;
  }
});

console.log(`\n✅ ${fixedCount} pages corrigées`);
console.log(`📊 ${totalFixed} liens corrigés\n`);

// Générer rapport de correction
const fixReport = {
  pagesFixed: fixedCount,
  linksFixed: totalFixed,
  timestamp: new Date().toISOString()
};

fs.writeFileSync(
  path.join(__dirname, '..', 'internal-links-fixed-report.json'),
  JSON.stringify(fixReport, null, 2)
);

console.log('📄 Rapport sauvegardé: internal-links-fixed-report.json\n');

