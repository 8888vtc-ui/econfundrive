const fs = require('fs');
const path = require('path');

// Dossier racine du projet
const rootDir = __dirname;

// Mappage des anciens chemins vers les nouveaux chemins
const imagePathMappings = [
  {
    oldPath: /\/assets\/img\/fr\/home\/vtc-nice-berline\.webp/g,
    newPath: '/assets/img/destinations/vtc-tesla-nice.jpg'
  },
  {
    oldPath: /\/assets\/img\/fr\/home\/hero-aeroport-nice\.jpg/g,
    newPath: '/assets/img/hero/hero-aeroport-nice.webp'
  },
  {
    oldPath: /\/assets\/img\/fr\/home\/homepage-riviera-1920w\.webp/g,
    newPath: '/assets/img/hero/homepage-riviera-1920w.webp'
  },
  {
    oldPath: /\/assets\/img\/fr\/home\/hero-business\.webp/g,
    newPath: '/assets/img/hero/hero-business.webp'
  },
  {
    oldPath: /\/assets\/img\/fr\/home\/vtc-tesla-nice\.jpg/g,
    newPath: '/assets/img/destinations/vtc-tesla-nice.jpg'
  },
  {
    oldPath: /\/assets\/img\/fr\/home\/plage-beau-rivage-nice\.jpg/g,
    newPath: '/assets/img/destinations/plage-beau-rivage-nice.jpg'
  },
  {
    oldPath: /\/assets\/img\/fr\/home\/vtc-tesla-cannes\.jpg/g,
    newPath: '/assets/img/destinations/vtc-tesla-cannes.jpg'
  },
  {
    oldPath: /\/assets\/img\/fr\/home\/vtc-tesla-monaco\.jpg/g,
    newPath: '/assets/img/destinations/vtc-tesla-monaco.jpg'
  },
  {
    oldPath: /\/assets\/img\/fr\/home\/vtc-nice-cannes\.jpg/g,
    newPath: '/assets/img/destinations/vtc-nice-cannes.jpg'
  },
  {
    oldPath: /\/assets\/img\/fr\/home\/hotel-metropole-monaco\.jpg/g,
    newPath: '/assets/img/destinations/hotel-metropole-monaco.jpg'
  },
  {
    oldPath: /\/assets\/img\/fr\/home\/monaco-private-driver\.webp/g,
    newPath: '/assets/img/hero/authority/monaco-private-driver.webp'
  },
  {
    oldPath: /\/assets\/img\/fr\/home\/nice-cannes-\.webp/g,
    newPath: '/assets/img/hero/authority/nice-cannes-.webp'
  }
];

// Fonction pour mettre à jour les chemins d'images dans un fichier
function updateImagePaths(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    imagePathMappings.forEach(mapping => {
      if (content.match(mapping.oldPath)) {
        content = content.replace(mapping.oldPath, mapping.newPath);
        updated = true;
      }
    });

    // Ajouter onerror pour les images
    content = content.replace(
      /<img([^>]*)src="([^"]*)"([^>]*)>/g,
      (match, before, src, after) => {
        if (!match.includes('onerror=')) {
          return `<img${before}src="${src}" onerror="this.src='${src}'; this.onerror=null;"${after}>`;
        }
        return match;
      }
    );

    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fichier mis à jour : ${filePath}`);
    } else {
      console.log(`ℹ️ Aucune modification nécessaire pour : ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Erreur lors du traitement de ${filePath}:`, error.message);
  }
}

// Parcourir tous les fichiers HTML du projet
function processHtmlFiles(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Ignorer les dossiers node_modules et .git
      if (file !== 'node_modules' && file !== '.git') {
        processHtmlFiles(fullPath);
      }
    } else if (path.extname(file).toLowerCase() === '.html') {
      updateImagePaths(fullPath);
    }
  });
}

// Démarrer le traitement à partir du répertoire racine
console.log('🔍 Recherche et correction des chemins d\'images...');
processHtmlFiles(rootDir);
console.log('✅ Correction des chemins d\'images terminée !');
