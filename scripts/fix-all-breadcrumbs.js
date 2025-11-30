// Script pour corriger toutes les erreurs de syntaxe breadcrumbs
const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '..', 'src', 'pages');

function fixBreadcrumbSyntax(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Pattern 1: breadcrumbItems après > de BaseLayout
  const pattern1 = /(<BaseLayout[^>]*>)\s*breadcrumbItems=\{([\s\S]*?)\}\s*>/;
  const match1 = content.match(pattern1);
  
  if (match1) {
    const baseLayoutTag = match1[1];
    const breadcrumbItems = match1[2];
    
    // Replacer dans BaseLayout avant le >
    content = content.replace(
      /(<BaseLayout[^>]*)>/,
      `$1\n  breadcrumbItems={[${breadcrumbItems}]}>`
    );
    
    // Supprimer l'ancien breadcrumbItems mal placé
    content = content.replace(
      /(<BaseLayout[^>]*>)\s*breadcrumbItems=\{([\s\S]*?)\}\s*>/,
      '$1'
    );
  }
  
  // Pattern 2: breadcrumbItems sur ligne séparée après BaseLayout>
  const pattern2 = /(<BaseLayout[^>]*>)\s*\n\s*breadcrumbItems=\{([\s\S]*?)\}\s*\n\s*>/;
  const match2 = content.match(pattern2);
  
  if (match2) {
    const baseLayoutTag = match2[1];
    const breadcrumbItems = match2[2];
    
    // Replacer dans BaseLayout
    content = content.replace(
      /(<BaseLayout[^>]*)>/,
      `$1\n  breadcrumbItems={[${breadcrumbItems}]}>`
    );
    
    // Supprimer l'ancien breadcrumbItems
    content = content.replace(
      /(<BaseLayout[^>]*>)\s*\n\s*breadcrumbItems=\{([\s\S]*?)\}\s*\n\s*>/,
      '$1>'
    );
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Corrigé: ${path.basename(filePath)}`);
    return true;
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

