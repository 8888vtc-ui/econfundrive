const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Structure cible propre
const targetStructure = {
  'hero': [
    'hero-main.webp',
    'hero-business.webp',
    'nice-hero-1.webp',
    'nice-hero-2.webp',
    'cannes-hero-1.webp',
    'cannes-hero-2.webp',
    'monaco-hero-1.webp',
    'monaco-hero-2.webp',
    'saint-tropez-hero-1.webp',
    'saint-tropez-hero-2.webp'
  ],
  'destinations': [
    'nice-destination.webp',
    'cannes-destination.webp',
    'monaco-destination.webp',
    'saint-tropez-destination.webp',
    'nice-destination-1.webp',
    'nice-destination-2.webp',
    'cannes-destination-1.webp',
    'cannes-destination-2.webp',
    'monaco-destination-1.webp',
    'monaco-destination-2.webp',
    'saint-tropez-destination-1.webp',
    'saint-tropez-destination-2.webp'
  ],
  'about': [
    'about-chauffeur.webp',
    'about-vehicle.webp',
    'about-certification.webp'
  ],
  'services': [
    'service-airport.webp',
    'service-business.webp',
    'service-wedding.webp'
  ]
};

// Nettoyer les dossiers dupliqués
function cleanDuplicateFolders() {
  const publicImgPath = path.join(__dirname, '..', 'public', 'assets', 'img');
  
  // Supprimer le dossier optimized récursif
  const optimizedPath = path.join(publicImgPath, 'optimized');
  if (fs.existsSync(optimizedPath)) {
    console.log('🗑️  Suppression du dossier optimized récursif...');
    deleteFolderRecursive(optimizedPath);
  }
  
  console.log('✅ Nettoyage terminé');
}

function deleteFolderRecursive(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = path.join(folderPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(folderPath);
  }
}

// Créer la structure cible
function createTargetStructure() {
  const publicImgPath = path.join(__dirname, '..', 'public', 'assets', 'img');
  
  console.log('\n📁 Création de la structure cible...\n');
  
  Object.keys(targetStructure).forEach(folder => {
    const folderPath = path.join(publicImgPath, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(`✅ Créé: ${folder}/`);
    }
  });
  
  console.log('\n✅ Structure créée\n');
}

// Analyser les images utilisées par page
function analyzePageImages() {
  const pages = glob.sync('src/pages/**/*.astro', { cwd: path.join(__dirname, '..') });
  const pageImages = {};
  
  pages.forEach(pageFile => {
    const content = fs.readFileSync(path.join(__dirname, '..', pageFile), 'utf8');
    const pageName = path.basename(pageFile, '.astro');
    
    // Extraire les références d'images
    const imageRefs = [];
    const patterns = [
      /src=["']([^"']+\.(jpg|jpeg|png|webp))["']/gi,
      /srcset=["']([^"']+\.(jpg|jpeg|png|webp))["']/gi
    ];
    
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const imgPath = match[1];
        if (imgPath.startsWith('/assets/img/')) {
          imageRefs.push(imgPath);
        }
      }
    });
    
    if (imageRefs.length > 0) {
      pageImages[pageName] = imageRefs;
    }
  });
  
  return pageImages;
}

// Générer le mapping des images par page
function generateImageMapping() {
  const mapping = {
    'index': {
      hero: ['hero-main.webp'],
      destinations: ['nice-destination.webp', 'cannes-destination.webp', 'monaco-destination.webp', 'saint-tropez-destination.webp']
    },
    'vtc-nice': {
      hero: ['nice-hero-1.webp', 'nice-hero-2.webp'],
      destinations: ['nice-destination-1.webp', 'nice-destination-2.webp']
    },
    'vtc-cannes': {
      hero: ['cannes-hero-1.webp', 'cannes-hero-2.webp'],
      destinations: ['cannes-destination-1.webp', 'cannes-destination-2.webp']
    },
    'vtc-monaco': {
      hero: ['monaco-hero-1.webp', 'monaco-hero-2.webp'],
      destinations: ['monaco-destination-1.webp', 'monaco-destination-2.webp']
    },
    'vtc-saint-tropez': {
      hero: ['saint-tropez-hero-1.webp', 'saint-tropez-hero-2.webp'],
      destinations: ['saint-tropez-destination-1.webp', 'saint-tropez-destination-2.webp']
    },
    'a-propos': {
      about: ['about-chauffeur.webp', 'about-vehicle.webp', 'about-certification.webp']
    },
    'services': {
      services: ['service-airport.webp', 'service-business.webp', 'service-wedding.webp']
    }
  };
  
  return mapping;
}

// Exécuter
console.log('🧹 NETTOYAGE ET RÉORGANISATION DES IMAGES\n');
console.log('='.repeat(50));

cleanDuplicateFolders();
createTargetStructure();

const mapping = generateImageMapping();
fs.writeFileSync(
  path.join(__dirname, '..', 'image-mapping.json'),
  JSON.stringify(mapping, null, 2)
);

console.log('📄 Mapping sauvegardé: image-mapping.json\n');
console.log('✅ Structure prête pour la génération d\'images\n');

