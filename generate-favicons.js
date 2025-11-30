const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Dossier de sortie
const outputDir = path.join(__dirname, 'assets', 'img', 'favicon');

// Créer le dossier de sortie s'il n'existe pas
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Configuration des tailles d'icônes à générer
const iconSizes = [
  { name: 'favicon', size: 32, format: 'png' },
  { name: 'favicon-16x16', size: 16, format: 'png' },
  { name: 'favicon-32x32', size: 32, format: 'png' },
  { name: 'apple-touch-icon', size: 180, format: 'png' },
  { name: 'android-chrome-192x192', size: 192, format: 'png' },
  { name: 'android-chrome-512x512', size: 512, format: 'png' },
  { name: 'mstile-70x70', size: 70, format: 'png' },
  { name: 'mstile-144x144', size: 144, format: 'png' },
  { name: 'mstile-150x150', size: 150, format: 'png' },
  { name: 'mstile-310x310', size: 310, format: 'png' },
];

// Chemin du fichier SVG source
const svgPath = path.join(outputDir, 'favicon.svg');

// Générer les icônes
async function generateIcons() {
  try {
    // Lire le fichier SVG
    const svg = fs.readFileSync(svgPath);
    
    // Générer chaque taille d'icône
    for (const icon of iconSizes) {
      const outputPath = path.join(outputDir, `${icon.name}.${icon.format}`);
      
      await sharp(svg)
        .resize(icon.size, icon.size)
        .toFormat(icon.format, {
          quality: 90,
          compressionLevel: 9,
        })
        .toFile(outputPath);
      
      console.log(`Généré: ${outputPath}`);
    }
    
    // Générer le favicon.ico (spécial)
    // D'abord créer un PNG, puis le convertir en ICO
    const icoPngPath = path.join(outputDir, 'favicon-temp.png');
    await sharp(svg)
      .resize(32, 32)
      .toFile(icoPngPath);
    
    console.log('Généré: ' + icoPngPath);
    console.log('Note: Le fichier favicon.ico doit être généré manuellement à partir du fichier favicon-32x32.png en utilisant un convertisseur en ligne.');
    
    console.log('\nTous les favicons ont été générés avec succès !');
  } catch (error) {
    console.error('Erreur lors de la génération des favicons:', error);
    process.exit(1);
  }
}

// Exécuter la génération
generateIcons();
