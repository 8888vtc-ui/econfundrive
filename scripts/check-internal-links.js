const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Lister toutes les pages existantes
function getExistingPages() {
  const pages = glob.sync('src/pages/**/*.astro', { cwd: path.join(__dirname, '..') });
  const existingPages = new Set();
  
  pages.forEach(pageFile => {
    const relativePath = path.relative(
      path.join(__dirname, '..', 'src', 'pages'),
      pageFile
    );
    
    // Convertir le chemin en URL
    let url = '/' + relativePath
      .replace(/\\/g, '/')
      .replace(/\.astro$/, '')
      .replace(/\/index$/, '')
      .replace(/\/index$/, ''); // Au cas où il y aurait index/index
    
    // Nettoyer les URLs
    if (url === '/index') url = '/';
    if (url.endsWith('/index')) url = url.replace(/\/index$/, '');
    
    existingPages.add(url);
    
    // Ajouter aussi sans extension pour les cas spéciaux
    if (url !== '/') {
      existingPages.add(url);
    }
  });
  
  return existingPages;
}

// Extraire tous les liens internes d'une page
function extractInternalLinks(content, filePath) {
  const links = [];
  
  // Patterns pour trouver les liens
  const patterns = [
    /href=["']([^"']+)["']/gi,  // href="..."
    /href=['"]([^'"]+)['"]/gi,  // href='...'
  ];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const link = match[1];
      
      // Ignorer les liens externes, ancres, mailto, tel, etc.
      if (link.startsWith('http://') || 
          link.startsWith('https://') ||
          link.startsWith('mailto:') ||
          link.startsWith('tel:') ||
          link.startsWith('#') ||
          link.startsWith('javascript:') ||
          link.startsWith('//')) {
        continue;
      }
      
      // Normaliser le lien
      let normalizedLink = link;
      
      // Supprimer les ancres
      if (normalizedLink.includes('#')) {
        normalizedLink = normalizedLink.split('#')[0];
      }
      
      // Supprimer les query strings
      if (normalizedLink.includes('?')) {
        normalizedLink = normalizedLink.split('?')[0];
      }
      
      // Normaliser les chemins
      if (!normalizedLink.startsWith('/')) {
        // Lien relatif - calculer le chemin absolu
        const pageDir = path.dirname(filePath);
        const relativePath = path.relative(
          path.join(__dirname, '..', 'src', 'pages'),
          pageDir
        );
        
        if (relativePath !== '.') {
          const baseUrl = '/' + relativePath.replace(/\\/g, '/');
          normalizedLink = baseUrl + '/' + normalizedLink;
        } else {
          normalizedLink = '/' + normalizedLink;
        }
      }
      
      // Nettoyer les doubles slashes
      normalizedLink = normalizedLink.replace(/\/+/g, '/');
      
      // Supprimer le trailing slash sauf pour la racine
      if (normalizedLink !== '/' && normalizedLink.endsWith('/')) {
        normalizedLink = normalizedLink.slice(0, -1);
      }
      
      links.push({
        original: link,
        normalized: normalizedLink,
        file: filePath
      });
    }
  });
  
  return links;
}

// Vérifier tous les liens internes
const existingPages = getExistingPages();
const allPages = glob.sync('src/pages/**/*.astro', { cwd: path.join(__dirname, '..') });
const brokenLinks = [];
const validLinks = [];

console.log('\n🔍 VÉRIFICATION DES LIENS INTERNES\n');
console.log('='.repeat(50));
console.log(`📄 Pages existantes: ${existingPages.size}`);
console.log(`📄 Pages à vérifier: ${allPages.length}\n`);

allPages.forEach(pageFile => {
  const fullPath = path.join(__dirname, '..', pageFile);
  const content = fs.readFileSync(fullPath, 'utf8');
  const pageName = path.basename(pageFile, '.astro');
  
  const links = extractInternalLinks(content, fullPath);
  
  links.forEach(({ original, normalized, file }) => {
    // Vérifier si le lien existe
    if (normalized === '' || normalized === '/') {
      // Lien vers la racine - toujours valide
      validLinks.push({ page: pageName, link: original, normalized });
      return;
    }
    
    if (existingPages.has(normalized)) {
      validLinks.push({ page: pageName, link: original, normalized });
    } else {
      brokenLinks.push({ 
        page: pageName, 
        file: file,
        original: original, 
        normalized: normalized 
      });
    }
  });
});

// Afficher les résultats
if (brokenLinks.length > 0) {
  console.log(`❌ LIENS CASSÉS TROUVÉS: ${brokenLinks.length}\n`);
  
  // Grouper par page
  const grouped = {};
  brokenLinks.forEach(({ page, original, normalized }) => {
    if (!grouped[page]) {
      grouped[page] = [];
    }
    grouped[page].push({ original, normalized });
  });
  
  Object.keys(grouped).sort().forEach(page => {
    console.log(`📄 ${page}:`);
    grouped[page].forEach(({ original, normalized }) => {
      console.log(`   ❌ ${original} → ${normalized} (page introuvable)`);
    });
    console.log('');
  });
} else {
  console.log('✅ Tous les liens internes sont valides !\n');
}

console.log(`✅ Liens valides: ${validLinks.length}`);
console.log(`❌ Liens cassés: ${brokenLinks.length}\n`);

// Générer rapport
const report = {
  totalPages: allPages.length,
  existingPages: Array.from(existingPages).sort(),
  totalLinks: validLinks.length + brokenLinks.length,
  validLinks: validLinks.length,
  brokenLinks: brokenLinks.length,
  brokenLinksDetails: brokenLinks,
  timestamp: new Date().toISOString()
};

fs.writeFileSync(
  path.join(__dirname, '..', 'internal-links-report.json'),
  JSON.stringify(report, null, 2)
);

console.log('📄 Rapport sauvegardé: internal-links-report.json\n');

// Afficher quelques exemples de pages existantes pour référence
console.log('📋 Exemples de pages existantes:');
Array.from(existingPages).sort().slice(0, 10).forEach(page => {
  console.log(`   ${page}`);
});
if (existingPages.size > 10) {
  console.log(`   ... et ${existingPages.size - 10} autres`);
}
console.log('');

