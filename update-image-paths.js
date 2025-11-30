const fs = require('fs');
const path = require('path');

// Mappage des anciens chemins vers les nouveaux chemins
const imagePathMappings = {
  // Anciens chemins vers nouveaux chemins
  '/assets/img/fr/home/hero-aeroport-nice.webp': '/assets/img/hero/hero-aeroport-nice.webp',
  '/assets/img/fr/home/hero-business.webp': '/assets/img/hero/hero-business.webp',
  '/assets/img/shared/homepage-riviera-1920w.webp': '/assets/img/hero/homepage-riviera-1920w.webp',
  
  // Images de destinations
  '/assets/img/fr/hero/plage-beau-rivage-nice.jpg': '/assets/img/destinations/plage-beau-rivage-nice.jpg',
  '/assets/img/fr/hero/vtc-nice-cannes.jpg': '/assets/img/destinations/vtc-nice-cannes.jpg',
  '/assets/img/fr/hero/vtc-tesla-cannes.jpg': '/assets/img/destinations/vtc-tesla-cannes.jpg',
  '/assets/img/fr/hero/vtc-tesla-monaco.jpg': '/assets/img/destinations/vtc-tesla-monaco.jpg',
  '/assets/img/fr/hero/vtc-tesla-nice.jpg': '/assets/img/destinations/vtc-tesla-nice.jpg',
  '/assets/img/fr/hero/club-55-saint-tropez.jpg': '/assets/img/destinations/club-55-saint-tropez.jpg',
  '/assets/img/fr/hero/nikki-beach-saint-tropez.jpg': '/assets/img/destinations/nikki-beach-saint-tropez.jpg',
  '/assets/img/fr/hero/tahiti-beach-saint-tropez.jpg': '/assets/img/destinations/tahiti-beach-saint-tropez.jpg',
  '/assets/img/fr/hero/buddha-bar-monaco.jpg': '/assets/img/destinations/buddha-bar-monaco.jpg',
  '/assets/img/fr/hero/hotel-metropole-monaco.jpg': '/assets/img/destinations/hotel-metropole-monaco.jpg',
  '/assets/img/authority/monaco-1920w.webp': '/assets/img/destinations/monaco-1920w.webp',
  '/assets/img/authority/nice-cannes-1920w.webp': '/assets/img/destinations/nice-cannes-1920w.webp',
  
  // Images de services
  '/assets/img/fr/services/service-corporate.webp': '/assets/img/services/service-corporate.webp',
  '/assets/img/fr/services/service-events.webp': '/assets/img/services/service-events.webp',
  
  // Images d'autorité
  '/assets/img/authority/aeroport-nice-1920w.webp': '/assets/img/hero/aeroport-nice-1920w.webp',
  
  // Chemins partiels
  '/assets/img/fr/hero/': '/assets/img/destinations/'
};

// Fonction pour mettre à jour les chemins dans un fichier
function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;
    
    // Remplacer chaque ancien chemin par le nouveau
    for (const [oldPath, newPath] of Object.entries(imagePathMappings)) {
      if (content.includes(oldPath)) {
        content = content.split(oldPath).join(newPath);
        updated = true;
      }
    }
    
    // Écrire le fichier uniquement si des modifications ont été apportées
    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fichier mis à jour : ${filePath}`);
    }
  } catch (err) {
    console.error(`Erreur lors de la mise à jour de ${filePath}:`, err);
  }
}

// Fonction pour parcourir les fichiers HTML
function processHtmlFiles(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  files.forEach(file => {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      // Ignorer les dossiers node_modules et .git
      if (file.name !== 'node_modules' && file.name !== '.git') {
        processHtmlFiles(fullPath);
      }
    } else if (file.name.endsWith('.html')) {
      updateFile(fullPath);
    }
  });
}

// Démarrer le traitement à partir du répertoire courant
console.log('Début de la mise à jour des chemins d\'images...');
processHtmlFiles(__dirname);
console.log('Mise à jour des chemins d\'images terminée !');
