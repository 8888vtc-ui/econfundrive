/**
 * Script de nettoyage - Remplace PricingRequest par un CTA simple vers /contact
 */
const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

function cleanFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 1. Supprimer l'import PricingRequest
    if (content.includes("import PricingRequest from")) {
        content = content.replace(/import PricingRequest from ['"][^'"]+['"];\s*\n?/g, '');
        modified = true;
    }

    // 2. Remplacer <PricingRequest /> par un CTA simple
    if (content.includes('<PricingRequest')) {
        // Remplacer toutes les variantes
        content = content.replace(/<PricingRequest\s*\/>/g, `<div class="cta-box">
        <a href="/contact" class="btn-primary">Demander un devis gratuit</a>
      </div>`);
        content = content.replace(/<PricingRequest\s+lang="en"\s*\/>/g, `<div class="cta-box">
        <a href="/en/booking" class="btn-primary">Get a Free Quote</a>
      </div>`);
        content = content.replace(/<PricingRequest\s+lang="it"\s*\/>/g, `<div class="cta-box">
        <a href="/it/contatto" class="btn-primary">Richiedi un preventivo</a>
      </div>`);
        content = content.replace(/<PricingRequest\s+lang="ru"\s*\/>/g, `<div class="cta-box">
        <a href="/ru/kontakt" class="btn-primary">Запросить цену</a>
      </div>`);
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(filePath, content);
        console.log('✅ Cleaned:', filePath);
        return true;
    }
    return false;
}

function walkDir(dir) {
    let count = 0;
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            count += walkDir(filePath);
        } else if (file.endsWith('.astro')) {
            if (cleanFile(filePath)) count++;
        }
    }
    return count;
}

console.log('🧹 Starting cleanup...');
const cleaned = walkDir(pagesDir);
console.log(`\n✨ Done! Cleaned ${cleaned} files.`);
