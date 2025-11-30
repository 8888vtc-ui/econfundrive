const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Structure simplifiée - MOINS d'images, une seule par contexte
const simpleImageMapping = {
  'index': {
    hero: '/assets/img/hero/hero-main.webp',
    cards: [
      { src: '/assets/img/destinations/nice-destination.webp', alt: 'VTC Nice - Ville côtière méditerranéenne' },
      { src: '/assets/img/destinations/cannes-destination.webp', alt: 'VTC Cannes - Ville côtière méditerranéenne' },
      { src: '/assets/img/destinations/monaco-destination.webp', alt: 'VTC Monaco - Ville côtière méditerranéenne' },
      { src: '/assets/img/destinations/saint-tropez-destination.webp', alt: 'VTC Saint-Tropez - Station balnéaire méditerranéenne' }
    ]
  },
  'vtc-nice': {
    hero: '/assets/img/hero/hero-main.webp',
    image1: '/assets/img/destinations/nice-destination.webp',
    image2: '/assets/img/hero/hero-business.webp'
  },
  'vtc-cannes': {
    hero: '/assets/img/hero/hero-main.webp',
    image1: '/assets/img/destinations/cannes-destination.webp',
    image2: '/assets/img/hero/hero-business.webp'
  },
  'vtc-monaco': {
    hero: '/assets/img/hero/hero-main.webp',
    image1: '/assets/img/destinations/monaco-destination.webp',
    image2: '/assets/img/hero/hero-business.webp'
  },
  'vtc-saint-tropez': {
    hero: '/assets/img/hero/hero-main.webp',
    image1: '/assets/img/destinations/saint-tropez-destination.webp',
    image2: '/assets/img/hero/hero-business.webp'
  },
  'a-propos': {
    image1: '/assets/img/hero/hero-business.webp',
    image2: '/assets/img/destinations/nice-destination.webp'
  },
  'services': {
    image1: '/assets/img/hero/hero-main.webp',
    image2: '/assets/img/hero/hero-business.webp'
  }
};

// Images existantes à utiliser (vérification)
const existingImages = {
  hero: [
    'hero-main.webp',
    'hero-business.webp',
    'hero-aeroport-nice.webp'
  ],
  destinations: [
    'nice-destination.webp',
    'cannes-destination.webp',
    'monaco-destination.webp',
    'saint-tropez-destination.webp',
    'vtc-nice-cannes.jpg',
    'vtc-tesla-cannes.jpg',
    'vtc-tesla-monaco.jpg',
    'vtc-tesla-nice.jpg',
    'plage-beau-rivage-nice.jpg'
  ]
};

// Vérifier qu'une image existe
function imageExists(imgPath) {
  const fullPath = path.join(__dirname, '..', 'public', imgPath);
  return fs.existsSync(fullPath);
}

// Remplacer toutes les images dans une page avec structure simplifiée
function simplifyPageImages(pageFile, pageName) {
  let content = fs.readFileSync(pageFile, 'utf8');
  const mapping = simpleImageMapping[pageName];
  
  if (!mapping) {
    // Pour les autres pages, utiliser des images génériques existantes
    return replaceWithExistingImages(pageFile, content);
  }
  
  let modified = false;
  
  // Page index - structure spéciale avec cards
  if (pageName === 'index' && mapping.cards) {
    // Remplacer hero
    if (mapping.hero && imageExists(mapping.hero)) {
      content = content.replace(
        /src=["']([^"']*hero[^"']*\.(webp|jpg|jpeg|png))["']/gi,
        (match) => {
          modified = true;
          return match.replace(/src=["'][^"']*["']/, `src="${mapping.hero}"`);
        }
      );
    }
    
    // Remplacer les 4 cards
    let cardIndex = 0;
    content = content.replace(
      /<picture>[\s\S]*?<source[^>]*srcset=["']([^"']*)["'][^>]*>[\s\S]*?<img[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*>/gi,
      (match, srcset, src, alt) => {
        if (cardIndex < mapping.cards.length) {
          const card = mapping.cards[cardIndex];
          if (imageExists(card.src)) {
            modified = true;
            const newMatch = match
              .replace(srcset, card.src)
              .replace(src, card.src.replace('.webp', '.jpg'))
              .replace(/alt=["'][^"']*["']/i, `alt="${card.alt}"`);
            cardIndex++;
            return newMatch;
          }
        }
        return match;
      }
    );
    
    // Remplacer aussi les images simples
    cardIndex = 0;
    content = content.replace(
      /<img[^>]*src=["']([^"']*destinations[^"']*\.(webp|jpg|jpeg|png))["'][^>]*alt=["']([^"']*)["'][^>]*>/gi,
      (match, src, ext, alt) => {
        if (cardIndex < mapping.cards.length && src.includes('destinations')) {
          const card = mapping.cards[cardIndex];
          if (imageExists(card.src)) {
            modified = true;
            const newMatch = match
              .replace(src, card.src)
              .replace(/alt=["'][^"']*["']/i, `alt="${card.alt}"`);
            cardIndex++;
            return newMatch;
          }
        }
        return match;
      }
    );
  }
  // Autres pages - maximum 3 images
  else {
    const images = [mapping.hero, mapping.image1, mapping.image2].filter(Boolean);
    let imageIndex = 0;
    
    // Remplacer toutes les images
    content = content.replace(
      /<img[^>]*src=["']([^"']*\/assets\/img\/[^"']*\.(webp|jpg|jpeg|png))["'][^>]*>/gi,
      (match, oldSrc) => {
        if (imageIndex < images.length && oldSrc.includes('/assets/img/')) {
          const img = images[imageIndex];
          if (imageExists(img)) {
            modified = true;
            const newMatch = match.replace(oldSrc, img);
            imageIndex++;
            return newMatch;
          }
        }
        return match;
      }
    );
    
    // Remplacer aussi les source dans picture
    imageIndex = 0;
    content = content.replace(
      /<source[^>]*srcset=["']([^"']*\/assets\/img\/[^"']*\.(webp|jpg|jpeg|png))["'][^>]*>/gi,
      (match, oldSrcset) => {
        if (imageIndex < images.length && oldSrcset.includes('/assets/img/')) {
          const img = images[imageIndex];
          if (imageExists(img)) {
            modified = true;
            const newMatch = match.replace(oldSrcset, img);
            imageIndex++;
            return newMatch;
          }
        }
        return match;
      }
    );
  }
  
  // Supprimer toutes les références à /optimized/
  if (content.includes('/optimized/')) {
    modified = true;
    content = content.replace(/\/assets\/img\/optimized\//g, '/assets/img/destinations/');
  }
  
  if (modified) {
    fs.writeFileSync(pageFile, content, 'utf8');
    return true;
  }
  
  return false;
}

// Pour les pages non mappées, utiliser des images existantes
function replaceWithExistingImages(pageFile, content) {
  let modified = false;
  
  // Trouver une image hero existante
  const heroImages = [
    '/assets/img/hero/hero-main.webp',
    '/assets/img/hero/hero-business.webp',
    '/assets/img/hero/hero-aeroport-nice.webp'
  ];
  
  const destImages = [
    '/assets/img/destinations/nice-destination.webp',
    '/assets/img/destinations/vtc-nice-cannes.jpg',
    '/assets/img/destinations/plage-beau-rivage-nice.jpg'
  ];
  
  // Remplacer les références à /optimized/
  if (content.includes('/optimized/')) {
    modified = true;
    content = content.replace(/\/assets\/img\/optimized\//g, '/assets/img/destinations/');
  }
  
  // Remplacer les images manquantes par des images existantes
  content = content.replace(
    /src=["']([^"']*\/assets\/img\/[^"']*\.(webp|jpg|jpeg|png))["']/gi,
    (match, imgPath) => {
      if (!imageExists(imgPath)) {
        modified = true;
        // Utiliser une image existante selon le contexte
        if (imgPath.includes('hero')) {
          return match.replace(imgPath, heroImages[0]);
        } else if (imgPath.includes('destinations')) {
          return match.replace(imgPath, destImages[0]);
        } else {
          return match.replace(imgPath, heroImages[0]);
        }
      }
      return match;
    }
  );
  
  if (modified) {
    fs.writeFileSync(pageFile, content, 'utf8');
    return true;
  }
  
  return false;
}

// Traiter toutes les pages
const pages = glob.sync('src/pages/**/*.astro', { cwd: path.join(__dirname, '..') });
let updatedCount = 0;
const brokenLinks = [];

console.log('\n🔄 RÉORGANISATION SIMPLIFIÉE DES IMAGES\n');
console.log('='.repeat(50));

pages.forEach(pageFile => {
  const fullPath = path.join(__dirname, '..', pageFile);
  const pageName = path.basename(pageFile, '.astro');
  
  const updated = simplifyPageImages(fullPath, pageName);
  if (updated) {
    console.log(`✅ ${pageName}`);
    updatedCount++;
  }
  
  // Vérifier les liens cassés
  const content = fs.readFileSync(fullPath, 'utf8');
  const imageMatches = content.matchAll(/src=["']([^"']*\/assets\/img\/[^"']*\.(webp|jpg|jpeg|png))["']/gi);
  for (const match of imageMatches) {
    const imgPath = match[1];
    if (!imageExists(imgPath)) {
      brokenLinks.push({ page: pageName, path: imgPath });
    }
  }
});

console.log(`\n✅ ${updatedCount} pages réorganisées\n`);

if (brokenLinks.length > 0) {
  console.log('❌ LIENS CASSÉS DÉTECTÉS:\n');
  brokenLinks.forEach(({ page, path: imgPath }) => {
    console.log(`   ${page}: ${imgPath}`);
  });
  console.log('\n');
} else {
  console.log('✅ Tous les liens d\'images sont valides !\n');
}

// Générer rapport
const report = {
  pagesUpdated: updatedCount,
  brokenLinks: brokenLinks,
  timestamp: new Date().toISOString()
};

fs.writeFileSync(
  path.join(__dirname, '..', 'image-reorganization-report.json'),
  JSON.stringify(report, null, 2)
);

console.log('📄 Rapport sauvegardé: image-reorganization-report.json\n');

