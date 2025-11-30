const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Supprimer toutes les balises img et picture
function removeAllImages(content) {
  // Supprimer les balises <picture> complètes
  content = content.replace(/<picture[^>]*>[\s\S]*?<\/picture>/gi, '');
  
  // Supprimer les balises <img>
  content = content.replace(/<img[^>]*>/gi, '');
  
  // Supprimer les références dans srcset
  content = content.replace(/srcset=["'][^"']*["']/gi, '');
  
  return content;
}

// Traiter toutes les pages
const pages = glob.sync('src/pages/**/*.astro', { cwd: path.join(__dirname, '..') });
let processedCount = 0;

console.log('\n🗑️  SUPPRESSION DE TOUTES LES IMAGES\n');
console.log('='.repeat(50));

pages.forEach(pageFile => {
  const fullPath = path.join(__dirname, '..', pageFile);
  let content = fs.readFileSync(fullPath, 'utf8');
  const originalContent = content;
  
  content = removeAllImages(content);
  
  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content, 'utf8');
    const pageName = path.basename(pageFile, '.astro');
    console.log(`✅ ${pageName}`);
    processedCount++;
  }
});

console.log(`\n✅ ${processedCount} pages traitées\n`);

