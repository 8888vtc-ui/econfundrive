// Script de vérification complète du site
const fs = require('fs');
const path = require('path');

console.log('========================================');
console.log('VERIFICATION COMPLETE DU SITE');
console.log('========================================\n');

let issues = [];
let stats = {
  totalPages: 0,
  pagesWithErrors: 0,
  missingImports: 0,
  brokenLinks: 0,
  missingImages: 0,
  syntaxErrors: 0
};

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
stats.totalPages = pageFiles.length;

console.log(`Analyse de ${pageFiles.length} pages...\n`);

pageFiles.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    const relativePath = filePath.replace(process.cwd() + path.sep, '').replace(/\\/g, '/');
    
    // 1. Vérifier les imports manquants
    const usedComponents = [];
    if (content.includes('<SectionImageText')) {
      usedComponents.push('SectionImageText');
    }
    if (content.includes('<OptimizedImage')) {
      usedComponents.push('OptimizedImage');
    }
    if (content.includes('<CategoryCard')) {
      usedComponents.push('CategoryCard');
    }
    if (content.includes('<HeroBanner')) {
      usedComponents.push('HeroBanner');
    }
    
    usedComponents.forEach(comp => {
      if (!content.includes(`import ${comp}`) && !content.includes(`from '../components/${comp}`) && !content.includes(`from '../../components/${comp}`)) {
        issues.push({
          type: 'missing-import',
          file: relativePath,
          component: comp
        });
        stats.missingImports++;
      }
    });
    
    // 2. Vérifier les liens internes cassés (basique)
    const linkMatches = content.matchAll(/href=["'](\/[^"']+)["']/g);
    for (const match of linkMatches) {
      const link = match[1];
      // Ignorer les liens externes, anchors, etc.
      if (link.startsWith('http') || link.startsWith('#') || link.startsWith('mailto:') || link.startsWith('tel:')) {
        continue;
      }
      
      // Vérifier si le fichier existe (approximation)
      const linkPath = link.replace(/^\//, '').replace(/\/$/, '');
      const possibleFiles = [
        `src/pages/${linkPath}.astro`,
        `src/pages/${linkPath}/index.astro`,
        `src/pages/${linkPath.replace(/^en\//, 'en/')}.astro`
      ];
      
      const exists = possibleFiles.some(f => fs.existsSync(f));
      if (!exists && linkPath !== '' && !linkPath.includes('#')) {
        // Ne pas signaler si c'est un lien vers une section (#)
        issues.push({
          type: 'possible-broken-link',
          file: relativePath,
          link: link
        });
        stats.brokenLinks++;
      }
    }
    
    // 3. Vérifier les images manquantes (basique)
    const imgMatches = content.matchAll(/src=["'](\/[^"']+)["']/g);
    for (const match of imgMatches) {
      const imgPath = match[1];
      if (imgPath.startsWith('/assets/')) {
        const fullPath = `public${imgPath}`;
        if (!fs.existsSync(fullPath)) {
          issues.push({
            type: 'missing-image',
            file: relativePath,
            image: imgPath
          });
          stats.missingImages++;
        }
      }
    }
    
    // 4. Vérifier la syntaxe de base
    if (content.includes('];;')) {
      issues.push({
        type: 'syntax-error',
        file: relativePath,
        error: 'Double point-virgule après keywords'
      });
      stats.syntaxErrors++;
    }
    
    if (content.includes('const keywords = [') && !content.match(/const keywords = \[[\s\S]*?\];/)) {
      issues.push({
        type: 'syntax-error',
        file: relativePath,
        error: 'Keywords mal formatés'
      });
      stats.syntaxErrors++;
    }
    
  } catch (error) {
    issues.push({
      type: 'file-error',
      file: filePath,
      error: error.message
    });
    stats.pagesWithErrors++;
  }
});

// Afficher les résultats
console.log('RÉSULTATS DE LA VÉRIFICATION:');
console.log('==============================\n');

if (issues.length === 0) {
  console.log('✅ Aucun problème détecté !\n');
} else {
  console.log(`⚠ ${issues.length} problème(s) détecté(s):\n`);
  
  const byType = {};
  issues.forEach(issue => {
    if (!byType[issue.type]) {
      byType[issue.type] = [];
    }
    byType[issue.type].push(issue);
  });
  
  Object.keys(byType).forEach(type => {
    console.log(`\n${type.toUpperCase()} (${byType[type].length}):`);
    byType[type].slice(0, 10).forEach(issue => {
      console.log(`  - ${issue.file}`);
      if (issue.component) console.log(`    Composant manquant: ${issue.component}`);
      if (issue.link) console.log(`    Lien: ${issue.link}`);
      if (issue.image) console.log(`    Image: ${issue.image}`);
      if (issue.error) console.log(`    Erreur: ${issue.error}`);
    });
    if (byType[type].length > 10) {
      console.log(`  ... et ${byType[type].length - 10} autres`);
    }
  });
}

console.log(`\n==============================`);
console.log(`STATISTIQUES:`);
console.log(`  - Total pages: ${stats.totalPages}`);
console.log(`  - Pages avec erreurs: ${stats.pagesWithErrors}`);
console.log(`  - Imports manquants: ${stats.missingImports}`);
console.log(`  - Liens cassés possibles: ${stats.brokenLinks}`);
console.log(`  - Images manquantes: ${stats.missingImages}`);
console.log(`  - Erreurs de syntaxe: ${stats.syntaxErrors}`);
console.log(`==============================\n`);

// Sauvegarder le rapport
const report = {
  date: new Date().toISOString(),
  stats: stats,
  issues: issues
};

fs.writeFileSync('verification-complete-report.json', JSON.stringify(report, null, 2), 'utf8');
console.log('Rapport sauvegardé dans: verification-complete-report.json');
console.log('TERMINE');

