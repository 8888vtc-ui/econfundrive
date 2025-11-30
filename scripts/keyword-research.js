// Script de recherche de mots-clés pour SEO
// Utilise une approche hybride : analyse du contenu + suggestions basées sur le secteur

const fs = require('fs');
const path = require('path');

// Mots-clés existants extraits du contenu
const existingKeywords = {
  fr: [
    'chauffeur privé VTC',
    'VTC Nice',
    'VTC Cannes',
    'VTC Monaco',
    'transfert aéroport Nice',
    'chauffeur Côte d\'Azur',
    'VTC Saint-Tropez',
    'transport premium',
    'chauffeur business',
    'mise à disposition chauffeur',
    'transfert aéroport Cannes',
    'VTC longue distance',
    'chauffeur événement',
    'VTC mariage',
    'circuit touristique Côte d\'Azur'
  ],
  en: [
    'private driver French Riviera',
    'Nice airport transfer',
    'Monaco private driver',
    'Cannes chauffeur',
    'luxury car service',
    'business driver',
    'airport transfer Nice',
    'French Riviera transport',
    'private car service',
    'executive driver'
  ]
};

// Opportunités de mots-clés identifiées
const keywordOpportunities = {
  fr: [
    // Long tail keywords
    {
      keyword: 'chauffeur VTC aéroport Nice prix',
      volume: 'moyen',
      difficulty: 'facile',
      intent: 'commercial',
      page: 'transfert-nice-aeroport-monaco'
    },
    {
      keyword: 'réserver chauffeur privé Nice',
      volume: 'élevé',
      difficulty: 'moyen',
      intent: 'commercial',
      page: 'reservation'
    },
    {
      keyword: 'VTC pas cher Nice aéroport',
      volume: 'élevé',
      difficulty: 'moyen',
      intent: 'commercial',
      page: 'vtc-nice'
    },
    {
      keyword: 'chauffeur avec voiture de luxe Monaco',
      volume: 'moyen',
      difficulty: 'facile',
      intent: 'commercial',
      page: 'vtc-monaco'
    },
    {
      keyword: 'transfert aéroport Nice centre-ville',
      volume: 'élevé',
      difficulty: 'facile',
      intent: 'commercial',
      page: 'transfert-nice-aeroport-cannes'
    },
    {
      keyword: 'chauffeur VTC 24h/24 Nice',
      volume: 'moyen',
      difficulty: 'facile',
      intent: 'commercial',
      page: 'vtc-nice'
    },
    {
      keyword: 'service VTC entreprise Côte d\'Azur',
      volume: 'moyen',
      difficulty: 'moyen',
      intent: 'commercial',
      page: 'services'
    },
    {
      keyword: 'chauffeur privé pour mariage Côte d\'Azur',
      volume: 'moyen',
      difficulty: 'facile',
      intent: 'commercial',
      page: 'services'
    },
    {
      keyword: 'VTC avec siège enfant Nice',
      volume: 'faible',
      difficulty: 'facile',
      intent: 'commercial',
      page: 'services'
    },
    {
      keyword: 'chauffeur anglais Côte d\'Azur',
      volume: 'moyen',
      difficulty: 'facile',
      intent: 'commercial',
      page: 'services'
    },
    // Questions
    {
      keyword: 'combien coûte un VTC Nice Monaco',
      volume: 'moyen',
      difficulty: 'facile',
      intent: 'informationnel',
      page: 'tarifs'
    },
    {
      keyword: 'quelle différence entre VTC et taxi Nice',
      volume: 'moyen',
      difficulty: 'facile',
      intent: 'informationnel',
      page: 'guide-vtc-ou-taxi-aeroport-nice'
    },
    {
      keyword: 'comment réserver un chauffeur VTC Nice',
      volume: 'élevé',
      difficulty: 'moyen',
      intent: 'informationnel',
      page: 'reservation'
    },
    // Local
    {
      keyword: 'VTC Villeneuve-Loubet',
      volume: 'faible',
      difficulty: 'très facile',
      intent: 'commercial',
      page: 'vtc-villeneuve-loubet'
    },
    {
      keyword: 'chauffeur Sophia-Antipolis',
      volume: 'moyen',
      difficulty: 'facile',
      intent: 'commercial',
      page: 'vtc-sophia-antipolis'
    },
    {
      keyword: 'VTC Antibes Juan-les-Pins',
      volume: 'moyen',
      difficulty: 'facile',
      intent: 'commercial',
      page: 'vtc-antibes'
    }
  ],
  en: [
    {
      keyword: 'Nice airport to Monaco private transfer',
      volume: 'élevé',
      difficulty: 'moyen',
      intent: 'commercial',
      page: 'en/nice-airport-to-monaco-transfer'
    },
    {
      keyword: 'luxury car service French Riviera',
      volume: 'moyen',
      difficulty: 'moyen',
      intent: 'commercial',
      page: 'en/index'
    },
    {
      keyword: 'English speaking driver Nice',
      volume: 'moyen',
      difficulty: 'facile',
      intent: 'commercial',
      page: 'en/nice-private-driver'
    },
    {
      keyword: 'Monaco Grand Prix transportation',
      volume: 'élevé',
      difficulty: 'moyen',
      intent: 'commercial',
      page: 'en/guide-monaco-grand-prix-transport'
    },
    {
      keyword: 'Cannes Film Festival driver',
      volume: 'élevé',
      difficulty: 'moyen',
      intent: 'commercial',
      page: 'en/guide-cannes-festivals-transport'
    },
    {
      keyword: 'private driver with child seat Nice',
      volume: 'faible',
      difficulty: 'facile',
      intent: 'commercial',
      page: 'en/nice-private-driver'
    }
  ]
};

// Pages manquantes à créer
const missingPages = [
  {
    slug: 'vtc-aeroport-nice-prix',
    title: 'Prix VTC Aéroport Nice | Tarifs Transferts NCE',
    keywords: ['VTC aéroport Nice prix', 'transfert aéroport Nice tarif', 'chauffeur aéroport Nice'],
    intent: 'commercial'
  },
  {
    slug: 'chauffeur-24h-nice',
    title: 'Chauffeur VTC 24h/24 Nice | Service Permanent',
    keywords: ['VTC 24h Nice', 'chauffeur nuit Nice', 'VTC urgence Nice'],
    intent: 'commercial'
  },
  {
    slug: 'vtc-entreprise-cote-azur',
    title: 'VTC Entreprise Côte d\'Azur | Service Corporate',
    keywords: ['VTC entreprise', 'chauffeur corporate', 'transport professionnel'],
    intent: 'commercial'
  },
  {
    slug: 'chauffeur-anglais-nice',
    title: 'English Speaking Driver Nice | Chauffeur Anglais',
    keywords: ['chauffeur anglais Nice', 'English driver Nice', 'chauffeur bilingue'],
    intent: 'commercial'
  },
  {
    slug: 'vtc-mariage-cote-azur',
    title: 'VTC Mariage Côte d\'Azur | Transport Mariés Premium',
    keywords: ['VTC mariage', 'chauffeur mariage', 'transport mariés'],
    intent: 'commercial'
  }
];

// Générer le rapport
const report = {
  existingKeywords,
  keywordOpportunities,
  missingPages,
  recommendations: [
    'Créer des pages pour les mots-clés à fort volume',
    'Optimiser les pages existantes avec les mots-clés identifiés',
    'Ajouter du contenu autour des questions fréquentes',
    'Créer des pages locales pour les villes moins couvertes',
    'Optimiser pour les recherches en anglais (touristes internationaux)'
  ]
};

fs.writeFileSync(
  path.join(__dirname, '..', 'keyword-research-report.json'),
  JSON.stringify(report, null, 2)
);

console.log('🔍 RECHERCHE DE MOTS-CLÉS\n');
console.log('='.repeat(50));
console.log(`\n📊 Mots-clés existants: ${existingKeywords.fr.length} (FR) + ${existingKeywords.en.length} (EN)`);
console.log(`\n💡 Opportunités identifiées: ${keywordOpportunities.fr.length} (FR) + ${keywordOpportunities.en.length} (EN)`);
console.log(`\n📄 Pages manquantes à créer: ${missingPages.length}\n`);

console.log('🎯 TOP 10 OPPORTUNITÉS FRANÇAIS:');
keywordOpportunities.fr
  .filter(k => k.volume === 'élevé')
  .slice(0, 10)
  .forEach((k, i) => {
    console.log(`  ${i + 1}. ${k.keyword} (${k.intent}) → ${k.page}`);
  });

console.log('\n🎯 TOP 5 OPPORTUNITÉS ANGLAIS:');
keywordOpportunities.en
  .filter(k => k.volume === 'élevé')
  .slice(0, 5)
  .forEach((k, i) => {
    console.log(`  ${i + 1}. ${k.keyword} (${k.intent}) → ${k.page}`);
  });

console.log('\n📝 PAGES À CRÉER:');
missingPages.forEach((page, i) => {
  console.log(`  ${i + 1}. ${page.slug} - ${page.title}`);
  console.log(`     Keywords: ${page.keywords.join(', ')}`);
});

console.log('\n✅ Rapport JSON sauvegardé: keyword-research-report.json');

