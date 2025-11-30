const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Trouver toutes les pages Astro
const astroFiles = glob.sync('src/pages/**/*.astro', { cwd: __dirname + '/..' });

const imageReferences = [];
const missingImages = [];
const existingImages = new Set();

// Lister toutes les images existantes dans public/assets/img
function listExistingImages(dir, basePath = '') {
  const fullPath = path.join(__dirname, '..', 'public', 'assets', 'img', basePath);
  if (!fs.existsSync(fullPath)) return;
  
  const items = fs.readdirSync(fullPath);
  items.forEach(item => {
    const itemPath = path.join(fullPath, item);
    const stat = fs.statSync(itemPath);
    if (stat.isDirectory()) {
      listExistingImages(dir, path.join(basePath, item));
    } else {
      const relativePath = `/assets/img/${path.join(basePath, item).replace(/\\/g, '/')}`;
      existingImages.add(relativePath);
    }
  });
}

listExistingImages();

// Extraire les références d'images des fichiers Astro
astroFiles.forEach(file => {
  const content = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  
  // Trouver toutes les références d'images
  const patterns = [
    /src=["']([^"']+\.(jpg|jpeg|png|webp|svg))["']/gi,
    /srcset=["']([^"']+\.(jpg|jpeg|png|webp|svg))["']/gi,
    /href=["']([^"']+\.(jpg|jpeg|png|webp|svg))["']/gi,
  ];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      let imgPath = match[1];
      if (imgPath.startsWith('/assets/img/')) {
        imageReferences.push({
          file,
          path: imgPath
        });
        
        if (!existingImages.has(imgPath)) {
          missingImages.push({
            file,
            path: imgPath
          });
        }
      }
    }
  });
});

console.log('\n📊 ANALYSE DES IMAGES\n');
console.log(`Total images référencées: ${imageReferences.length}`);
console.log(`Images existantes: ${existingImages.size}`);
console.log(`Images manquantes: ${missingImages.length}\n`);

if (missingImages.length > 0) {
  console.log('❌ IMAGES MANQUANTES:\n');
  const grouped = {};
  missingImages.forEach(({ file, path: imgPath }) => {
    if (!grouped[imgPath]) {
      grouped[imgPath] = [];
    }
    grouped[imgPath].push(file);
  });
  
  Object.keys(grouped).sort().forEach(imgPath => {
    console.log(`  ${imgPath}`);
    console.log(`    Utilisé dans: ${grouped[imgPath].join(', ')}`);
  });
} else {
  console.log('✅ Toutes les images référencées existent !');
}

// Générer un rapport JSON
const report = {
  totalReferences: imageReferences.length,
  totalExisting: existingImages.size,
  missing: missingImages,
  timestamp: new Date().toISOString()
};

fs.writeFileSync(
  path.join(__dirname, '..', 'image-check-report.json'),
  JSON.stringify(report, null, 2)
);

console.log('\n📄 Rapport sauvegardé: image-check-report.json\n');

