const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Mapping complet des images par page (aucune duplication, structure propre)
const imageMapping = {
  'index': {
    hero: '/assets/img/hero/hero-main.webp',
    cards: [
      { src: '/assets/img/destinations/nice-destination.webp', alt: 'VTC Nice - Vue sur une ville côtière méditerranéenne' },
      { src: '/assets/img/destinations/cannes-destination.webp', alt: 'VTC Cannes - Vue sur une ville côtière méditerranéenne' },
      { src: '/assets/img/destinations/monaco-destination.webp', alt: 'VTC Monaco - Vue sur une ville côtière méditerranéenne' },
      { src: '/assets/img/destinations/saint-tropez-destination.webp', alt: 'VTC Saint-Tropez - Vue sur une station balnéaire méditerranéenne' }
    ]
  },
  'vtc-nice': {
    images: [
      { src: '/assets/img/hero/nice-hero-1.webp', alt: 'Berline VTC premium dans une ville côtière méditerranéenne' },
      { src: '/assets/img/destinations/nice-destination-1.webp', alt: 'Vue panoramique d\'une ville côtière méditerranéenne' },
      { src: '/assets/img/hero/nice-hero-2.webp', alt: 'Intérieur premium d\'une berline VTC' },
      { src: '/assets/img/destinations/nice-destination-2.webp', alt: 'Promenade côtière méditerranéenne' }
    ]
  },
  'vtc-cannes': {
    images: [
      { src: '/assets/img/hero/cannes-hero-1.webp', alt: 'Berline VTC premium devant un palais des congrès méditerranéen' },
      { src: '/assets/img/destinations/cannes-destination-1.webp', alt: 'Vue aérienne d\'une ville côtière méditerranéenne' },
      { src: '/assets/img/hero/cannes-hero-2.webp', alt: 'Intérieur premium d\'une berline VTC spacieuse' },
      { src: '/assets/img/destinations/cannes-destination-2.webp', alt: 'Plage méditerranéenne avec cabanes' }
    ]
  },
  'vtc-monaco': {
    images: [
      { src: '/assets/img/hero/monaco-hero-1.webp', alt: 'Berline VTC premium dans une principauté côtière méditerranéenne' },
      { src: '/assets/img/destinations/monaco-destination-1.webp', alt: 'Vue aérienne d\'une principauté côtière méditerranéenne' },
      { src: '/assets/img/hero/monaco-hero-2.webp', alt: 'Intérieur premium d\'une berline VTC luxueuse' },
      { src: '/assets/img/destinations/monaco-destination-2.webp', alt: 'Port méditerranéen avec yachts' }
    ]
  },
  'vtc-saint-tropez': {
    images: [
      { src: '/assets/img/hero/saint-tropez-hero-1.webp', alt: 'Berline VTC premium dans une station balnéaire méditerranéenne' },
      { src: '/assets/img/destinations/saint-tropez-destination-1.webp', alt: 'Vue aérienne d\'une station balnéaire méditerranéenne' },
      { src: '/assets/img/hero/saint-tropez-hero-2.webp', alt: 'Intérieur premium d\'une berline VTC avec vue mer' },
      { src: '/assets/img/destinations/saint-tropez-destination-2.webp', alt: 'Plage méditerranéenne avec club de plage' }
    ]
  },
  'a-propos': {
    images: [
      { src: '/assets/img/about/about-chauffeur.webp', alt: 'Chauffeur professionnel en tenue business' },
      { src: '/assets/img/about/about-vehicle.webp', alt: 'Berline premium VTC vue de côté' },
      { src: '/assets/img/about/about-certification.webp', alt: 'Certificat VTC professionnel' }
    ]
  },
  'services': {
    images: [
      { src: '/assets/img/services/service-airport.webp', alt: 'Berline VTC premium à l\'aéroport' },
      { src: '/assets/img/services/service-business.webp', alt: 'Intérieur premium d\'une berline VTC avec espace de travail' },
      { src: '/assets/img/services/service-wedding.webp', alt: 'Berline VTC premium décorée pour événement' }
    ]
  }
};

// Remplacer toutes les images dans une page
function fixPageImages(pageFile, pageName) {
  let content = fs.readFileSync(pageFile, 'utf8');
  const mapping = imageMapping[pageName];
  
  if (!mapping) return false;
  
  let modified = false;
  
  // Page index - structure spéciale
  if (pageName === 'index' && mapping.cards) {
    // Remplacer hero
    if (mapping.hero) {
      content = content.replace(
        /src=["']([^"']*hero[^"']*\.(webp|jpg|jpeg|png))["']/gi,
        (match) => {
          modified = true;
          return match.replace(/src=["'][^"']*["']/, `src="${mapping.hero}"`);
        }
      );
    }
    
    // Remplacer les cards (4 images uniques)
    let cardIndex = 0;
    content = content.replace(
      /<picture>[\s\S]*?<source[^>]*srcset=["']([^"']*)["'][^>]*>[\s\S]*?<img[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*>/gi,
      (match, srcset, src, alt) => {
        if (cardIndex < mapping.cards.length) {
          modified = true;
          const card = mapping.cards[cardIndex];
          const newMatch = match
            .replace(srcset, card.src)
            .replace(src, card.src.replace('.webp', '.jpg'))
            .replace(/alt=["'][^"']*["']/i, `alt="${card.alt}"`);
          cardIndex++;
          return newMatch;
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
          modified = true;
          const card = mapping.cards[cardIndex];
          const newMatch = match
            .replace(src, card.src)
            .replace(/alt=["'][^"']*["']/i, `alt="${card.alt}"`);
          cardIndex++;
          return newMatch;
        }
        return match;
      }
    );
  }
  // Autres pages
  else if (mapping.images) {
    let imageIndex = 0;
    
    // Remplacer toutes les images une par une
    content = content.replace(
      /<img[^>]*src=["']([^"']*\/assets\/img\/[^"']*\.(webp|jpg|jpeg|png))["'][^>]*>/gi,
      (match, oldSrc) => {
        if (imageIndex < mapping.images.length && oldSrc.includes('/assets/img/')) {
          modified = true;
          const img = mapping.images[imageIndex];
          const newMatch = match
            .replace(oldSrc, img.src)
            .replace(/alt=["'][^"']*["']/i, `alt="${img.alt}"`);
          imageIndex++;
          return newMatch;
        }
        return match;
      }
    );
    
    // Remplacer aussi les source dans picture
    imageIndex = 0;
    content = content.replace(
      /<source[^>]*srcset=["']([^"']*\/assets\/img\/[^"']*\.(webp|jpg|jpeg|png))["'][^>]*>/gi,
      (match, oldSrcset) => {
        if (imageIndex < mapping.images.length && oldSrcset.includes('/assets/img/')) {
          modified = true;
          const img = mapping.images[imageIndex];
          const newMatch = match.replace(oldSrcset, img.src);
          imageIndex++;
          return newMatch;
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

// Traiter toutes les pages
const pages = glob.sync('src/pages/**/*.astro', { cwd: path.join(__dirname, '..') });
let updatedCount = 0;

console.log('\n🔧 CORRECTION COMPLÈTE DES IMAGES\n');
console.log('='.repeat(50));

pages.forEach(pageFile => {
  const fullPath = path.join(__dirname, '..', pageFile);
  const pageName = path.basename(pageFile, '.astro');
  
  if (imageMapping[pageName]) {
    const updated = fixPageImages(fullPath, pageName);
    if (updated) {
      console.log(`✅ ${pageName}`);
      updatedCount++;
    }
  } else {
    // Pour les autres pages, supprimer juste les références à /optimized/
    let content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes('/optimized/')) {
      content = content.replace(/\/assets\/img\/optimized\//g, '/assets/img/destinations/');
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`🔧 ${pageName} (nettoyage chemins)`);
      updatedCount++;
    }
  }
});

console.log(`\n✅ ${updatedCount} pages corrigées\n`);

