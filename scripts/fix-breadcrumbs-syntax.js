// Script pour corriger les erreurs de syntaxe des breadcrumbs
const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '..', 'src', 'pages');

function fixBreadcrumbSyntax(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Pattern pour trouver breadcrumbItems mal placé (en dehors de BaseLayout)
  const pattern = /(<BaseLayout[^>]*>)\s*breadcrumbItems=\{([^}]+)\}/s;
  const match = content.match(pattern);
  
  if (match) {
    // Extraire breadcrumbItems
    const breadcrumbItems = match[2];
    
    // Replacer dans BaseLayout
    content = content.replace(
      /(<BaseLayout[^>]*>)/,
      `$1\n  breadcrumbItems={[${breadcrumbItems}]}`
    );
    
    // Supprimer l'ancien breadcrumbItems mal placé
    content = content.replace(
      /(<BaseLayout[^>]*>)\s*breadcrumbItems=\{([^}]+)\}/s,
      '$1'
    );
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Corrigé: ${path.basename(filePath)}`);
      return true;
    }
  }
  
  return false;
}

function scanPages(dir) {
  const files = fs.readdirSync(dir);
  let fixed = 0;
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.')) {
      fixed += scanPages(filePath);
    } else if (file.endsWith('.astro')) {
      if (fixBreadcrumbSyntax(filePath)) {
        fixed++;
      }
    }
  }
  
  return fixed;
}

console.log('🔧 Correction des erreurs de syntaxe breadcrumbs...\n');
const fixed = scanPages(pagesDir);
console.log(`\n✅ ${fixed} fichiers corrigés !`);

