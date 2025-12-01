// Script pour corriger les double point-virgule après les keywords
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
console.log('CORRECTION DOUBLE POINT-VIRGULE');
console.log('================================\n');

let fixed = 0;

pageFiles.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Remplacer ]; par ]; (enlever le double point-virgule)
    if (content.includes('];;')) {
      content = content.replace(/];;/g, '];');
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

console.log(`\n================================`);
console.log(`Fichiers corrigés: ${fixed}`);
console.log(`TERMINE`);

