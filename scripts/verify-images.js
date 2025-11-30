/**
 * Script pour vérifier l'existence des images
 */

const fs = require('fs');
const path = require('path');

const imagesToCheck = [
  // Fond d'écran
  'public/assets/img/hero/chauffeur-luxe-background.webp',
  // Hero images
  'public/assets/img/hero/hero-aeroport-nice.webp',
  'public/assets/img/hero/hero-business.webp',
  'public/assets/img/hero/hero-mariage.webp',
  // Destinations
  'public/assets/img/destinations/destination-nice.webp',
  'public/assets/img/destinations/destination-cannes.webp',
  'public/assets/img/destinations/destination-monaco.webp',
  'public/assets/img/destinations/destination-saint-tropez.webp',
  'public/assets/img/destinations/nice-vieux-nice.webp',
  'public/assets/img/destinations/cannes-palais-festivals.webp',
  'public/assets/img/destinations/monaco-casino.webp',
  'public/assets/img/destinations/saint-tropez-port.webp',
  // Services
  'public/assets/img/services/service-aeroport.webp',
  'public/assets/img/services/service-business.webp',
  'public/assets/img/services/service-mariage.webp',
  'public/assets/img/services/service-evenements.webp',
  'public/assets/img/services/service-mise-disposition.webp',
  // Guides
  'public/assets/img/guides/route-panoramique-nice-eze-monaco.webp',
  'public/assets/img/guides/villages-perches.webp',
  'public/assets/img/guides/grand-prix-monaco.webp',
  // À propos
  'public/assets/img/about/chauffeur-professionnel.webp',
  'public/assets/img/about/vehicule-premium.webp'
];

console.log('🔍 Vérification des images...\n');
const missing = [];
const existing = [];

imagesToCheck.forEach(img => {
  const fullPath = path.join(process.cwd(), img);
  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath);
    const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
    existing.push({ img, size: sizeMB });
    console.log(`✅ ${img} (${sizeMB} MB)`);
  } else {
    missing.push(img);
    console.log(`❌ ${img} - MANQUANTE`);
  }
});

console.log(`\n📊 Résultat:`);
console.log(`  ✅ ${existing.length} existantes`);
console.log(`  ❌ ${missing.length} manquantes`);

if (missing.length > 0) {
  console.log(`\n⚠️  Images manquantes à générer ou vérifier:`);
  missing.forEach(img => console.log(`  - ${img}`));
}

// Vérifier aussi les chemins dans le CSS
console.log(`\n🔍 Vérification des chemins dans le CSS...`);
const cssPath = path.join(process.cwd(), 'src/assets/css/luxe-chauffeur.css');
if (fs.existsSync(cssPath)) {
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  const urlMatches = cssContent.match(/url\(['"]?([^'")]+)['"]?\)/g);
  if (urlMatches) {
    console.log(`  Chemins trouvés dans CSS:`);
    urlMatches.forEach(match => {
      const url = match.replace(/url\(['"]?/, '').replace(/['"]?\)/, '');
      console.log(`    - ${url}`);
    });
  }
}

process.exit(missing.length > 0 ? 1 : 0);

