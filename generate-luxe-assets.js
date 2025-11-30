// Script pour générer les assets luxe : image de fond chauffeur et logo
const fs = require('node:fs/promises');
const path = require('node:path');

const REPLICATE_API_URL = 'https://api.replicate.com/v1/predictions';
const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const REPLICATE_MODEL_VERSION = process.env.REPLICATE_MODEL_VERSION || 'black-forest-labs/flux-pro';

if (!REPLICATE_API_TOKEN) {
  console.error('⚠️  REPLICATE_API_TOKEN non défini. Utilisation de placeholders.');
}

async function callReplicate(prompt, modelVersion = REPLICATE_MODEL_VERSION) {
  if (!REPLICATE_API_TOKEN) {
    throw new Error('REPLICATE_API_TOKEN requis');
  }

  const response = await fetch(REPLICATE_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Token ${REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: modelVersion,
      input: {
        prompt,
        aspect_ratio: modelVersion.includes('flux') ? '16:9' : undefined,
        output_format: 'webp',
        output_quality: 90,
        num_outputs: 1
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erreur Replicate: ${response.status} ${errorText}`);
  }

  let prediction = await response.json();
  const pollUrl = prediction.urls.get;

  for (let i = 0; i < 30; i++) {
    if (prediction.status === 'succeeded') break;
    if (prediction.status === 'failed' || prediction.status === 'canceled') {
      throw new Error(`Prédiction échouée: ${prediction.status}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const pollRes = await fetch(pollUrl, {
      headers: { 'Authorization': `Token ${REPLICATE_API_TOKEN}` },
    });

    if (!pollRes.ok) throw new Error(`Erreur polling: ${pollRes.status}`);
    prediction = await pollRes.json();
  }

  if (prediction.status !== 'succeeded') {
    throw new Error(`Prédiction non terminée: ${prediction.status}`);
  }

  return Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
}

async function downloadImage(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erreur téléchargement: ${res.status}`);
  const buffer = await res.arrayBuffer();
  await fs.writeFile(destPath, Buffer.from(buffer));
}

// Images à générer avec prompts optimisés
const assetsToGenerate = [
  {
    fileName: 'hero/chauffeur-luxe-background.webp',
    prompt: 'Ultra premium luxury private driver service background: elegant black luxury sedan Mercedes or Tesla with professional chauffeur in dark business suit and white gloves standing beside the car door, French Riviera coastal road at golden hour sunset, sophisticated atmosphere, cinematic lighting with warm golden tones, premium quality photography, no text, no logos, no recognizable landmarks, professional automotive photography style, 4K quality, wide horizontal composition perfect for website hero background, depth of field, bokeh effect'
  },
  {
    fileName: 'hero/chauffeur-interior-luxe.webp',
    prompt: 'Luxury car interior view from back passenger seat: premium black leather seats with golden stitching, ambient golden lighting strips, elegant wood or carbon fiber details, sophisticated atmosphere, champagne glasses visible, no people, professional automotive photography, high-end luxury car interior, perfect for premium service website, shallow depth of field'
  },
  {
    fileName: 'logo/ecofundrive-logo-concept.webp',
    prompt: 'Professional luxury logo design concept for private driver service: elegant minimalist icon combining car silhouette and luxury elements, gold and black color scheme, sophisticated typography style, premium feel, suitable for high-end transportation service, clean modern design, no text, just visual logo mark, vector style, professional branding'
  }
];

async function main() {
  console.log('🎨 Génération des assets luxe...\n');

  const projectRoot = path.resolve(__dirname);
  const imgDir = path.join(projectRoot, 'assets', 'img');

  for (const asset of assetsToGenerate) {
    const destPath = path.join(imgDir, asset.fileName);
    const destDir = path.dirname(destPath);

    // Créer le dossier si nécessaire
    await fs.mkdir(destDir, { recursive: true });

    // Vérifier si l'image existe déjà
    try {
      await fs.access(destPath);
      console.log(`⌁ Image déjà présente: ${asset.fileName}`);
      continue;
    } catch {
      // Fichier absent, on le génère
    }

    if (!REPLICATE_API_TOKEN) {
      console.log(`⚠️  ${asset.fileName} - REPLICATE_API_TOKEN requis`);
      continue;
    }

    console.log(`▶ Génération de ${asset.fileName}...`);

    try {
      const imageUrl = await callReplicate(asset.prompt);
      console.log(`   URL générée: ${imageUrl}`);
      await downloadImage(imageUrl, destPath);
      console.log(`   ✅ Image sauvegardée: ${asset.fileName}\n`);
    } catch (error) {
      console.error(`   ❌ Erreur: ${error.message}\n`);
    }
  }

  console.log('✅ Génération terminée!');
}

main().catch(console.error);

