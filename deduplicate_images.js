const fs = require('fs');
const path = require('path');

// Liste d'images de remplacement variées
const replacementImages = [
    '/assets/img/hero/hero-home.webp',
    '/assets/img/hero/hero-business.webp',
    '/assets/img/hero/hero-mariage.webp',
    '/assets/img/services/service-aeroport.webp',
    '/assets/img/services/service-mise-disposition.webp',
    '/assets/img/services/service-evenements.webp',
    '/assets/img/destinations/destination-nice.webp',
    '/assets/img/destinations/destination-cannes.webp',
    '/assets/img/destinations/destination-monaco.webp',
    '/assets/img/destinations/destination-saint-tropez.webp',
    '/assets/img/destinations/vtc-tesla-nice.webp'
];

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

let totalReplacements = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const originalContent = content;

    // Regex pour trouver les images
    // On capture tout le src="..." pour pouvoir le remplacer
    const imgRegex = /(?:src|image)=["']([^"']+\.(?:webp|png|jpg|jpeg|svg))["']/g;

    const foundImages = [];
    let match;

    // 1. Identifier les doublons
    while ((match = imgRegex.exec(content)) !== null) {
        const imgPath = match[1];
        if (!imgPath.includes('logo') && !imgPath.includes('favicon')) {
            foundImages.push(imgPath);
        }
    }

    // Compter les occurrences
    const counts = {};
    foundImages.forEach(x => { counts[x] = (counts[x] || 0) + 1; });

    const duplicates = Object.keys(counts).filter(img => counts[img] >= 2);

    if (duplicates.length > 0) {
        console.log(`Processing ${path.relative(__dirname, file)}...`);

        duplicates.forEach(dupImg => {
            let occurrences = 0;
            // Remplacer à partir de la 2ème occurrence
            // On utilise une regex spécifique pour cette image
            // On doit échapper les caractères spéciaux du chemin pour la regex
            const escapedImg = dupImg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const specificRegex = new RegExp(`((?:src|image)=["'])(${escapedImg})(["'])`, 'g');

            content = content.replace(specificRegex, (match, prefix, img, suffix) => {
                occurrences++;
                if (occurrences > 1) {
                    // C'est un doublon ! On remplace.
                    // On choisit une image au hasard qui n'est PAS l'image actuelle
                    let newImg = replacementImages[Math.floor(Math.random() * replacementImages.length)];
                    while (newImg === dupImg) {
                        newImg = replacementImages[Math.floor(Math.random() * replacementImages.length)];
                    }
                    console.log(`  -> Replaced duplicate ${dupImg} with ${newImg}`);
                    totalReplacements++;
                    return `${prefix}${newImg}${suffix}`;
                }
                return match; // Garder la première occurrence intacte
            });
        });
    }

    if (content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
    }
});

console.log(`\nDone! Total images replaced: ${totalReplacements}`);
