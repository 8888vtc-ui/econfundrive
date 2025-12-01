const fs = require('fs');
const path = require('path');

// Charger le rapport de diagnostic
const reportPath = path.join(__dirname, '../IMAGE-DIAGNOSTIC-REPORT.json');
const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

// Corrections à appliquer
const corrections = [];

/**
 * Corrige les chemins d'images dans un fichier
 */
function fixImagePathsInFile(filePath, imagesToFix) {
    const fullPath = path.join(__dirname, '..', filePath);
    let content = fs.readFileSync(fullPath, 'utf-8');
    let modified = false;

    for (const img of imagesToFix) {
        if (img.correctPath && img.correctPath !== img.normalizedPath) {
            // Remplacer le chemin incorrect par le chemin correct
            const oldPath = img.originalPath;
            const newPath = img.correctPath;

            // Échapper les caractères spéciaux pour regex
            const escapedOldPath = oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(image|src)=["']${escapedOldPath}["']`, 'g');

            if (regex.test(content)) {
                content = content.replace(regex, `$1="${newPath}"`);
                modified = true;
                corrections.push({
                    file: filePath,
                    line: img.line,
                    from: oldPath,
                    to: newPath,
                    reason: 'Extension incorrecte'
                });
                console.log(`  ✅ ${filePath}:${img.line}`);
                console.log(`     ${oldPath} → ${newPath}`);
            }
        }
    }

    if (modified) {
        fs.writeFileSync(fullPath, content, 'utf-8');
        return true;
    }

    return false;
}

/**
 * Trouve une image de remplacement appropriée
 */
function findReplacementImage(missingPath, availableImages) {
    // Extraire le nom de fichier et le dossier
    const pathParts = missingPath.split('/');
    const filename = pathParts[pathParts.length - 1];
    const folder = pathParts[pathParts.length - 2];

    // 1. Chercher dans le même dossier avec une extension différente
    const baseName = filename.replace(/\.(jpg|jpeg|png|webp|gif|svg)$/i, '');
    const sameFolder = availableImages.filter(img =>
        img.publicPath.includes(`/${folder}/`) &&
        img.filename.startsWith(baseName)
    );

    if (sameFolder.length > 0) {
        return sameFolder[0].publicPath;
    }

    // 2. Chercher une image similaire par nom
    const similarByName = availableImages.filter(img =>
        img.filename.toLowerCase().includes(baseName.toLowerCase()) ||
        baseName.toLowerCase().includes(img.filename.replace(/\.(jpg|jpeg|png|webp|gif|svg)$/i, '').toLowerCase())
    );

    if (similarByName.length > 0) {
        return similarByName[0].publicPath;
    }

    // 3. Utiliser une image générique du même dossier
    const genericInFolder = availableImages.filter(img =>
        img.publicPath.includes(`/${folder}/`)
    );

    if (genericInFolder.length > 0) {
        return genericInFolder[0].publicPath;
    }

    // 4. Fallback: première image disponible
    if (availableImages.length > 0) {
        return availableImages[0].publicPath;
    }

    return null;
}

/**
 * Corrige les images manquantes
 */
function fixMissingImages() {
    console.log('\n🔧 Correction des images manquantes...\n');

    for (const img of report.missingImages) {
        const filePath = img.file;
        const fullPath = path.join(__dirname, '..', filePath);

        // Trouver une image de remplacement
        let replacement = null;

        // Cas spécifiques
        if (img.originalPath.includes('david-chemla')) {
            replacement = '/assets/img/about/chauffeur-professionnel.webp';
            console.log(`  ⚠️  ${filePath}:${img.line}`);
            console.log(`     Image manquante: ${img.originalPath}`);
            console.log(`     Remplacement: ${replacement} (photo générique chauffeur)`);
        } else if (img.originalPath.includes('tesla-model-3')) {
            replacement = '/assets/img/about/vehicule-premium.webp';
            console.log(`  ⚠️  ${filePath}:${img.line}`);
            console.log(`     Image manquante: ${img.originalPath}`);
            console.log(`     Remplacement: ${replacement} (photo générique véhicule)`);
        } else if (img.originalPath.includes('vehicules/vtc-tesla-nice')) {
            // Chercher dans destinations
            const found = report.availableImages.find(i => i.publicPath === '/assets/img/destinations/vtc-tesla-nice.jpg');
            if (found) {
                replacement = found.publicPath;
                console.log(`  ✅ ${filePath}:${img.line}`);
                console.log(`     Image trouvée dans un autre dossier: ${replacement}`);
            } else {
                replacement = '/assets/img/about/vehicule-premium.webp';
                console.log(`  ⚠️  ${filePath}:${img.line}`);
                console.log(`     Image manquante: ${img.originalPath}`);
                console.log(`     Remplacement: ${replacement} (photo générique véhicule)`);
            }
        } else {
            replacement = findReplacementImage(img.originalPath, report.availableImages);
            console.log(`  ⚠️  ${filePath}:${img.line}`);
            console.log(`     Image manquante: ${img.originalPath}`);
            console.log(`     Remplacement: ${replacement}`);
        }

        if (replacement) {
            // Appliquer la correction
            let content = fs.readFileSync(fullPath, 'utf-8');
            const oldPath = img.originalPath;

            // Échapper les caractères spéciaux pour regex
            const escapedOldPath = oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(image|src)=["']${escapedOldPath}["']`, 'g');

            if (regex.test(content)) {
                content = content.replace(regex, `$1="${replacement}"`);
                fs.writeFileSync(fullPath, content, 'utf-8');

                corrections.push({
                    file: filePath,
                    line: img.line,
                    from: oldPath,
                    to: replacement,
                    reason: 'Image manquante remplacée'
                });
            }
        }

        console.log('');
    }
}

/**
 * Corrige les chemins incorrects
 */
function fixIncorrectPaths() {
    console.log('\n🔧 Correction des chemins incorrects...\n');

    // Grouper par fichier
    const byFile = {};
    for (const img of report.incorrectPaths) {
        if (!byFile[img.file]) {
            byFile[img.file] = [];
        }
        byFile[img.file].push(img);
    }

    // Corriger chaque fichier
    for (const [file, images] of Object.entries(byFile)) {
        console.log(`📄 ${file}:`);
        fixImagePathsInFile(file, images);
        console.log('');
    }
}

/**
 * Fonction principale
 */
function fixAllImages() {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('          CORRECTION AUTOMATIQUE DES IMAGES                ');
    console.log('═══════════════════════════════════════════════════════════');

    // 1. Corriger les chemins incorrects (extensions)
    fixIncorrectPaths();

    // 2. Corriger les images manquantes
    fixMissingImages();

    // 3. Générer le rapport de corrections
    console.log('═══════════════════════════════════════════════════════════');
    console.log('                    RÉSUMÉ DES CORRECTIONS                 ');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`Total de corrections: ${corrections.length}\n`);

    if (corrections.length > 0) {
        console.log('Détails des corrections:\n');
        corrections.forEach((c, index) => {
            console.log(`${index + 1}. ${c.file}:${c.line}`);
            console.log(`   ${c.from} → ${c.to}`);
            console.log(`   Raison: ${c.reason}\n`);
        });
    }

    // Sauvegarder le rapport
    const correctionsReportPath = path.join(__dirname, '../IMAGE-CORRECTIONS-REPORT.json');
    fs.writeFileSync(correctionsReportPath, JSON.stringify(corrections, null, 2), 'utf-8');
    console.log(`💾 Rapport de corrections sauvegardé: ${correctionsReportPath}\n`);

    console.log('✅ Corrections terminées!\n');
    console.log('🔍 Prochaines étapes:');
    console.log('   1. Exécuter: npm run build');
    console.log('   2. Vérifier qu\'il n\'y a pas d\'erreurs');
    console.log('   3. Exécuter: npm run dev');
    console.log('   4. Vérifier visuellement que les images s\'affichent\n');
}

// Exécuter les corrections
fixAllImages();
