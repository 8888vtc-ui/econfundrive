/**
 * Script pour vérifier toutes les images référencées dans le code
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const publicDir = path.join(__dirname, '../public');
const srcDir = path.join(__dirname, '../src');

// Extraire tous les chemins d'images du code
function extractImagePaths(content) {
  const patterns = [
    /src=["']([^"']+\.(jpg|jpeg|png|webp|avif|svg))["']/gi,
    /image=["']([^"']+\.(jpg|jpeg|png|webp|avif|svg))["']/gi,
    /href=["']([^"']+\.(jpg|jpeg|png|webp|avif|svg))["']/gi,
    /url\(["']?([^"')]+\.(jpg|jpeg|png|webp|avif|svg))["']?\)/gi,
    /background-image:\s*url\(["']?([^"')]+\.(jpg|jpeg|png|webp|avif|svg))["']?\)/gi,
  ];

  const images = new Set();
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      let imgPath = match[1];
      // Nettoyer le chemin
      if (imgPath.startsWith('/')) {
        imgPath = imgPath.substring(1);
      }
      if (imgPath.startsWith('assets/') || imgPath.startsWith('/assets/')) {
        images.add(imgPath.replace(/^\/+/, ''));
      }
    }
  });

  return Array.from(images);
}

// Vérifier si un fichier existe
function fileExists(filePath) {
  const fullPath = path.join(publicDir, filePath);
  return fs.existsSync(fullPath);
}

// Traiter tous les fichiers .astro
const astroFiles = glob.sync('**/*.astro', { 
  cwd: srcDir,
  absolute: true 
});

console.log(`\n🔍 Vérification des images dans ${astroFiles.length} fichiers...\n`);

const allImages = new Set();
const missingImages = [];
const existingImages = [];

astroFiles.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const images = extractImagePaths(content);
    images.forEach(img => allImages.add(img));
  } catch (error) {
    console.error(`Erreur lecture ${file}:`, error.message);
  }
});

console.log(`📸 ${allImages.size} images uniques trouvées dans le code\n`);

// Vérifier chaque image
allImages.forEach(imgPath => {
  if (fileExists(imgPath)) {
    existingImages.push(imgPath);
  } else {
    missingImages.push(imgPath);
  }
});

// Afficher les résultats
console.log(`✅ Images existantes: ${existingImages.length}`);
console.log(`❌ Images manquantes: ${missingImages.length}\n`);

if (missingImages.length > 0) {
  console.log('❌ IMAGES MANQUANTES:\n');
  missingImages.forEach(img => {
    console.log(`   - ${img}`);
  });
  console.log('');
}

// Vérifier aussi les images dans le dossier public qui ne sont pas utilisées
const allPublicImages = glob.sync('**/*.{jpg,jpeg,png,webp,avif,svg}', {
  cwd: publicDir,
  absolute: false
});

const unusedImages = allPublicImages.filter(img => {
  const normalized = img.replace(/\\/g, '/');
  return !allImages.has(normalized);
});

if (unusedImages.length > 0 && unusedImages.length < 50) {
  console.log(`\n📦 Images non utilisées (${unusedImages.length}):\n`);
  unusedImages.slice(0, 20).forEach(img => {
    console.log(`   - ${img}`);
  });
  if (unusedImages.length > 20) {
    console.log(`   ... et ${unusedImages.length - 20} autres`);
  }
}

// Résumé
console.log(`\n📊 RÉSUMÉ:`);
console.log(`   Total images dans le code: ${allImages.size}`);
console.log(`   Images existantes: ${existingImages.length} ✅`);
console.log(`   Images manquantes: ${missingImages.length} ${missingImages.length > 0 ? '❌' : '✅'}`);
console.log(`   Images dans public/: ${allPublicImages.length}`);
console.log(`   Images non utilisées: ${unusedImages.length}\n`);

if (missingImages.length === 0) {
  console.log('✅ Toutes les images référencées existent !\n');
  process.exit(0);
} else {
  console.log('❌ Certaines images sont manquantes. Vérifiez les chemins ci-dessus.\n');
  process.exit(1);
}
