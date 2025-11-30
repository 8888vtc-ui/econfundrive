// Migration des pages multi-langue (en/it/ru)
const fs = require('fs');
const path = require('path');

const languages = ['en', 'it', 'ru'];

function extractTitleAndDescription(htmlContent) {
  const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/i);
  const descMatch = htmlContent.match(/<meta name="description" content="(.*?)">/i);
  
  return {
    title: titleMatch ? titleMatch[1].replace(/&amp;/g, '&').replace(/"/g, '&quot;') : 'Page',
    description: descMatch ? descMatch[1].replace(/"/g, '&quot;') : 'Description'
  };
}

function extractCanonical(htmlContent) {
  const canonicalMatch = htmlContent.match(/<link rel="canonical" href="(.*?)">/i);
  return canonicalMatch ? canonicalMatch[1].replace('https://www.ecofundrive.com', '') : null;
}

function extractBodyContent(htmlContent) {
  const mainMatch = htmlContent.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch) {
    let content = mainMatch[1];
    content = content.replace(/href="\/([^"]+)\.html/g, 'href="/$1');
    content = content.replace(/href="([^"]+)\.html/g, 'href="$1');
    return content;
  }
  return '';
}

languages.forEach(lang => {
  const langDir = path.join(__dirname, lang);
  if (!fs.existsSync(langDir)) {
    console.log(`⚠️  Dossier ${lang} n'existe pas`);
    return;
  }

  const htmlFiles = fs.readdirSync(langDir).filter(f => f.endsWith('.html'));
  console.log(`\n🌍 Migration ${lang.toUpperCase()} (${htmlFiles.length} pages)`);

  htmlFiles.forEach(file => {
    const htmlFile = path.join(langDir, file);
    const pageName = path.basename(file, '.html');
    const astroFile = path.join(__dirname, 'src', 'pages', lang, `${pageName}.astro`);

    try {
      const htmlContent = fs.readFileSync(htmlFile, 'utf-8');
      const { title, description } = extractTitleAndDescription(htmlContent);
      const canonical = extractCanonical(htmlContent) || `/${lang}/${pageName === 'index' ? '' : pageName}`;
      const bodyContent = extractBodyContent(htmlContent);

      const astroContent = `---
import BaseLayout from '../../layouts/BaseLayout.astro';

const title = "${title}";
const description = "${description}";
const canonical = "${canonical}";
---

<BaseLayout 
  title={title}
  description={description}
  currentPage="${pageName}"
  canonical={canonical}
>
${bodyContent}
</BaseLayout>
`;

      const dir = path.dirname(astroFile);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(astroFile, astroContent, 'utf-8');
      console.log(`   ✅ ${file}`);
    } catch (error) {
      console.error(`   ❌ ${file}: ${error.message}`);
    }
  });
});

console.log(`\n✅ Migration multi-langue terminée!`);

