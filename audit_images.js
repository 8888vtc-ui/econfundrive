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

console.log('--- SCANNING FOR DUPLICATE IMAGES ---\n');

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    // Regex pour capturer les images dans src="...", image="..." ou import
    const imgRegex = /(?:src|image)=["']([^"']+\.(?:webp|png|jpg|jpeg|svg))["']/g;

    const images = [];
    let match;
    while ((match = imgRegex.exec(content)) !== null) {
        // Ignorer les logos et favicons qui sont légitimement répétés
        if (!match[1].includes('logo') && !match[1].includes('favicon')) {
            images.push(match[1]);
        }
    }

    const counts = {};
    images.forEach(x => { counts[x] = (counts[x] || 0) + 1; });

    const duplicates = Object.keys(counts).filter(img => counts[img] >= 2);

    if (duplicates.length > 0) {
        console.log(`FILE: ${path.relative(__dirname, file)}`);
        duplicates.forEach(img => {
            console.log(`  - ${img} (x${counts[img]})`);
        });
        console.log('');
    }
});
