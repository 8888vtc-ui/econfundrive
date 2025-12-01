// Nouvelle fonction chatbot - Code propre et optimisé avec DeepSeek v3
const OpenAI = require('openai');

// DeepSeek v3 - Dernière génération
const deepseekKey = process.env.DEEPSEEK_API_KEY;
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
  availability: '24h/24 et 7j/7 sur réservation (minimum 4h à l\'avance)'
};

// System prompt
const systemPrompt = `Tu es David Chemla, GUIDE TOURISTIQUE EXPERT sur la Côte d'Azur. Tu es passionné par cette région et tu adores partager tes connaissances.

TON RÔLE:
- GUIDE TOURISTIQUE uniquement : conseils, visites, lieux à voir, restaurants, plages, activités
- Tu connais les coins cachés, les meilleurs spots, les bonnes adresses
- Tu partages des anecdotes et des conseils pratiques
- Tu es chaleureux, passionné, et tu aimes faire découvrir la Côte d'Azur

LOCALISATION: ${businessInfo.location}
ZONES CONNUES: ${businessInfo.zones.join(', ')}
AÉROPORTS: ${businessInfo.airports.join(', ')}

RÈGLES:
1. Réponds dans la langue de l'utilisateur (FR/EN/IT/RU)
2. Réponses courtes et pratiques (max 2-3 phrases)
3. Ton enthousiaste mais naturel, comme un ami local qui connaît bien la région
4. Tu es GUIDE TOURISTIQUE, pas commercial - tu ne vends rien
5. Si on te pose des questions sur réservations/trajets/tarifs, tu dis : "Pour les réservations et tarifs précis, contactez-moi directement sur WhatsApp au ${businessInfo.phone} - je réponds rapidement !"
6. Si on te demande des infos de réservation, tu dis : "Pour réserver, envoyez-moi un message WhatsApp avec vos détails (départ, arrivée, date, heure) et je vous réponds rapidement !"
7. Toujours orienter vers WhatsApp pour les questions pratiques/réservations : "Pour plus d'infos ou réserver, WhatsApp moi au ${businessInfo.phone} !"

INTERDITS:
- Sujets sensibles (politique, religion)
- Promesses irréalistes
- Être commercial ou insistant
- Donner des tarifs précis (orienter vers WhatsApp)
- Réponses trop longues

OBJECTIF:
- Être un GUIDE TOURISTIQUE utile et passionné
- Donner des conseils sur la Côte d'Azur
- Orienter vers WhatsApp pour réservations/questions pratiques
- Faire découvrir la région avec enthousiasme`;

// Détection de langue
function detectLanguage(text) {
  const lower = text.toLowerCase();
  if (/^[a-z\s]+$/.test(text) && !lower.includes('à') && !lower.includes('é')) return 'en';
  if (/[а-яё]/i.test(text)) return 'ru';
  if (/ciao|grazie|prego|buongiorno/i.test(text)) return 'it';
  return 'fr';
}

// Détecter si le message contient des informations de réservation
function detectBookingInfo(text) {
  const lower = text.toLowerCase();
  
  // Mots-clés indiquant une réservation
  const bookingKeywords = [
    'réserv', 'book', 'prenot', 'бронир',
    'transfert', 'transfer', 'trajet', 'trip', 'viaggio',
    'aéroport', 'airport', 'aeroporto', 'аэропорт',
    'demain', 'tomorrow', 'domani', 'завтра',
    'aujourd\'hui', 'today', 'oggi', 'сегодня',
    'passager', 'passenger', 'passeggero', 'пассажир',
    'bagage', 'baggage', 'bagaglio', 'багаж'
  ];
  
  // Vérifier présence de mots-clés
  const hasKeywords = bookingKeywords.some(keyword => lower.includes(keyword));
  
  // Vérifier présence de dates/heures (format simple)
  const hasDate = /\d{1,2}[\/\-\.]\d{1,2}/.test(text) || 
                  /\d{1,2}\s+(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)/i.test(text) ||
                  /\d{1,2}\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(text);
  
  const hasTime = /\d{1,2}[h:]\d{0,2}/.test(text) || 
                  /\d{1,2}\s*(h|am|pm|heure|hour)/i.test(text);
  
  // Vérifier présence de lieux (Nice, Cannes, Monaco, etc.)
  const hasLocation = /nice|cannes|monaco|saint-tropez|antibes|fréjus|sainte-maxime|sophia/i.test(text);
  
  return hasKeywords && (hasDate || hasTime || hasLocation);
}

// Formater le message pour WhatsApp
function formatBookingMessage(text, lang) {
  const timestamp = new Date().toLocaleString('fr-FR', { 
    timeZone: 'Europe/Paris',
    dateStyle: 'short',
    timeStyle: 'short'
  });
  
  if (lang === 'en') {
    return `New booking request from website chatbot:\n\n${text}\n\nReceived: ${timestamp}`;
  }
  
  if (lang === 'it') {
    return `Nuova richiesta di prenotazione dal chatbot del sito:\n\n${text}\n\nRicevuta: ${timestamp}`;
  }
  
  if (lang === 'ru') {
    return `Новый запрос на бронирование с чатбота сайта:\n\n${text}\n\nПолучено: ${timestamp}`;
  }
  
  // Français (par défaut)
  return `Nouvelle demande de réservation depuis le chatbot du site:\n\n${text}\n\nReçue le: ${timestamp}`;
}

// Message de fallback
function getFallbackMessage(userMessage, lang) {
  const lower = userMessage.toLowerCase();
  
  if (lang === 'en') {
    if (lower.includes('price') || lower.includes('cost') || lower.includes('tariff')) {
      return 'For a precise quote, please specify: departure, arrival, date, time and number of passengers. Check our pricing page or call me at +33 6 16 55 28 11.';
    }
    if (lower.includes('book') || lower.includes('reserv')) {
      return 'To book, use our booking form or contact me directly at +33 6 16 55 28 11 / WhatsApp. Minimum 4 hours advance notice required.';
    }
    if (lower.includes('airport')) {
      return 'I offer transfers from Nice (NCE) and Cannes-Mandelieu airports to the entire French Riviera. Book at least 4 hours in advance.';
    }
    return 'I can help you with your trips, airport transfers, and advice on the French Riviera. Contact me at +33 6 16 55 28 11 or use our booking form.';
  }
  
  if (lang === 'it') {
    if (lower.includes('prezzo') || lower.includes('costo')) {
      return 'Per un preventivo preciso, specificate: partenza, arrivo, data, ora e numero di passeggeri. Contattatemi al +33 6 16 55 28 11.';
    }
    if (lower.includes('prenot')) {
      return 'Per prenotare, utilizzate il nostro modulo di prenotazione o contattatemi direttamente al +33 6 16 55 28 11 / WhatsApp.';
    }
    return 'Posso aiutarvi con i vostri viaggi, trasferimenti aeroporto e consigli sulla Costa Azzurra. Contattatemi al +33 6 16 55 28 11.';
  }
  
  if (lang === 'ru') {
    if (lower.includes('цена') || lower.includes('стоимость')) {
      return 'Для точного расчета укажите: отправление, прибытие, дата, время и количество пассажиров. Звоните +33 6 16 55 28 11.';
    }
    if (lower.includes('бронир')) {
      return 'Для бронирования используйте форму на сайте или свяжитесь со мной по +33 6 16 55 28 11 / WhatsApp.';
    }
    return 'Могу помочь с поездками, трансферами из аэропорта и советами по Лазурному Берегу. Звоните +33 6 16 55 28 11.';
  }
  
  // Français (par défaut) - Guide touristique orienté WhatsApp
  if (lower.includes('prix') || lower.includes('tarif') || lower.includes('coût') || lower.includes('réserv') || lower.includes('book')) {
    return 'Pour les tarifs et réservations, contactez-moi directement sur WhatsApp au 06 16 55 28 11 - je réponds rapidement avec un devis précis !';
  }
  if (lower.includes('aéroport') || lower.includes('airport')) {
    return 'Je connais bien les aéroports de Nice (NCE) et Cannes-Mandelieu. Pour réserver un transfert, envoyez-moi un message WhatsApp au 06 16 55 28 11 avec vos détails !';
  }
  if (lower.includes('nice') || lower.includes('cannes') || lower.includes('monaco') || lower.includes('saint-tropez')) {
    return 'J\'adore ces villes ! Je connais plein de coins sympas. Pour des conseils détaillés ou réserver un trajet, contactez-moi sur WhatsApp au 06 16 55 28 11 !';
  }
  return 'Je suis guide touristique sur la Côte d\'Azur ! Je peux vous conseiller sur les visites, restaurants, plages... Pour réserver un trajet ou plus d\'infos, WhatsApp moi au 06 16 55 28 11 !';
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

  // Vérifier méthode
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Allow': 'POST, OPTIONS',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Méthode non autorisée' })
    };
  }

  // Parser le body
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

  // Détecter langue
  const lang = detectLanguage(userMessage);

  // Si pas d'API key, utiliser fallback
  if (!deepseek) {
    const fallback = getFallbackMessage(userMessage, lang);
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ answer: fallback, fallback: true })
    };
  }

  // Appel DeepSeek v3 - Dernière génération
  try {
    const response = await deepseek.chat.completions.create({
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat', // deepseek-chat ou deepseek-reasoner
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      max_tokens: 300,
      temperature: 0.7,
      top_p: 0.9,
      frequency_penalty: 0.3,
      presence_penalty: 0.2
    });

    const answer = response?.choices?.[0]?.message?.content?.trim();

    if (!answer) {
      throw new Error('Aucune réponse générée');
    }

    // Détecter si des informations de réservation sont présentes
    const hasBookingInfo = detectBookingInfo(userMessage);
    let whatsappLink = null;
    
    if (hasBookingInfo) {
      // Créer un lien WhatsApp avec message pré-rempli
      const bookingMessage = formatBookingMessage(userMessage, lang);
      whatsappLink = `https://wa.me/33616552811?text=${encodeURIComponent(bookingMessage)}`;
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        answer,
        hasBookingInfo,
        whatsappLink
      })
    };

  } catch (error) {
    console.error('DeepSeek error:', error);
    
    // Fallback en cas d'erreur
    const fallback = getFallbackMessage(userMessage, lang);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ answer: fallback, fallback: true })
    };
  }
};

