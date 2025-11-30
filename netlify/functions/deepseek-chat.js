// Netlify Function - simple proxy OpenAI chat completions
// Nécessite uniquement la variable d'environnement OPENAI_API_KEY configurée sur Netlify

const OpenAI = require('openai');

const openaiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: openaiKey,
});

// Contexte enrichi pour meilleure compréhension
const businessContext = {
  name: "ECOFUNDRIVE",
  chauffeur: "David Chemla",
  phone: "+33616552811",
  whatsapp: "https://wa.me/33616552811",
  email: "8888VTC@gmail.com",
  website: "https://www.ecofundrive.com",
  location: "Villeneuve-Loubet (Marina Baie des Anges), Côte d'Azur",
  zones: ["Nice", "Cannes", "Monaco", "Saint-Tropez", "Antibes", "Fréjus", "Sainte-Maxime", "Sophia-Antipolis"],
  services: ["Transferts aéroport", "VTC business", "Mariages", "Événements", "Circuits touristiques", "Mise à disposition"],
  airports: ["Nice Côte d'Azur (NCE)", "Cannes-Mandelieu"],
  vehicles: ["Berlines premium", "Vans (4-7 places)"],
  languages: ["Français", "Anglais", "Italien", "Russe"],
  availability: "24h/24 et 7j/7 sur réservation (minimum 4h à l'avance)",
  booking: "Formulaire en ligne sur /reservation ou téléphone/WhatsApp"
};

const systemPrompt =
  `Tu es David Chemla, chauffeur VTC professionnel et guide touristique expérimenté sur la Côte d'Azur.

CONTEXTE BUSINESS:
- Entreprise: ${businessContext.name}
- Localisation: ${businessContext.location}
- Téléphone: ${businessContext.phone}
- WhatsApp: ${businessContext.whatsapp}
- Site web: ${businessContext.website}
- Zones couvertes: ${businessContext.zones.join(', ')}
- Services: ${businessContext.services.join(', ')}
- Aéroports: ${businessContext.airports.join(', ')}
- Véhicules: ${businessContext.vehicles.join(', ')}
- Langues: ${businessContext.languages.join(', ')}
- Disponibilité: ${businessContext.availability}
- Réservation: ${businessContext.booking}

PERSONNALITÉ:
- Chaleureux, sympathique, professionnel, discret
- Accessible ("mister good vibes") mais toujours sérieux
- Passionné par la Côte d'Azur, la mer, les sports nautiques (windsurf, wingfoil)
- Connaît les coins cachés ET les lieux emblématiques
- Niveau de décontraction: 5/10 (professionnel mais humain)

RÈGLES DE COMMUNICATION:
1. Langue: Réponds TOUJOURS dans la langue de l'utilisateur (FR/EN/IT/RU), jamais de mélange
2. Longueur: Réponses courtes et pratiques (max 3-4 phrases sauf demande détaillée)
3. Ton: Comme si tu parlais directement au client dans la voiture
4. Bienvenue: Adapte selon la langue (ex: "Bienvenue sur la Côte d'Azur" en FR)

RÔLES:
1. Conseiller sur trajets, visites, excursions, organisation séjour
2. Aider à préparer réservation VTC (collecter: départ, arrivée, date, heure, passagers, bagages)

PRIORITÉS:
- Transferts aéroport (Nice NCE, Cannes-Mandelieu)
- Transferts business (Nice, Cannes, Monaco, Saint-Tropez)
- Grands trajets (Nice ↔ Saint-Tropez, longue distance)
- Événements (mariages, congrès, séminaires)

RÉSEAU:
- Partenaires sérieux (chauffeurs, vans, autocars, guides officiels)
- Peux coordonner solutions complètes (bus + guide, multi-véhicules)
- Toujours sur devis, sous réserve disponibilité, délai suffisant

INTERDITS:
- Sujets sensibles (politique, religion, discrimination, alcool)
- Promesses irréalistes
- Citer email directement (privilégier WhatsApp/téléphone/formulaire)
- Familiarité excessive
- Réponses trop longues sans demande

OBJECTIF:
- Faire sourire le client au moins une fois (sans forcer)
- Respecter si client préfère calme/silence
- Sécurité et Code de la route avant tout
- Questions précises avant solution (date, heure, adresses, passagers, bagages)

FORMAT RÉPONSES:
- Courtes, claires, pratiques
- Toujours proposer formulaire /reservation ou contact direct
- Mentionner délai minimum 4h si pertinent
- Évoquer services premium si contexte approprié`;

exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Allow": "POST, OPTIONS", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Méthode non autorisée" }),
    };
  }

  const body = JSON.parse(event.body || "{}");
  const userMessage = (body && body.message ? String(body.message) : "").trim();

  if (!userMessage) {
    return {
      statusCode: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Message manquant" }),
    };
  }

  if (!openaiKey) {
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        answer:
          "Bonjour, je suis David, votre chauffeur VTC. Le moteur IA n'est pas encore configuré, mais je peux vous orienter sur tous vos trajets, transferts et services premium. Dites-moi simplement d'où vous partez et où vous voulez aller !",
      }),
    };
  }

  try {
    // Détection de langue pour contexte
    const detectLanguage = (text) => {
      const lower = text.toLowerCase();
      if (/^[a-z\s]+$/.test(text) && !lower.includes('à') && !lower.includes('é')) return 'en';
      if (/[а-яё]/i.test(text)) return 'ru';
      if (/[àèéìíîòóùú]/i.test(text) || lower.includes('ciao') || lower.includes('grazie')) return 'it';
      return 'fr';
    };

    const userLang = detectLanguage(userMessage);
    
    // Contexte enrichi avec historique si disponible
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ];

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini", // Utiliser mini pour performance/cost
      messages: messages,
      max_tokens: 400, // Réduit pour réponses plus courtes
      temperature: 0.7, // Légèrement augmenté pour plus de naturel
      top_p: 0.9,
      frequency_penalty: 0.3, // Évite répétitions
      presence_penalty: 0.2,
    });

    const answer = response?.choices?.[0]?.message?.content?.trim();

    if (!answer) {
      throw new Error("Aucune réponse générée");
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ answer }),
    };
  } catch (error) {
    console.error("OpenAI call failed", error);
    
    // Fallback intelligent amélioré avec détection de langue
    const lowerMessage = userMessage.toLowerCase();
    const isEnglish = /^[a-z\s]+$/.test(userMessage) && !lowerMessage.includes('à') && !lowerMessage.includes('é');
    const isItalian = /ciao|grazie|prego|buongiorno/i.test(userMessage);
    const isRussian = /[а-яё]/i.test(userMessage);
    
    let fallbackAnswer = "";
    let linkText = "";
    
    if (isEnglish) {
      fallbackAnswer = "Hello, I'm David, your private driver on the French Riviera. ";
      linkText = "booking form";
    } else if (isItalian) {
      fallbackAnswer = "Ciao, sono David, il vostro autista privato sulla Costa Azzurra. ";
      linkText = "modulo di prenotazione";
    } else if (isRussian) {
      fallbackAnswer = "Здравствуйте, я Давид, ваш частный водитель на Лазурном Берегу. ";
      linkText = "форму бронирования";
    } else {
      fallbackAnswer = "Bonjour, je suis David, votre chauffeur VTC sur la Côte d'Azur. ";
      linkText = "formulaire de réservation";
    }
    
    // Réponses contextuelles améliorées
    if (lowerMessage.includes('prix') || lowerMessage.includes('tarif') || lowerMessage.includes('coût') || lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      if (isEnglish) {
        fallbackAnswer += "For a precise quote, please specify: departure, arrival, date, time and number of passengers. You can also check our <a href='/tarifs'>pricing page</a> or call me at +33 6 16 55 28 11.";
      } else {
        fallbackAnswer += `Pour un devis précis, merci de me préciser : départ, arrivée, date, heure et nombre de passagers. Vous pouvez aussi consulter la page <a href='/tarifs'>Tarifs</a> ou m'appeler au 06 16 55 28 11.`;
      }
    } else if (lowerMessage.includes('réserv') || lowerMessage.includes('book') || lowerMessage.includes('prenot')) {
      if (isEnglish) {
        fallbackAnswer += `To book, use our <a href='/reservation'>${linkText}</a> or contact me directly at +33 6 16 55 28 11 / WhatsApp.`;
      } else {
        fallbackAnswer += `Pour réserver, utilisez le <a href='/reservation'>${linkText}</a> ou contactez-moi directement au 06 16 55 28 11 / WhatsApp.`;
      }
    } else if (lowerMessage.includes('aéroport') || lowerMessage.includes('airport') || lowerMessage.includes('aeroporto')) {
      if (isEnglish) {
        fallbackAnswer += "I offer transfers from Nice (NCE) and Cannes-Mandelieu airports to the entire French Riviera. Book at least 4 hours in advance via our <a href='/reservation'>booking form</a>.";
      } else {
        fallbackAnswer += "Je propose des transferts depuis les aéroports de Nice (NCE) et Cannes-Mandelieu vers toute la Côte d'Azur. Réservez au moins 4h à l'avance via le <a href='/reservation'>formulaire</a>.";
      }
    } else if (lowerMessage.includes('nice') || lowerMessage.includes('cannes') || lowerMessage.includes('monaco') || lowerMessage.includes('saint-tropez')) {
      if (isEnglish) {
        fallbackAnswer += "I cover the entire French Riviera: Nice, Cannes, Monaco, Saint-Tropez, Fréjus, Sainte-Maxime. Tell me your exact route for a quote!";
      } else {
        fallbackAnswer += "Je couvre toute la Côte d'Azur : Nice, Cannes, Monaco, Saint-Tropez, Fréjus, Sainte-Maxime. Dites-moi votre trajet précis pour un devis !";
      }
    } else {
      if (isEnglish) {
        fallbackAnswer += "I can help you with your trips, airport transfers, and advice on the French Riviera. Contact me at +33 6 16 55 28 11 or via our <a href='/reservation'>booking form</a>.";
      } else {
        fallbackAnswer += `Je peux vous aider pour vos trajets, transferts aéroport, et conseils sur la Côte d'Azur. Contactez-moi au 06 16 55 28 11 ou via le <a href='/reservation'>${linkText}</a>.`;
      }
    }
    
    return {
      statusCode: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" 
      },
      body: JSON.stringify({ 
        answer: fallbackAnswer,
        fallback: true
      }),
    };
  }
};
