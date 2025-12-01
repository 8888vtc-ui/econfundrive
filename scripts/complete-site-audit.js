import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const issues = {
  errors: [],
  warnings: [],
  info: []
};

// Fonction pour lire récursivement les fichiers
function getAllFiles(dir, ext = '.astro') {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      // Ignorer node_modules, dist, .git
      if (!['node_modules', 'dist', '.git', '.astro'].includes(file)) {
        results = results.concat(getAllFiles(filePath, ext));
      }
    } else if (file.endsWith(ext)) {
      results.push(filePath);
    }
  });
  
  return results;
}

// Vérifier les imports
function checkImports(filePath, content) {
  const importRegex = /import\s+.*?\s+from\s+['"](.+?)['"]/g;
  const matches = [...content.matchAll(importRegex)];
  
  matches.forEach(match => {
    const importPath = match[1];
    
    // Ignorer les imports de packages npm
    if (importPath.startsWith('.') || importPath.startsWith('/')) {
      const resolvedPath = path.resolve(path.dirname(filePath), importPath);
      
      // Vérifier si le fichier existe
      if (!fs.existsSync(resolvedPath) && !fs.existsSync(resolvedPath + '.astro') && !fs.existsSync(resolvedPath + '.ts')) {
        issues.errors.push(`Import manquant dans ${filePath}: ${importPath}`);
      }
    }
  });
}

// Vérifier les composants utilisés mais non importés
function checkComponentUsage(filePath, content) {
  const componentRegex = /<(\w+[A-Z]\w+)\s/g;
  const matches = [...content.matchAll(componentRegex)];
  const imports = [...content.matchAll(/import\s+(\w+)\s+from/g)];
  const importedComponents = imports.map(m => m[1]);
  
  matches.forEach(match => {
    const componentName = match[1];
    // Ignorer les balises HTML natives
    if (!['div', 'span', 'a', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'button', 'input', 'form', 'section', 'article', 'header', 'footer', 'main', 'nav', 'ul', 'li', 'ol', 'table', 'tr', 'td', 'th', 'thead', 'tbody', 'script', 'style', 'link', 'meta', 'title'].includes(componentName)) {
      if (!importedComponents.includes(componentName)) {
        issues.warnings.push(`Composant ${componentName} utilisé mais non importé dans ${filePath}`);
      }
    }
  });
}

// Vérifier les liens internes
function checkInternalLinks(filePath, content) {
  const linkRegex = /href=["']([^"']+)["']/g;
  const matches = [...content.matchAll(linkRegex)];
  
  matches.forEach(match => {
    const link = match[1];
    
    // Vérifier seulement les liens internes
    if (link.startsWith('/') && !link.startsWith('//') && !link.includes('#')) {
      // Convertir le lien en chemin de fichier
      let filePathCheck = link;
      if (filePathCheck.endsWith('/')) {
        filePathCheck = filePathCheck.slice(0, -1);
      }
      if (!filePathCheck.endsWith('.html')) {
        filePathCheck = filePathCheck + '.html';
      }
      
      const fullPath = path.join(rootDir, 'src', 'pages', filePathCheck.replace(/^\//, ''));
      const indexPath = path.join(path.dirname(fullPath), 'index.html');
      
      if (!fs.existsSync(fullPath) && !fs.existsSync(indexPath)) {
        // Vérifier si c'est une page Astro
        const astroPath = fullPath.replace('.html', '.astro');
        if (!fs.existsSync(astroPath)) {
          issues.warnings.push(`Lien potentiellement cassé dans ${filePath}: ${link}`);
        }
      }
    }
  });
}

// Vérifier les images
function checkImages(filePath, content) {
  const imgRegex = /(?:src|href)=["']([^"']*\.(?:jpg|jpeg|png|webp|svg|gif))["']/gi;
  const matches = [...content.matchAll(imgRegex)];
  
  matches.forEach(match => {
    const imgPath = match[1];
    
    // Vérifier seulement les chemins relatifs
    if (imgPath.startsWith('/') || imgPath.startsWith('./') || imgPath.startsWith('../')) {
      const resolvedPath = path.resolve(path.dirname(filePath), imgPath.replace(/^\//, ''));
      const publicPath = path.join(rootDir, 'public', imgPath.replace(/^\//, ''));
      
      if (!fs.existsSync(resolvedPath) && !fs.existsSync(publicPath)) {
        issues.warnings.push(`Image potentiellement manquante dans ${filePath}: ${imgPath}`);
      }
    }
  });
}

// Vérifier le SEO
function checkSEO(filePath, content) {
  const hasTitle = /<title>/.test(content) || /title\s*[:=]/.test(content);
  const hasDescription = /<meta\s+name=["']description["']/.test(content) || /description\s*[:=]/.test(content);
  const hasH1 = /<h1/.test(content);
  const hasKeywords = /keywords/.test(content);
  
  if (!hasTitle) {
    issues.warnings.push(`Pas de titre dans ${filePath}`);
  }
  if (!hasDescription) {
    issues.warnings.push(`Pas de description dans ${filePath}`);
  }
  if (!hasH1) {
    issues.warnings.push(`Pas de H1 dans ${filePath}`);
  }
}

// Vérifier les fichiers CSS/JS référencés
function checkAssets(filePath, content) {
  const cssRegex = /href=["']([^"']*\.css)["']/g;
  const jsRegex = /src=["']([^"']*\.js)["']/g;
  const matches = [...content.matchAll(cssRegex), ...content.matchAll(jsRegex)];
  
  matches.forEach(match => {
    const assetPath = match[1];
    
    if (assetPath.startsWith('/')) {
      const publicPath = path.join(rootDir, 'public', assetPath);
      const srcPath = path.join(rootDir, 'src', assetPath);
      
      if (!fs.existsSync(publicPath) && !fs.existsSync(srcPath)) {
        issues.warnings.push(`Asset potentiellement manquant dans ${filePath}: ${assetPath}`);
      }
    }
  });
}

// Vérifier la syntaxe TypeScript/JavaScript
function checkSyntax(filePath, content) {
  // Vérifier les erreurs de syntaxe communes
  const openBraces = (content.match(/\{/g) || []).length;
  const closeBraces = (content.match(/\}/g) || []).length;
  const openParens = (content.match(/\(/g) || []).length;
  const closeParens = (content.match(/\)/g) || []).length;
  const openBrackets = (content.match(/\[/g) || []).length;
  const closeBrackets = (content.match(/\]/g) || []).length;
  
  if (openBraces !== closeBraces) {
    issues.errors.push(`Accolades non équilibrées dans ${filePath}`);
  }
  if (openParens !== closeParens) {
    issues.errors.push(`Parenthèses non équilibrées dans ${filePath}`);
  }
  if (openBrackets !== closeBrackets) {
    issues.errors.push(`Crochets non équilibrés dans ${filePath}`);
  }
  
  // Vérifier les chaînes non fermées
  const singleQuotes = (content.match(/'/g) || []).length;
  const doubleQuotes = (content.match(/"/g) || []).length;
  
  if (singleQuotes % 2 !== 0) {
    issues.warnings.push(`Guillemets simples potentiellement non fermés dans ${filePath}`);
  }
  if (doubleQuotes % 2 !== 0) {
    issues.warnings.push(`Guillemets doubles potentiellement non fermés dans ${filePath}`);
  }
}

// Audit principal
console.log('🔍 Démarrage de l\'audit complet du site...\n');

const astroFiles = getAllFiles(path.join(rootDir, 'src'), '.astro');
const tsFiles = getAllFiles(path.join(rootDir, 'src'), '.ts');

console.log(`📁 Fichiers trouvés: ${astroFiles.length} .astro, ${tsFiles.length} .ts\n`);

// Vérifier tous les fichiers Astro
astroFiles.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const relativePath = path.relative(rootDir, filePath);
    
    checkImports(filePath, content);
    checkComponentUsage(filePath, content);
    checkInternalLinks(filePath, content);
    checkImages(filePath, content);
    checkSEO(filePath, content);
    checkAssets(filePath, content);
    checkSyntax(filePath, content);
  } catch (error) {
    issues.errors.push(`Erreur lors de la lecture de ${filePath}: ${error.message}`);
  }
});

// Vérifier les fichiers TypeScript
tsFiles.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    checkImports(filePath, content);
    checkSyntax(filePath, content);
  } catch (error) {
    issues.errors.push(`Erreur lors de la lecture de ${filePath}: ${error.message}`);
  }
});

// Vérifier les fichiers CSS référencés
const cssFiles = [
  '/assets/css/base.css',
  '/assets/css/components.css',
  '/assets/css/utilities.css',
  '/assets/css/performance.css',
  '/assets/css/accessibility.css'
];

cssFiles.forEach(cssFile => {
  const cssPath = path.join(rootDir, 'public', cssFile);
  if (!fs.existsSync(cssPath)) {
    issues.warnings.push(`Fichier CSS manquant: ${cssFile}`);
  }
});

// Vérifier les composants essentiels
const essentialComponents = [
  'Header.astro',
  'Footer.astro',
  'Breadcrumb.astro',
  'WhatsAppButton.astro',
  'Chatbot.astro',
  'ReviewsDisplay.astro',
  'ReviewsSchema.astro'
];

essentialComponents.forEach(comp => {
  const compPath = path.join(rootDir, 'src', 'components', comp);
  if (!fs.existsSync(compPath)) {
    issues.errors.push(`Composant essentiel manquant: ${comp}`);
  }
});

// Vérifier les données
const dataFiles = [
  'reviews.ts'
];

dataFiles.forEach(dataFile => {
  const dataPath = path.join(rootDir, 'src', 'data', dataFile);
  if (!fs.existsSync(dataPath)) {
    issues.errors.push(`Fichier de données manquant: ${dataFile}`);
  }
});

// Rapport final
console.log('\n' + '='.repeat(60));
console.log('📊 RAPPORT D\'AUDIT COMPLET');
console.log('='.repeat(60));

if (issues.errors.length > 0) {
  console.log(`\n❌ ERREURS (${issues.errors.length}):`);
  issues.errors.forEach((error, index) => {
    console.log(`  ${index + 1}. ${error}`);
  });
} else {
  console.log('\n✅ Aucune erreur critique trouvée');
}

if (issues.warnings.length > 0) {
  console.log(`\n⚠️  AVERTISSEMENTS (${issues.warnings.length}):`);
  issues.warnings.slice(0, 20).forEach((warning, index) => {
    console.log(`  ${index + 1}. ${warning}`);
  });
  if (issues.warnings.length > 20) {
    console.log(`  ... et ${issues.warnings.length - 20} autres avertissements`);
  }
} else {
  console.log('\n✅ Aucun avertissement');
}

console.log(`\n📈 Statistiques:`);
console.log(`  - Fichiers Astro: ${astroFiles.length}`);
console.log(`  - Fichiers TypeScript: ${tsFiles.length}`);
console.log(`  - Erreurs: ${issues.errors.length}`);
console.log(`  - Avertissements: ${issues.warnings.length}`);

// Sauvegarder le rapport
const report = {
  timestamp: new Date().toISOString(),
  stats: {
    astroFiles: astroFiles.length,
    tsFiles: tsFiles.length,
    errors: issues.errors.length,
    warnings: issues.warnings.length
  },
  errors: issues.errors,
  warnings: issues.warnings
};

fs.writeFileSync(
  path.join(rootDir, 'COMPLETE-AUDIT-REPORT.json'),
  JSON.stringify(report, null, 2)
);

console.log('\n💾 Rapport sauvegardé dans: COMPLETE-AUDIT-REPORT.json');

if (issues.errors.length === 0) {
  console.log('\n✅ Site prêt pour le déploiement !');
  process.exit(0);
} else {
  console.log('\n❌ Des erreurs doivent être corrigées avant le déploiement.');
  process.exit(1);
}

