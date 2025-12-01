// Script pour corriger automatiquement les problèmes SEO de base
const fs = require('fs');
const path = require('path');

const report = JSON.parse(fs.readFileSync('seo-content-audit-report.json', 'utf8'));

console.log('CORRECTION SEO AUTOMATIQUE');
console.log('==========================\n');

let fixed = 0;
let skipped = 0;

report.pagesWithIssues.forEach(pageData => {
  const filePath = pageData.page;
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠ Fichier non trouvé: ${filePath}`);
    skipped++;
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 1. Ajouter canonical si manquant
    if (pageData.issues.some(i => i.includes('CANONICAL'))) {
      const canonicalMatch = content.match(/canonical="([^"]+)"/);
      if (!canonicalMatch) {
        // Extraire le chemin depuis le fichier
        const relativePath = filePath.replace(/^src\/pages\//, '').replace(/\.astro$/, '');
        const canonicalPath = relativePath === 'index' ? '/' : `/${relativePath}`;
        
        // Chercher BaseLayout
        const baseLayoutMatch = content.match(/<BaseLayout\s+([^>]+)>/);
        if (baseLayoutMatch) {
          const props = baseLayoutMatch[1];
          if (!props.includes('canonical')) {
            content = content.replace(
              /<BaseLayout\s+([^>]+)>/,
              `<BaseLayout $1\n  canonical="${canonicalPath}"`
            );
            modified = true;
            console.log(`✓ Canonical ajouté: ${filePath}`);
          }
        }
      }
    }

    // 2. Corriger title trop court/long
    const titleIssue = pageData.issues.find(i => i.includes('TITLE'));
    if (titleIssue) {
      const titleMatch = content.match(/const title = "([^"]+)"/);
      if (titleMatch) {
        let title = titleMatch[1];
        const titleLength = title.length;
        
        if (titleLength < 30) {
          // Enrichir le title
          if (!title.includes('ECOFUNDRIVE')) {
            title = `${title} | ECOFUNDRIVE`;
          }
          if (title.length < 50) {
            title = `${title} – Chauffeur Privé VTC Côte d'Azur`;
          }
          content = content.replace(/const title = "[^"]+"/, `const title = "${title}"`);
          modified = true;
          console.log(`✓ Title corrigé: ${filePath}`);
        } else if (titleLength > 60) {
          // Raccourcir le title
          const parts = title.split('|');
          if (parts.length > 1) {
            title = parts[0].trim() + ' | ECOFUNDRIVE';
          } else {
            title = title.substring(0, 50) + '...';
          }
          content = content.replace(/const title = "[^"]+"/, `const title = "${title}"`);
          modified = true;
          console.log(`✓ Title raccourci: ${filePath}`);
        }
      }
    }

    // 3. Corriger description trop courte
    const descIssue = pageData.issues.find(i => i.includes('DESCRIPTION TROP COURTE'));
    if (descIssue) {
      const descMatch = content.match(/const description = "([^"]+)"/);
      if (descMatch) {
        let description = descMatch[1];
        if (description.length < 120) {
          // Enrichir la description
          if (!description.includes('ECOFUNDRIVE')) {
            description += ' Service ECOFUNDRIVE professionnel 24h/24.';
          }
          if (description.length < 150) {
            description += ' Véhicules premium, chauffeurs expérimentés.';
          }
          // Limiter à 160 caractères
          if (description.length > 160) {
            description = description.substring(0, 157) + '...';
          }
          content = content.replace(/const description = "[^"]+"/, `const description = "${description}"`);
          modified = true;
          console.log(`✓ Description enrichie: ${filePath}`);
        }
      }
    }

    // 4. Corriger description trop longue
    const descLongIssue = pageData.issues.find(i => i.includes('DESCRIPTION TROP LONGUE'));
    if (descLongIssue) {
      const descMatch = content.match(/const description = "([^"]+)"/);
      if (descMatch) {
        let description = descMatch[1];
        if (description.length > 160) {
          description = description.substring(0, 157) + '...';
          content = content.replace(/const description = "[^"]+"/, `const description = "${description}"`);
          modified = true;
          console.log(`✓ Description raccourcie: ${filePath}`);
        }
      }
    }

    // 5. Ajouter keywords si manquant ou insuffisant
    const keywordsIssue = pageData.issues.find(i => i.includes('KEYWORDS'));
    if (keywordsIssue) {
      if (!content.includes('const keywords = [')) {
        // Ajouter keywords de base
        const keywordsBlock = `const keywords = [
  'VTC Côte d'Azur',
  'chauffeur privé',
  'transfert aéroport',
  'VTC Nice',
  'VTC Cannes',
  'transport premium'
];`;
        
        // Insérer après description
        const descMatch = content.match(/const description = "[^"]+";/);
        if (descMatch) {
          content = content.replace(descMatch[0], descMatch[0] + '\n' + keywordsBlock);
          modified = true;
          console.log(`✓ Keywords ajoutés: ${filePath}`);
        }
      } else {
        // Enrichir keywords existants
        const keywordsMatch = content.match(/const keywords = \[([^\]]+)\]/s);
        if (keywordsMatch) {
          const keywordsContent = keywordsMatch[1];
          const keywordCount = (keywordsContent.match(/'[^']+'/g) || []).length;
          if (keywordCount < 5) {
            // Ajouter des keywords génériques
            const additionalKeywords = [
              "VTC Côte d'Azur",
              'chauffeur privé',
              'transport premium'
            ];
            const newKeywords = keywordsContent.trim() + ',\n  ' + additionalKeywords.join(',\n  ');
            content = content.replace(
              /const keywords = \[([^\]]+)\]/s,
              `const keywords = [${newKeywords}]`
            );
            modified = true;
            console.log(`✓ Keywords enrichis: ${filePath}`);
          }
        }
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      fixed++;
    } else {
      skipped++;
    }

  } catch (error) {
    console.log(`✗ Erreur sur ${filePath}: ${error.message}`);
    skipped++;
  }
});

console.log(`\n==========================`);
console.log(`Fichiers corrigés: ${fixed}`);
console.log(`Fichiers ignorés: ${skipped}`);
console.log(`TERMINE`);

