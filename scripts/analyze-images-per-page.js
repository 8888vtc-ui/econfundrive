const fs = require('fs');
const path = require('path');

const PAGES_DIR = path.join(__dirname, '../src/pages');

function countImagesInFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Compter les SectionImageText
    const sectionImageTextCount = (content.match(/<SectionImageText/g) || []).length;

    // Compter les balises img directes
    const imgTagCount = (content.match(/<img/g) || []).length;

    // Compter les OptimizedImage
    const optimizedImageCount = (content.match(/<OptimizedImage/g) || []).length;

    // Compter les CategoryCard (qui ont des images)
    const categoryCardCount = (content.match(/<CategoryCard/g) || []).length;

    const total = sectionImageTextCount + imgTagCount + optimizedImageCount + categoryCardCount;

    return {
        sectionImageText: sectionImageTextCount,
        imgTag: imgTagCount,
        optimizedImage: optimizedImageCount,
        categoryCard: categoryCardCount,
        total: total
    };
}

function analyzePages() {
    const pages = [
        'index.astro',
        'services.astro',
        'a-propos.astro',
        'contact.astro',
        'tarifs.astro',
        'reservation.astro',
        'guides.astro',
        'vtc-nice.astro',
        'vtc-cannes.astro',
        'vtc-monaco.astro',
        'vtc-saint-tropez.astro',
        'vtc-antibes.astro',
        'vtc-frejus-saint-raphael.astro',
        'vtc-grasse.astro',
        'vtc-menton.astro'
    ];

    const results = [];

    for (const page of pages) {
        const filePath = path.join(PAGES_DIR, page);
        if (fs.existsSync(filePath)) {
            const counts = countImagesInFile(filePath);
            results.push({
                page,
                ...counts,
                status: counts.total >= 3 ? '✅' : '❌'
            });
        }
    }

    // Trier par nombre total d'images (croissant)
    results.sort((a, b) => a.total - b.total);

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('           ANALYSE DES IMAGES PAR PAGE                     ');
    console.log('═══════════════════════════════════════════════════════════\n');

    results.forEach(r => {
        console.log(`${r.status} ${r.page.padEnd(35)} Total: ${r.total}`);
        if (r.total < 3) {
            console.log(`   ⚠️  MANQUE ${3 - r.total} image(s) pour atteindre le minimum de 3`);
        }
        console.log(`   - SectionImageText: ${r.sectionImageText}`);
        console.log(`   - CategoryCard: ${r.categoryCard}`);
        console.log(`   - Autres images: ${r.imgTag + r.optimizedImage}`);
        console.log('');
    });

    const pagesWithIssues = results.filter(r => r.total < 3);

    console.log('═══════════════════════════════════════════════════════════');
    console.log(`RÉSUMÉ: ${pagesWithIssues.length} page(s) avec moins de 3 images`);
    console.log('═══════════════════════════════════════════════════════════\n');

    if (pagesWithIssues.length > 0) {
        console.log('Pages à corriger:\n');
        pagesWithIssues.forEach(p => {
            console.log(`- ${p.page} (${p.total} image(s))`);
        });
    } else {
        console.log('✅ Toutes les pages ont au moins 3 images !');
    }

    return results;
}

analyzePages();
