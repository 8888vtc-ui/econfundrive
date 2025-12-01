const fs = require('fs');
const path = require('path');

console.log('🔧 Correction de l\'encodage UTF-8 dans les fichiers sources...\n');

// Dictionnaire des corrections
const corrections = {
  'coÃ»te': 'coûte',
  'CÃ´te': 'Côte',
  'Ã©': 'é',
  'Ã¨': 'è',
  'Ãª': 'ê',
  'Ã ': 'à',
  'Ã§': 'ç',
  'Ã¹': 'ù',
  'Ã®': 'î',
  'Ã´': 'ô',
  'Ã«': 'ë',
  'Ã¯': 'ï',
  'Ã¼': 'ü',
  'Ã‰': 'É',
  'Ã€': 'À',
  'aÃ©roport': 'aéroport',
  'privÃ©': 'privé',
  'rÃ©server': 'réserver',
  'dÃ©placements': 'déplacements',
  'RÃ©servation': 'Réservation',
  'clÃ©s': 'clés',
  'intÃ©grer': 'intégrer'
};

// Fonction récursive pour trouver les fichiers .astro
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

// Trouver tous les fichiers .astro
const srcPath = path.join(__dirname, 'src', 'pages');
const files = findAstroFiles(srcPath);

let totalFiles = 0;
let totalCorrections = 0;

files.forEach(file => {
  console.log(`📄 Traitement: ${path.basename(file)}`);
  
  // Lire le contenu
  let content = fs.readFileSync(file, 'utf8');
  const originalContent = content;
  let fileCorrections = 0;
  
  // Appliquer toutes les corrections
  Object.keys(corrections).forEach(wrong => {
    const correct = corrections[wrong];
    const regex = new RegExp(wrong.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const matches = content.match(regex);
    
    if (matches) {
      content = content.replace(regex, correct);
      fileCorrections += matches.length;
      console.log(`  ✓ Corrigé '${wrong}' → '${correct}' (${matches.length} occurrence(s))`);
    }
  });
  
  // Sauvegarder si modifié
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    totalFiles++;
    totalCorrections += fileCorrections;
    console.log(`  💾 Fichier sauvegardé (${fileCorrections} corrections)\n`);
  } else {
    console.log(`  ✓ Aucune correction nécessaire\n`);
  }
});

console.log('═══════════════════════════════════════════════════════');
console.log('✅ TERMINÉ!');
console.log(`   📊 Fichiers corrigés: ${totalFiles}`);
console.log(`   🔧 Total corrections: ${totalCorrections}`);
console.log('═══════════════════════════════════════════════════════\n');
console.log('⚠️  PROCHAINE ÉTAPE: Rebuilder le site avec "npm run build"');
