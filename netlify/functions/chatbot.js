// Chatbot ECOFUNDRIVE - Multi-API (OpenAI, DeepSeek, Anthropic)
const OpenAI = require('openai');

// Configuration des APIs
const openaiKey = process.env.OPENAI_API_KEY;
const deepseekKey = process.env.DEEPSEEK_API_KEY;
const anthropicKey = process.env.ANTHROPIC_API_KEY;

// Clients API
const openai = openaiKey ? new OpenAI({ apiKey: openaiKey }) : null;
const deepseek = deepseekKey ? new OpenAI({ 
  apiKey: deepseekKey, 
  baseURL: 'https://api.deepseek.com' 
}) : null;

// Contexte business
const businessInfo = {
  name: 'ECOFUNDRIVE',
  chauffeur: 'David Chemla',
  phone: '+33616552811',
  whatsapp: 'https://wa.me/33616552811',
  email: '8888VTC@gmail.com',
  website: 'https://www.ecofundrive.com',
  location: 'Villeneuve-Loubet (Marina Baie des Anges), Côte d\'Azur',
  zones: ['Nice', 'Cannes', 'Monaco', 'Saint-Tropez', 'Antibes', 'Fréjus', 'Sainte-Maxime', 'Sophia-Antipolis'],
  services: ['Transferts aéroport', 'VTC business', 'Mariages', 'Événements', 'Circuits touristiques', 'Mise à disposition'],
  airports: ['Nice Côte d\'Azur (NCE)', 'Cannes-Mandelieu'],
  vehicles: ['Berlines premium', 'Vans (4-7 places)'],
  languages: ['Français', 'Anglais', 'Italien', 'Russe'],
  availability: '24h/24 et 7j/7 sur réservation'
};

// System prompt
const systemPrompt = `Tu es David Chemla, GUIDE TOURISTIQUE EXPERT sur la Côte d'Azur. Tu es passionné par cette région.

TON RÔLE:
- GUIDE TOURISTIQUE : conseils, visites, restaurants, plages, activités
- Tu connais les coins cachés et les meilleurs spots
- Tu es chaleureux et passionné

LOCALISATION: ${businessInfo.location}
ZONES: ${businessInfo.zones.join(', ')}

RÈGLES:
1. Réponds dans la langue de l'utilisateur (FR/EN/IT/RU)
2. Réponses courtes (2-3 phrases max)
3. Pour réservations/tarifs → orienter vers WhatsApp: ${businessInfo.phone}
4. Sois enthousiaste et utile !

IMPORTANT: Chaque réponse doit être UNIQUE et PERSONNALISÉE selon la question.`;

// Détection de langue
function detectLanguage(text) {
  const lower = text.toLowerCase();
  if (/[а-яё]/i.test(text)) return 'ru';
  if (/ciao|grazie|prego|buongiorno|come|dove|quando/i.test(text)) return 'it';
  if (/^[a-z\s]+$/.test(text) && !lower.includes('à') && !lower.includes('é') && !lower.includes('è')) return 'en';
  return 'fr';
}

// Réponses intelligentes variées (fallback amélioré)
function getSmartResponse(userMessage, lang) {
  const lower = userMessage.toLowerCase();
  const random = Math.random();
  
  // Salutations
  if (/bonjour|hello|hi|ciao|salut|hey|bonsoir/i.test(lower)) {
    const greetings = {
      fr: [
        'Bonjour ! 👋 Je suis votre guide sur la Côte d\'Azur. Que souhaitez-vous découvrir ?',
        'Salut ! Bienvenue ! Je connais tous les secrets de la Côte d\'Azur. Une question ?',
        'Hello ! Ravi de vous accueillir. Nice, Cannes, Monaco... où voulez-vous aller ?'
      ],
      en: [
        'Hello! 👋 I\'m your French Riviera guide. What would you like to discover?',
        'Hi there! Welcome! I know all the secrets of the Côte d\'Azur. Any questions?',
        'Hey! Nice to meet you. Nice, Cannes, Monaco... where would you like to go?'
      ],
      it: [
        'Ciao! 👋 Sono la tua guida sulla Costa Azzurra. Cosa vuoi scoprire?',
        'Benvenuto! Conosco tutti i segreti della Costa Azzurra. Domande?'
      ],
      ru: [
        'Привет! 👋 Я ваш гид по Лазурному Берегу. Что хотите узнать?',
        'Здравствуйте! Добро пожаловать! Я знаю все секреты Côte d\'Azur.'
      ]
    };
    const responses = greetings[lang] || greetings.fr;
    return responses[Math.floor(random * responses.length)];
  }
  
  // Nice
  if (/nice/i.test(lower)) {
    const niceResponses = {
      fr: [
        'Nice est magnifique ! La Promenade des Anglais au coucher du soleil est un must. Le Vieux Nice aussi, avec ses ruelles colorées ! 🌅',
        'J\'adore Nice ! Le Cours Saleya pour le marché aux fleurs, la Colline du Château pour la vue... Vous allez adorer !',
        'Nice, c\'est mon terrain de jeu ! Plage de Castel pour la tranquillité, ou les restos du Port pour l\'ambiance. Des préférences ?'
      ],
      en: [
        'Nice is amazing! The Promenade des Anglais at sunset is a must. Old Nice too, with its colorful alleys! 🌅',
        'I love Nice! Cours Saleya for the flower market, Castle Hill for the view... You\'ll love it!',
        'Nice is my playground! Castel Beach for peace, or Port restaurants for atmosphere. Any preferences?'
      ]
    };
    const responses = niceResponses[lang] || niceResponses.fr;
    return responses[Math.floor(random * responses.length)];
  }
  
  // Cannes
  if (/cannes/i.test(lower)) {
    const cannesResponses = {
      fr: [
        'Cannes, c\'est le glamour ! La Croisette est incontournable. Pour manger, essayez le Suquet, le vieux quartier ! 🎬',
        'J\'aime beaucoup Cannes ! Les îles de Lérins sont accessibles en bateau, c\'est paradisiaque. La plage du Midi est plus locale.',
        'Cannes a du style ! Le Marché Forville pour les produits locaux, et le quartier du Suquet pour l\'authenticité.'
      ],
      en: [
        'Cannes is glamour! La Croisette is a must. For food, try Le Suquet, the old quarter! 🎬',
        'I love Cannes! The Lérins Islands are accessible by boat, it\'s paradise. Midi Beach is more local.',
        'Cannes has style! Forville Market for local products, and Le Suquet district for authenticity.'
      ]
    };
    const responses = cannesResponses[lang] || cannesResponses.fr;
    return responses[Math.floor(random * responses.length)];
  }
  
  // Monaco
  if (/monaco/i.test(lower)) {
    const monacoResponses = {
      fr: [
        'Monaco, c\'est unique ! Le Rocher avec le Palais, le Musée Océanographique, et le Port Hercule. Impressionnant ! 🏎️',
        'J\'adore Monaco ! Le Jardin Exotique offre une vue incroyable. Et Monte-Carlo pour l\'ambiance casino chic.',
        'Monaco en une journée : le Rocher le matin, déjeuner au Port, Monte-Carlo l\'après-midi. Parfait !'
      ],
      en: [
        'Monaco is unique! The Rock with the Palace, the Oceanographic Museum, and Port Hercule. Impressive! 🏎️',
        'I love Monaco! The Exotic Garden offers an incredible view. And Monte-Carlo for the chic casino vibe.',
        'Monaco in one day: the Rock in the morning, lunch at the Port, Monte-Carlo in the afternoon. Perfect!'
      ]
    };
    const responses = monacoResponses[lang] || monacoResponses.fr;
    return responses[Math.floor(random * responses.length)];
  }
  
  // Saint-Tropez
  if (/saint.?tropez|st.?tropez/i.test(lower)) {
    const tropezResponses = {
      fr: [
        'Saint-Tropez, c\'est le rêve ! La Place des Lices le mardi et samedi matin pour le marché. Les plages de Pampelonne sont mythiques ! 🏖️',
        'J\'adore Saint-Trop\' ! Le port pour voir les yachts, la Citadelle pour la vue, et Ramatuelle pour le calme.',
        'Saint-Tropez hors saison, c\'est magique. Moins de monde, même charme. Le Sentier du Littoral est superbe pour marcher.'
      ],
      en: [
        'Saint-Tropez is a dream! Place des Lices on Tuesday and Saturday mornings for the market. Pampelonne beaches are legendary! 🏖️',
        'I love Saint-Trop\'! The port to see yachts, the Citadel for views, and Ramatuelle for peace.',
        'Saint-Tropez off-season is magical. Fewer crowds, same charm. The Coastal Path is great for walking.'
      ]
    };
    const responses = tropezResponses[lang] || tropezResponses.fr;
    return responses[Math.floor(random * responses.length)];
  }
  
  // Restaurant / manger
  if (/restaurant|manger|eat|food|cuisine|déjeuner|dîner|lunch|dinner/i.test(lower)) {
    const foodResponses = {
      fr: [
        'Pour bien manger sur la Côte d\'Azur : la socca à Nice, la pissaladière, les petits farcis... Vous êtes où ? Je vous donne mes adresses ! 🍽️',
        'J\'ai plein de bonnes adresses ! Chez Pipo à Nice pour la socca, le Plongeoir pour la vue, ou des restos plus cachés. Vous préférez quoi ?',
        'La cuisine provençale est incroyable ici ! Dites-moi votre budget et la ville, je vous trouve le parfait resto.'
      ],
      en: [
        'For great food on the Riviera: socca in Nice, pissaladière, petits farcis... Where are you? I\'ll share my favorite spots! 🍽️',
        'I have lots of good addresses! Chez Pipo in Nice for socca, Le Plongeoir for the view. What do you prefer?',
        'Provençal cuisine is incredible here! Tell me your budget and city, I\'ll find you the perfect restaurant.'
      ]
    };
    const responses = foodResponses[lang] || foodResponses.fr;
    return responses[Math.floor(random * responses.length)];
  }
  
  // Plage
  if (/plage|beach|mer|sea|baignade|swim/i.test(lower)) {
    const beachResponses = {
      fr: [
        'Les meilleures plages ? Paloma à Saint-Jean-Cap-Ferrat (sublime !), Mala à Cap d\'Ail, ou Pampelonne à Saint-Tropez. Vous cherchez quoi ? 🏖️',
        'Pour les plages, ça dépend : tranquille ou animée ? Sable ou galets ? Dites-moi et je vous guide !',
        'La plage de la Garoupe à Antibes est superbe, eau turquoise ! Sinon, Passable à Saint-Jean est très sympa aussi.'
      ],
      en: [
        'Best beaches? Paloma in Saint-Jean-Cap-Ferrat (stunning!), Mala in Cap d\'Ail, or Pampelonne in Saint-Tropez. What are you looking for? 🏖️',
        'For beaches, it depends: quiet or lively? Sand or pebbles? Tell me and I\'ll guide you!',
        'La Garoupe beach in Antibes is gorgeous, turquoise water! Passable in Saint-Jean is also very nice.'
      ]
    };
    const responses = beachResponses[lang] || beachResponses.fr;
    return responses[Math.floor(random * responses.length)];
  }
  
  // Réservation / tarif / prix
  if (/réserv|book|tarif|prix|price|cost|combien|how much|quanto/i.test(lower)) {
    const bookingResponses = {
      fr: [
        'Pour réserver ou avoir un tarif précis, le mieux c\'est de me contacter sur WhatsApp au 06 16 55 28 11 ! Je réponds vite avec un devis personnalisé. 📱',
        'Les tarifs dépendent du trajet et des options. Envoyez-moi un WhatsApp au 06 16 55 28 11 avec vos détails, je vous fais un devis rapide !',
        'Pour les réservations, WhatsApp est le plus simple : 06 16 55 28 11. Dites-moi départ, arrivée, date et heure, et c\'est parti !'
      ],
      en: [
        'For booking or pricing, best to contact me on WhatsApp at +33 6 16 55 28 11! I reply quickly with a personalized quote. 📱',
        'Prices depend on the route and options. Send me a WhatsApp at +33 6 16 55 28 11 with your details, I\'ll give you a quick quote!',
        'For reservations, WhatsApp is easiest: +33 6 16 55 28 11. Tell me departure, arrival, date and time, and we\'re good to go!'
      ]
    };
    const responses = bookingResponses[lang] || bookingResponses.fr;
    return responses[Math.floor(random * responses.length)];
  }
  
  // Aéroport
  if (/aéroport|airport|avion|plane|vol|flight|nce/i.test(lower)) {
    const airportResponses = {
      fr: [
        'L\'aéroport de Nice (NCE) est super bien situé ! Je fais des transferts vers Nice centre (20-30min), Cannes (45min), Monaco (40min). WhatsApp pour réserver : 06 16 55 28 11 ✈️',
        'Pour les transferts aéroport, je vous attends à la sortie avec une pancarte. Véhicule climatisé, WiFi, eau fraîche. Contactez-moi sur WhatsApp !',
        'Aéroport Nice-Côte d\'Azur : je connais par cœur ! Terminal 1 ou 2, je m\'adapte. Réservez sur WhatsApp : 06 16 55 28 11'
      ],
      en: [
        'Nice Airport (NCE) is perfectly located! I do transfers to Nice center (20-30min), Cannes (45min), Monaco (40min). WhatsApp to book: +33 6 16 55 28 11 ✈️',
        'For airport transfers, I wait for you at the exit with a sign. Air-conditioned vehicle, WiFi, fresh water. Contact me on WhatsApp!',
        'Nice Côte d\'Azur Airport: I know it by heart! Terminal 1 or 2, I adapt. Book on WhatsApp: +33 6 16 55 28 11'
      ]
    };
    const responses = airportResponses[lang] || airportResponses.fr;
    return responses[Math.floor(random * responses.length)];
  }
  
  // Réponse par défaut variée
  const defaultResponses = {
    fr: [
      'Excellente question ! Je connais la Côte d\'Azur comme ma poche. Dites-moi plus précisément ce que vous cherchez et je vous guide ! 🌴',
      'Je suis là pour vous aider ! Nice, Cannes, Monaco, Saint-Tropez... ou peut-être des coins moins connus ? Qu\'est-ce qui vous fait envie ?',
      'La Côte d\'Azur regorge de trésors ! Dites-moi vos centres d\'intérêt (plages, culture, gastronomie, villages...) et je vous conseille.',
      'Ah, bonne question ! Pour mieux vous répondre, dites-moi : vous êtes où sur la Côte d\'Azur et qu\'est-ce que vous aimez faire ?'
    ],
    en: [
      'Great question! I know the French Riviera like the back of my hand. Tell me more specifically what you\'re looking for! 🌴',
      'I\'m here to help! Nice, Cannes, Monaco, Saint-Tropez... or perhaps lesser-known spots? What interests you?',
      'The Côte d\'Azur is full of treasures! Tell me your interests (beaches, culture, food, villages...) and I\'ll advise you.',
      'Good question! To answer better, tell me: where are you on the Riviera and what do you like to do?'
    ],
    it: [
      'Bella domanda! Conosco la Costa Azzurra come le mie tasche. Dimmi cosa cerchi! 🌴',
      'Sono qui per aiutarti! Nice, Cannes, Monaco, Saint-Tropez... cosa ti interessa?'
    ],
    ru: [
      'Отличный вопрос! Я знаю Лазурный Берег как свои пять пальцев. Скажите, что вы ищете! 🌴',
      'Я здесь, чтобы помочь! Ницца, Канны, Монако, Сен-Тропе... Что вас интересует?'
    ]
  };
  const responses = defaultResponses[lang] || defaultResponses.fr;
  return responses[Math.floor(random * responses.length)];
}

// Handler principal
exports.handler = async function(event) {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Allow': 'POST, OPTIONS', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Méthode non autorisée' })
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Body JSON invalide' })
    };
  }

  const userMessage = (body.message || '').trim();
  if (!userMessage) {
    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Message manquant' })
    };
  }

  const lang = detectLanguage(userMessage);

  // Essayer les APIs dans l'ordre : OpenAI > DeepSeek
  let answer = null;
  let usedApi = null;

  // 1. Essayer OpenAI GPT-4o-mini (rapide et pas cher)
  if (openai && !answer) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 250,
        temperature: 0.8
      });
      answer = response?.choices?.[0]?.message?.content?.trim();
      usedApi = 'openai';
    } catch (err) {
      console.error('OpenAI error:', err.message);
    }
  }

  // 2. Essayer DeepSeek
  if (deepseek && !answer) {
    try {
      const response = await deepseek.chat.completions.create({
        model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 250,
        temperature: 0.8
      });
      answer = response?.choices?.[0]?.message?.content?.trim();
      usedApi = 'deepseek';
    } catch (err) {
      console.error('DeepSeek error:', err.message);
    }
  }

  // 3. Fallback intelligent si aucune API ne fonctionne
  if (!answer) {
    answer = getSmartResponse(userMessage, lang);
    usedApi = 'fallback';
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ 
      answer,
      api: usedApi
    })
  };
};
