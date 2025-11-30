// Netlify Function - proxy vers l'API DeepSeek
// Nécessite la variable d'environnement DEEPSEEK_API_KEY configurée sur Netlify

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.handler = async function (event) {
  // CORS de base pour l'appel depuis le front
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

  try {
    const body = JSON.parse(event.body || "{}");
    const userMessage = (body && body.message ? String(body.message) : "").trim();

    if (!userMessage) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Message manquant" }),
      };
    }

    const systemPrompt =
      "Tu t'appelles David. Tu es chauffeur VTC et guide touristique expérimenté basé sur la Côte d'Azur et en région PACA." +
      " Tu es chaleureux, sympathique, poli et bienveillant : tu mets à l'aise les clients français et internationaux, sans être envahissant." +
      " Tu réponds toujours dans la langue utilisée par l'utilisateur : si le message est en français, tu réponds en français ; s'il est clairement en anglais, en italien ou en russe, tu réponds dans cette même langue, sans mélanger plusieurs langues dans une même réponse." +
      " Tu peux commencer souvent par une courte phrase de bienvenue adaptée à la langue de l'utilisateur, par exemple :" +
      " en français : 'Bienvenue sur la Côte d'Azur, je suis David, votre chauffeur privé et guide.'" +
      " en anglais : 'Welcome to the French Riviera, I'm David, your private driver and local guide.'" +
      " en italien : 'Benvenuti in Costa Azzurra, sono David, il vostro autista privato e guida locale.'" +
      " en russe : 'Добро пожаловать на Лазурный Берег, я Давид, ваш частный водитель и гид.'" +
      " Ton rôle est double : (1) donner des conseils simples et concrets sur les trajets, visites, excursions et l'organisation du séjour ;" +
      " (2) aider à préparer une réservation de VTC pour ECOFUNDRIVE (chauffeur privé VTC)." +
      " Tu as un ton sérieux et fiable, avec une chaleur humaine discrète : tu peux, de temps en temps, glisser une légère touche d'auto-dérision (par exemple sur ton accent ou ta passion pour la Côte d'Azur), mais tu restes toujours sobre et professionnel." +
      " Tu peux montrer que tu es passionné par la Côte d'Azur, la mer et les sports nautiques comme le windsurf ou le wingfoil, si cela aide à créer du lien, mais sans insister." +
      " Tu connais aussi bien les coins cachés que les lieux emblématiques de la Côte d'Azur et tu aides les clients à rendre leur séjour agréable et mémorable." +
      " Tu mets particulièrement en avant les grands transferts business, les transferts aéroport (Nice Côte d'Azur et Cannes-Mandelieu), ainsi que les trajets entre Nice, Cannes, Monaco et le golfe de Saint-Tropez (Fréjus, Sainte-Maxime, Saint-Tropez)." +
      " Tu peux, si c'est pertinent, évoquer que tu disposes d'un réseau de partenaires sérieux (autres chauffeurs, vans, autocars, guides officiels) et que tu peux aider à coordonner des solutions plus complètes (par exemple un bus avec guide officiel parlant une autre langue, ou plusieurs vans pendant quelques jours), toujours sur devis, sous réserve de disponibilité et avec un délai suffisant." +
      " Tu te comportes comme un 'mister good vibes' accessible plutôt que comme un chauffeur VIP distant, tout en restant très professionnel et posé (niveau de décontraction 5/10)." +
      " Ton défi personnel est de réussir à faire sourire le client au moins une fois pendant l'échange, sans jamais forcer la conversation : si la personne préfère un trajet calme et silencieux, tu le respects totalement." +
      " Tu évites les sujets sensibles et polémiques (politique, religion, origine, thèmes liés à la discrimination ou à l'alcool, etc.) et tu ne donnes jamais d'opinion personnelle sur ces sujets." +
      " Tu restes toujours factuel et professionnel : tu rappelles que la sécurité, le respect du Code de la route et le repos du chauffeur passent avant tout." +
      " Tu ne promets pas de choses irréalistes, tu ne cites jamais d'adresse e-mail et tu privilégies toujours WhatsApp, le téléphone et le formulaire de réservation du site." +
      " Tu poses des questions de précision utiles (date, heure approximative, adresse ou ville de départ et d'arrivée, nombre de passagers, bagages, événements particuliers) avant de proposer une solution." +
      " Tes réponses sont courtes, claires et pratiques, comme si tu parlais directement au client dans la voiture, avec une touche de chaleur humaine mais jamais de familiarité excessive.";

    const deepseekKey = process.env.DEEPSEEK_API_KEY;
    const openaiModel = process.env.OPENAI_MODEL || "gpt-4o";
    const anthropicKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
    const anthropicModel = process.env.ANTHROPIC_MODEL || "claude-3-opus-20240229";

    let answer = null;
    let lastError = null;

    // 1) Tentative avec OpenAI (GPT) si une clé est disponible
    if (openai.apiKey) {
      try {
        const payloadOpenAI = {
          model: openaiModel,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
          max_tokens: 512,
          temperature: 0.6,
        };

        const response = await openai.createChatCompletion(payloadOpenAI);

        if (response.status === 200) {
          answer =
            (response.data.choices &&
              response.data.choices[0] &&
              response.data.choices[0].message &&
              response.data.choices[0].message.content) ||
            null;
        } else {
          const errorText = response.statusText;
          console.error("OpenAI error", errorText);
          lastError = { provider: "openai", details: errorText };
        }
      } catch (err) {
        console.error("OpenAI call failed", err);
        lastError = { provider: "openai", details: String(err) };
      }
    }

    // 2) Si aucune réponse et une clé Anthropic / Claude est dispo, fallback Claude
    if (!answer && anthropicKey) {
      try {
        const payloadAnthropic = {
          model: anthropicModel,
          max_tokens: 512,
          temperature: 0.6,
          system: systemPrompt,
          messages: [
            { role: "user", content: userMessage },
          ],
        };

        const response = await fetch(ANTHROPIC_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": anthropicKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify(payloadAnthropic),
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.content && Array.isArray(data.content)) {
            for (let i = 0; i < data.content.length; i++) {
              const block = data.content[i];
              if (block && block.type === "text" && typeof block.text === "string") {
                answer = block.text;
                break;
              }
            }
          }
        } else {
          const errorText = await response.text();
          console.error("Anthropic / Claude error", errorText);
          lastError = { provider: "anthropic", details: errorText };
        }
      } catch (err) {
        console.error("Anthropic / Claude call failed", err);
        lastError = { provider: "anthropic", details: String(err) };
      }
    }

    // 3) Optionnel : si aucune réponse et une clé DeepSeek est dispo, ultime fallback
    if (!answer && deepseekKey) {
      try {
        const payloadDeepseek = {
          model: "deepseek-chat",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
          max_tokens: 512,
          temperature: 0.6,
        };

        const response = await fetch(DEEPSEEK_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${deepseekKey}`,
          },
          body: JSON.stringify(payloadDeepseek),
        });

        if (response.ok) {
          const data = await response.json();
          answer =
            (data.choices &&
              data.choices[0] &&
              data.choices[0].message &&
              data.choices[0].message.content) ||
            null;
        } else {
          const errorText = await response.text();
          console.error("DeepSeek error", errorText);
          lastError = { provider: "deepseek", details: errorText };
        }
      } catch (err) {
        console.error("DeepSeek call failed", err);
        lastError = { provider: "deepseek", details: String(err) };
      }
    }

    if (!answer) {
      return {
        statusCode: 502,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          error: "Aucun moteur de chat disponible",
          details:
            lastError ||
            "Aucune clé API configurée ou toutes les tentatives ont échoué (DeepSeek / OpenAI).",
        }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ answer: answer.trim() }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Erreur interne" }),
    };
  }
};
