const fs = require('fs');
const path = require('path');

// Configuration de la structure des dossiers
const imageStructure = {
  'assets/img/hero': [
    'hero-aeroport-nice.webp',
    'hero-business.webp',
    'hero-vtc-nice-cannes.jpg',
    'hero-vtc-tesla-cannes.jpg',
    'hero-vtc-tesla-monaco.jpg',
    'hero-vtc-tesla-nice.jpg',
    'hero-plage-beau-rivage-nice.jpg',
    'hero-club-55-saint-tropez.jpg',
    'hero-hotel-metropole-monaco.jpg',
    'hero-hotel-negresco-nice.jpg',
    'hero-nikki-beach-saint-tropez.jpg',
    'hero-tahiti-beach-saint-tropez.jpg'
  ],
  'assets/img/destinations': [
    'nice-aeroport.webp',
    'cannes-croisette.webp',
    'monaco-casino.webp',
    'saint-tropez-port.webp',
    'saint-maxime-plage.webp',
    'fréjus-ville.webp'
  ],
  'assets/img/services': [
    'service-aeroport.webp',
    'service-business.webp',
    'service-evenements.webp',
    'service-tourisme.webp',
    'service-nuit.webp',
    'service-mariage.webp'
  ],
  'assets/img/vehicules': [
    'mercedes-classe-e.webp',
    'tesla-model-s.webp',
    'mercedes-v-class.webp',
    'interieur-luxe.webp'
  ]
};

// Fonction pour créer les dossiers s'ils n'existent pas
function createDirectories() {
  Object.keys(imageStructure).forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Dossier créé : ${dirPath}`);
    }
  });
}

// Fonction pour déplacer les fichiers existants
function organizeExistingImages() {
  const sourceDirs = [
    'assets/img/fr/hero',
    'assets/img/fr/home',
    'assets/img/shared',
    'assets/img/authority'
  ];

  sourceDirs.forEach(sourceDir => {
    const fullSourcePath = path.join(__dirname, sourceDir);
    if (fs.existsSync(fullSourcePath)) {
      const files = fs.readdirSync(fullSourcePath);
      
      files.forEach(file => {
        const sourceFile = path.join(fullSourcePath, file);
        
        // Vérifier si c'est un fichier image
        if (fs.statSync(sourceFile).isFile() && /\.(jpg|jpeg|png|webp)$/i.test(file)) {
          // Trouver la destination appropriée
          let destinationDir = '';
          
          if (file.includes('aeroport') || file.includes('business')) {
            destinationDir = 'assets/img/hero';
          } else if (file.includes('cannes') || file.includes('nice') || file.includes('monaco') || file.includes('saint-tropez')) {
            destinationDir = 'assets/img/destinations';
          } else if (file.includes('service')) {
            destinationDir = 'assets/img/services';
          } else if (file.includes('tesla') || file.includes('mercedes') || file.includes('interieur')) {
            destinationDir = 'assets/img/vehicules';
          } else {
            destinationDir = 'assets/img/hero'; // Par défaut
          }
          
          const destFile = path.join(__dirname, destinationDir, file.toLowerCase().replace(/[^a-z0-9.\-]/g, '-'));
          
          try {
            fs.renameSync(sourceFile, destFile);
            console.log(`Déplacé : ${sourceFile} -> ${destFile}`);
          } catch (err) {
            console.error(`Erreur lors du déplacement de ${sourceFile}:`, err);
          }
        }
      });
    }
  });
}

// Exécution
console.log('Création de la structure des dossiers...');
createDirectories();

console.log('\nOrganisation des images existantes...');
organizeExistingImages();

console.log('\nOrganisation terminée !');
