/**
 * Script pour convertir les images PNG en WebP pour optimisation
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Liste des images à convertir (basée sur le rapport de génération)
const imagesToConvert = [
  // Hero
  'public/assets/img/hero/hero-aeroport-nice.png',
  'public/assets/img/hero/hero-business.png',
  'public/assets/img/hero/hero-mariage.png',
  
  // Destinations
  'public/assets/img/destinations/destination-nice.png',
  'public/assets/img/destinations/destination-cannes.png',
  'public/assets/img/destinations/destination-monaco.png',
  'public/assets/img/destinations/destination-saint-tropez.png',
  'public/assets/img/destinations/nice-vieux-nice.png',
  'public/assets/img/destinations/cannes-palais-festivals.png',
  'public/assets/img/destinations/monaco-casino.png',
  'public/assets/img/destinations/saint-tropez-port.png',
  
  // Services
  'public/assets/img/services/service-aeroport.png',
  'public/assets/img/services/service-business.png',
  'public/assets/img/services/service-mariage.png',
  'public/assets/img/services/service-evenements.png',
  'public/assets/img/services/service-mise-disposition.png',
  
  // Guides
  'public/assets/img/guides/route-panoramique-nice-eze-monaco.png',
  'public/assets/img/guides/villages-perches.png',
  'public/assets/img/guides/grand-prix-monaco.png',
  
  // À Propos
  'public/assets/img/about/chauffeur-professionnel.png',
  'public/assets/img/about/vehicule-premium.png'
];

async function convertToWebP(pngPath) {
  const webpPath = pngPath.replace('.png', '.webp');
  const fullPngPath = path.join(process.cwd(), pngPath);
  const fullWebpPath = path.join(process.cwd(), webpPath);
  
  if (!fs.existsSync(fullPngPath)) {
    console.log(`⚠️  Fichier non trouvé: ${pngPath}`);
    return { success: false, error: 'Fichier non trouvé' };
  }
  
  try {
    const stats = fs.statSync(fullPngPath);
    const originalSize = (stats.size / 1024 / 1024).toFixed(2);
    
    await sharp(fullPngPath)
      .webp({ quality: 85, effort: 6 })
      .toFile(fullWebpPath);
    
    const webpStats = fs.statSync(fullWebpPath);
    const webpSize = (webpStats.size / 1024 / 1024).toFixed(2);
    const reduction = ((1 - webpStats.size / stats.size) * 100).toFixed(1);
    
    return {
      success: true,
      originalSize,
      webpSize,
      reduction,
      path: webpPath
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function convertAllImages() {
  console.log('🔄 CONVERSION PNG → WEBP');
  console.log(`📊 Total: ${imagesToConvert.length} images à convertir\n`);
  
  const results = [];
  
  for (let i = 0; i < imagesToConvert.length; i++) {
    const image = imagesToConvert[i];
    console.log(`[${i + 1}/${imagesToConvert.length}] 🔄 Conversion: ${path.basename(image)}`);
    
    const result = await convertToWebP(image);
    results.push({ image, ...result });
    
    if (result.success) {
      console.log(`  ✅ ${result.originalSize} MB → ${result.webpSize} MB (${result.reduction}% de réduction)`);
    } else {
      console.log(`  ❌ Erreur: ${result.error}`);
    }
  }
  
  // Rapport
  console.log('\n' + '='.repeat(60));
  console.log('📊 RAPPORT DE CONVERSION');
  console.log('='.repeat(60));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  const totalOriginal = successful.reduce((sum, r) => sum + parseFloat(r.originalSize), 0);
  const totalWebp = successful.reduce((sum, r) => sum + parseFloat(r.webpSize), 0);
  const totalReduction = ((1 - totalWebp / totalOriginal) * 100).toFixed(1);
  
  console.log(`\n✅ Converties: ${successful.length}/${imagesToConvert.length}`);
  console.log(`❌ Échouées: ${failed.length}/${imagesToConvert.length}`);
  console.log(`\n📊 Taille totale:`);
  console.log(`  PNG: ${totalOriginal.toFixed(2)} MB`);
  console.log(`  WebP: ${totalWebp.toFixed(2)} MB`);
  console.log(`  Réduction: ${totalReduction}%`);
  
  if (failed.length > 0) {
    console.log('\n❌ CONVERSIONS ÉCHOUÉES:');
    failed.forEach((r, i) => {
      console.log(`  ${i + 1}. ${path.basename(r.image)} - ${r.error}`);
    });
  }
  
  console.log('\n🎉 CONVERSION TERMINÉE !');
  console.log('\n💡 Les fichiers PNG peuvent être supprimés si vous le souhaitez.');
}

if (require.main === module) {
  convertAllImages()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Erreur fatale:', error);
      process.exit(1);
    });
}

module.exports = { convertAllImages, convertToWebP };

