const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Mapping des chemins incorrects vers les chemins corrects
const imagePathMappings = {
  // Images about - utiliser des images existantes en remplacement
  '/assets/img/about/david-chemla.jpg': '/assets/img/hero/hero-aeroport-nice.webp',
  '/assets/img/about/tesla-model-3.jpg': '/assets/img/destinations/vtc-tesla-nice.jpg',
  '/assets/img/about/certification-vtc.jpg': '/assets/img/hero/hero-business.webp',
  
  // Images optimized - corriger les chemins
  '/assets/img/optimized/destinations/plage-beau-rivage-nice.webp': '/assets/img/optimized/plage-beau-rivage-nice.webp',
  '/assets/img/optimized/destinations/vtc-tesla-nice.webp': '/assets/img/optimized/vtc-tesla-nice.webp',
  '/assets/img/optimized/destinations/vtc-tesla-cannes.webp': '/assets/img/optimized/vtc-tesla-cannes.webp',
  '/assets/img/optimized/destinations/vtc-tesla-monaco.webp': '/assets/img/optimized/vtc-tesla-monaco.webp',
  '/assets/img/optimized/destinations/nikki-beach-saint-tropez.webp': '/assets/img/optimized/nikki-beach-saint-tropez.webp',
  '/assets/img/optimized/destinations/vtc-nice-cannes.webp': '/assets/img/optimized/vtc-nice-cannes.webp',
  '/assets/img/optimized/destinations/hotel-metropole-monaco.webp': '/assets/img/optimized/hotel-metropole-monaco.webp',
  '/assets/img/optimized/destinations/shared/homepage-riviera-1920w.webp': '/assets/img/hero/homepage-riviera-1920w.webp',
  '/assets/img/optimized/destinations/hero/authority/monaco-private-driver.webp': '/assets/img/hero/authority/monaco-private-driver.webp',
  
  // Images optimized/hero
  '/assets/img/optimized/hero/hero-aeroport-nice.webp': '/assets/img/hero/hero-aeroport-nice.webp',
  '/assets/img/optimized/hero/hero-business.webp': '/assets/img/hero/hero-business.webp',
  '/assets/img/optimized/hero/homepage-riviera-1920w.webp': '/assets/img/hero/homepage-riviera-1920w.webp',
  
  // Images optimized/en
  '/assets/img/optimized/en/booking/en-booking-process.webp': '/assets/img/en/booking/en-booking-process.webp',
  
  // Images destinations manquantes - utiliser images existantes
  '/assets/img/destinations/croisette-cannes.jpg': '/assets/img/destinations/vtc-tesla-cannes.jpg',
  '/assets/img/destinations/palais-des-festivals.jpg': '/assets/img/destinations/vtc-tesla-cannes.jpg',
  '/assets/img/destinations/suquet-cannes.jpg': '/assets/img/destinations/vtc-tesla-cannes.jpg',
  '/assets/img/destinations/vtc-nice-cannes.webp': '/assets/img/destinations/vtc-nice-cannes.jpg',
  '/assets/img/destinations/casino-monaco.jpg': '/assets/img/destinations/vtc-tesla-monaco.jpg',
  '/assets/img/destinations/port-hercule.jpg': '/assets/img/destinations/vtc-tesla-monaco.jpg',
  '/assets/img/destinations/palais-princier.jpg': '/assets/img/destinations/vtc-tesla-monaco.jpg',
  '/assets/img/destinations/vieux-nice.jpg': '/assets/img/destinations/plage-beau-rivage-nice.jpg',
  '/assets/img/destinations/promenade-des-anglais.jpg': '/assets/img/destinations/plage-beau-rivage-nice.jpg',
  '/assets/img/destinations/port-saint-tropez.jpg': '/assets/img/destinations/nikki-beach-saint-tropez.jpg',
  '/assets/img/destinations/plage-pampelonne.jpg': '/assets/img/destinations/nikki-beach-saint-tropez.jpg',
  '/assets/img/destinations/citadelle-saint-tropez.jpg': '/assets/img/destinations/nikki-beach-saint-tropez.jpg',
};

// Trouver toutes les pages Astro
const astroFiles = glob.sync('src/pages/**/*.astro', { cwd: __dirname + '/..' });

let totalFixed = 0;

astroFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Remplacer tous les chemins d'images
  Object.keys(imagePathMappings).forEach(oldPath => {
    const newPath = imagePathMappings[oldPath];
    const regex = new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    
    if (content.includes(oldPath)) {
      content = content.replace(regex, newPath);
      modified = true;
      totalFixed++;
      console.log(`  ${file}: ${oldPath} → ${newPath}`);
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
});

console.log(`\n✅ ${totalFixed} chemins d'images corrigés dans ${astroFiles.length} fichiers\n`);

