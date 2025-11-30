const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const sharp = require('sharp');

// Configuration
const IMG_DIR = path.join(__dirname, 'assets', 'img');
const OPTIMIZED_DIR = path.join(IMG_DIR, 'optimized');

// Créer le dossier optimisé s'il n'existe pas
if (!fs.existsSync(OPTIMIZED_DIR)) {
  fs.mkdirSync(OPTIMIZED_DIR, { recursive: true });
}

// Fonction pour optimiser une image
async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const fileName = path.basename(filePath);
  const optimizedPath = path.join(OPTIMIZED_DIR, fileName.replace(/\.[^/.]+$/, '.webp'));

  try {
    // Utiliser sharp pour optimiser et convertir en WebP
    await sharp(filePath)
      .webp({ quality: 80, effort: 6 })
      .toFile(optimizedPath);
    
    return {
      original: fileName,
      optimized: path.basename(optimizedPath),
      status: 'optimized',
      originalSize: (fs.statSync(filePath).size / 1024).toFixed(2) + ' KB',
      optimizedSize: (fs.statSync(optimizedPath).size / 1024).toFixed(2) + ' KB'
    };
  } catch (error) {
    console.error(`Erreur lors de l'optimisation de ${filePath}:`, error);
    return {
      original: fileName,
      optimized: null,
      status: 'error',
      error: error.message
    };
  }
}

// Fonction pour trouver tous les fichiers image
async function findImageFiles(dir, fileList = []) {
  const files = await readdir(dir);
  
  for (const file of files) {
    if (file === 'optimized') continue; // Ignorer le dossier optimisé
    
    const filePath = path.join(dir, file);
    const fileStat = await stat(filePath);

    if (fileStat.isDirectory()) {
      await findImageFiles(filePath, fileList);
    } else if (/\.(jpg|jpeg|png|webp)$/i.test(file)) {
      fileList.push(filePath);
    }
  }

  return fileList;
}

// Fonction pour mettre à jour les références dans les fichiers HTML
async function updateHtmlReferences() {
  const htmlFiles = await findHtmlFiles(__dirname);
  
  for (const file of htmlFiles) {
    try {
      let content = await readFile(file, 'utf8');
      let updated = false;

      // Mettre à jour les balises img
      content = content.replace(
        /<img([^>]*)src=["']([^"']*\.(?:jpg|jpeg|png|webp))["']([^>]*)>/gi,
        (match, before, imgPath, after) => {
          if (!imgPath.includes('optimized') && !imgPath.startsWith('http')) {
            const newPath = imgPath.replace(/\.[^/.]+$/, '.webp').replace('/assets/img/', '/assets/img/optimized/');
            updated = true;
            return `<img${before}src="${newPath}"${after.replace(/loading=["'][^"']*["']/gi, '')} loading="lazy">`;
          }
          return match;
        }
      );

      // Mettre à jour les balises source dans picture
      content = content.replace(
        /<source[^>]*srcset=["']([^"']*\.(?:jpg|jpeg|png|webp))["'][^>]*>/gi,
        (match, imgPath) => {
          if (!imgPath.includes('optimized') && !imgPath.startsWith('http')) {
            const newPath = imgPath.replace(/\.[^/.]+$/, '.webp').replace('/assets/img/', '/assets/img/optimized/');
            updated = true;
            return match.replace(imgPath, newPath);
          }
          return match;
        }
      );

      if (updated) {
        await writeFile(file, content, 'utf8');
        console.log(`✓ Fichier mis à jour : ${file}`);
      }
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de ${file}:`, error);
    }
  }
}

// Fonction pour trouver tous les fichiers HTML
async function findHtmlFiles(dir, fileList = []) {
  const ignoreDirs = ['node_modules', '.git', 'assets'];
  const files = await readdir(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const fileStat = await stat(filePath);

    if (fileStat.isDirectory() && !ignoreDirs.includes(file)) {
      await findHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  }

  return fileList;
}

// Fonction principale
async function main() {
  console.log('Début de l\'optimisation des images...');
  
  // 1. Trouver toutes les images
  const imgFiles = await findImageFiles(IMG_DIR);
  console.log(`\n${imgFiles.length} images trouvées.`);
  
  // 2. Optimiser les images
  const results = [];
  for (const file of imgFiles) {
    const result = await optimizeImage(file);
    results.push(result);
    
    if (result.status === 'optimized') {
      console.log(`✓ Optimisé : ${result.original} (${result.originalSize}) -> ${result.optimized} (${result.optimizedSize})`);
    } else if (result.status === 'error') {
      console.error(`✗ Erreur avec ${result.original}: ${result.error}`);
    }
  }

  // 3. Mettre à jour les références dans les fichiers HTML
  console.log('\nMise à jour des références dans les fichiers HTML...');
  await updateHtmlReferences();

  // Afficher un résumé
  const optimizedCount = results.filter(r => r.status === 'optimized').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  const totalOriginalSize = results
    .filter(r => r.originalSize)
    .reduce((sum, r) => sum + parseFloat(r.originalSize), 0);
  const totalOptimizedSize = results
    .filter(r => r.optimizedSize)
    .reduce((sum, r) => sum + parseFloat(r.optimizedSize), 0);
  const reduction = ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(2);

  console.log('\nRésumé de l\'optimisation :');
  console.log('------------------------');
  console.log(`- Images optimisées : ${optimizedCount}`);
  console.log(`- Erreurs : ${errorCount}`);
  console.log(`- Taille totale originale : ${totalOriginalSize.toFixed(2)} KB`);
  console.log(`- Taille totale optimisée : ${totalOptimizedSize.toFixed(2)} KB`);
  console.log(`- Économie totale : ${(totalOriginalSize - totalOptimizedSize).toFixed(2)} KB (${reduction}%)`);
  console.log('\nOptimisation terminée avec succès !');
}

// Démarrer le processus
main().catch(console.error);
