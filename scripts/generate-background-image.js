/**
 * Script pour générer une image de fond avec Replicate API
 * Image : Chauffeur privé professionnel avec voiture classe sur la Côte d'Azur
 */

const Replicate = require('replicate');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function generateBackgroundImage() {
  console.log('🎨 Génération de l\'image de fond avec Replicate...');
  
  try {
    // Prompt détaillé pour une image authentique
    const prompt = `Professional luxury private chauffeur service, elegant male chauffeur in black suit and white gloves standing next to a premium black luxury sedan car (Mercedes S-Class or similar), French Riviera background with Mediterranean sea and palm trees, Côte d'Azur, Nice or Cannes, golden hour lighting, professional photography, high quality, cinematic, elegant, sophisticated, luxury, premium, 4K, ultra detailed, photorealistic, natural lighting, depth of field, bokeh effect, wide angle view, horizontal composition, perfect for website background, 1920x1080 resolution`;

    // Utiliser un modèle Stable Diffusion performant
    const model = "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b";
    
    console.log('📤 Envoi de la requête à Replicate...');
    console.log('⏳ Cela peut prendre 1-2 minutes...');
    
    const output = await replicate.run(model, {
      input: {
        prompt: prompt,
        width: 1920,
        height: 1080,
        num_outputs: 1,
        num_inference_steps: 50,
        guidance_scale: 7.5,
        negative_prompt: "blurry, low quality, distorted, ugly, bad anatomy, text, watermark, logo, signature, cartoon, anime, painting, drawing, sketch, illustration, abstract, dark, gloomy, night, indoor, cluttered, busy, people in casual clothes, old car, damaged car, poor lighting",
        refine: "expert_ensemble_refiner",
        scheduler: "K_EULER",
        lora_scale: 0.6,
        apply_watermark: false,
      }
    });

    console.log('✅ Image générée !');
    console.log('📥 Téléchargement de l\'image...');
    
    // L'output est une URL ou un tableau d'URLs
    const imageUrl = Array.isArray(output) ? output[0] : output;
    console.log('🔗 URL de l\'image :', imageUrl);
    
    // Télécharger l'image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    const buffer = await response.arrayBuffer();
    
    // Créer le dossier de destination s'il n'existe pas
    const publicDir = path.join(process.cwd(), 'public', 'assets', 'img', 'hero');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
      console.log('📁 Dossier créé :', publicDir);
    }
    
    // Sauvegarder l'image en WebP (on garde le format original pour l'instant)
    const imagePath = path.join(publicDir, 'chauffeur-luxe-background.webp');
    fs.writeFileSync(imagePath, Buffer.from(buffer));
    
    const fileSizeMB = (buffer.byteLength / 1024 / 1024).toFixed(2);
    console.log('✅ Image sauvegardée :', imagePath);
    console.log('📏 Taille :', fileSizeMB, 'MB');
    
    return imagePath;
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération :', error);
    if (error.message.includes('API_TOKEN')) {
      console.error('💡 Vérifiez que REPLICATE_API_TOKEN est défini dans votre fichier .env');
    }
    throw error;
  }
}

// Exécuter
if (require.main === module) {
  generateBackgroundImage()
    .then(() => {
      console.log('🎉 Image de fond générée avec succès !');
      console.log('📝 N\'oubliez pas de modifier le CSS pour rendre l\'image visible.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Échec de la génération :', error.message);
      process.exit(1);
    });
}

module.exports = { generateBackgroundImage };

