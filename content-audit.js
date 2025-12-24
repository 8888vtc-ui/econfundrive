/**
 * Audit de qualité du contenu - ECOFUNDRIVE
 * Analyse chaque page .astro et génère un rapport
 */
const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const issues = [];
let totalPages = 0;

function analyzePage(filePath, relativePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const pageIssues = [];

    // Extraire le frontmatter
    const frontmatterMatch = content.match(/^---\s*([\s\S]*?)\s*---/);
    const frontmatter = frontmatterMatch ? frontmatterMatch[1] : '';
    const htmlContent = frontmatterMatch ? content.slice(frontmatterMatch[0].length) : content;

    // 1. Vérifier le titre
    const titleMatch = frontmatter.match(/const title\s*=\s*["'`]([^"'`]+)["'`]/);
    const title = titleMatch ? titleMatch[1] : null;
    if (!title) {
        pageIssues.push('❌ Pas de title défini');
    } else if (title.length < 30) {
        pageIssues.push(`⚠️ Title trop court (${title.length} chars): "${title}"`);
    } else if (title.length > 70) {
        pageIssues.push(`⚠️ Title trop long (${title.length} chars)`);
    }

    // 2. Vérifier la description
    const descMatch = frontmatter.match(/const description\s*=\s*["'`]([^"'`]+)["'`]/);
    const desc = descMatch ? descMatch[1] : null;
    if (!desc) {
        pageIssues.push('❌ Pas de description définie');
    } else if (desc.length < 100) {
        pageIssues.push(`⚠️ Description trop courte (${desc.length} chars)`);
    } else if (desc.length > 160) {
        pageIssues.push(`⚠️ Description trop longue (${desc.length} chars)`);
    }

    // 3. Vérifier H1
    const h1Match = htmlContent.match(/<h1[^>]*>([^<]+)<\/h1>/);
    if (!h1Match) {
        pageIssues.push('❌ Pas de balise H1');
    }

    // 4. Vérifier la longueur du contenu (hors code)
    const textContent = htmlContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const wordCount = textContent.split(' ').length;
    if (wordCount < 100) {
        pageIssues.push(`⚠️ Contenu très court (${wordCount} mots)`);
    } else if (wordCount < 300) {
        pageIssues.push(`ℹ️ Contenu court (${wordCount} mots)`);
    }

    // 5. Vérifier les CTAs
    const hasCTA = htmlContent.includes('/reservation') || htmlContent.includes('/contact') || htmlContent.includes('/booking') || htmlContent.includes('wa.me');
    if (!hasCTA) {
        pageIssues.push('⚠️ Pas de CTA (lien vers réservation/contact)');
    }

    // 6. Vérifier les images alt
    const imgTags = htmlContent.match(/<img[^>]+>/g) || [];
    const missingAlt = imgTags.filter(img => !img.includes('alt=')).length;
    if (missingAlt > 0) {
        pageIssues.push(`⚠️ ${missingAlt} image(s) sans attribut alt`);
    }

    // 7. Vérifier les liens cassés potentiels (internes)
    const brokenLinks = [];
    const linkMatches = htmlContent.match(/href=["']\/[^"']+["']/g) || [];

    // 8. Détecter du contenu placeholder
    if (htmlContent.includes('Lorem ipsum') || htmlContent.includes('TODO') || htmlContent.includes('FIXME')) {
        pageIssues.push('❌ Contenu placeholder détecté (Lorem/TODO)');
    }

    // 9. Vérifier le canonical
    if (!frontmatter.includes('canonical=') && !htmlContent.includes('canonical')) {
        pageIssues.push('ℹ️ Pas de canonical défini');
    }

    // 10. Vérifier le schema markup
    if (!frontmatter.includes('schema') && !htmlContent.includes('@type')) {
        pageIssues.push('ℹ️ Pas de Schema.org markup');
    }

    return {
        path: relativePath,
        title: title || 'N/A',
        wordCount,
        issues: pageIssues
    };
}

function walkDir(dir, basePath = '') {
    const results = [];
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const relativePath = path.join(basePath, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            results.push(...walkDir(filePath, relativePath));
        } else if (file.endsWith('.astro')) {
            totalPages++;
            const analysis = analyzePage(filePath, relativePath);
            results.push(analysis);
        }
    }
    return results;
}

console.log('🔍 Audit de qualité du contenu ECOFUNDRIVE\n');
console.log('='.repeat(60));

const allPages = walkDir(pagesDir);

// Trier par nombre de problèmes (plus critique en premier)
const pagesWithIssues = allPages.filter(p => p.issues.length > 0).sort((a, b) => b.issues.length - a.issues.length);
const pagesOK = allPages.filter(p => p.issues.length === 0);

// Afficher les pages avec problèmes
console.log(`\n🚨 PAGES AVEC PROBLÈMES (${pagesWithIssues.length}/${totalPages}):\n`);

for (const page of pagesWithIssues) {
    console.log(`📄 ${page.path}`);
    console.log(`   📝 ${page.wordCount} mots`);
    for (const issue of page.issues) {
        console.log(`   ${issue}`);
    }
    console.log('');
}

// Résumé
console.log('='.repeat(60));
console.log(`\n📊 RÉSUMÉ:`);
console.log(`   Total pages: ${totalPages}`);
console.log(`   ✅ Pages OK: ${pagesOK.length}`);
console.log(`   ⚠️ Pages avec problèmes: ${pagesWithIssues.length}`);

// Statistiques par type de problème
const issueStats = {};
for (const page of pagesWithIssues) {
    for (const issue of page.issues) {
        const type = issue.substring(0, 2);
        issueStats[type] = (issueStats[type] || 0) + 1;
    }
}

console.log(`\n   Problèmes par type:`);
if (issueStats['❌']) console.log(`   ❌ Critiques: ${issueStats['❌']}`);
if (issueStats['⚠️']) console.log(`   ⚠️ Avertissements: ${issueStats['⚠️']}`);
if (issueStats['ℹ️']) console.log(`   ℹ️ Informations: ${issueStats['ℹ️']}`);

// Écrire le rapport dans un fichier
const reportPath = path.join(__dirname, 'content-audit-report.txt');
let report = `ECOFUNDRIVE - Audit de Contenu\nDate: ${new Date().toISOString()}\n\n`;
report += `Total: ${totalPages} pages\nOK: ${pagesOK.length}\nProblèmes: ${pagesWithIssues.length}\n\n`;
for (const page of pagesWithIssues) {
    report += `${page.path} (${page.wordCount} mots)\n`;
    for (const issue of page.issues) {
        report += `  ${issue}\n`;
    }
    report += '\n';
}
fs.writeFileSync(reportPath, report);
console.log(`\n📝 Rapport complet: ${reportPath}`);
