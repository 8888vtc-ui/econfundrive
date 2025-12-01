// Script pour corriger TOUS les problèmes de keywords
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
console.log('CORRECTION COMPLETE KEYWORDS');
console.log('=============================\n');

let fixed = 0;

pageFiles.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Chercher les keywords
    const keywordsMatch = content.match(/const keywords = \[([^\]]+)\]/s);
    if (keywordsMatch) {
      const keywordsContent = keywordsMatch[1];
      
      // Extraire tous les keywords (même mal formatés)
      const rawKeywords = keywordsContent
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0 && !k.match(/^[,]+$/))
        .map(k => {
          // Nettoyer
          k = k.replace(/^['"]+|['"]+$/g, ''); // Enlever guillemets
          k = k.replace(/^`+|`+$/g, ''); // Enlever backticks
          k = k.trim();
          return k;
        })
        .filter(k => k.length > 0);
      
      // Dédupliquer
      const uniqueKeywords = [...new Set(rawKeywords)];
      
      // Formater correctement
      const formattedKeywords = uniqueKeywords.map(k => {
        // Si contient apostrophe, utiliser guillemets doubles
        if (k.includes("'")) {
          return `"${k}"`;
        }
        return `'${k}'`;
      });
      
      // Reconstruire
      const newKeywords = `const keywords = [\n  ${formattedKeywords.join(',\n  ')}\n];`;
      
      content = content.replace(/const keywords = \[[^\]]+\]/s, newKeywords);
      modified = true;
      console.log(`✓ Corrigé: ${filePath}`);
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      fixed++;
    }
    
  } catch (error) {
    console.log(`✗ Erreur sur ${filePath}: ${error.message}`);
  }
});

console.log(`\n=============================`);
console.log(`Fichiers corrigés: ${fixed}`);
console.log(`TERMINE`);

