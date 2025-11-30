// Script d'analyse du linking interne
const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '..', 'src', 'pages');
const allPages = [];
const linkMap = new Map(); // page -> [pages liées]
const backlinkMap = new Map(); // page -> [pages qui la lient]

function extractLinks(content, filePath) {
  const links = [];
  const linkRegex = /href=["']([^"']+)["']/g;
  let match;
  
  while ((match = linkRegex.exec(content)) !== null) {
    let link = match[1];
    // Ignorer les liens externes, anchors, mailto, tel
    if (link.startsWith('http') || link.startsWith('#') || 
        link.startsWith('mailto:') || link.startsWith('tel:')) {
      continue;
    }
    
    // Normaliser les liens
    if (link.startsWith('/')) {
      link = link.substring(1);
    }
    
    // Retirer .html et index
    link = link.replace(/\.html$/, '').replace(/\/index$/, '').replace(/^index$/, '');
    if (link) {
      links.push(link);
    }
  }
  
  return links;
}

function getPageSlug(filePath) {
  const relative = path.relative(pagesDir, filePath);
  const slug = relative
    .replace(/\.astro$/, '')
    .replace(/\\/g, '/')
    .replace(/\/index$/, '')
    .replace(/^index$/, '');
  return slug || 'index';
}

function scanPages(dir, basePath = '') {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      scanPages(filePath, path.join(basePath, file));
    } else if (file.endsWith('.astro')) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const slug = getPageSlug(filePath);
      const links = extractLinks(content, filePath);
      
      allPages.push(slug);
      linkMap.set(slug, links);
      
      // Construire les backlinks
      links.forEach(linkedPage => {
        if (!backlinkMap.has(linkedPage)) {
          backlinkMap.set(linkedPage, []);
        }
        backlinkMap.get(linkedPage).push(slug);
      });
    }
  }
}

// Analyser
scanPages(pagesDir);

// Générer le rapport
console.log('📊 ANALYSE DU LINKING INTERNE\n');
console.log('='.repeat(50));
console.log(`\n📄 Total pages: ${allPages.length}\n`);

// Pages orphelines (sans backlinks)
console.log('🔴 PAGES ORPHELINES (peu de backlinks):');
const orphanPages = allPages
  .filter(page => {
    const backlinks = backlinkMap.get(page) || [];
    return backlinks.length < 2 && page !== 'index';
  })
  .sort((a, b) => {
    const aLinks = (backlinkMap.get(a) || []).length;
    const bLinks = (backlinkMap.get(b) || []).length;
    return aLinks - bLinks;
  });

orphanPages.slice(0, 10).forEach(page => {
  const backlinks = backlinkMap.get(page) || [];
  console.log(`  - ${page} (${backlinks.length} backlink${backlinks.length > 1 ? 's' : ''})`);
});

// Pages les plus liées
console.log('\n✅ PAGES LES PLUS LIÉES (bonne structure):');
const topLinked = allPages
  .map(page => ({
    page,
    backlinks: (backlinkMap.get(page) || []).length,
    outlinks: (linkMap.get(page) || []).length
  }))
  .sort((a, b) => b.backlinks - a.backlinks)
  .slice(0, 10);

topLinked.forEach(({ page, backlinks, outlinks }) => {
  console.log(`  - ${page}: ${backlinks} backlinks, ${outlinks} outlinks`);
});

// Pages sans liens sortants
console.log('\n⚠️  PAGES SANS LIENS SORTANTS:');
const noOutlinks = allPages.filter(page => {
  const outlinks = linkMap.get(page) || [];
  return outlinks.length === 0 && page !== 'index';
});

noOutlinks.forEach(page => {
  console.log(`  - ${page}`);
});

// Recommandations
console.log('\n💡 RECOMMANDATIONS:');
console.log('  1. Ajouter des liens vers les pages orphelines depuis:');
orphanPages.slice(0, 5).forEach(page => {
  console.log(`     - ${page} (depuis index, services, ou pages VTC)`);
});

console.log('\n  2. Pages à améliorer avec plus de liens internes:');
noOutlinks.slice(0, 5).forEach(page => {
  console.log(`     - ${page}`);
});

// Export JSON pour analyse
const report = {
  totalPages: allPages.length,
  orphanPages: orphanPages.map(page => ({
    page,
    backlinks: (backlinkMap.get(page) || []).length
  })),
  topLinked: topLinked,
  noOutlinks: noOutlinks,
  linkMap: Object.fromEntries(linkMap),
  backlinkMap: Object.fromEntries(backlinkMap)
};

fs.writeFileSync(
  path.join(__dirname, '..', 'internal-links-report.json'),
  JSON.stringify(report, null, 2)
);

console.log('\n✅ Rapport JSON sauvegardé: internal-links-report.json');

