const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Images existantes réelles dans public/assets/img
const existingImages = {
  hero: [
    'hero-aeroport-nice.webp',
    'hero-business.webp',
    'aeroport-nice-1920w.webp',
    'homepage-riviera-1920w.webp'
  ],
  destinations: [
    'vtc-nice-cannes.jpg',
    'vtc-tesla-cannes.jpg',
    'vtc-tesla-monaco.jpg',
    'vtc-tesla-nice.jpg',
    'plage-beau-rivage-nice.jpg',
    'buddha-bar-monaco.jpg',
    'club-55-saint-tropez.jpg',
    'hotel-metropole-monaco.jpg',
    'hotel-negresco-nice.jpg',
    'nikki-beach-saint-tropez.jpg',
    'tahiti-beach-saint-tropez.jpg'
  ]
};

// Vérifier qu'une image existe vraiment
function imageExists(imgPath) {
  const fullPath = path.join(__dirname, '..', 'public', imgPath);
  return fs.existsSync(fullPath);
}

// Obtenir une image existante selon le contexte
function getExistingImage(context) {
  if (context === 'hero') {
    return '/assets/img/hero/hero-aeroport-nice.webp';
  } else if (context === 'destinations') {
    return '/assets/img/destinations/vtc-nice-cannes.jpg';
  } else if (context === 'business') {
    return '/assets/img/hero/hero-business.webp';
  }
  return '/assets/img/hero/hero-aeroport-nice.webp';
}

// Remplacer TOUTES les images par des images existantes
function fixAllImages(pageFile) {
  let content = fs.readFileSync(pageFile, 'utf8');
  let modified = false;
  
  // Remplacer toutes les images hero
  content = content.replace(
    /src=["']([^"']*\/assets\/img\/hero\/[^"']*\.(webp|jpg|jpeg|png))["']/gi,
    (match, imgPath) => {
      if (!imageExists(imgPath)) {
        modified = true;
        return match.replace(imgPath, '/assets/img/hero/hero-aeroport-nice.webp');
      }
      return match;
    }
  );
  
  // Remplacer toutes les images destinations
  content = content.replace(
    /src=["']([^"']*\/assets\/img\/destinations\/[^"']*\.(webp|jpg|jpeg|png))["']/gi,
    (match, imgPath) => {
      if (!imageExists(imgPath)) {
        modified = true;
        return match.replace(imgPath, '/assets/img/destinations/vtc-nice-cannes.jpg');
      }
      return match;
    }
  );
  
  // Remplacer toutes les images about
  content = content.replace(
    /src=["']([^"']*\/assets\/img\/about\/[^"']*\.(webp|jpg|jpeg|png))["']/gi,
    (match, imgPath) => {
      if (!imageExists(imgPath)) {
        modified = true;
        return match.replace(imgPath, '/assets/img/hero/hero-business.webp');
      }
      return match;
    }
  );
  
  // Remplacer toutes les images services
  content = content.replace(
    /src=["']([^"']*\/assets\/img\/services\/[^"']*\.(webp|jpg|jpeg|png))["']/gi,
    (match, imgPath) => {
      if (!imageExists(imgPath)) {
        modified = true;
        return match.replace(imgPath, '/assets/img/hero/hero-aeroport-nice.webp');
      }
      return match;
    }
  );
  
  // Remplacer tous les srcset
  content = content.replace(
    /srcset=["']([^"']*\/assets\/img\/[^"']*\.(webp|jpg|jpeg|png))["']/gi,
    (match, imgPath) => {
      if (!imageExists(imgPath)) {
        modified = true;
        if (imgPath.includes('hero')) {
          return match.replace(imgPath, '/assets/img/hero/hero-aeroport-nice.webp');
        } else {
          return match.replace(imgPath, '/assets/img/destinations/vtc-nice-cannes.jpg');
        }
      }
      return match;
    }
  );
  
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
let fixedCount = 0;

console.log('\n🔧 CORRECTION FINALE DE TOUTES LES IMAGES\n');
console.log('='.repeat(50));
console.log('📋 Utilisation uniquement d\'images existantes:\n');
console.log('   Hero: /assets/img/hero/hero-aeroport-nice.webp');
console.log('   Hero Business: /assets/img/hero/hero-business.webp');
console.log('   Destinations: /assets/img/destinations/vtc-nice-cannes.jpg');
console.log('   Destinations: /assets/img/destinations/vtc-tesla-cannes.jpg');
console.log('   Destinations: /assets/img/destinations/vtc-tesla-monaco.jpg');
console.log('   Destinations: /assets/img/destinations/vtc-tesla-nice.jpg');
console.log('   Destinations: /assets/img/destinations/plage-beau-rivage-nice.jpg\n');
console.log('='.repeat(50) + '\n');

pages.forEach(pageFile => {
  const fullPath = path.join(__dirname, '..', pageFile);
  const pageName = path.basename(pageFile, '.astro');
  
  const fixed = fixAllImages(fullPath);
  if (fixed) {
    console.log(`✅ ${pageName}`);
    fixedCount++;
  }
});

console.log(`\n✅ ${fixedCount} pages corrigées\n`);

// Vérification finale
console.log('🔍 Vérification finale...\n');
const checkScript = require('./check-images.js');
// On ne peut pas exécuter directement, mais on peut vérifier manuellement

