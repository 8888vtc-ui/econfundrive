const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Images existantes à utiliser comme remplacement
const existingImages = {
  hero: [
    '/assets/img/hero/hero-aeroport-nice.webp',
    '/assets/img/hero/hero-business.webp'
  ],
  destinations: [
    '/assets/img/destinations/vtc-nice-cannes.jpg',
    '/assets/img/destinations/vtc-tesla-cannes.jpg',
    '/assets/img/destinations/vtc-tesla-monaco.jpg',
    '/assets/img/destinations/vtc-tesla-nice.jpg',
    '/assets/img/destinations/plage-beau-rivage-nice.jpg'
  ],
  about: [
    '/assets/img/hero/hero-business.webp',
    '/assets/img/destinations/vtc-tesla-nice.jpg'
  ]
};

// Vérifier qu'une image existe
function imageExists(imgPath) {
  const fullPath = path.join(__dirname, '..', 'public', imgPath);
  return fs.existsSync(fullPath);
}

// Obtenir une image de remplacement
function getReplacementImage(brokenPath) {
  if (brokenPath.includes('hero')) {
    return existingImages.hero[0];
  } else if (brokenPath.includes('destinations')) {
    return existingImages.destinations[0];
  } else if (brokenPath.includes('about')) {
    return existingImages.about[0];
  } else if (brokenPath.includes('services')) {
    return existingImages.hero[1];
  }
  return existingImages.hero[0]; // Par défaut
}

// Corriger tous les liens cassés dans une page
function fixBrokenLinks(pageFile) {
  let content = fs.readFileSync(pageFile, 'utf8');
  let modified = false;
  
  // Trouver tous les liens d'images
  const imagePattern = /src=["']([^"']*\/assets\/img\/[^"']*\.(webp|jpg|jpeg|png))["']/gi;
  const srcsetPattern = /srcset=["']([^"']*\/assets\/img\/[^"']*\.(webp|jpg|jpeg|png))["']/gi;
  
  // Remplacer les src cassés
  content = content.replace(imagePattern, (match, imgPath) => {
    if (!imageExists(imgPath)) {
      modified = true;
      const replacement = getReplacementImage(imgPath);
      return match.replace(imgPath, replacement);
    }
    return match;
  });
  
  // Remplacer les srcset cassés
  content = content.replace(srcsetPattern, (match, imgPath) => {
    if (!imageExists(imgPath)) {
      modified = true;
      const replacement = getReplacementImage(imgPath);
      return match.replace(imgPath, replacement);
    }
    return match;
  });
  
  if (modified) {
    fs.writeFileSync(pageFile, content, 'utf8');
    return true;
  }
  
  return false;
}

// Traiter toutes les pages
const pages = glob.sync('src/pages/**/*.astro', { cwd: path.join(__dirname, '..') });
let fixedCount = 0;
const fixedLinks = [];

console.log('\n🔧 CORRECTION DES LIENS CASSÉS\n');
console.log('='.repeat(50));

pages.forEach(pageFile => {
  const fullPath = path.join(__dirname, '..', pageFile);
  const pageName = path.basename(pageFile, '.astro');
  
  // Vérifier les liens cassés avant correction
  const contentBefore = fs.readFileSync(fullPath, 'utf8');
  const brokenBefore = [];
  
  const imagePattern = /src=["']([^"']*\/assets\/img\/[^"']*\.(webp|jpg|jpeg|png))["']/gi;
  let match;
  while ((match = imagePattern.exec(contentBefore)) !== null) {
    const imgPath = match[1];
    if (!imageExists(imgPath)) {
      brokenBefore.push(imgPath);
    }
  }
  
  // Corriger
  const fixed = fixBrokenLinks(fullPath);
  
  if (fixed || brokenBefore.length > 0) {
    console.log(`✅ ${pageName} (${brokenBefore.length} lien(s) corrigé(s))`);
    fixedCount++;
    brokenBefore.forEach(link => {
      fixedLinks.push({ page: pageName, broken: link, replacement: getReplacementImage(link) });
    });
  }
});

console.log(`\n✅ ${fixedCount} pages corrigées`);
console.log(`📊 ${fixedLinks.length} liens cassés remplacés\n`);

// Générer rapport
const report = {
  pagesFixed: fixedCount,
  linksFixed: fixedLinks.length,
  details: fixedLinks,
  timestamp: new Date().toISOString()
};

fs.writeFileSync(
  path.join(__dirname, '..', 'broken-links-fixed-report.json'),
  JSON.stringify(report, null, 2)
);

console.log('📄 Rapport sauvegardé: broken-links-fixed-report.json\n');

