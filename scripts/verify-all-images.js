const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔍 VÉRIFICATION COMPLÈTE DES IMAGES\n');

// 1. Vérifier l'image de fond
const bgImagePath = path.join(__dirname, '..', 'public', 'assets', 'img', 'hero', 'chauffeur-luxe-background.webp');
if (fs.existsSync(bgImagePath)) {
  const stats = fs.statSync(bgImagePath);
  console.log(`✅ Image de fond trouvée: ${bgImagePath}`);
  console.log(`   Taille: ${(stats.size / 1024 / 1024).toFixed(2)} MB\n`);
} else {
  console.log(`❌ Image de fond MANQUANTE: ${bgImagePath}\n`);
}

// 2. Lister toutes les images dans public/assets/img
const publicImgDir = path.join(__dirname, '..', 'public', 'assets', 'img');
const existingImages = new Set();

function listImages(dir, basePath = '') {
  const fullPath = path.join(dir, basePath);
  if (!fs.existsSync(fullPath)) return;
  
  const items = fs.readdirSync(fullPath);
  items.forEach(item => {
    const itemPath = path.join(fullPath, item);
    const stat = fs.statSync(itemPath);
    if (stat.isDirectory()) {
      listImages(dir, path.join(basePath, item));
    } else if (/\.(jpg|jpeg|png|webp|svg)$/i.test(item)) {
      const relativePath = `/assets/img/${path.join(basePath, item).replace(/\\/g, '/')}`;
      existingImages.add(relativePath);
    }
  });
}

listImages(publicImgDir);
console.log(`📊 Total images trouvées: ${existingImages.size}\n`);

// 3. Chercher toutes les références d'images dans les fichiers Astro
const astroFiles = glob.sync('src/**/*.astro', { cwd: path.join(__dirname, '..') });
const cssFiles = glob.sync('src/**/*.css', { cwd: path.join(__dirname, '..') });

const imageReferences = [];
const missingImages = [];

// Patterns pour trouver les images
const patterns = [
  /src=["']([^"']+\.(jpg|jpeg|png|webp|svg))["']/gi,
  /srcset=["']([^"']+\.(jpg|jpeg|png|webp|svg))["']/gi,
  /href=["']([^"']+\.(jpg|jpeg|png|webp|svg))["']/gi,
  /url\(["']?([^"')]+\.(jpg|jpeg|png|webp|svg))["']?\)/gi,
  /background-image:\s*url\(["']?([^"')]+\.(jpg|jpeg|png|webp|svg))["']?\)/gi,
];

function findImagesInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      let imgPath = match[1];
      // Normaliser le chemin
      if (imgPath.startsWith('/assets/img/')) {
        imageReferences.push({
          file: filePath,
          path: imgPath
        });
        
        if (!existingImages.has(imgPath)) {
          missingImages.push({
            file: filePath,
            path: imgPath
          });
        }
      }
    }
  });
}

// Analyser tous les fichiers
[...astroFiles, ...cssFiles].forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  if (fs.existsSync(fullPath)) {
    findImagesInFile(fullPath);
  }
});

// 4. Rapport
console.log('📋 RAPPORT DES IMAGES\n');
console.log(`✅ Images référencées: ${imageReferences.length}`);
console.log(`❌ Images manquantes: ${missingImages.length}\n`);

if (missingImages.length > 0) {
  console.log('🚨 IMAGES MANQUANTES:\n');
  missingImages.forEach(({ file, path: imgPath }) => {
    console.log(`   ❌ ${imgPath}`);
    console.log(`      Référencée dans: ${file}\n`);
  });
} else {
  console.log('✅ Toutes les images référencées existent !\n');
}

// 5. Vérifier les images les plus importantes
const criticalImages = [
  '/assets/img/hero/chauffeur-luxe-background.webp',
  '/assets/img/hero/hero-aeroport-nice.webp',
  '/assets/img/destinations/vtc-tesla-nice.jpg',
  '/assets/img/destinations/vtc-tesla-cannes.jpg',
  '/assets/img/destinations/vtc-tesla-monaco.jpg',
];

console.log('🎯 IMAGES CRITIQUES:\n');
criticalImages.forEach(imgPath => {
  const fullPath = path.join(__dirname, '..', 'public', imgPath);
  if (fs.existsSync(fullPath)) {
    console.log(`   ✅ ${imgPath}`);
  } else {
    console.log(`   ❌ ${imgPath} - MANQUANTE`);
  }
});

console.log('\n✅ Vérification terminée\n');

