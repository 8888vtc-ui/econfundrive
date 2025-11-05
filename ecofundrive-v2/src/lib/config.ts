// ═══════════════════════════════════════════════════════════
// ECOFUNDRIVE V2.0 - CONFIG.TS
// ═══════════════════════════════════════════════════════════

export const siteConfig = {
  // Entreprise
  company: {
    name: 'ECOFUNDRIVE',
    siret: '91224469600015',
    siren: '912244696',
    legalForm: 'Entreprise individuelle',
    activity: 'VTC premium Tesla électrique'
  },
  
  // Siège social
  headquarters: {
    address: '1001 Avenue de la Batterie',
    postalCode: '06270',
    city: 'Villeneuve-Loubet',
    department: 'Alpes-Maritimes (06)',
    region: 'Provence-Alpes-Côte d\'Azur',
    country: 'France'
  },
  
  // Contacts
  contact: {
    email: '8888vtc@gmail.com',
    phone: '+33 6 16 55 28 11',
    whatsapp: 'https://wa.me/33616552811'
  },
  
  // Tracking (NO TRUSTINDEX)
  tracking: {
    gtm: 'GTM-NMMBXS4T'
  },
  
  // Auteur
  author: {
    name: 'David Chemla',
    title: 'Local Guide Google Niveau 6',
    specialty: 'Expert Côte d\'Azur depuis 15 ans',
    profileUrl: 'https://maps.app.goo.gl/qPAanSvPmAxxmhZZA'
  },
  
  // Avis (NO TRUSTINDEX - Direct reviews only)
  reviews: {
    platform: 'Avis directs (pas de widget)',
    rating: '5.0',
    total: 26,
    displayText: '26 avis clients vérifiés'
  },
  
  // Flotte
  fleet: [
    {
      model: 'Tesla Model 3',
      capacity: '5 passagers',
      luggage: '2 grandes valises',
      trunk: '425L',
      hourlyRate: '70€/h'
    },
    {
      model: 'Tesla Model S',
      capacity: '5 passagers',
      luggage: '3 grandes valises',
      trunk: '804L',
      hourlyRate: '100€/h'
    },
    {
      model: 'Tesla Model X',
      capacity: '6 passagers',
      luggage: '4+ valises',
      trunk: '2180L',
      hourlyRate: '120€/h',
      feature: 'Portes Falcon Wing'
    },
    {
      model: 'Van électrique',
      capacity: '8 passagers',
      luggage: '6+ valises',
      hourlyRate: '120€/h'
    }
  ],
  
  // Tarifs standards
  pricing: {
    niceMonaco: {
      distance: '22 km',
      duration: '25 minutes',
      model3: '80€',
      modelS: '96€',
      modelX: '104€',
      van: '112€'
    },
    niceCannes: {
      distance: '27 km',
      duration: '30 minutes',
      model3: '100€',
      modelS: '120€',
      modelX: '130€',
      van: '140€'
    },
    hourly: {
      minimum: '3 heures',
      model3: '70€/h',
      modelS: '100€/h',
      modelX: '120€/h',
      van: '120€/h'
    }
  },
  
  // Inclusions
  inclusions: [
    'Chauffeur professionnel bilingue (français/anglais)',
    'Suivi vol temps réel (aéroport Nice)',
    'Eau fraîche + chargeurs USB offerts',
    'WiFi gratuit embarqué',
    '15 minutes d\'attente gratuites',
    'Assurance tous risques incluse',
    'Parking + péages inclus',
    'Sièges enfants disponibles sur demande',
    'Assistance 24/7'
  ]
};
