const Replicate = require('replicate');
const fs = require('fs');
const path = require('path');

// Configuration
const replicateToken = process.env.REPLICATE_API_TOKEN;
if (!replicateToken) {
  console.error('❌ REPLICATE_API_TOKEN manquant dans les variables d\'environnement');
  process.exit(1);
}

const replicate = new Replicate({ auth: replicateToken });

// Structure des images nécessaires par page
const imageRequirements = {
  'index': [
    { id: 'hero-main', context: 'hero', description: 'Berline premium VTC stationnée devant un aéroport générique méditerranéen' },
    { id: 'nice-destination', context: 'destination', description: 'Vue panoramique d\'une ville côtière méditerranéenne générique avec plage' },
    { id: 'cannes-destination', context: 'destination', description: 'Vue panoramique d\'une ville côtière méditerranéenne générique avec palmiers' },
    { id: 'monaco-destination', context: 'destination', description: 'Vue panoramique d\'une ville côtière méditerranéenne générique avec port' },
    { id: 'saint-tropez-destination', context: 'destination', description: 'Vue panoramique d\'une ville côtière méditerranéenne générique avec plage et yachts' }
  ],
  'vtc-nice': [
    { id: 'nice-hero-1', context: 'hero', description: 'Berline premium VTC dans une ville côtière méditerranéenne générique' },
    { id: 'nice-hero-2', context: 'hero', description: 'Intérieur premium d\'une berline VTC avec sièges en cuir' },
    { id: 'nice-destination-1', context: 'destination', description: 'Vue aérienne d\'une ville côtière méditerranéenne générique' },
    { id: 'nice-destination-2', context: 'destination', description: 'Promenade côtière méditerranéenne générique avec palmiers' }
  ],
  'vtc-cannes': [
    { id: 'cannes-hero-1', context: 'hero', description: 'Berline premium VTC devant un palais des congrès générique méditerranéen' },
    { id: 'cannes-hero-2', context: 'hero', description: 'Intérieur premium d\'une berline VTC avec espace spacieux' },
    { id: 'cannes-destination-1', context: 'destination', description: 'Vue aérienne d\'une ville côtière méditerranéenne générique avec croisette' },
    { id: 'cannes-destination-2', context: 'destination', description: 'Plage méditerranéenne générique avec cabanes de plage' }
  ],
  'vtc-monaco': [
    { id: 'monaco-hero-1', context: 'hero', description: 'Berline premium VTC dans une principauté côtière méditerranéenne générique' },
    { id: 'monaco-hero-2', context: 'hero', description: 'Intérieur premium d\'une berline VTC avec finitions luxueuses' },
    { id: 'monaco-destination-1', context: 'destination', description: 'Vue aérienne d\'une principauté côtière méditerranéenne générique' },
    { id: 'monaco-destination-2', context: 'destination', description: 'Port méditerranéen générique avec yachts de luxe' }
  ],
  'vtc-saint-tropez': [
    { id: 'saint-tropez-hero-1', context: 'hero', description: 'Berline premium VTC dans une station balnéaire méditerranéenne générique' },
    { id: 'saint-tropez-hero-2', context: 'hero', description: 'Intérieur premium d\'une berline VTC avec vue sur la mer' },
    { id: 'saint-tropez-destination-1', context: 'destination', description: 'Vue aérienne d\'une station balnéaire méditerranéenne générique' },
    { id: 'saint-tropez-destination-2', context: 'destination', description: 'Plage méditerranéenne générique avec club de plage' }
  ],
  'a-propos': [
    { id: 'about-chauffeur', context: 'about', description: 'Chauffeur professionnel en tenue business debout à côté d\'une berline premium' },
    { id: 'about-vehicle', context: 'about', description: 'Berline premium VTC vue de côté avec finitions haut de gamme' },
    { id: 'about-certification', context: 'about', description: 'Certificat VTC professionnel sur fond neutre' }
  ],
  'services': [
    { id: 'service-airport', context: 'service', description: 'Berline premium VTC à l\'aéroport avec panneaux génériques' },
    { id: 'service-business', context: 'service', description: 'Intérieur premium d\'une berline VTC avec espace de travail' },
    { id: 'service-wedding', context: 'service', description: 'Berline premium VTC décorée pour événement avec rubans discrets' }
  ]
};

// Prompt de base pour toutes les images
const basePrompt = "Photo réaliste professionnelle, haute qualité, style photographie commerciale premium, éclairage naturel, composition soignée, sans aucun logo de marque, sans nom de lieu réel, sans monument ou bâtiment clairement reconnaissable, sans texte visible, ambiance élégante et sobre";

// Générer une image
async function generateImage(imageId, description, context) {
  const prompt = `${basePrompt}, ${description}, contexte: ${context}`;
  
  console.log(`\n📸 Génération: ${imageId}`);
  console.log(`   Prompt: ${prompt.substring(0, 100)}...`);
  
  try {
    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: prompt,
          negative_prompt: "logo, texte, panneau, nom de ville, monument célèbre, bâtiment reconnaissable, marque, watermark, signature",
          num_outputs: 1,
          num_inference_steps: 30,
          guidance_scale: 7.5,
          width: 1024,
          height: 768
        }
      }
    );
    
    if (output && output[0]) {
      console.log(`   ✅ Généré: ${output[0]}`);
      return output[0];
    } else {
      throw new Error('Aucune image générée');
    }
  } catch (error) {
    console.error(`   ❌ Erreur: ${error.message}`);
    return null;
  }
}

// Télécharger et sauvegarder une image
async function downloadAndSave(url, filePath) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const buffer = await response.arrayBuffer();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, Buffer.from(buffer));
    console.log(`   💾 Sauvegardé: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`   ❌ Erreur téléchargement: ${error.message}`);
    return false;
  }
}

// Générer toutes les images
async function generateAllImages() {
  console.log('\n🎨 GÉNÉRATION DE TOUTES LES IMAGES\n');
  console.log('='.repeat(50));
  
  const results = {
    success: [],
    failed: []
  };
  
  for (const [page, images] of Object.entries(imageRequirements)) {
    console.log(`\n📄 Page: ${page}`);
    console.log('-'.repeat(50));
    
    for (const img of images) {
      const imageUrl = await generateImage(img.id, img.description, img.context);
      
      if (imageUrl) {
        // Déterminer le chemin de sauvegarde
        let savePath;
        if (img.context === 'hero') {
          savePath = path.join(__dirname, '..', 'public', 'assets', 'img', 'hero', `${img.id}.webp`);
        } else if (img.context === 'destination') {
          savePath = path.join(__dirname, '..', 'public', 'assets', 'img', 'destinations', `${img.id}.webp`);
        } else if (img.context === 'about') {
          savePath = path.join(__dirname, '..', 'public', 'assets', 'img', 'about', `${img.id}.webp`);
        } else if (img.context === 'service') {
          savePath = path.join(__dirname, '..', 'public', 'assets', 'img', 'services', `${img.id}.webp`);
        }
        
        if (savePath) {
          const saved = await downloadAndSave(imageUrl, savePath);
          if (saved) {
            results.success.push({ page, id: img.id, path: savePath });
          } else {
            results.failed.push({ page, id: img.id, error: 'Téléchargement échoué' });
          }
        }
      } else {
        results.failed.push({ page, id: img.id, error: 'Génération échouée' });
      }
      
      // Pause entre les générations pour éviter rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // Rapport final
  console.log('\n\n📊 RAPPORT FINAL\n');
  console.log('='.repeat(50));
  console.log(`✅ Succès: ${results.success.length}`);
  console.log(`❌ Échecs: ${results.failed.length}`);
  
  if (results.failed.length > 0) {
    console.log('\n❌ Échecs:');
    results.failed.forEach(f => {
      console.log(`   - ${f.page}/${f.id}: ${f.error}`);
    });
  }
  
  // Sauvegarder le rapport
  fs.writeFileSync(
    path.join(__dirname, '..', 'image-generation-report.json'),
    JSON.stringify(results, null, 2)
  );
  
  console.log('\n📄 Rapport sauvegardé: image-generation-report.json\n');
}

// Exécuter
generateAllImages().catch(console.error);

