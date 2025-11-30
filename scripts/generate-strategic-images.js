/**
 * Script pour générer des images stratégiques avec Replicate API
 * 21 images de haute qualité pour meubler le site VTC
 */

const Replicate = require('replicate');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Configuration des images à générer
const imagesToGenerate = [
  // CATÉGORIE 1 : HERO IMAGES (1920x1080)
  {
    file: 'public/assets/img/hero/hero-aeroport-nice.webp',
    prompt: 'Professional luxury private chauffeur in black suit and white gloves opening door of premium black luxury sedan car (Mercedes S-Class or BMW 7 Series) at Nice Côte d\'Azur Airport terminal, modern airport architecture in background, French Riviera, golden hour lighting, professional photography, cinematic, elegant, sophisticated, luxury, premium, 4K, ultra detailed, photorealistic, natural lighting, depth of field, wide angle view, horizontal composition, no text, no titles, no names, no logos, no watermarks',
    width: 1920,
    height: 1080,
    category: 'Hero'
  },
  {
    file: 'public/assets/img/hero/hero-business.webp',
    prompt: 'Professional business executive in suit getting into premium black luxury sedan car with professional chauffeur in black suit holding door open, modern business district background, French Riviera, Cannes or Nice, professional photography, corporate, elegant, sophisticated, luxury, premium, 4K, ultra detailed, photorealistic, natural lighting, depth of field, horizontal composition, no text, no titles, no names, no logos, no watermarks',
    width: 1920,
    height: 1080,
    category: 'Hero'
  },
  {
    file: 'public/assets/img/hero/hero-mariage.webp',
    prompt: 'Elegant wedding couple in formal attire getting into decorated premium white luxury sedan car with professional chauffeur in black suit and white gloves, beautiful French Riviera wedding venue in background, flowers, romantic atmosphere, golden hour lighting, professional photography, elegant, sophisticated, luxury, premium, 4K, ultra detailed, photorealistic, natural lighting, depth of field, horizontal composition, no text, no titles, no names, no logos, no watermarks',
    width: 1920,
    height: 1080,
    category: 'Hero'
  },
  
  // CATÉGORIE 2 : DESTINATIONS (1200x800)
  {
    file: 'public/assets/img/destinations/destination-nice.webp',
    prompt: 'Premium black luxury sedan car (Mercedes S-Class) parked on Promenade des Anglais in Nice, Mediterranean sea and palm trees in background, elegant French Riviera atmosphere, golden hour lighting, professional photography, cinematic, elegant, sophisticated, luxury, premium, 4K, ultra detailed, photorealistic, natural lighting, depth of field, horizontal composition, no text, no titles, no names, no logos, no watermarks',
    width: 1200,
    height: 800,
    category: 'Destination'
  },
  {
    file: 'public/assets/img/destinations/destination-cannes.webp',
    prompt: 'Premium black luxury sedan car (BMW 7 Series) parked near Croisette in Cannes, Mediterranean sea and luxury hotels in background, elegant French Riviera atmosphere, golden hour lighting, professional photography, cinematic, elegant, sophisticated, luxury, premium, 4K, ultra detailed, photorealistic, natural lighting, depth of field, horizontal composition, no text, no titles, no names, no logos, no watermarks',
    width: 1200,
    height: 800,
    category: 'Destination'
  },
  {
    file: 'public/assets/img/destinations/destination-monaco.webp',
    prompt: 'Premium black luxury sedan car (Mercedes S-Class) parked in Monte-Carlo Monaco, luxury casino and Mediterranean sea in background, elegant French Riviera atmosphere, golden hour lighting, professional photography, cinematic, elegant, sophisticated, luxury, premium, 4K, ultra detailed, photorealistic, natural lighting, depth of field, horizontal composition, no text, no titles, no names, no logos, no watermarks',
    width: 1200,
    height: 800,
    category: 'Destination'
  },
  {
    file: 'public/assets/img/destinations/destination-saint-tropez.webp',
    prompt: 'Premium black luxury sedan car (BMW 7 Series) parked near port of Saint-Tropez, luxury yachts and Mediterranean sea in background, elegant French Riviera atmosphere, golden hour lighting, professional photography, cinematic, elegant, sophisticated, luxury, premium, 4K, ultra detailed, photorealistic, natural lighting, depth of field, horizontal composition, no text, no titles, no names, no logos, no watermarks',
    width: 1200,
    height: 800,
    category: 'Destination'
  },
  
  // CATÉGORIE 3 : SERVICES (1200x800)
  {
    file: 'public/assets/img/services/service-aeroport.webp',
    prompt: 'Professional chauffeur in black suit and white gloves loading luggage into premium black luxury sedan car trunk at modern airport terminal, Nice Côte d\'Azur Airport, professional photography, elegant, sophisticated, luxury, premium, 4K, ultra detailed, photorealistic, natural lighting, depth of field, horizontal composition, no text, no titles, no names, no logos, no watermarks',
    width: 1200,
    height: 800,
    category: 'Service'
  },
  {
    file: 'public/assets/img/services/service-business.webp',
    prompt: 'Professional business executive working on laptop inside premium black luxury sedan car, professional chauffeur driving, modern business district visible through window, French Riviera, professional photography, elegant, sophisticated, luxury, premium, 4K, ultra detailed, photorealistic, natural lighting, depth of field, horizontal composition, no text, no titles, no names, no logos, no watermarks',
    width: 1200,
    height: 800,
    category: 'Service'
  },
  {
    file: 'public/assets/img/services/service-mariage.webp',
    prompt: 'Elegant wedding couple in formal attire inside decorated premium white luxury sedan car, professional chauffeur driving, beautiful French Riviera wedding venue visible through window, romantic atmosphere, golden hour lighting, professional photography, elegant, sophisticated, luxury, premium, 4K, ultra detailed, photorealistic, natural lighting, depth of field, horizontal composition, no text, no titles, no names, no logos, no watermarks',
    width: 1200,
    height: 800,
    category: 'Service'
  },
  {
    file: 'public/assets/img/services/service-evenements.webp',
    prompt: 'Premium black luxury sedan car and luxury van parked at elegant event venue on French Riviera, professional chauffeurs in black suits, Mediterranean sea in background, golden hour lighting, professional photography, elegant, sophisticated, luxury, premium, 4K, ultra detailed, photorealistic, natural lighting, depth of field, horizontal composition, no text, no titles, no names, no logos, no watermarks',
    width: 1200,
    height: 800,
    category: 'Service'
  },
  {
    file: 'public/assets/img/services/service-mise-disposition.webp',
    prompt: 'Premium black luxury sedan car with professional chauffeur waiting elegantly next to vehicle, modern business district or luxury hotel in background, French Riviera, professional photography, elegant, sophisticated, luxury, premium, 4K, ultra detailed, photorealistic, natural lighting, depth of field, horizontal composition, no text, no titles, no names, no logos, no watermarks',
    width: 1200,
    height: 800,
    category: 'Service'
  },
  
  // CATÉGORIE 4 : CONTEXTE VILLES (1200x800)
  {
    file: 'public/assets/img/destinations/nice-vieux-nice.webp',
    prompt: 'Premium black luxury sedan car driving through narrow historic streets of Vieux-Nice, colorful buildings and Mediterranean atmosphere, French Riviera, golden hour lighting, professional photography, elegant, sophisticated, luxury, premium, 4K, ultra detailed, photorealistic, natural lighting, depth of field, horizontal composition, no text, no titles, no names, no logos, no watermarks',
    width: 1200,
    height: 800,
    category: 'Contexte Ville'
  },
  {
    file: 'public/assets/img/destinations/cannes-palais-festivals.webp',
    prompt: 'Premium black luxury sedan car parked near Palais des Festivals in Cannes, red carpet and luxury atmosphere, Mediterranean sea in background, French Riviera, golden hour lighting, professional photography, elegant, sophisticated, luxury, premium, 4K, ultra detailed, photorealistic, natural lighting, depth of field, horizontal composition, no text, no titles, no names, no logos, no watermarks',
    width: 1200,
    height: 800,
    category: 'Contexte Ville'
  },
  {
    file: 'public/assets/img/destinations/monaco-casino.webp',
    prompt: 'Premium black luxury sedan car parked near Monte-Carlo Casino in Monaco, luxury architecture and Mediterranean sea in background, elegant French Riviera atmosphere, golden hour lighting, professional photography, elegant, sophisticated, luxury, premium, 4K, ultra detailed, photorealistic, natural lighting, depth of field, horizontal composition, no text, no titles, no names, no logos, no watermarks',
    width: 1200,
    height: 800,
    category: 'Contexte Ville'
  },
  {
    file: 'public/assets/img/destinations/saint-tropez-port.webp',
    prompt: 'Premium black luxury sedan car parked near port of Saint-Tropez, luxury yachts and Mediterranean sea in background, elegant French Riviera atmosphere, golden hour lighting, professional photography, elegant, sophisticated, luxury, premium, 4K, ultra detailed, photorealistic, natural lighting, depth of field, horizontal composition, no text, no titles, no names, no logos, no watermarks',
    width: 1200,
    height: 800,
    category: 'Contexte Ville'
  },
  
  // CATÉGORIE 5 : GUIDES (1200x800)
  {
    file: 'public/assets/img/guides/route-panoramique-nice-eze-monaco.webp',
    prompt: 'Premium black luxury sedan car driving on scenic coastal road between Nice and Monaco, Mediterranean sea and cliffs in background, French Riviera, golden hour lighting, professional photography, elegant, sophisticated, luxury, premium, 4K, ultra detailed, photorealistic, natural lighting, depth of field, horizontal composition, no text, no titles, no names, no logos, no watermarks',
    width: 1200,
    height: 800,
    category: 'Guide'
  },
  {
    file: 'public/assets/img/guides/villages-perches.webp',
    prompt: 'Premium black luxury sedan car parked near medieval hilltop village on French Riviera, Eze or Saint-Paul-de-Vence, Mediterranean sea in background, golden hour lighting, professional photography, elegant, sophisticated, luxury, premium, 4K, ultra detailed, photorealistic, natural lighting, depth of field, horizontal composition, no text, no titles, no names, no logos, no watermarks',
    width: 1200,
    height: 800,
    category: 'Guide'
  },
  {
    file: 'public/assets/img/guides/grand-prix-monaco.webp',
    prompt: 'Premium black luxury sedan car with professional chauffeur near Monaco Grand Prix circuit, luxury atmosphere, Mediterranean sea in background, French Riviera, golden hour lighting, professional photography, elegant, sophisticated, luxury, premium, 4K, ultra detailed, photorealistic, natural lighting, depth of field, horizontal composition, no text, no titles, no names, no logos, no watermarks',
    width: 1200,
    height: 800,
    category: 'Guide'
  },
  
  // CATÉGORIE 6 : À PROPOS (1200x800)
  {
    file: 'public/assets/img/about/chauffeur-professionnel.webp',
    prompt: 'Professional male chauffeur in elegant black suit and white gloves standing confidently next to premium black luxury sedan car, French Riviera background, professional photography, elegant, sophisticated, luxury, premium, 4K, ultra detailed, photorealistic, natural lighting, depth of field, horizontal composition, no text, no titles, no names, no logos, no watermarks',
    width: 1200,
    height: 800,
    category: 'À Propos'
  },
  {
    file: 'public/assets/img/about/vehicule-premium.webp',
    prompt: 'Interior view of premium black luxury sedan car (Mercedes S-Class or BMW 7 Series), leather seats, elegant dashboard, professional photography, elegant, sophisticated, luxury, premium, 4K, ultra detailed, photorealistic, natural lighting, depth of field, horizontal composition, no text, no titles, no names, no logos, no watermarks',
    width: 1200,
    height: 800,
    category: 'À Propos'
  }
];

// Modèle Replicate
const model = "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b";

// Negative prompt commun
const negativePrompt = "blurry, low quality, distorted, ugly, bad anatomy, text, watermark, logo, signature, cartoon, anime, painting, drawing, sketch, illustration, abstract, dark, gloomy, night, indoor, cluttered, busy, people in casual clothes, old car, damaged car, poor lighting, readable license plates, street signs with text";

async function generateImage(imageConfig, index, total) {
  const { file, prompt, width, height, category } = imageConfig;
  
  console.log(`\n[${index}/${total}] 🎨 Génération: ${path.basename(file)}`);
  console.log(`📁 Catégorie: ${category}`);
  console.log(`📐 Dimensions: ${width}x${height}`);
  console.log(`⏳ Cela peut prendre 1-2 minutes...`);
  
  try {
    const output = await replicate.run(model, {
      input: {
        prompt: prompt,
        width: width,
        height: height,
        num_outputs: 1,
        num_inference_steps: 50,
        guidance_scale: 7.5,
        negative_prompt: negativePrompt,
        refine: "expert_ensemble_refiner",
        scheduler: "K_EULER",
        lora_scale: 0.6,
        apply_watermark: false,
      }
    });

    const imageUrl = Array.isArray(output) ? output[0] : output;
    console.log(`✅ Image générée !`);
    console.log(`📥 Téléchargement...`);
    
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    const buffer = await response.arrayBuffer();
    
    // Créer le dossier de destination
    const fullPath = path.join(process.cwd(), file);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Sauvegarder l'image (on garde le format PNG pour l'instant, conversion WebP après)
    const pngPath = fullPath.replace('.webp', '.png');
    fs.writeFileSync(pngPath, Buffer.from(buffer));
    
    const fileSizeMB = (buffer.byteLength / 1024 / 1024).toFixed(2);
    console.log(`✅ Image sauvegardée: ${pngPath}`);
    console.log(`📏 Taille: ${fileSizeMB} MB`);
    
    return {
      success: true,
      file: pngPath,
      size: fileSizeMB,
      category: category
    };
    
  } catch (error) {
    console.error(`❌ Erreur: ${error.message}`);
    return {
      success: false,
      file: file,
      error: error.message,
      category: category
    };
  }
}

async function generateAllImages() {
  console.log('🚀 DÉMARRAGE DE LA GÉNÉRATION D\'IMAGES STRATÉGIQUES');
  console.log(`📊 Total: ${imagesToGenerate.length} images à générer`);
  console.log('⏱️  Temps estimé: 20-40 minutes\n');
  
  const results = [];
  const startTime = Date.now();
  
  for (let i = 0; i < imagesToGenerate.length; i++) {
    const result = await generateImage(imagesToGenerate[i], i + 1, imagesToGenerate.length);
    results.push(result);
    
    // Pause entre les générations pour éviter de surcharger l'API
    if (i < imagesToGenerate.length - 1) {
      console.log('⏸️  Pause de 3 secondes avant la prochaine image...\n');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000 / 60).toFixed(1);
  
  // Générer le rapport
  console.log('\n' + '='.repeat(60));
  console.log('📊 RAPPORT DE GÉNÉRATION');
  console.log('='.repeat(60));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`\n✅ Réussies: ${successful.length}/${imagesToGenerate.length}`);
  console.log(`❌ Échouées: ${failed.length}/${imagesToGenerate.length}`);
  console.log(`⏱️  Durée totale: ${duration} minutes`);
  
  if (successful.length > 0) {
    console.log('\n📁 IMAGES GÉNÉRÉES AVEC SUCCÈS:');
    successful.forEach((r, i) => {
      console.log(`  ${i + 1}. [${r.category}] ${path.basename(r.file)} (${r.size} MB)`);
    });
  }
  
  if (failed.length > 0) {
    console.log('\n❌ IMAGES ÉCHOUÉES:');
    failed.forEach((r, i) => {
      console.log(`  ${i + 1}. [${r.category}] ${path.basename(r.file)} - ${r.error}`);
    });
  }
  
  // Sauvegarder le rapport
  const reportPath = path.join(process.cwd(), 'strategic-images-generation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    date: new Date().toISOString(),
    total: imagesToGenerate.length,
    successful: successful.length,
    failed: failed.length,
    duration: `${duration} minutes`,
    results: results
  }, null, 2));
  
  console.log(`\n📄 Rapport sauvegardé: ${reportPath}`);
  console.log('\n🎉 GÉNÉRATION TERMINÉE !');
  console.log('\n💡 PROCHAINES ÉTAPES:');
  console.log('  1. Vérifier les images générées');
  console.log('  2. Convertir les PNG en WebP pour optimisation');
  console.log('  3. Intégrer les images dans les pages du site');
}

// Exécuter
if (require.main === module) {
  if (!process.env.REPLICATE_API_TOKEN) {
    console.error('❌ REPLICATE_API_TOKEN non défini dans .env');
    process.exit(1);
  }
  
  generateAllImages()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Erreur fatale:', error);
      process.exit(1);
    });
}

module.exports = { generateAllImages, imagesToGenerate };

