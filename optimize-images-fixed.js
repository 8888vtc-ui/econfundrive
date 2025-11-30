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
  extensions: ['.jpg', '.jpeg', '.png']
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
    const nameWithoutExt = path.basename(srcPath, path.extname(srcPath));
    
    // Ignorer les fichiers déjà optimisés
    if (destDir.includes('optimized') || filename.includes('optimized')) {
      console.log(`Ignoré (déjà optimisé) : ${filename}`);
      return;
    }

    console.log(`Traitement de ${filename}...`);
    
    // Lire les métadonnées de l'image
    const metadata = await sharp(srcPath).metadata();
    const size = getSize(metadata);
    
    // Créer le nom de fichier de destination
    const destFilename = `${nameWithoutExt}.webp`;
    const destPath = path.join(destDir, destFilename);
    
    // Créer le dossier de destination s'il n'existe pas
    await ensureDir(destDir);
    
    // Optimiser et redimensionner l'image
    await sharp(srcPath)
      .resize({
        width: config.sizes[size],
        height: Math.round(metadata.height * (config.sizes[size] / metadata.width)),
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ 
        quality: config.quality,
        alphaQuality: config.quality
      })
      .toFile(destPath);
      
    console.log(`✓ ${filename} optimisé en ${size} (${destFilename})`);
    
  } catch (error) {
    console.error(`Erreur lors de l'optimisation de ${srcPath}:`, error.message);
  }
}

// Parcourir les fichiers d'un dossier
async function processDirectory(dir, relativePath = '') {
  try {
    const items = await readdir(dir);
    const destDir = path.join(config.destDir, relativePath);
    
    // Créer le dossier de destination correspondant
    await ensureDir(destDir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const itemStat = await stat(fullPath);
      
      if (itemStat.isDirectory()) {
        // Ignorer le dossier d'optimisation
        if (item === 'optimized') continue;
        
        // Traiter le sous-dossier
        await processDirectory(
          fullPath, 
          path.join(relativePath, item)
        );
      } else if (isImage(item)) {
        // Optimiser l'image
        await optimizeImage(fullPath, destDir);
      }
    }
  } catch (error) {
    console.error(`Erreur lors du traitement du dossier ${dir}:`, error.message);
  }
}

// Fonction principale
async function main() {
  try {
    console.log('Début de l\'optimisation des images...');
    console.log('Source :', config.srcDir);
    console.log('Destination :', config.destDir);
    
    // Vérifier que le dossier source existe
    try {
      await stat(config.srcDir);
    } catch (error) {
      console.error(`Le dossier source n'existe pas : ${config.srcDir}`);
      process.exit(1);
    }
    
    // Créer le dossier de destination
    await ensureDir(config.destDir);
    
    // Démarrer le traitement
    await processDirectory(config.srcDir);
    
    console.log('\nOptimisation terminée avec succès !');
    console.log(`Les images optimisées sont disponibles dans : ${config.destDir}`);
    
  } catch (error) {
    console.error('Une erreur est survenue :', error);
    process.exit(1);
  }
}

// Démarrer le processus
main();
