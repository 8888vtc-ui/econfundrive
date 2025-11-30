// Script final pour corriger toutes les erreurs de syntaxe breadcrumbs
const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '..', 'src', 'pages');

function fixBreadcrumbSyntax(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Pattern: BaseLayout ... > suivi de breadcrumbItems sur nouvelle ligne
  const lines = content.split('\n');
  let newLines = [];
  let i = 0;
  let fixed = false;
  
  while (i < lines.length) {
    const line = lines[i];
    
    // Détecter BaseLayout qui se termine par >
    if (line.includes('<BaseLayout') && line.trim().endsWith('>')) {
      newLines.push(line);
      i++;
      
      // Vérifier si la prochaine ligne commence par breadcrumbItems
      if (i < lines.length && lines[i].trim().startsWith('breadcrumbItems={')) {
        // Extraire breadcrumbItems jusqu'à la fermeture }
        let breadcrumbContent = lines[i];
        i++;
        
        // Continuer à lire jusqu'à trouver la fermeture }
        while (i < lines.length && !breadcrumbContent.includes(']}')) {
          breadcrumbContent += '\n' + lines[i];
          i++;
        }
        
        // Extraire le contenu entre {}
        const match = breadcrumbContent.match(/breadcrumbItems=\{([\s\S]*?)\}/);
        if (match) {
          const items = match[1].trim();
          
          // Ajouter breadcrumbItems dans BaseLayout avant le >
          const lastLine = newLines[newLines.length - 1];
          newLines[newLines.length - 1] = lastLine.replace('>', `\n  breadcrumbItems={[${items}]}>`);
          fixed = true;
        }
      } else {
        // Pas de breadcrumbItems, continuer normalement
      }
    } else {
      newLines.push(line);
      i++;
    }
  }
  
  if (fixed) {
    fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
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

