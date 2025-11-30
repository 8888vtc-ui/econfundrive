// Sitemap dynamique pour SEO
import type { APIRoute } from 'astro';

const site = 'https://www.ecofundrive.com';

// Toutes les pages du site
const pages = [
  // Pages principales
  { url: '/', changefreq: 'weekly', priority: 1.0 },
  { url: '/services', changefreq: 'monthly', priority: 0.9 },
  { url: '/reservation', changefreq: 'weekly', priority: 0.9 },
  { url: '/tarifs', changefreq: 'monthly', priority: 0.8 },
  { url: '/contact', changefreq: 'monthly', priority: 0.8 },
  { url: '/a-propos', changefreq: 'monthly', priority: 0.7 },
  { url: '/avis-clients', changefreq: 'weekly', priority: 0.8 },
  { url: '/guides', changefreq: 'monthly', priority: 0.7 },
  { url: '/mentions-legales-rgpd', changefreq: 'yearly', priority: 0.3 },
  
  // Nouvelles pages SEO
  { url: '/vtc-aeroport-nice-prix', changefreq: 'monthly', priority: 0.9 },
  { url: '/chauffeur-24h-nice', changefreq: 'monthly', priority: 0.8 },
  { url: '/vtc-entreprise-cote-azur', changefreq: 'monthly', priority: 0.8 },
  { url: '/chauffeur-anglais-nice', changefreq: 'monthly', priority: 0.8 },
  { url: '/vtc-mariage-cote-azur', changefreq: 'monthly', priority: 0.8 },
  
  // Pages VTC par ville
  { url: '/vtc-nice', changefreq: 'monthly', priority: 0.9 },
  { url: '/vtc-cannes', changefreq: 'monthly', priority: 0.9 },
  { url: '/vtc-monaco', changefreq: 'monthly', priority: 0.9 },
  { url: '/vtc-saint-tropez', changefreq: 'monthly', priority: 0.9 },
  { url: '/vtc-antibes', changefreq: 'monthly', priority: 0.8 },
  { url: '/vtc-frejus-saint-raphael', changefreq: 'monthly', priority: 0.8 },
  { url: '/vtc-grasse', changefreq: 'monthly', priority: 0.7 },
  { url: '/vtc-menton', changefreq: 'monthly', priority: 0.7 },
  { url: '/vtc-sophia-antipolis', changefreq: 'monthly', priority: 0.8 },
  { url: '/vtc-villeneuve-loubet', changefreq: 'monthly', priority: 0.7 },
  
  // Pages transferts
  { url: '/transfert-nice-aeroport-cannes', changefreq: 'monthly', priority: 0.8 },
  { url: '/transfert-nice-aeroport-monaco', changefreq: 'monthly', priority: 0.8 },
  { url: '/transfert-nice-aeroport-saint-tropez', changefreq: 'monthly', priority: 0.8 },
  { url: '/transfert-cannes-saint-tropez', changefreq: 'monthly', priority: 0.7 },
  { url: '/transferts-longue-distance-paca', changefreq: 'monthly', priority: 0.7 },
  
  // Pages guides
  { url: '/guide-vtc-ou-taxi-aeroport-nice', changefreq: 'monthly', priority: 0.7 },
  { url: '/guide-vtc-longue-distance', changefreq: 'monthly', priority: 0.7 },
  { url: '/guide-vtc-festival-cannes', changefreq: 'monthly', priority: 0.7 },
  { url: '/guide-villages-perches-cote-d-azur', changefreq: 'monthly', priority: 0.6 },
  { url: '/guide-route-panoramique-nice-eze-monaco', changefreq: 'monthly', priority: 0.7 },
  { url: '/guide-que-faire-a-nice-1-3-jours', changefreq: 'monthly', priority: 0.7 },
  { url: '/guide-que-faire-a-cannes', changefreq: 'monthly', priority: 0.7 },
  { url: '/guide-monaco-en-une-journee', changefreq: 'monthly', priority: 0.7 },
  { url: '/guide-journee-famille-cote-d-azur', changefreq: 'monthly', priority: 0.6 },
  { url: '/guide-grand-prix-monaco-deplacements', changefreq: 'monthly', priority: 0.7 },
  { url: '/guide-decouvrir-saint-tropez-golfe', changefreq: 'monthly', priority: 0.7 },
  { url: '/guide-congres-cannes-deplacements', changefreq: 'monthly', priority: 0.7 },
  { url: '/guide-circulation-cote-d-azur-haute-saison', changefreq: 'monthly', priority: 0.6 },
  
  // Pages EN
  { url: '/en/', changefreq: 'monthly', priority: 0.8 },
  { url: '/en/booking', changefreq: 'monthly', priority: 0.8 },
  { url: '/en/nice-private-driver', changefreq: 'monthly', priority: 0.8 },
  { url: '/en/cannes-private-driver', changefreq: 'monthly', priority: 0.8 },
  { url: '/en/guides', changefreq: 'monthly', priority: 0.7 },
  { url: '/en/nice-airport-to-monaco-transfer', changefreq: 'monthly', priority: 0.8 },
  { url: '/en/nice-airport-to-cannes-transfer', changefreq: 'monthly', priority: 0.8 },
  { url: '/en/nice-airport-to-saint-tropez-transfer', changefreq: 'monthly', priority: 0.7 },
  { url: '/en/guide-monaco-grand-prix-transport', changefreq: 'monthly', priority: 0.7 },
  { url: '/en/guide-cannes-festivals-transport', changefreq: 'monthly', priority: 0.7 },
  
  // Pages IT/RU
  { url: '/it/', changefreq: 'monthly', priority: 0.6 },
  { url: '/ru/', changefreq: 'monthly', priority: 0.6 },
];

const getSitemap = (): string => {
  const urls = pages.map(page => {
    return `  <url>
    <loc>${site}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
};

export const GET: APIRoute = () => {
  return new Response(getSitemap(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};

