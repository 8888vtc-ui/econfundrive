// Script pour ajouter automatiquement les breadcrumbs manquants
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
console.log('AJOUT BREADCRUMBS AUTOMATIQUE');
console.log('=============================\n');

let fixed = 0;
let skipped = 0;

pageFiles.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    const dirName = path.dirname(filePath).split(path.sep).pop();
    
    // Ignorer index.astro et pages multilingues (en, it, ru)
    if (fileName === 'index.astro' || ['en', 'it', 'ru'].includes(dirName)) {
      skipped++;
      return;
    }
    
    // Vérifier si breadcrumbs existent déjà
    if (content.includes('breadcrumbItems')) {
      skipped++;
      return;
    }
    
    // Générer les breadcrumbs selon le type de page
    let breadcrumbs = [];
    const relativePath = filePath.replace(/^src\/pages\//, '').replace(/\.astro$/, '');
    
    // Pages services
    if (relativePath.startsWith('vtc-')) {
      const city = relativePath.replace('vtc-', '').replace(/-/g, ' ');
      breadcrumbs = [
        { name: 'Accueil', url: '/' },
        { name: 'Services', url: '/services' },
        { name: `VTC ${city.charAt(0).toUpperCase() + city.slice(1)}`, url: `/${relativePath}` }
      ];
    }
    // Pages guides
    else if (relativePath.startsWith('guide-')) {
      breadcrumbs = [
        { name: 'Accueil', url: '/' },
        { name: 'Guides', url: '/guides' },
        { name: 'Guide', url: `/${relativePath}` }
      ];
    }
    // Pages transferts
    else if (relativePath.startsWith('transfert-') || relativePath.startsWith('transferts-')) {
      breadcrumbs = [
        { name: 'Accueil', url: '/' },
        { name: 'Services', url: '/services' },
        { name: 'Transferts', url: `/${relativePath}` }
      ];
    }
    // Autres pages
    else {
      const pageName = relativePath.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      breadcrumbs = [
        { name: 'Accueil', url: '/' },
        { name: pageName, url: `/${relativePath}` }
      ];
    }
    
    // Convertir en format Astro
    const breadcrumbStr = breadcrumbs.map(b => `    { name: "${b.name}", url: "${b.url}" }`).join(',\n');
    const breadcrumbBlock = `  breadcrumbItems={[\n${breadcrumbStr}\n  ]}`;
    
    // Chercher BaseLayout et ajouter breadcrumbs
    const baseLayoutMatch = content.match(/<BaseLayout\s+([^>]+)>/);
    if (baseLayoutMatch) {
      const props = baseLayoutMatch[1];
      // Vérifier si canonical existe déjà
      if (props.includes('canonical')) {
        // Ajouter breadcrumbs après canonical
        content = content.replace(
          /(canonical="[^"]+")\s*>/,
          `$1\n${breadcrumbBlock}\n>`
        );
      } else {
        // Ajouter breadcrumbs avant le >
        content = content.replace(
          /<BaseLayout\s+([^>]+)>/,
          `<BaseLayout $1\n${breadcrumbBlock}\n>`
        );
      }
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Breadcrumbs ajoutés: ${filePath}`);
      fixed++;
    } else {
      skipped++;
    }
    
  } catch (error) {
    console.log(`✗ Erreur sur ${filePath}: ${error.message}`);
    skipped++;
  }
});

console.log(`\n=============================`);
console.log(`Fichiers corrigés: ${fixed}`);
console.log(`Fichiers ignorés: ${skipped}`);
console.log(`TERMINE`);
