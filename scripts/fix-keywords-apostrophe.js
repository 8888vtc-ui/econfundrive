// Script pour corriger les apostrophes dans les keywords
const fs = require('fs');
const path = require('path');

function findAstroFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      findAstroFiles(filePath, fileList);
    } else if (file.endsWith('.astro')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const pageFiles = findAstroFiles('src/pages');
console.log('CORRECTION APOSTROPHES DANS KEYWORDS');
console.log('====================================\n');

let fixed = 0;

pageFiles.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Chercher les keywords avec apostrophe mal échappée
    const keywordsMatch = content.match(/const keywords = \[([^\]]+)\]/s);
    if (keywordsMatch) {
      const keywordsContent = keywordsMatch[1];
      
      // Vérifier si contient "d'Azur" avec apostrophe simple
      if (keywordsContent.includes("d'Azur") && !keywordsContent.includes('"VTC Côte d\'Azur"')) {
        // Remplacer toutes les occurrences de 'VTC Côte d'Azur' par "VTC Côte d'Azur"
        content = content.replace(
          /'VTC Côte d'Azur'/g,
          '"VTC Côte d\'Azur"'
        );
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✓ Corrigé: ${filePath}`);
        fixed++;
      }
    }
    
  } catch (error) {
    console.log(`✗ Erreur sur ${filePath}: ${error.message}`);
  }
});

console.log(`\n====================================`);
console.log(`Fichiers corrigés: ${fixed}`);
console.log(`TERMINE`);

