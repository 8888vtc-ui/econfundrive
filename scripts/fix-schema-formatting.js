// Script pour corriger le formatage des schemas et ajouter Article pour guides
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
console.log('CORRECTION FORMATAGE SCHEMAS + ARTICLE');
console.log('======================================\n');

let fixed = 0;
let articleAdded = 0;

pageFiles.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    let modified = false;

    // 1. Corriger le formatage des schemas (mettre sur plusieurs lignes)
    if (content.includes('schema={{')) {
      // Extraire le schema
      const schemaMatch = content.match(/schema=\{\{([^}]+)\}\}/);
      if (schemaMatch) {
        try {
          const schemaStr = schemaMatch[1];
          const schema = JSON.parse(schemaStr);
          
          // Reformater proprement
          const formattedSchema = JSON.stringify(schema, null, 2);
          const newSchemaProp = `schema={${formattedSchema}}`;
          
          content = content.replace(/schema=\{\{[^}]+\}\}/, newSchemaProp);
          modified = true;
          console.log(`✓ Schema reformaté: ${filePath}`);
        } catch (e) {
          // Ignorer si JSON invalide
        }
      }
    }

    // 2. Ajouter Schema Article pour les guides
    if (fileName.startsWith('guide-') && !content.includes('"@type":"Article"')) {
      // Extraire title et description
      const titleMatch = content.match(/const title = "([^"]+)"/);
      const descMatch = content.match(/const description = "([^"]+)"/);
      const canonicalMatch = content.match(/canonical="([^"]+)"/);
      
      if (titleMatch && descMatch) {
        const title = titleMatch[1];
        const description = descMatch[1];
        const canonical = canonicalMatch ? canonicalMatch[1] : `/${fileName.replace('.astro', '')}`;
        const url = `https://www.ecofundrive.com${canonical}`;
        
        const articleSchema = {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": title,
          "description": description,
          "url": url,
          "author": {
            "@type": "Person",
            "name": "David Chemla"
          },
          "publisher": {
            "@type": "Organization",
            "name": "ECOFUNDRIVE",
            "logo": {
              "@type": "ImageObject",
              "url": "https://www.ecofundrive.com/assets/img/logo.png"
            }
          },
          "datePublished": "2024-01-01",
          "dateModified": new Date().toISOString().split('T')[0]
        };
        
        // Chercher BaseLayout et ajouter schema
        if (content.includes('<BaseLayout')) {
          const baseLayoutMatch = content.match(/<BaseLayout\s+([^>]+)>/);
          if (baseLayoutMatch) {
            const props = baseLayoutMatch[1];
            
            // Si schema existe déjà, le remplacer par un array
            if (props.includes('schema={')) {
              // Extraire le schema existant et créer un array
              const existingSchemaMatch = content.match(/schema=\{([^}]+)\}/);
              if (existingSchemaMatch) {
                try {
                  const existingSchema = JSON.parse(existingSchemaMatch[1]);
                  const combinedSchema = {
                    "@context": "https://schema.org",
                    "@graph": [existingSchema, articleSchema]
                  };
                  const formatted = JSON.stringify(combinedSchema, null, 2);
                  content = content.replace(/schema=\{([^}]+)\}/, `schema={${formatted}}`);
                } catch (e) {
                  // Ajouter articleSchema séparément
                  const formatted = JSON.stringify(articleSchema, null, 2);
                  content = content.replace(/schema=\{([^}]+)\}/, `schema={${formatted}}`);
                }
              }
            } else {
              // Ajouter schema
              const formatted = JSON.stringify(articleSchema, null, 2);
              const schemaProp = `\n  schema={${formatted}}`;
              content = content.replace(/<BaseLayout\s+([^>]+)>/, `<BaseLayout $1${schemaProp}\n>`);
            }
            
            modified = true;
            articleAdded++;
            console.log(`✓ Schema Article ajouté: ${filePath}`);
          }
        }
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      fixed++;
    }

  } catch (error) {
    console.log(`✗ Erreur sur ${filePath}: ${error.message}`);
  }
});

console.log(`\n======================================`);
console.log(`Schemas reformatés: ${fixed - articleAdded}`);
console.log(`Schemas Article ajoutés: ${articleAdded}`);
console.log(`Total pages modifiées: ${fixed}`);
console.log(`TERMINE`);

