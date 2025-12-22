// Script de ping automatique des moteurs de recherche
// À exécuter après chaque déploiement pour forcer l'indexation

const SITE_URL = 'https://www.ecofundrive.com';
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

// URLs des services de ping
const PING_SERVICES = [
    // Google
    `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,

    // Bing / Microsoft
    `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,

    // IndexNow (Bing, Yandex, Naver, Seznam)
    `https://api.indexnow.org/indexnow?url=${encodeURIComponent(SITE_URL)}&key=ecofundrive2024`,

    // Yandex
    `https://blogs.yandex.ru/pings/?status=success&url=${encodeURIComponent(SITE_URL)}`,
];

// Pages importantes à soumettre individuellement
const PRIORITY_PAGES = [
    '/',
    '/vtc-nice',
    '/vtc-monaco',
    '/vtc-cannes',
    '/vtc-saint-tropez',
    '/vtc-antibes',
    '/transfert-nice-aeroport-monaco',
    '/transfert-nice-aeroport-cannes',
    '/en/',
    '/en/nice-private-driver',
    '/en/monaco-private-driver',
    '/en/cannes-private-driver',
    '/it/',
    '/ru/',
    '/tarifs',
    '/reservation',
];

async function pingServices() {
    console.log('🚀 Ping des moteurs de recherche...\n');

    for (const pingUrl of PING_SERVICES) {
        try {
            const response = await fetch(pingUrl, { method: 'GET' });
            console.log(`✅ ${pingUrl.split('?')[0]} - Status: ${response.status}`);
        } catch (error) {
            console.log(`❌ ${pingUrl.split('?')[0]} - Erreur: ${error.message}`);
        }
    }

    console.log('\n📄 Soumission des pages prioritaires à IndexNow...\n');

    // IndexNow batch submission
    try {
        const indexNowPayload = {
            host: 'www.ecofundrive.com',
            key: 'ecofundrive2024',
            keyLocation: `${SITE_URL}/ecofundrive2024.txt`,
            urlList: PRIORITY_PAGES.map(page => `${SITE_URL}${page}`)
        };

        const response = await fetch('https://api.indexnow.org/indexnow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(indexNowPayload)
        });

        console.log(`✅ IndexNow batch - Status: ${response.status}`);
    } catch (error) {
        console.log(`❌ IndexNow batch - Erreur: ${error.message}`);
    }

    console.log('\n✨ Ping terminé !');
    console.log('📊 Les moteurs de recherche vont crawler le site dans les prochaines heures.');
}

// Exécution
pingServices();
