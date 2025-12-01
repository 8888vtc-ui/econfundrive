/**
 * Script pour supprimer tous les blocs <style> des fichiers .astro
 * Grand nettoyage CSS interne
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const pagesDir = path.join(__dirname, '../src/pages');
const componentsDir = path.join(__dirname, '../src/components');

function removeStyleBlocks(content) {
  // Supprimer les blocs <style>...</style>
  // Pattern pour capturer <style> avec tout son contenu jusqu'à </style>
  let cleaned = content;
  
  // Supprimer les blocs <style> complets (multiligne)
  cleaned = cleaned.replace(/<style>[\s\S]*?<\/style>/g, '');
  
  // Supprimer les balises <style> orphelines (au cas où)
  cleaned = cleaned.replace(/<style>\s*<\/style>/g, '');
  cleaned = cleaned.replace(/<style>/g, '');
  cleaned = cleaned.replace(/<\/style>/g, '');
  
  return cleaned;
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const cleaned = removeStyleBlocks(content);
    
    if (content !== cleaned) {
      fs.writeFileSync(filePath, cleaned, 'utf8');
      console.log(`✓ Nettoyé: ${path.relative(process.cwd(), filePath)}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`✗ Erreur sur ${filePath}:`, error.message);
    return false;
  }
}

// Traiter tous les fichiers .astro dans pages/
const pageFiles = glob.sync('**/*.astro', { 
  cwd: pagesDir,
  absolute: true 
});

// Traiter tous les fichiers .astro dans components/ (sauf _archived)
const componentFiles = glob.sync('**/*.astro', { 
  cwd: componentsDir,
  absolute: true,
  ignore: ['**/_archived/**']
});

const allFiles = [...pageFiles, ...componentFiles];

console.log(`\n🧹 Nettoyage des blocs <style> dans ${allFiles.length} fichiers...\n`);

let cleanedCount = 0;
allFiles.forEach(file => {
  if (processFile(file)) {
    cleanedCount++;
  }
});

console.log(`\n✅ Nettoyage terminé: ${cleanedCount} fichiers modifiés sur ${allFiles.length} fichiers\n`);

