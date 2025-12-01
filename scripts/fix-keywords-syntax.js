// Script pour corriger la syntaxe incorrecte des keywords
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
console.log('CORRECTION SYNTAXE KEYWORDS');
console.log('===========================\n');

let fixed = 0;

pageFiles.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Chercher les keywords avec syntaxe incorrecte (double virgule ou sans guillemets)
    const keywordsMatch = content.match(/const keywords = \[([^\]]+)\]/s);
    if (keywordsMatch) {
      const keywordsContent = keywordsMatch[1];
      
      // Vérifier si contient des erreurs de syntaxe
      if (keywordsContent.includes(',,') || 
          keywordsContent.match(/^\s*[A-Z]/) || // Commence par une majuscule sans guillemets
          !keywordsContent.includes("'") && !keywordsContent.includes('"')) {
        
        // Extraire les keywords (séparés par virgules)
        const keywords = keywordsContent
          .split(',')
          .map(k => k.trim())
          .filter(k => k.length > 0 && !k.match(/^[,]+$/))
          .map(k => {
            // Nettoyer et formater
            k = k.replace(/^['"]+|['"]+$/g, ''); // Enlever guillemets existants
            // Si contient apostrophe, utiliser guillemets doubles
            if (k.includes("'")) {
              return `"${k}"`;
            }
            return `'${k}'`;
          });
        
        // Reconstruire le tableau
        const newKeywords = `const keywords = [\n  ${keywords.join(',\n  ')}\n];`;
        
        content = content.replace(/const keywords = \[[^\]]+\]/s, newKeywords);
        modified = true;
        console.log(`✓ Corrigé: ${filePath}`);
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      fixed++;
    }
    
  } catch (error) {
    console.log(`✗ Erreur sur ${filePath}: ${error.message}`);
  }
});

console.log(`\n===========================`);
console.log(`Fichiers corrigés: ${fixed}`);
console.log(`TERMINE`);

