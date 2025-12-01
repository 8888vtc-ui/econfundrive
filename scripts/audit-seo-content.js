// Audit SEO On-Page et Contenu Complet - Site ECOFUNDRIVE
const fs = require('fs');
const path = require('path');

console.log('========================================');
console.log('AUDIT SEO ON-PAGE ET CONTENU COMPLET');
console.log('========================================');
console.log('');

const report = {
  totalPages: 0,
  pagesWithIssues: [],
  statistics: {
    totalWords: 0,
    totalH2: 0,
    totalH3: 0,
    totalImages: 0,
    totalInternalLinks: 0
  }
};

// Trouver tous les fichiers .astro dans src/pages
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
report.totalPages = pageFiles.length;

console.log(`Analyse de ${pageFiles.length} pages...`);
console.log('');

pageFiles.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = filePath.replace(process.cwd() + path.sep, '').replace(/\\/g, '/');
    const pageIssues = [];
    
    // 1. VERIFICATION TITLE
    const titleMatch = content.match(/const title = "([^"]+)"/);
    if (titleMatch) {
      const title = titleMatch[1];
      const titleLength = title.length;
      if (titleLength < 30) {
        pageIssues.push(`TITLE TROP COURT (${titleLength} caracteres, minimum 50)`);
      }
      if (titleLength > 60) {
        pageIssues.push(`TITLE TROP LONG (${titleLength} caracteres, maximum 60)`);
      }
    } else {
      pageIssues.push('TITLE MANQUANT');
    }
    
    // 2. VERIFICATION DESCRIPTION
    const descMatch = content.match(/const description = "([^"]+)"/);
    if (descMatch) {
      const description = descMatch[1];
      const descLength = description.length;
      if (descLength < 120) {
        pageIssues.push(`DESCRIPTION TROP COURTE (${descLength} caracteres, minimum 150)`);
      }
      if (descLength > 160) {
        pageIssues.push(`DESCRIPTION TROP LONGUE (${descLength} caracteres, maximum 160)`);
      }
    } else {
      pageIssues.push('DESCRIPTION MANQUANTE');
    }
    
    // 3. VERIFICATION KEYWORDS
    if (!content.includes('const keywords = [')) {
      pageIssues.push('KEYWORDS MANQUANTS');
    } else {
      const keywordsMatch = content.match(/const keywords = \[([^\]]+)\]/s);
      if (keywordsMatch) {
        const keywordsContent = keywordsMatch[1];
        const keywordCount = (keywordsContent.match(/'[^']+'/g) || []).length;
        if (keywordCount < 5) {
          pageIssues.push(`PEU DE KEYWORDS (${keywordCount}, minimum 5 recommande)`);
        }
      }
    }
    
    // 4. VERIFICATION H1
    const h1Matches = content.match(/<h1[^>]*>/g);
    if (!h1Matches || h1Matches.length === 0) {
      pageIssues.push('H1 MANQUANT');
    } else if (h1Matches.length > 1) {
      pageIssues.push(`MULTIPLES H1 (${h1Matches.length}, maximum 1)`);
    }
    
    // 5. VERIFICATION STRUCTURE H2/H3
    const h2Matches = content.match(/<h2[^>]*>/g) || [];
    const h3Matches = content.match(/<h3[^>]*>/g) || [];
    const h2Count = h2Matches.length;
    const h3Count = h3Matches.length;
    
    if (h2Count === 0) {
      pageIssues.push('AUCUN H2 (structure manquante)');
    }
    if (h2Count < 2 && content.length > 1000) {
      pageIssues.push(`PEU DE H2 (${h2Count} pour contenu long, minimum 2-3 recommande)`);
    }
    
    // 6. VERIFICATION IMAGES (alt text)
    const imgMatches = content.match(/<img[^>]+>|<OptimizedImage[^>]+>/gi) || [];
    let imgWithoutAlt = 0;
    imgMatches.forEach(img => {
      if (!img.match(/alt="[^"]+"/)) {
        imgWithoutAlt++;
      }
    });
    if (imgWithoutAlt > 0) {
      pageIssues.push(`IMAGES SANS ALT (${imgWithoutAlt} image(s))`);
    }
    
    // 7. VERIFICATION LIENS INTERNES
    const internalLinks = (content.match(/href="(\/[^"]+)"/g) || []).length;
    if (internalLinks < 2) {
      pageIssues.push(`PEU DE LIENS INTERNES (${internalLinks}, minimum 2-3 recommande)`);
    }
    
    // 8. VERIFICATION CONTENU (nombre de mots)
    const textContent = content
      .replace(/---[\s\S]*?---/, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const wordCount = textContent.split(/\s+/).filter(w => w.length > 0).length;
    
    if (wordCount < 300) {
      pageIssues.push(`CONTENU TROP FAIBLE (${wordCount} mots, minimum 400 recommande)`);
    }
    const fileName = path.basename(filePath);
    if (wordCount < 500 && /index|services/.test(fileName)) {
      pageIssues.push(`CONTENU INSUFFISANT POUR PAGE PRINCIPALE (${wordCount} mots, minimum 800 recommande)`);
    }
    if (wordCount < 1000 && fileName.includes('guide-')) {
      pageIssues.push(`CONTENU INSUFFISANT POUR GUIDE (${wordCount} mots, minimum 1200 recommande)`);
    }
    
    // 9. VERIFICATION CANONICAL
    if (!content.includes('canonical')) {
      pageIssues.push('CANONICAL NON SPECIFIE (utilise la valeur par defaut)');
    }
    
    // 10. VERIFICATION SCHEMA.ORG
    if (!content.match(/schema|Schema/)) {
      pageIssues.push('SCHEMA.ORG MANQUANT (utilise le schema de base uniquement)');
    }
    
    // 11. VERIFICATION BREADCRUMBS
    const dirName = path.dirname(filePath).split(path.sep).pop();
    if (fileName !== 'index.astro' && !['en', 'it', 'ru'].includes(dirName) && !content.includes('breadcrumbItems')) {
      pageIssues.push('BREADCRUMBS MANQUANTS (recommandé pour SEO)');
    }
    
    // Ajouter aux statistiques
    report.statistics.totalWords += wordCount;
    report.statistics.totalH2 += h2Count;
    report.statistics.totalH3 += h3Count;
    report.statistics.totalImages += imgMatches.length;
    report.statistics.totalInternalLinks += internalLinks;
    
    // Si des problèmes trouvés, ajouter à la liste
    if (pageIssues.length > 0) {
      report.pagesWithIssues.push({
        page: relativePath,
        issues: pageIssues,
        wordCount: wordCount,
        h2Count: h2Count,
        h3Count: h3Count,
        images: imgMatches.length,
        internalLinks: internalLinks
      });
      
      console.log(`⚠ ${relativePath}`);
      pageIssues.forEach(issue => {
        console.log(`   - ${issue}`);
      });
    } else {
      console.log(`✓ ${relativePath}`);
    }
    
  } catch (error) {
    console.log(`✗ ERREUR: ${path.basename(filePath)} - ${error.message}`);
  }
});

console.log('');
console.log('========================================');
console.log('RESUME DE L\'AUDIT');
console.log('========================================');
console.log('');
console.log(`Total de pages analysees: ${report.totalPages}`);
console.log(`Pages avec problemes: ${report.pagesWithIssues.length}`);
console.log('');

if (report.statistics.totalWords > 0) {
  const avgWords = Math.round(report.statistics.totalWords / report.totalPages);
  console.log('STATISTIQUES GLOBALES:');
  console.log(`  - Total de mots: ${report.statistics.totalWords}`);
  console.log(`  - Mots moyens par page: ${avgWords}`);
  console.log(`  - Total H2: ${report.statistics.totalH2}`);
  console.log(`  - Total H3: ${report.statistics.totalH3}`);
  console.log(`  - Total images: ${report.statistics.totalImages}`);
  console.log(`  - Total liens internes: ${report.statistics.totalInternalLinks}`);
  console.log('');
}

// Sauvegarder le rapport
const reportJson = JSON.stringify(report, null, 2);
const reportPath = 'seo-content-audit-report.json';
fs.writeFileSync(reportPath, reportJson, 'utf8');

console.log(`Rapport sauvegarde dans: ${reportPath}`);
console.log('');
console.log('TERMINE');

