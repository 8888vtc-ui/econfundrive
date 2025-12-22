// Sitemap dynamique pour SEO - COMPLET avec toutes les 111 pages
import type { APIRoute } from 'astro';

const site = 'https://www.ecofundrive.com';

// Toutes les pages du site - LISTE COMPLETE Dec 2024
const pages = [
  // Pages principales FR
  { url: '/', changefreq: 'weekly', priority: 1.0 },
  { url: '/services', changefreq: 'monthly', priority: 0.9 },
  { url: '/reservation', changefreq: 'weekly', priority: 0.9 },
  { url: '/tarifs', changefreq: 'monthly', priority: 0.8 },
  { url: '/contact', changefreq: 'monthly', priority: 0.8 },
  { url: '/a-propos', changefreq: 'monthly', priority: 0.7 },
  { url: '/avis-clients', changefreq: 'weekly', priority: 0.8 },
  { url: '/guides', changefreq: 'monthly', priority: 0.7 },
  { url: '/plan-du-site', changefreq: 'monthly', priority: 0.5 },
  { url: '/mentions-legales-rgpd', changefreq: 'yearly', priority: 0.3 },
  { url: '/info', changefreq: 'monthly', priority: 0.8 },

  // Pages spéciales FR
  { url: '/chauffeur-24h-nice', changefreq: 'monthly', priority: 0.8 },
  { url: '/chauffeur-anglais-nice', changefreq: 'monthly', priority: 0.8 },
  { url: '/comparatif-vtc-taxi-uber-nice', changefreq: 'monthly', priority: 0.8 },
  { url: '/conseils-voyageurs-cote-azur', changefreq: 'monthly', priority: 0.7 },

  // Pages VTC Aéroport et Services
  { url: '/vtc-aeroport-nice-prix', changefreq: 'monthly', priority: 0.9 },
  { url: '/vtc-entreprise-cote-azur', changefreq: 'monthly', priority: 0.8 },
  { url: '/vtc-mariage-cote-azur', changefreq: 'monthly', priority: 0.8 },
  { url: '/vtc-carnaval-nice', changefreq: 'monthly', priority: 0.7 },
  { url: '/vtc-mipim-cannes', changefreq: 'monthly', priority: 0.8 },

  // Pages VTC par ville - COMPLETE (25 villes)
  { url: '/vtc-nice', changefreq: 'monthly', priority: 0.9 },
  { url: '/vtc-cannes', changefreq: 'monthly', priority: 0.9 },
  { url: '/vtc-monaco', changefreq: 'monthly', priority: 0.9 },
  { url: '/vtc-saint-tropez', changefreq: 'monthly', priority: 0.9 },
  { url: '/vtc-antibes', changefreq: 'monthly', priority: 0.8 },
  { url: '/vtc-frejus-saint-raphael', changefreq: 'monthly', priority: 0.8 },
  { url: '/vtc-grasse', changefreq: 'monthly', priority: 0.8 },
  { url: '/vtc-menton', changefreq: 'monthly', priority: 0.8 },
  { url: '/vtc-eze', changefreq: 'monthly', priority: 0.8 },
  { url: '/vtc-villefranche-sur-mer', changefreq: 'monthly', priority: 0.7 },
  { url: '/vtc-cap-ferrat', changefreq: 'monthly', priority: 0.7 },
  { url: '/vtc-beaulieu-sur-mer', changefreq: 'monthly', priority: 0.7 },
  { url: '/vtc-roquebrune-cap-martin', changefreq: 'monthly', priority: 0.7 },
  { url: '/vtc-la-turbie', changefreq: 'monthly', priority: 0.6 },
  { url: '/vtc-sophia-antipolis', changefreq: 'monthly', priority: 0.8 },
  { url: '/vtc-juan-les-pins', changefreq: 'monthly', priority: 0.7 },
  { url: '/vtc-vallauris-golfe-juan', changefreq: 'monthly', priority: 0.7 },
  { url: '/vtc-mougins', changefreq: 'monthly', priority: 0.7 },
  { url: '/vtc-vence', changefreq: 'monthly', priority: 0.7 },
  { url: '/vtc-saint-paul-de-vence', changefreq: 'monthly', priority: 0.7 },
  { url: '/vtc-cagnes-sur-mer', changefreq: 'monthly', priority: 0.7 },
  { url: '/vtc-saint-laurent-du-var', changefreq: 'monthly', priority: 0.7 },
  { url: '/vtc-villeneuve-loubet', changefreq: 'monthly', priority: 0.7 },
  { url: '/vtc-mandelieu-la-napoule', changefreq: 'monthly', priority: 0.7 },
  { url: '/vtc-biot', changefreq: 'monthly', priority: 0.6 },

  // Pages transferts
  { url: '/transfert-nice-aeroport-cannes', changefreq: 'monthly', priority: 0.8 },
  { url: '/transfert-nice-aeroport-monaco', changefreq: 'monthly', priority: 0.8 },
  { url: '/transfert-nice-aeroport-saint-tropez', changefreq: 'monthly', priority: 0.8 },
  { url: '/transfert-cannes-saint-tropez', changefreq: 'monthly', priority: 0.7 },
  { url: '/transferts-longue-distance-paca', changefreq: 'monthly', priority: 0.7 },

  // Pages guides FR (16 guides)
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
  { url: '/guide-evenements-cote-azur', changefreq: 'monthly', priority: 0.7 },
  { url: '/guide-budget-transport-cote-azur', changefreq: 'monthly', priority: 0.6 },
  { url: '/guide-choisir-vtc-cote-azur', changefreq: 'monthly', priority: 0.7 },

  // Pages EN - COMPLETE (28 pages)
  { url: '/en/', changefreq: 'monthly', priority: 0.8 },
  { url: '/en/booking', changefreq: 'monthly', priority: 0.8 },
  { url: '/en/guides', changefreq: 'monthly', priority: 0.7 },
  { url: '/en/nice-private-driver', changefreq: 'monthly', priority: 0.8 },
  { url: '/en/cannes-private-driver', changefreq: 'monthly', priority: 0.8 },
  { url: '/en/monaco-private-driver', changefreq: 'monthly', priority: 0.8 },
  { url: '/en/saint-tropez-private-driver', changefreq: 'monthly', priority: 0.8 },
  { url: '/en/antibes-private-driver', changefreq: 'monthly', priority: 0.7 },
  { url: '/en/eze-private-driver', changefreq: 'monthly', priority: 0.7 },
  { url: '/en/grasse-private-driver', changefreq: 'monthly', priority: 0.7 },
  { url: '/en/menton-private-driver', changefreq: 'monthly', priority: 0.7 },
  { url: '/en/villefranche-private-driver', changefreq: 'monthly', priority: 0.7 },
  { url: '/en/cap-ferrat-private-driver', changefreq: 'monthly', priority: 0.7 },
  { url: '/en/mougins-private-driver', changefreq: 'monthly', priority: 0.6 },
  { url: '/en/saint-paul-de-vence-private-driver', changefreq: 'monthly', priority: 0.6 },
  { url: '/en/nice-airport-to-monaco-transfer', changefreq: 'monthly', priority: 0.8 },
  { url: '/en/nice-airport-to-cannes-transfer', changefreq: 'monthly', priority: 0.8 },
  { url: '/en/nice-airport-to-saint-tropez-transfer', changefreq: 'monthly', priority: 0.7 },
  { url: '/en/guide-hilltop-villages-french-riviera', changefreq: 'monthly', priority: 0.7 },
  { url: '/en/vtc-vs-taxi-uber-nice', changefreq: 'monthly', priority: 0.7 },
  { url: '/en/guide-cannes-congress-transport', changefreq: 'monthly', priority: 0.7 },
  { url: '/en/guide-cannes-festivals-transport', changefreq: 'monthly', priority: 0.7 },
  { url: '/en/guide-family-day-french-riviera', changefreq: 'monthly', priority: 0.6 },
  { url: '/en/guide-high-season-traffic-french-riviera', changefreq: 'monthly', priority: 0.6 },
  { url: '/en/guide-long-distance-transfers', changefreq: 'monthly', priority: 0.7 },
  { url: '/en/guide-monaco-grand-prix-transport', changefreq: 'monthly', priority: 0.7 },
  { url: '/en/guide-nice-airport-taxi-or-private-driver', changefreq: 'monthly', priority: 0.7 },
  { url: '/en/guide-nice-in-1-to-3-days', changefreq: 'monthly', priority: 0.7 },
  { url: '/en/guide-one-day-in-monaco', changefreq: 'monthly', priority: 0.7 },
  { url: '/en/guide-saint-tropez-and-gulf', changefreq: 'monthly', priority: 0.7 },
  { url: '/en/guide-scenic-road-nice-eze-monaco', changefreq: 'monthly', priority: 0.7 },
  { url: '/en/guide-what-to-do-in-cannes', changefreq: 'monthly', priority: 0.7 },

  // Pages IT - COMPLETE (6 pages)
  { url: '/it/', changefreq: 'monthly', priority: 0.7 },
  { url: '/it/ncc-nizza', changefreq: 'monthly', priority: 0.7 },
  { url: '/it/ncc-monaco', changefreq: 'monthly', priority: 0.7 },
  { url: '/it/ncc-cannes', changefreq: 'monthly', priority: 0.7 },
  { url: '/it/ncc-saint-tropez', changefreq: 'monthly', priority: 0.7 },
  { url: '/it/ncc-antibes', changefreq: 'monthly', priority: 0.6 },

  // Pages RU - COMPLETE (6 pages)
  { url: '/ru/', changefreq: 'monthly', priority: 0.6 },
  { url: '/ru/transfer-nizza', changefreq: 'monthly', priority: 0.6 },
  { url: '/ru/transfer-monaco', changefreq: 'monthly', priority: 0.6 },
  { url: '/ru/transfer-cannes', changefreq: 'monthly', priority: 0.6 },
  { url: '/ru/transfer-saint-tropez', changefreq: 'monthly', priority: 0.6 },
  { url: '/ru/transfer-antibes', changefreq: 'monthly', priority: 0.6 },
];

const getSitemap = (): string => {
  const now = new Date().toISOString().split('T')[0];
  const urls = pages.map(page => {
    return `  <url>
    <loc>${site}${page.url}</loc>
    <lastmod>${now}</lastmod>
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
