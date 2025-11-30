const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const mkdir = promisify(fs.mkdir);

// Configuration
const config = {
  // Dossiers source et destination
  srcDir: path.join(__dirname, 'assets', 'img'),
  destDir: path.join(__dirname, 'assets', 'img', 'optimized'),
  
  // Qualité des images (0-100)
  quality: 80,
  
  // Tailles maximales (largeur en pixels)
  sizes: {
    small: 400,
    medium: 800,
    large: 1200,
    xlarge: 1920
  },
  
  // Extensions des fichiers à traiter
  extensions: ['.jpg', '.jpeg', '.png', '.webp']
};

// Créer le dossier de destination s'il n'existe pas
async function ensureDir(dir) {
  try {
    await mkdir(dir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

// Vérifier si le fichier est une image
function isImage(file) {
  const ext = path.extname(file).toLowerCase();
  return config.extensions.includes(ext);
}

// Obtenir la taille appropriée pour une image
function getSize(dimensions) {
  const width = dimensions.width;
  if (width <= config.sizes.small) return 'small';
  if (width <= config.sizes.medium) return 'medium';
  if (width <= config.sizes.large) return 'large';
  return 'xlarge';
}

// Optimiser une image
async function optimizeImage(srcPath, destDir) {
  try {
    const filename = path.basename(srcPath);
    const ext = path.extname(filename).toLowerCase();
    const name = path.basename(filename, ext);
    
    // Lire les métadonnées de l'image
    const metadata = await sharp(srcPath).metadata();
    const size = getSize(metadata);
    
    // Créer le nom du fichier de sortie
    const webpFilename = `${name}.webp`;
    const destPath = path.join(destDir, webpFilename);
    
    console.log(`Optimisation de ${filename} (${size})...`);
    
    // Optimiser l'image en WebP
    await sharp(srcPath)
      .resize({
        width: Math.min(metadata.width, config.sizes[size]),
        height: Math.min(metadata.height, config.sizes[size]),
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ 
        quality: config.quality,
        alphaQuality: 80,
        force: false
      })
      .toFile(destPath);
    
    console.log(`✓ ${webpFilename} créé`);
    
    return {
      original: filename,
      optimized: webpFilename,
      size: size,
      originalSize: (metadata.size / 1024).toFixed(2) + ' KB',
      optimizedSize: (fs.statSync(destPath).size / 1024).toFixed(2) + ' KB'
    };
  } catch (err) {
    console.error(`Erreur lors de l'optimisation de ${srcPath}:`, err);
    return null;
  }
}

// Parcourir récursivement les dossiers
async function processDirectory(dir, relativePath = '') {
  const results = [];
  const items = await readdir(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stats = await stat(fullPath);
    const relPath = path.join(relativePath, item);
    
    if (stats.isDirectory()) {
      // Créer le dossier de destination correspondant
      const destDir = path.join(config.destDir, relPath);
      await ensureDir(destDir);
      
      // Traiter le sous-dossier
      const subResults = await processDirectory(fullPath, relPath);
      results.push(...subResults);
    } else if (isImage(item)) {
      // Traiter le fichier image
      const destDir = path.join(config.destDir, relativePath);
      const result = await optimizeImage(fullPath, destDir);
      if (result) {
        results.push({
          ...result,
          path: relPath
        });
      }
    }
  }
  
  return results;
}

// Fonction principale
async function main() {
  console.log('Début de l\'optimisation des images...');
  console.log('Source :', config.srcDir);
  console.log('Destination :', config.destDir);
  
  try {
    // Vérifier que le dossier source existe
    await stat(config.srcDir);
    
    // Créer le dossier de destination
    await ensureDir(config.destDir);
    
    // Traiter les images
    const results = await processDirectory(config.srcDir);
    
    // Afficher un résumé
    console.log('\nRésumé de l\'optimisation :');
    console.log('------------------------');
    
    let totalOriginal = 0;
    let totalOptimized = 0;
    
    results.forEach(result => {
      const original = parseFloat(result.originalSize);
      const optimized = parseFloat(result.optimizedSize);
      const reduction = ((original - optimized) / original * 100).toFixed(2);
      
      console.log(`${result.original} -> ${result.optimized} (${result.size})`);
      console.log(`  ${result.originalSize} -> ${result.optimizedSize} (${reduction}% de réduction)`);
      
      totalOriginal += original;
      totalOptimized += optimized;
    });
    
    const totalReduction = ((totalOriginal - totalOptimized) / totalOriginal * 100).toFixed(2);
    
    console.log('\nTotal :');
    console.log(`  Taille originale : ${totalOriginal.toFixed(2)} KB`);
    console.log(`  Taille optimisée : ${totalOptimized.toFixed(2)} KB`);
    console.log(`  Économie totale : ${(totalOriginal - totalOptimized).toFixed(2)} KB (${totalReduction}%)`);
    
    console.log('\nOptimisation terminée avec succès !');
    
  } catch (err) {
    console.error('Erreur :', err);
    process.exit(1);
  }
}

// Démarrer le processus
main();
