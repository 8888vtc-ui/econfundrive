// Script pour ajouter automatiquement les breadcrumbs sur toutes les pages
const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '..', 'src', 'pages');

// Mapping des breadcrumbs par type de page
const breadcrumbMapping = {
  'vtc-': (pageName) => [
    { name: "Accueil", url: "/" },
    { name: "Services", url: "/services" },
    { name: pageName.replace('vtc-', 'VTC ').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), url: `/${pageName}` }
  ],
  'guide-': (pageName) => [
    { name: "Accueil", url: "/" },
    { name: "Guides", url: "/guides" },
    { name: pageName.replace('guide-', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), url: `/${pageName}` }
  ],
  'transfert-': (pageName) => [
    { name: "Accueil", url: "/" },
    { name: "Services", url: "/services" },
    { name: pageName.replace('transfert-', 'Transfert ').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), url: `/${pageName}` }
  ],
  'chauffeur-': (pageName) => [
    { name: "Accueil", url: "/" },
    { name: "Services", url: "/services" },
    { name: pageName.replace('chauffeur-', 'Chauffeur ').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), url: `/${pageName}` }
  ]
};

function getBreadcrumbs(pageName) {
  for (const [prefix, fn] of Object.entries(breadcrumbMapping)) {
    if (pageName.startsWith(prefix)) {
      return fn(pageName);
    }
  }
  // Par défaut
  return [
    { name: "Accueil", url: "/" },
    { name: pageName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), url: `/${pageName}` }
  ];
}

function addBreadcrumbsToFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath, '.astro');
  
  // Ignorer index, en/, it/, ru/
  if (fileName === 'index' || filePath.includes('/en/') || filePath.includes('/it/') || filePath.includes('/ru/')) {
    return;
  }
  
  // Vérifier si breadcrumbItems existe déjà
  if (content.includes('breadcrumbItems')) {
    return; // Déjà présent
  }
  
  const breadcrumbs = getBreadcrumbs(fileName);
  const breadcrumbCode = `  breadcrumbItems={[\n${breadcrumbs.map(b => `    { name: "${b.name}", url: "${b.url}" }`).join(',\n')}\n  ]}`;
  
  // Trouver la ligne BaseLayout et ajouter breadcrumbItems
  const baseLayoutRegex = /(<BaseLayout[^>]*>)/;
  if (baseLayoutRegex.test(content)) {
    content = content.replace(
      baseLayoutRegex,
      `$1\n${breadcrumbCode}`
    );
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Breadcrumbs ajoutés: ${fileName}`);
  }
}

function scanPages(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.')) {
      scanPages(filePath);
    } else if (file.endsWith('.astro')) {
      addBreadcrumbsToFile(filePath);
    }
  }
}

console.log('🔍 Ajout des breadcrumbs sur toutes les pages...\n');
scanPages(pagesDir);
console.log('\n✅ Terminé !');

