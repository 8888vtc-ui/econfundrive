const fs = require('fs');
const path = require('path');
const https = require('https');

// Créer les dossiers nécessaires
const imageDirs = [
  'assets/img/hero/authority',
  'assets/img/destinations/authority'
];

imageDirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Images à télécharger avec leurs URLs Pexels
const imagesToDownload = [
  {
    url: 'https://images.pexels.com/photos/112452/pexels-photo-112452.jpeg',
    dest: 'assets/img/hero/authority/monaco-private-driver.webp',
    description: 'Luxury car in Monaco at night'
  },
  {
    url: 'https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg',
    dest: 'assets/img/hero/authority/nice-cannes-.webp',
    description: 'Coastal road between Nice and Cannes'
  },
  {
    url: 'https://images.pexels.com/photos/210182/pexels-photo-210182.jpeg',
    dest: 'assets/img/destinations/authority/monaco-private-driver.webp',
    description: 'Luxury car in Monaco'
  },
  {
    url: 'https://images.pexels.com/photos/1320686/pexels-photo-1320686.jpeg',
    dest: 'assets/img/destinations/authority/nice-cannes-.webp',
    description: 'Coastal view between Nice and Cannes'
  }
];

// Fonction pour télécharger une image
function downloadImage(url, dest, callback) {
  const file = fs.createWriteStream(dest);
  
  https.get(url, response => {
    response.pipe(file);
    file.on('finish', () => {
      file.close(callback);
    });  
  }).on('error', err => {
    fs.unlink(dest, () => {}); // Supprimer le fichier en cas d'erreur
    console.error(`❌ Erreur lors du téléchargement de ${url}: ${err.message}`);
  });
}

// Télécharger toutes les images
console.log('📥 Téléchargement des images manquantes...');

let downloaded = 0;
imagesToDownload.forEach((image, index) => {
  const destPath = path.join(__dirname, image.dest);
  
  // Vérifier si le fichier existe déjà
  if (fs.existsSync(destPath)) {
    console.log(`ℹ️ L'image existe déjà : ${image.dest}`);
    downloaded++;
    return;
  }
  
  console.log(`⬇️  Téléchargement de ${image.dest}...`);
  
  downloadImage(image.url, destPath, () => {
    console.log(`✅ Téléchargement réussi : ${image.dest}`);
    downloaded++;
    
    // Vérifier si toutes les images ont été téléchargées
    if (downloaded === imagesToDownload.length) {
      console.log('🎉 Toutes les images ont été téléchargées avec succès !');
      
      // Mettre à jour les références dans les fichiers HTML
      updateHtmlFiles();
    }
  });
});

// Fonction pour mettre à jour les références dans les fichiers HTML
function updateHtmlFiles() {
  console.log('\n🔄 Mise à jour des références dans les fichiers HTML...');
  
  // Liste des fichiers HTML à mettre à jour
  const htmlFiles = [
    'vtc-monaco.html',
    'services.html',
    'fr/hero/authority/monaco-private-driver.webp',
    'fr/hero/authority/nice-cannes-.webp'
  ];
  
  htmlFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    
    if (fs.existsSync(filePath)) {
      try {
        let content = fs.readFileSync(filePath, 'utf8');
        let updated = false;
        
        // Mettre à jour les chemins d'images
        const pathMappings = [
          { old: 'authority/monaco-private-driver.webp', new: 'hero/authority/monaco-private-driver.webp' },
          { old: 'authority/nice-cannes-.webp', new: 'hero/authority/nice-cannes-.webp' }
        ];
        
        pathMappings.forEach(mapping => {
          if (content.includes(mapping.old)) {
            content = content.replace(
              new RegExp(mapping.old, 'g'),
              mapping.new
            );
            updated = true;
          }
        });
        
        if (updated) {
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`✅ Fichier mis à jour : ${file}`);
        } else {
          console.log(`ℹ️ Aucune modification nécessaire pour : ${file}`);
        }
      } catch (error) {
        console.error(`❌ Erreur lors de la mise à jour de ${file}:`, error.message);
      }
    } else {
      console.log(`⚠️ Fichier non trouvé : ${file}`);
    }
  });
  
  console.log('\n✅ Tâche terminée ! Les images ont été téléchargées et les fichiers HTML mis à jour.');
  console.log('🔄 Vous pouvez maintenant rafraîchir votre navigateur pour voir les changements.');
}
