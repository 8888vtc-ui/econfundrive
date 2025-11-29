// Script de génération d'images via Replicate pour David Chemla VTC
// Utilisation :
//   1) Définir les variables d'environnement :
//        REPLICATE_API_TOKEN  -> votre clé API Replicate
//        REPLICATE_MODEL_VERSION -> l'ID de version du modèle image que vous utilisez
//      (à récupérer dans le tableau de bord Replicate)
//   2) Depuis la racine du projet :
//        node scripts/generate-images.js
//   3) Le script crée les fichiers .webp dans assets/img/ aux chemins déjà utilisés dans le HTML.
//
// Remarque importante :
// - Ce script génère les images UNE FOIS (pré-production). Il n'est pas appelé à chaque visite,
//   pour éviter de consommer vos crédits Replicate à chaque page vue.

const fs = require('node:fs/promises');
const path = require('node:path');

const REPLICATE_API_URL = 'https://api.replicate.com/v1/predictions';
const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const REPLICATE_MODEL_VERSION = process.env.REPLICATE_MODEL_VERSION; // à définir côté Replicate

if (!REPLICATE_API_TOKEN) {
  console.error('Erreur : la variable REPLICATE_API_TOKEN n\'est pas définie.');
  console.error('Définissez-la avant d\'exécuter : REPLICATE_API_TOKEN=... REPLICATE_MODEL_VERSION=... node scripts/generate-images.js');
  process.exit(1);
}

if (!REPLICATE_MODEL_VERSION) {
  console.error('Erreur : la variable REPLICATE_MODEL_VERSION n\'est pas définie.');
  console.error('Renseignez l\'ID de version du modèle image Replicate que vous utilisez.');
  process.exit(1);
}

/**
 * Liste des images à générer automatiquement.
 * Chaque entrée correspond à un fichier dans assets/img/ utilisé par le site.
 * Les prompts sont volontairement génériques, sans noms de lieux.
 */
const imagesConfig = [
  // Accueil FR - hero
  {
    fileName: 'vtc-nice-berline.webp',
    prompt:
      'ultra high quality photo of a luxury black sedan with tinted windows parked in front of a modern hotel entrance at night, warm golden lights, wet asphalt reflections, cinematic atmosphere, no people, no text, no logos, wide horizontal composition for website hero banner',
  },
  // Services - exemples de véhicules
  {
    fileName: 'services-berline-1.webp',
    prompt:
      'luxury black sedan waiting outside a generic modern airport terminal at night, large glass facade, subtle reflections on the car, no airline logos, no airport name, no city name, no text, no people',
  },
  {
    fileName: 'services-van-1.webp',
    prompt:
      'luxury black passenger van parked in front of a modern glass building, evening light, clean corporate style, no people, no text, no brand logos, no recognizable landmark',
  },
  {
    fileName: 'services-interieur-1.webp',
    prompt:
      'high quality photo of the rear passenger seats of a luxury car, black leather seats, soft ambient lighting, visible legroom, no people, no screens showing text or logos, clean minimalist interior',
  },
  {
    fileName: 'services-chauffeur-1.webp',
    prompt:
      'elegant chauffeur in a dark suit standing next to a luxury black sedan, focus on the car and suit, modern building background softly blurred, no visible face details, no text, no logos, no recognizable city',
  },
  // VTC Nice
  {
    fileName: 'vtc-nice-1.webp',
    prompt:
      'luxury black sedan parked near a generic airport drop off area, modern terminal with glass facade in the background, evening light, no airline logos, no airport names, no city names, no text, no people in focus',
  },
  {
    fileName: 'vtc-nice-2.webp',
    prompt:
      'luxury black sedan driving slowly through a modern city street at dusk, soft street lights, blurred background, wet road reflections, cinematic look, no billboards with text, no city names, no recognizable skyline',
  },
  {
    fileName: 'vtc-nice-3.webp',
    prompt:
      'luxury car interior viewed from the rear seats, black leather, ambient lighting strips, center armrest visible, no people, no visible screens with text, high detail, premium atmosphere',
  },
  {
    fileName: 'vtc-nice-4.webp',
    prompt:
      'luxury black car driving along a coastal road at sunset, calm sea on one side and elegant buildings on the other, warm golden light, motion blur on background, no recognizable landmarks, no text, no city names',
  },
  // VTC Cannes
  {
    fileName: 'vtc-cannes-1.webp',
    prompt:
      'luxury black sedan parked on a wide seaside promenade with palm trees and elegant buildings, early evening light, subtle reflections on the car, no text, no recognizable landmark, no city names',
  },
  {
    fileName: 'vtc-cannes-2.webp',
    prompt:
      'luxury black car in front of a modern event venue with wide steps and a red carpet, warm spotlights, people blurred in the background, no readable text on the building, no logos, no city names',
  },
  {
    fileName: 'vtc-cannes-3.webp',
    prompt:
      'luxury black sedan stopped at the entrance of an elegant five star hotel, doorman silhouette blurred in the background, warm lighting, no hotel name visible, no logos, no text, no city names',
  },
  {
    fileName: 'vtc-cannes-4.webp',
    prompt:
      'night scene with a luxury black sedan driving through a lively city street, colorful bokeh lights, wet pavement, cinematic look, no billboards with text, no recognizable skyline, no city names',
  },
  // VTC Monaco
  {
    fileName: 'vtc-monaco-1.webp',
    prompt:
      'luxury black sedan parked near an elegant grand hotel entrance with columns and warm golden lights, night scene, upscale atmosphere, no signs, no text, no city names',
  },
  {
    fileName: 'vtc-monaco-2.webp',
    prompt:
      'discreet professional chauffeur opening the rear door of a luxury black sedan, focus on the car and open door, background softly blurred, no visible face details, no text, no logos, no recognizable landmark',
  },
  {
    fileName: 'vtc-monaco-3.webp',
    prompt:
      'luxury black car on an elevated road overlooking a modern city at night, many lights in the distance, cinematic composition, no recognizable buildings, no text, no city names',
  },
  {
    fileName: 'vtc-monaco-4.webp',
    prompt:
      'view from inside a luxury car at night, looking through the windshield at a brightly lit city, dashboard slightly visible, bokeh lights outside, no text, no logos, no recognizable skyline',
  },
  // VTC Saint-Tropez
  {
    fileName: 'vtc-saint-tropez-1.webp',
    prompt:
      'luxury black sedan on a narrow coastal road with sea and hills, golden hour light, small boats in a distant harbor, relaxed holiday mood, no recognizable harbor, no text, no city names',
  },
  {
    fileName: 'vtc-saint-tropez-2.webp',
    prompt:
      'luxury black car parked in front of a modern villa with pool and terrace, evening ambiance, subtle warm lights, no house number visible, no people, no text, no city names',
  },
  {
    fileName: 'vtc-saint-tropez-3.webp',
    prompt:
      'luxury car near an upscale beach club entrance, wooden deck and umbrellas in the background, sunny weather, relaxed but premium style, no brand logos, no beach name, no text, no city names',
  },
  {
    fileName: 'vtc-saint-tropez-4.webp',
    prompt:
      'night view from a car parked near a marina with yachts, reflections of lights on the water, luxury atmosphere, no recognizable harbor, no text, no city names',
  },
  // EN hero
  {
    fileName: 'en-french-riviera-private-driver.webp',
    prompt:
      'portrait style photo of a luxury black sedan with an elegant driver standing next to it, modern building and palm shadows in the background, late afternoon light, cinematic look, no text, no logos, no city names',
  },
  // EN booking
  {
    fileName: 'en-booking-contact.webp',
    prompt:
      'luxury black car parked calmly at the curb in front of a modern building, driver waiting nearby, warm soft light, trustworthy and professional mood, no text, no logos, no city names',
  },
  // IT landing
  {
    fileName: 'it-costa-azzurra-driver.webp',
    prompt:
      'luxury black sedan driving along a sunny coastal road, blue sea on one side and green hills on the other, daylight, clean and bright style, no recognizable landmark, no text, no city names',
  },
  // RU landing
  {
    fileName: 'ru-private-transfer-car.webp',
    prompt:
      'luxury black car in front of a modern glass building, early evening, soft reflections on the car body, minimalistic composition, no text, no logos, no city names',
  },
];

async function callReplicate(prompt) {
  const response = await fetch(REPLICATE_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Token ${REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: REPLICATE_MODEL_VERSION,
      input: {
        // Clé générique : la plupart des modèles images Replicate acceptent "prompt".
        // Adaptez ici si votre modèle nécessite des champs spécifiques (negative_prompt, aspect_ratio, etc.).
        prompt,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erreur Replicate (création prédiction) : ${response.status} ${errorText}`);
  }

  let prediction = await response.json();

  if (!prediction || !prediction.urls || !prediction.urls.get) {
    throw new Error('Réponse Replicate inattendue (urls.get manquant).');
  }

  const pollUrl = prediction.urls.get;

  // Boucle de polling simple jusqu'à ce que le job soit terminé ou en erreur
  // Timeout de sécurité ~60s (30 itérations x 2s)
  for (let i = 0; i < 30; i++) {
    if (prediction.status === 'succeeded') break;
    if (prediction.status === 'failed' || prediction.status === 'canceled') {
      throw new Error(`Prédiction échouée : statut=${prediction.status}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const pollRes = await fetch(pollUrl, {
      headers: {
        'Authorization': `Token ${REPLICATE_API_TOKEN}`,
      },
    });

    if (!pollRes.ok) {
      const errorText = await pollRes.text();
      throw new Error(`Erreur Replicate (polling) : ${pollRes.status} ${errorText}`);
    }

    prediction = await pollRes.json();
  }

  if (prediction.status !== 'succeeded') {
    throw new Error(`Prédiction non terminée avec succès (statut final=${prediction.status}).`);
  }

  const output = prediction.output;

  if (!Array.isArray(output) || !output[0] || typeof output[0] !== 'string') {
    throw new Error('Format de sortie Replicate inattendu : sortie image manquante.');
  }

  return output[0]; // URL de l'image générée
}

async function downloadImage(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erreur téléchargement image : ${res.status} ${text}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await fs.writeFile(destPath, buffer);
}

async function main() {
  const projectRoot = path.resolve(__dirname, '..');
  const imgDir = path.join(projectRoot, 'assets', 'img');

  await fs.mkdir(imgDir, { recursive: true });

  for (const item of imagesConfig) {
    const destPath = path.join(imgDir, item.fileName);

    // Si le fichier existe déjà, on ne régénère pas (sécurité pour ne pas consommer le crédit inutilement)
    try {
      await fs.access(destPath);
      console.log(`⌁ Image déjà présente, on saute : ${item.fileName}`);
      continue;
    } catch {
      // Fichier absent, on le génère
    }

    console.log(`▶ Génération de ${item.fileName}...`);

    try {
      const imageUrl = await callReplicate(item.prompt);
      console.log(`   URL générée : ${imageUrl}`);
      await downloadImage(imageUrl, destPath);
      console.log(`   ✔ Image sauvegardée dans assets/img/${item.fileName}`);
    } catch (error) {
      console.error(`   ✖ Erreur pour ${item.fileName} :`, error.message);
    }
  }

  console.log('Terminé. Vérifiez le dossier assets/img/ et relancez le build/deploy du site.');
}

main().catch((error) => {
  console.error('Erreur générale du script :', error);
  process.exit(1);
});
