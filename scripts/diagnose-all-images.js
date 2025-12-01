const fs = require('fs');
const path = require('path');

// Configuration
const SRC_PAGES_DIR = path.join(__dirname, '../src/pages');
const SRC_COMPONENTS_DIR = path.join(__dirname, '../src/components');
const PUBLIC_IMG_DIR = path.join(__dirname, '../public/assets/img');

// Regex pour extraire les chemins d'images
const IMAGE_PATTERNS = [
    /src=["']([^"']+\.(?:webp|png|jpg|jpeg|gif|svg))["']/gi,
    /image=["']([^"']+\.(?:webp|png|jpg|jpeg|gif|svg))["']/gi,
    /srcset=["']([^"']+)["']/gi,
    /background(?:-image)?:\s*url\(["']?([^"')]+)["']?\)/gi
];

// Résultats
const results = {
    filesScanned: 0,
    imagesFound: [],
    imagesByFile: {},
    missingImages: [],
    validImages: [],
    incorrectPaths: [],
    availableImages: [],
    stats: {
        total: 0,
        valid: 0,
        missing: 0,
        incorrect: 0
    }
};

/**
 * Récupère tous les fichiers .astro récursivement
 */
function getAstroFiles(dir) {
    const files = [];

    function traverse(currentDir) {
        const items = fs.readdirSync(currentDir);

        for (const item of items) {
            const fullPath = path.join(currentDir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                traverse(fullPath);
            } else if (item.endsWith('.astro')) {
                files.push(fullPath);
            }
        }
    }

    traverse(dir);
    return files;
}

/**
 * Liste toutes les images disponibles dans public/assets/img
 */
function listAvailableImages(dir, baseDir = dir) {
    const images = [];

    function traverse(currentDir) {
        const items = fs.readdirSync(currentDir);

        for (const item of items) {
            const fullPath = path.join(currentDir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                traverse(fullPath);
            } else if (/\.(webp|png|jpg|jpeg|gif|svg)$/i.test(item)) {
                const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
                images.push({
                    filename: item,
                    path: fullPath,
                    relativePath: relativePath,
                    publicPath: `/assets/img/${relativePath}`
                });
            }
        }
    }

    traverse(dir);
    return images;
}

/**
 * Normalise un chemin d'image
 */
function normalizeImagePath(imagePath) {
    // Enlever les espaces
    imagePath = imagePath.trim();

    // Enlever les query strings et fragments
    imagePath = imagePath.split('?')[0].split('#')[0];

    // Convertir les backslashes en slashes
    imagePath = imagePath.replace(/\\/g, '/');

    // Si le chemin commence par /assets/img/, c'est déjà un chemin public
    if (imagePath.startsWith('/assets/img/')) {
        return imagePath;
    }

    // Si le chemin commence par ../assets/img/ ou ./assets/img/
    if (imagePath.includes('assets/img/')) {
        const match = imagePath.match(/assets\/img\/(.+)/);
        if (match) {
            return `/assets/img/${match[1]}`;
        }
    }

    // Si le chemin ne commence pas par /, ajouter /assets/img/
    if (!imagePath.startsWith('/')) {
        return `/assets/img/${imagePath}`;
    }

    return imagePath;
}

/**
 * Vérifie si une image existe
 */
function checkImageExists(imagePath, availableImages) {
    const normalizedPath = normalizeImagePath(imagePath);

    // Chercher dans les images disponibles
    const found = availableImages.find(img => img.publicPath === normalizedPath);

    if (found) {
        return { exists: true, correctPath: normalizedPath, file: found };
    }

    // Chercher des variantes (différentes extensions)
    const basePath = normalizedPath.replace(/\.(webp|png|jpg|jpeg|gif|svg)$/i, '');
    const extensions = ['.webp', '.png', '.jpg', '.jpeg', '.gif', '.svg'];

    for (const ext of extensions) {
        const variantPath = basePath + ext;
        const variant = availableImages.find(img => img.publicPath === variantPath);
        if (variant) {
            return { exists: true, correctPath: variantPath, file: variant, wasVariant: true };
        }
    }

    // Chercher par nom de fichier seulement (peut-être dans un autre dossier)
    const filename = path.basename(normalizedPath);
    const byFilename = availableImages.filter(img => img.filename === filename);

    if (byFilename.length > 0) {
        return {
            exists: false,
            suggestions: byFilename.map(img => img.publicPath),
            reason: 'Fichier trouvé dans un autre dossier'
        };
    }

    return { exists: false, reason: 'Fichier introuvable' };
}

/**
 * Extrait les images d'un fichier
 */
function extractImagesFromFile(filePath, availableImages) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const relativePath = path.relative(path.join(__dirname, '..'), filePath);
    const images = [];

    for (const pattern of IMAGE_PATTERNS) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
            const imagePath = match[1];

            // Ignorer les URLs externes et les data URIs
            if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
                continue;
            }

            // Trouver la ligne
            const lines = content.substring(0, match.index).split('\n');
            const lineNumber = lines.length;

            const normalizedPath = normalizeImagePath(imagePath);
            const check = checkImageExists(imagePath, availableImages);

            const imageInfo = {
                file: relativePath,
                line: lineNumber,
                originalPath: imagePath,
                normalizedPath: normalizedPath,
                ...check
            };

            images.push(imageInfo);
            results.imagesFound.push(imageInfo);

            if (check.exists) {
                results.validImages.push(imageInfo);
                results.stats.valid++;
            } else {
                results.missingImages.push(imageInfo);
                results.stats.missing++;
            }

            if (check.wasVariant) {
                results.incorrectPaths.push(imageInfo);
                results.stats.incorrect++;
            }
        }
    }

    if (images.length > 0) {
        results.imagesByFile[relativePath] = images;
    }

    return images;
}

/**
 * Fonction principale
 */
function diagnoseAllImages() {
    console.log('🔍 Diagnostic des images - Début\n');

    // 1. Lister toutes les images disponibles
    console.log('📁 Listing des images disponibles dans public/assets/img/...');
    results.availableImages = listAvailableImages(PUBLIC_IMG_DIR);
    console.log(`   ✅ ${results.availableImages.length} images trouvées\n`);

    // 2. Scanner les fichiers .astro dans src/pages
    console.log('📄 Scanning des fichiers dans src/pages/...');
    const pageFiles = getAstroFiles(SRC_PAGES_DIR);
    console.log(`   ✅ ${pageFiles.length} fichiers trouvés\n`);

    // 3. Scanner les fichiers .astro dans src/components
    console.log('🧩 Scanning des fichiers dans src/components/...');
    const componentFiles = getAstroFiles(SRC_COMPONENTS_DIR);
    console.log(`   ✅ ${componentFiles.length} fichiers trouvés\n`);

    // 4. Extraire les images de tous les fichiers
    console.log('🔎 Extraction des images référencées...');
    const allFiles = [...pageFiles, ...componentFiles];

    for (const file of allFiles) {
        extractImagesFromFile(file, results.availableImages);
        results.filesScanned++;
    }

    results.stats.total = results.imagesFound.length;

    console.log(`   ✅ ${results.stats.total} références d'images trouvées\n`);

    // 5. Générer le rapport
    console.log('📊 Génération du rapport...\n');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('                    RÉSUMÉ DU DIAGNOSTIC                   ');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`Fichiers scannés:        ${results.filesScanned}`);
    console.log(`Images disponibles:      ${results.availableImages.length}`);
    console.log(`Images référencées:      ${results.stats.total}`);
    console.log(`  ✅ Valides:            ${results.stats.valid}`);
    console.log(`  ❌ Manquantes:         ${results.stats.missing}`);
    console.log(`  ⚠️  Chemin incorrect:  ${results.stats.incorrect}`);
    console.log('═══════════════════════════════════════════════════════════\n');

    // 6. Détails des images manquantes
    if (results.missingImages.length > 0) {
        console.log('❌ IMAGES MANQUANTES:\n');
        results.missingImages.forEach((img, index) => {
            console.log(`${index + 1}. ${img.originalPath}`);
            console.log(`   Fichier: ${img.file}:${img.line}`);
            console.log(`   Raison: ${img.reason}`);
            if (img.suggestions && img.suggestions.length > 0) {
                console.log(`   Suggestions:`);
                img.suggestions.forEach(s => console.log(`     - ${s}`));
            }
            console.log('');
        });
    }

    // 7. Détails des chemins incorrects
    if (results.incorrectPaths.length > 0) {
        console.log('⚠️  CHEMINS INCORRECTS (mais fichier trouvé):\n');
        results.incorrectPaths.forEach((img, index) => {
            console.log(`${index + 1}. ${img.originalPath} → ${img.correctPath}`);
            console.log(`   Fichier: ${img.file}:${img.line}\n`);
        });
    }

    // 8. Sauvegarder le rapport JSON
    const reportPath = path.join(__dirname, '../IMAGE-DIAGNOSTIC-REPORT.json');
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), 'utf-8');
    console.log(`💾 Rapport JSON sauvegardé: ${reportPath}\n`);

    // 9. Créer un rapport Markdown
    const mdReport = generateMarkdownReport(results);
    const mdReportPath = path.join(__dirname, '../IMAGE-DIAGNOSTIC-REPORT.md');
    fs.writeFileSync(mdReportPath, mdReport, 'utf-8');
    console.log(`📝 Rapport Markdown sauvegardé: ${mdReportPath}\n`);

    console.log('✅ Diagnostic terminé!\n');

    return results;
}

/**
 * Génère un rapport Markdown
 */
function generateMarkdownReport(results) {
    let md = '# Rapport de Diagnostic des Images\n\n';
    md += `**Date:** ${new Date().toLocaleString('fr-FR')}\n\n`;

    md += '## Résumé\n\n';
    md += `- **Fichiers scannés:** ${results.filesScanned}\n`;
    md += `- **Images disponibles:** ${results.availableImages.length}\n`;
    md += `- **Images référencées:** ${results.stats.total}\n`;
    md += `  - ✅ **Valides:** ${results.stats.valid}\n`;
    md += `  - ❌ **Manquantes:** ${results.stats.missing}\n`;
    md += `  - ⚠️ **Chemin incorrect:** ${results.stats.incorrect}\n\n`;

    if (results.missingImages.length > 0) {
        md += '## ❌ Images Manquantes\n\n';
        results.missingImages.forEach((img, index) => {
            md += `### ${index + 1}. \`${img.originalPath}\`\n\n`;
            md += `- **Fichier:** \`${img.file}:${img.line}\`\n`;
            md += `- **Raison:** ${img.reason}\n`;
            if (img.suggestions && img.suggestions.length > 0) {
                md += `- **Suggestions:**\n`;
                img.suggestions.forEach(s => md += `  - \`${s}\`\n`);
            }
            md += '\n';
        });
    }

    if (results.incorrectPaths.length > 0) {
        md += '## ⚠️ Chemins Incorrects\n\n';
        results.incorrectPaths.forEach((img, index) => {
            md += `### ${index + 1}. \`${img.originalPath}\` → \`${img.correctPath}\`\n\n`;
            md += `- **Fichier:** \`${img.file}:${img.line}\`\n\n`;
        });
    }

    md += '## 📁 Images Disponibles\n\n';
    md += '```\n';
    results.availableImages.forEach(img => {
        md += `${img.publicPath}\n`;
    });
    md += '```\n\n';

    md += '## 📊 Images par Fichier\n\n';
    for (const [file, images] of Object.entries(results.imagesByFile)) {
        md += `### \`${file}\`\n\n`;
        images.forEach(img => {
            const status = img.exists ? '✅' : '❌';
            md += `- ${status} Ligne ${img.line}: \`${img.originalPath}\`\n`;
        });
        md += '\n';
    }

    return md;
}

// Exécuter le diagnostic
diagnoseAllImages();
