/**
 * Script de vérification SEO complète
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const srcDir = path.join(__dirname, '../src');
const publicDir = path.join(__dirname, '../public');

const results = {
  meta: { total: 0, withTitle: 0, withDescription: 0, withKeywords: 0, issues: [] },
  schema: { total: 0, found: [], missing: [] },
  hreflang: { total: 0, found: 0, issues: [] },
  headings: { total: 0, withH1: 0, multipleH1: [], noH1: [] },
  images: { total: 0, withAlt: 0, withoutAlt: [] },
  links: { internal: 0, external: 0, broken: [] },
  canonical: { total: 0, found: 0, missing: [] },
  og: { total: 0, found: 0, missing: [] },
  sitemap: { exists: false, valid: false },
  robots: { exists: false, valid: false }
};

// Vérifier les meta tags
function checkMetaTags(content, filePath) {
  const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
  const descriptionMatch = content.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  const keywordsMatch = content.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']+)["']/i);
  
  results.meta.total++;
  
  if (titleMatch) {
    results.meta.withTitle++;
    const title = titleMatch[1].trim();
    if (title.length < 30 || title.length > 60) {
      results.meta.issues.push(`${filePath}: Title length ${title.length} (should be 30-60)`);
    }
  } else {
    results.meta.issues.push(`${filePath}: Missing <title>`);
  }
  
  if (descriptionMatch) {
    results.meta.withDescription++;
    const desc = descriptionMatch[1].trim();
    if (desc.length < 120 || desc.length > 160) {
      results.meta.issues.push(`${filePath}: Description length ${desc.length} (should be 120-160)`);
    }
  } else {
    results.meta.issues.push(`${filePath}: Missing meta description`);
  }
  
  if (keywordsMatch) {
    results.meta.withKeywords++;
  }
}

// Vérifier Schema.org
function checkSchema(content, filePath) {
  const schemaMatches = content.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  
  if (schemaMatches) {
    schemaMatches.forEach(match => {
      try {
        const jsonMatch = match.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
        if (jsonMatch) {
          const json = JSON.parse(jsonMatch[1]);
          results.schema.found.push({
            file: filePath,
            type: json['@type'] || 'Unknown',
            hasName: !!json.name,
            hasUrl: !!json.url
          });
        }
      } catch (e) {
        // JSON invalide
      }
    });
  } else {
    results.schema.missing.push(filePath);
  }
  
  results.schema.total++;
}

// Vérifier Hreflang
function checkHreflang(content, filePath) {
  const hreflangMatches = content.match(/<link[^>]*rel=["']alternate["'][^>]*hreflang=["']([^"']+)["']/gi);
  
  if (hreflangMatches) {
    results.hreflang.found++;
    results.hreflang.total++;
  } else {
    // Vérifier si c'est une page multilingue
    if (filePath.includes('/en/') || filePath.includes('/it/') || filePath.includes('/ru/')) {
      results.hreflang.issues.push(`${filePath}: Missing hreflang tags`);
    }
  }
}

// Vérifier les headings
function checkHeadings(content, filePath) {
  const h1Matches = content.match(/<h1[^>]*>([^<]+)<\/h1>/gi);
  const h2Matches = content.match(/<h2[^>]*>([^<]+)<\/h2>/gi);
  
  if (h1Matches) {
    if (h1Matches.length === 1) {
      results.headings.withH1++;
    } else {
      results.headings.multipleH1.push(filePath);
    }
  } else {
    results.headings.noH1.push(filePath);
  }
  
  results.headings.total++;
}

// Vérifier les images
function checkImages(content, filePath) {
  const imgMatches = content.match(/<img[^>]*>/gi);
  
  if (imgMatches) {
    imgMatches.forEach(img => {
      results.images.total++;
      if (img.match(/alt=["']([^"']+)["']/i)) {
        results.images.withAlt++;
      } else {
        results.images.withoutAlt.push(`${filePath}: Image without alt`);
      }
    });
  }
}

// Vérifier les liens
function checkLinks(content, filePath) {
  const linkMatches = content.match(/<a[^>]*href=["']([^"']+)["']/gi);
  
  if (linkMatches) {
    linkMatches.forEach(link => {
      const hrefMatch = link.match(/href=["']([^"']+)["']/i);
      if (hrefMatch) {
        const href = hrefMatch[1];
        if (href.startsWith('/') || href.startsWith('./') || !href.startsWith('http')) {
          results.links.internal++;
        } else {
          results.links.external++;
        }
      }
    });
  }
}

// Vérifier canonical
function checkCanonical(content, filePath) {
  const canonicalMatch = content.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  
  if (canonicalMatch) {
    results.canonical.found++;
  } else {
    results.canonical.missing.push(filePath);
  }
  
  results.canonical.total++;
}

// Vérifier Open Graph
function checkOpenGraph(content, filePath) {
  const ogMatch = content.match(/<meta[^>]*property=["']og:/i);
  
  if (ogMatch) {
    results.og.found++;
  } else {
    results.og.missing.push(filePath);
  }
  
  results.og.total++;
}

// Vérifier sitemap
function checkSitemap() {
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  results.sitemap.exists = fs.existsSync(sitemapPath);
  
  if (results.sitemap.exists) {
    try {
      const content = fs.readFileSync(sitemapPath, 'utf8');
      results.sitemap.valid = content.includes('<?xml') && content.includes('<urlset');
    } catch (e) {
      results.sitemap.valid = false;
    }
  }
}

// Vérifier robots.txt
function checkRobots() {
  const robotsPath = path.join(publicDir, 'robots.txt');
  results.robots.exists = fs.existsSync(robotsPath);
  
  if (results.robots.exists) {
    try {
      const content = fs.readFileSync(robotsPath, 'utf8');
      results.robots.valid = content.includes('User-agent') || content.includes('Sitemap');
    } catch (e) {
      results.robots.valid = false;
    }
  }
}

// Traiter tous les fichiers .astro
const astroFiles = glob.sync('**/*.astro', { 
  cwd: srcDir,
  absolute: true,
  ignore: ['**/_archived/**', '**/node_modules/**']
});

console.log(`\n🔍 Vérification SEO de ${astroFiles.length} fichiers...\n`);

astroFiles.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const relativePath = path.relative(srcDir, file);
    
    // Ne vérifier que les pages (pas les composants)
    if (file.includes('/pages/') || file.includes('\\pages\\')) {
      checkMetaTags(content, relativePath);
      checkSchema(content, relativePath);
      checkHreflang(content, relativePath);
      checkHeadings(content, relativePath);
      checkCanonical(content, relativePath);
      checkOpenGraph(content, relativePath);
    }
    
    // Vérifier images et liens partout
    checkImages(content, relativePath);
    checkLinks(content, relativePath);
  } catch (error) {
    console.error(`Erreur lecture ${file}:`, error.message);
  }
});

// Vérifier sitemap et robots
checkSitemap();
checkRobots();

// Afficher les résultats
console.log('📊 RÉSULTATS SEO\n');

console.log('1. META TAGS:');
console.log(`   Total pages: ${results.meta.total}`);
console.log(`   ✅ Avec title: ${results.meta.withTitle}/${results.meta.total}`);
console.log(`   ✅ Avec description: ${results.meta.withDescription}/${results.meta.total}`);
console.log(`   ✅ Avec keywords: ${results.meta.withKeywords}/${results.meta.total}`);
if (results.meta.issues.length > 0) {
  console.log(`   ⚠️  Issues: ${results.meta.issues.length}`);
  results.meta.issues.slice(0, 10).forEach(issue => console.log(`      - ${issue}`));
  if (results.meta.issues.length > 10) {
    console.log(`      ... et ${results.meta.issues.length - 10} autres`);
  }
}

console.log('\n2. SCHEMA.ORG:');
console.log(`   Total pages: ${results.schema.total}`);
console.log(`   ✅ Avec Schema: ${results.schema.found.length}`);
console.log(`   ❌ Sans Schema: ${results.schema.missing.length}`);
if (results.schema.found.length > 0) {
  const types = {};
  results.schema.found.forEach(s => {
    types[s.type] = (types[s.type] || 0) + 1;
  });
  console.log(`   Types trouvés:`, types);
}

console.log('\n3. HREFLANG:');
console.log(`   Total pages multilingues: ${results.hreflang.total}`);
console.log(`   ✅ Avec hreflang: ${results.hreflang.found}`);
if (results.hreflang.issues.length > 0) {
  console.log(`   ⚠️  Sans hreflang: ${results.hreflang.issues.length}`);
  results.hreflang.issues.slice(0, 5).forEach(issue => console.log(`      - ${issue}`));
}

console.log('\n4. HEADINGS:');
console.log(`   Total pages: ${results.headings.total}`);
console.log(`   ✅ Avec H1 unique: ${results.headings.withH1}`);
if (results.headings.multipleH1.length > 0) {
  console.log(`   ⚠️  Pages avec plusieurs H1: ${results.headings.multipleH1.length}`);
  results.headings.multipleH1.slice(0, 5).forEach(f => console.log(`      - ${f}`));
}
if (results.headings.noH1.length > 0) {
  console.log(`   ❌ Pages sans H1: ${results.headings.noH1.length}`);
  results.headings.noH1.slice(0, 5).forEach(f => console.log(`      - ${f}`));
}

console.log('\n5. IMAGES:');
console.log(`   Total images: ${results.images.total}`);
console.log(`   ✅ Avec alt: ${results.images.withAlt}/${results.images.total}`);
if (results.images.withoutAlt.length > 0) {
  console.log(`   ❌ Sans alt: ${results.images.withoutAlt.length}`);
  results.images.withoutAlt.slice(0, 5).forEach(issue => console.log(`      - ${issue}`));
}

console.log('\n6. LIENS:');
console.log(`   ✅ Liens internes: ${results.links.internal}`);
console.log(`   ✅ Liens externes: ${results.links.external}`);

console.log('\n7. CANONICAL:');
console.log(`   Total pages: ${results.canonical.total}`);
console.log(`   ✅ Avec canonical: ${results.canonical.found}/${results.canonical.total}`);
if (results.canonical.missing.length > 0) {
  console.log(`   ⚠️  Sans canonical: ${results.canonical.missing.length}`);
  results.canonical.missing.slice(0, 5).forEach(f => console.log(`      - ${f}`));
}

console.log('\n8. OPEN GRAPH:');
console.log(`   Total pages: ${results.og.total}`);
console.log(`   ✅ Avec OG: ${results.og.found}/${results.og.total}`);
if (results.og.missing.length > 0) {
  console.log(`   ⚠️  Sans OG: ${results.og.missing.length}`);
  results.og.missing.slice(0, 5).forEach(f => console.log(`      - ${f}`));
}

console.log('\n9. SITEMAP:');
console.log(`   ${results.sitemap.exists ? '✅' : '❌'} Existe: ${results.sitemap.exists}`);
console.log(`   ${results.sitemap.valid ? '✅' : '❌'} Valide: ${results.sitemap.valid}`);

console.log('\n10. ROBOTS.TXT:');
console.log(`   ${results.robots.exists ? '✅' : '❌'} Existe: ${results.robots.exists}`);
console.log(`   ${results.robots.valid ? '✅' : '❌'} Valide: ${results.robots.valid}`);

// Score SEO
const score = {
  meta: (results.meta.withTitle / results.meta.total) * 20,
  schema: (results.schema.found.length / results.schema.total) * 20,
  headings: (results.headings.withH1 / results.headings.total) * 15,
  images: (results.images.withAlt / results.images.total) * 15,
  canonical: (results.canonical.found / results.canonical.total) * 10,
  og: (results.og.found / results.og.total) * 10,
  sitemap: results.sitemap.exists && results.sitemap.valid ? 5 : 0,
  robots: results.robots.exists && results.robots.valid ? 5 : 0
};

const totalScore = Object.values(score).reduce((a, b) => a + b, 0);

console.log('\n📈 SCORE SEO GLOBAL:');
console.log(`   ${Math.round(totalScore)}/100\n`);

if (totalScore >= 90) {
  console.log('✅ Excellent SEO !');
} else if (totalScore >= 70) {
  console.log('⚠️  SEO correct, quelques améliorations possibles');
} else {
  console.log('❌ SEO à améliorer');
}

console.log('');

