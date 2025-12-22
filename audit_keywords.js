const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.endsWith('.astro')) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });
    return arrayOfFiles;
}

const pagesDir = path.join(__dirname, 'src/pages');
const files = getAllFiles(pagesDir);

console.log('--- AUDIT SEO : MOTS-CLÉS & DESCRIPTION ---\n');

let missingKeywordsCount = 0;
let emptyDescriptionCount = 0;

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const relativePath = path.relative(__dirname, file);

    // Ignorer les fichiers spéciaux ou sans layout SEO explicite (comme 404 parfois)
    if (relativePath.includes('404.astro')) return;

    // Extraction naïve mais efficaces pour Astro
    const keywordsMatch = content.match(/const keywords = \[([\s\S]*?)\];/);
    const descriptionMatch = content.match(/const description = ["']([^"']*)["'];/);

    let status = "OK";
    let issues = [];

    if (!keywordsMatch) {
        issues.push("Pas de constante 'keywords' trouvée");
        missingKeywordsCount++;
    } else {
        // Nettoyer et compter les éléments
        const keywordsRaw = keywordsMatch[1];
        const keywordsList = keywordsRaw.split(',').map(k => k.trim()).filter(k => k.length > 2); // > 2 chars (ignorer les vides)

        if (keywordsList.length < 3) {
            issues.push(`Trop peu de mots-clés (${keywordsList.length})`);
            missingKeywordsCount++;
        }
    }

    if (!descriptionMatch) {
        // Parfois défini directement dans <BaseLayout description="...">
        if (!content.includes('description=')) {
            issues.push("Pas de description détectée");
            emptyDescriptionCount++;
        }
    } else if (descriptionMatch[1].length < 10) {
        issues.push("Description trop courte");
        emptyDescriptionCount++;
    }

    if (issues.length > 0) {
        console.log(`PAGE: ${relativePath}`);
        issues.forEach(issue => console.log(`  ⚠ ${issue}`));
        console.log('');
    }
});

console.log('--- RÉSUMÉ ---');
console.log(`Pages avec problèmes de mots-clés : ${missingKeywordsCount}`);
console.log(`Pages avec problèmes de description : ${emptyDescriptionCount}`);
