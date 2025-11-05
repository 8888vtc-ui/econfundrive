// ═══════════════════════════════════════════════════════════
// ECOFUNDRIVE V2.0 - FLUXPRO.TS (Image Generation)
// ═══════════════════════════════════════════════════════════

import 'dotenv/config';
import Replicate from 'replicate';
import fs from 'fs/promises';
import path from 'path';

// Replicate client with API key
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

interface ImageOptions {
  prompt: string;
  width: number;
  height: number;
  quality: 'high' | 'medium';
}

interface GeneratedImage {
  success: boolean;
  filename?: string;
  url?: string;
  error?: string;
}

const PROMPTS_BY_CATEGORY = {
  beaches: `Cinematic aerial view of pristine Mediterranean beach at golden hour,
    turquoise crystal-clear water, white sand, luxury beach clubs with elegant
    parasols (no logos), palm trees, French Riviera coastline, professional
    photography, warm colors, depth of field, 8K quality, NO text, NO logos,
    NO branding, landscape orientation`,

  restaurants: `Elegant fine dining restaurant terrace overlooking Mediterranean sea,
    sunset golden light, sophisticated table settings, coastal view, French Riviera
    architecture, luxury ambiance, warm tones, professional photography, shallow
    depth of field, NO logos, NO people faces, NO text, landscape format, 8K quality`,

  hotels: `Luxury 5-star hotel infinity pool overlooking Mediterranean, sunset
    reflection on water, modern elegant architecture, lounge chairs (no branding),
    panoramic sea view, palm trees, warm golden hour light, professional architectural
    photography, NO logos, NO text, landscape 16:9, 8K quality`,

  vtc_services: `Scenic coastal road French Riviera at sunset, luxury electric car silhouette,
    Mediterranean sea view, winding road through mountains, golden hour lighting,
    cinematic composition, warm colors, professional photography, NO license plate
    visible, NO car brand logos, landscape format, 8K quality`,

  golf: `Pristine golf course with Mediterranean sea view, perfectly manicured green,
    sunset golden light, coastal landscape, French Riviera scenery, professional golf
    photography, warm tones, depth of field, NO logos, NO text, NO people faces,
    landscape orientation, 8K quality`,

  vineyards: `Provence vineyard rows at golden hour, rolling hills, Mediterranean
    landscape, warm sunset light, organized vine rows, professional landscape
    photography, rich colors, depth of field, NO winery logos, NO text, NO people,
    landscape format 16:9, 8K quality`
};

export async function generateHeroImage(category: string, keyword: string): Promise<GeneratedImage> {
  const prompt = PROMPTS_BY_CATEGORY[category as keyof typeof PROMPTS_BY_CATEGORY] || PROMPTS_BY_CATEGORY.beaches;

  console.log(`🎨 Generating image for: ${keyword} (${category})`);
  console.log(`📝 Prompt: ${prompt.substring(0, 100)}...`);

  try {
    // Generate image with Flux Pro via Replicate API
    const output = await replicate.run(
      "black-forest-labs/flux-pro",
      {
        input: {
          prompt: prompt,
          aspect_ratio: "16:9",
          output_format: "jpg",
          output_quality: 90,
          safety_tolerance: 2,
          prompt_upsampling: true
        }
      }
    ) as string;

    // Download the generated image
    const imageUrl = output;
    console.log(`✅ Image URL generated: ${imageUrl}`);

    // Fetch image data
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }

    const imageBuffer = Buffer.from(await response.arrayBuffer());

    // Create filename and save to public/images/hero/
    const filename = `${keyword}.jpg`;
    const outputDir = path.join(process.cwd(), 'public', 'images', 'hero');
    const outputPath = path.join(outputDir, filename);

    // Ensure directory exists
    await fs.mkdir(outputDir, { recursive: true });

    // Save image file
    await fs.writeFile(outputPath, imageBuffer);

    console.log(`✅ Image saved: ${outputPath}`);

    return {
      success: true,
      filename: filename,
      url: `/images/hero/${filename}`
    };

  } catch (error: any) {
    console.error(`❌ Error generating image for ${keyword}:`, error);

    return {
      success: false,
      error: error.message || 'Unknown error during image generation'
    };
  }
}

// Generate 3 images per page (hero, mid, end) using Claude-generated prompts
export async function generatePageImages(
  keyword: string,
  prompts: { hero: string; mid: string; end: string }
): Promise<{
  hero: GeneratedImage;
  mid: GeneratedImage;
  end: GeneratedImage;
}> {
  console.log(`\n🎨 Generating 3 images for: ${keyword}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

  const results = {
    hero: { success: false, error: 'Not started' } as GeneratedImage,
    mid: { success: false, error: 'Not started' } as GeneratedImage,
    end: { success: false, error: 'Not started' } as GeneratedImage,
  };

  // Generate Hero Image
  try {
    console.log(`\n📸 [1/3] Generating HERO image...`);
    console.log(`Prompt: ${prompts.hero.substring(0, 80)}...`);

    const output = await replicate.run(
      "black-forest-labs/flux-pro",
      {
        input: {
          prompt: prompts.hero,
          aspect_ratio: "16:9",
          output_format: "jpg",
          output_quality: 90,
          safety_tolerance: 2,
          prompt_upsampling: true
        }
      }
    ) as string;

    const response = await fetch(output);
    if (!response.ok) throw new Error(`Failed to download: ${response.statusText}`);

    const imageBuffer = Buffer.from(await response.arrayBuffer());
    const filename = `${keyword}.jpg`;
    const outputDir = path.join(process.cwd(), 'public', 'images', 'hero');
    const outputPath = path.join(outputDir, filename);

    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(outputPath, imageBuffer);

    results.hero = {
      success: true,
      filename: filename,
      url: `/images/hero/${filename}`
    };

    console.log(`✅ Hero image saved: /images/hero/${filename}`);

  } catch (error: any) {
    console.error(`❌ Error generating hero image:`, error.message);
    results.hero = { success: false, error: error.message };
  }

  // Generate Mid Image
  try {
    console.log(`\n📸 [2/3] Generating MID image...`);
    console.log(`Prompt: ${prompts.mid.substring(0, 80)}...`);

    const output = await replicate.run(
      "black-forest-labs/flux-pro",
      {
        input: {
          prompt: prompts.mid,
          aspect_ratio: "16:9",
          output_format: "jpg",
          output_quality: 90,
          safety_tolerance: 2,
          prompt_upsampling: true
        }
      }
    ) as string;

    const response = await fetch(output);
    if (!response.ok) throw new Error(`Failed to download: ${response.statusText}`);

    const imageBuffer = Buffer.from(await response.arrayBuffer());
    const filename = `${keyword}-mid.jpg`;
    const outputDir = path.join(process.cwd(), 'public', 'images', 'content');
    const outputPath = path.join(outputDir, filename);

    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(outputPath, imageBuffer);

    results.mid = {
      success: true,
      filename: filename,
      url: `/images/content/${filename}`
    };

    console.log(`✅ Mid image saved: /images/content/${filename}`);

  } catch (error: any) {
    console.error(`❌ Error generating mid image:`, error.message);
    results.mid = { success: false, error: error.message };
  }

  // Generate End Image
  try {
    console.log(`\n📸 [3/3] Generating END image...`);
    console.log(`Prompt: ${prompts.end.substring(0, 80)}...`);

    const output = await replicate.run(
      "black-forest-labs/flux-pro",
      {
        input: {
          prompt: prompts.end,
          aspect_ratio: "16:9",
          output_format: "jpg",
          output_quality: 90,
          safety_tolerance: 2,
          prompt_upsampling: true
        }
      }
    ) as string;

    const response = await fetch(output);
    if (!response.ok) throw new Error(`Failed to download: ${response.statusText}`);

    const imageBuffer = Buffer.from(await response.arrayBuffer());
    const filename = `${keyword}-end.jpg`;
    const outputDir = path.join(process.cwd(), 'public', 'images', 'content');
    const outputPath = path.join(outputDir, filename);

    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(outputPath, imageBuffer);

    results.end = {
      success: true,
      filename: filename,
      url: `/images/content/${filename}`
    };

    console.log(`✅ End image saved: /images/content/${filename}`);

  } catch (error: any) {
    console.error(`❌ Error generating end image:`, error.message);
    results.end = { success: false, error: error.message };
  }

  // Summary
  const successCount = [results.hero, results.mid, results.end].filter(r => r.success).length;
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🎨 Image generation complete: ${successCount}/3 successful`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  return results;
}

export async function resizeImage(image: Blob, targetWidth: number) {
  // TODO: Implement Sharp or similar library
  console.log(`🔧 Resizing image to ${targetWidth}w`);

  return {
    success: true,
    message: 'Resize placeholder - implement Sharp'
  };
}
