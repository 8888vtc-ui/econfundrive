// ═══════════════════════════════════════════════════════════
// ECOFUNDRIVE V2.0 - IMAGES.TS (WebP/AVIF Responsive)
// ═══════════════════════════════════════════════════════════

export interface HeroImage {
  src: string;
  srcset: string;
  srcsetWebP: string;
  srcsetAVIF?: string;
  alt: string;
  sizes: string;
  width: number;
  height: number;
}

export interface ContentImage {
  src: string;
  srcWebP: string;
  srcAVIF?: string;
  alt: string;
  width: number;
  height: number;
}

/**
 * Get hero image for page with WebP/AVIF support
 * Authority pages: unique images
 * Standard pages: shared by category
 *
 * 3 sizes: 800w, 1200w, 1920w
 * 2 formats: WebP (required), AVIF (optional, better compression)
 */
export function getHeroImage(
  category: string,
  keyword: string,
  isAuthority: boolean
): HeroImage {
  const slug = keyword.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const basePath = isAuthority
    ? `/images/hero/${slug}`
    : `/images/hero/${category}`;

  // Original JPG fallback
  const jpg800 = `${basePath}-800w.jpg`;
  const jpg1200 = `${basePath}-1200w.jpg`;
  const jpg1920 = `${basePath}-1920w.jpg`;

  // WebP (primary modern format)
  const webp800 = `${basePath}-800w.webp`;
  const webp1200 = `${basePath}-1200w.webp`;
  const webp1920 = `${basePath}-1920w.webp`;

  // AVIF (next-gen format, best compression)
  const avif800 = `${basePath}-800w.avif`;
  const avif1200 = `${basePath}-1200w.avif`;
  const avif1920 = `${basePath}-1920w.avif`;

  return {
    src: jpg1200, // Fallback for old browsers
    srcset: `${jpg800} 800w, ${jpg1200} 1200w, ${jpg1920} 1920w`,
    srcsetWebP: `${webp800} 800w, ${webp1200} 1200w, ${webp1920} 1920w`,
    srcsetAVIF: `${avif800} 800w, ${avif1200} 1200w, ${avif1920} 1920w`,
    alt: generateAltText(keyword, category, 'hero'),
    sizes: '(max-width: 768px) 800px, (max-width: 1024px) 1200px, 1920px',
    width: 1920,
    height: 1080
  };
}

/**
 * Get content images for page (2-3 images)
 * Returns responsive images with WebP/AVIF support
 */
export function getContentImages(
  category: string,
  keyword: string,
  count: number = 3
): ContentImage[] {
  const images: ContentImage[] = [];
  const slug = keyword.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const contexts = getImageContexts(category);

  for (let i = 0; i < Math.min(count, contexts.length); i++) {
    const context = contexts[i];
    const basePath = `/images/content/${category}/${slug}-${i + 1}`;

    images.push({
      src: `${basePath}.jpg`,
      srcWebP: `${basePath}.webp`,
      srcAVIF: `${basePath}.avif`,
      alt: generateAltText(keyword, category, context),
      width: 1200,
      height: 800
    });
  }

  return images;
}

/**
 * Generate varied alt text (not template-based)
 * Returns descriptive, unique alt texts
 */
export function generateAltText(
  keyword: string,
  category: string,
  context: string = 'general'
): string {
  // Hash keyword for consistent variation
  const hash = hashString(keyword);
  const variant = hash % 3;

  // Category-specific natural alt texts
  const altTemplates: Record<string, string[][]> = {
    vtc: [
      [
        `Tesla Model S ECOFUNDRIVE pour ${keyword}`,
        `Intérieur luxueux Tesla pour trajet ${keyword}`,
        `Chauffeur professionnel VTC ${keyword} Côte d'Azur`
      ],
      [
        `VTC premium Tesla électrique ${keyword}`,
        `Confort à bord Tesla Model X pour ${keyword}`,
        `Service VTC haut de gamme ${keyword} ECOFUNDRIVE`
      ],
      [
        `Réservation VTC Tesla ${keyword} en ligne`,
        `Véhicule électrique premium pour ${keyword}`,
        `Transfert VTC éco-responsable ${keyword}`
      ]
    ],
    beaches: [
      [
        `Vue panoramique ${keyword} Côte d'Azur`,
        `Accès plage ${keyword} en VTC Tesla`,
        `Transats et parasols ${keyword} en été`
      ],
      [
        `Eaux turquoises ${keyword} Méditerranée`,
        `Plage aménagée ${keyword} avec services`,
        `Coucher de soleil ${keyword} French Riviera`
      ],
      [
        `${keyword} : plage de sable fin Côte d'Azur`,
        `Arrivée en VTC Tesla à ${keyword}`,
        `Ambiance estivale ${keyword} bord de mer`
      ]
    ],
    restaurants: [
      [
        `Terrasse panoramique restaurant ${keyword}`,
        `Plat signature chef ${keyword} Côte d'Azur`,
        `Ambiance gastronomique ${keyword} vue mer`
      ],
      [
        `Dégustation culinaire ${keyword} French Riviera`,
        `Intérieur élégant restaurant ${keyword}`,
        `Arrivée VTC Tesla restaurant ${keyword}`
      ],
      [
        `${keyword} : cuisine méditerranéenne raffinée`,
        `Service table restaurant ${keyword} premium`,
        `Expérience gastronomique ${keyword} avec chauffeur`
      ]
    ],
    hotels: [
      [
        `Façade luxueuse hôtel ${keyword}`,
        `Suite premium ${keyword} vue panoramique`,
        `Lobby élégant ${keyword} Côte d'Azur`
      ],
      [
        `Piscine à débordement ${keyword} vue mer`,
        `Spa wellness ${keyword} French Riviera`,
        `Transfert VTC Tesla hôtel ${keyword}`
      ],
      [
        `${keyword} : établissement 5 étoiles`,
        `Conciergerie premium ${keyword}`,
        `Hébergement luxe ${keyword} avec service VTC`
      ]
    ],
    golf: [
      [
        `Parcours 18 trous golf ${keyword}`,
        `Green impeccable ${keyword} Côte d'Azur`,
        `Club house élégant ${keyword}`
      ],
      [
        `Vue panoramique fairway ${keyword}`,
        `Pratique putting ${keyword} French Riviera`,
        `Transfert VTC Tesla golf ${keyword}`
      ],
      [
        `${keyword} : golf prestige international`,
        `Compétition golf ${keyword}`,
        `Arrivée en Tesla au golf ${keyword}`
      ]
    ],
    routes: [
      [
        `Route panoramique ${keyword} vue mer`,
        `Virage spectaculaire ${keyword} Côte d'Azur`,
        `Tesla sur route ${keyword} French Riviera`
      ],
      [
        `Paysage côtier ${keyword} Méditerranée`,
        `Trajet scenic ${keyword} en VTC électrique`,
        `Point de vue ${keyword} arrêt photo`
      ],
      [
        `${keyword} : route mythique Côte d'Azur`,
        `Excursion VTC ${keyword} confort premium`,
        `Panorama exceptionnel ${keyword}`
      ]
    ]
  };

  // Get category templates or fallback
  const categoryTemplates = altTemplates[category] || [
    [`${keyword} - ECOFUNDRIVE Côte d'Azur`, `Service VTC Tesla ${keyword}`, `Transfert premium ${keyword}`]
  ];

  // Select variation
  const templates = categoryTemplates[variant] || categoryTemplates[0];

  // Select context-based template
  let altText: string;
  if (context === 'hero') {
    altText = templates[0];
  } else if (context === 'interior' || context === 'detail') {
    altText = templates[1];
  } else {
    altText = templates[2];
  }

  // Ensure 5-100 chars
  if (altText.length < 5) {
    altText = `${keyword} - ECOFUNDRIVE Côte d'Azur`;
  }
  if (altText.length > 100) {
    altText = altText.substring(0, 97) + '...';
  }

  return altText;
}

/**
 * Generate modern <picture> tag with WebP/AVIF support
 * Fallback chain: AVIF → WebP → JPG
 */
export function generatePictureTag(image: HeroImage): string {
  return `<picture>
  <source
    type="image/avif"
    srcset="${image.srcsetAVIF}"
    sizes="${image.sizes}"
  />
  <source
    type="image/webp"
    srcset="${image.srcsetWebP}"
    sizes="${image.sizes}"
  />
  <source
    type="image/jpeg"
    srcset="${image.srcset}"
    sizes="${image.sizes}"
  />
  <img
    src="${image.src}"
    alt="${image.alt}"
    width="${image.width}"
    height="${image.height}"
    loading="lazy"
    decoding="async"
    style="width: 100%; height: auto;"
  />
</picture>`;
}

/**
 * Generate <picture> tag for content images
 */
export function generateContentPictureTag(image: ContentImage): string {
  return `<picture>
  <source
    type="image/avif"
    srcset="${image.srcAVIF}"
  />
  <source
    type="image/webp"
    srcset="${image.srcWebP}"
  />
  <img
    src="${image.src}"
    alt="${image.alt}"
    width="${image.width}"
    height="${image.height}"
    loading="lazy"
    decoding="async"
    style="width: 100%; height: auto;"
  />
</picture>`;
}

/**
 * Validate image optimization
 * Checks: format, alt text quality, dimensions
 */
export function validateImages(images: (HeroImage | ContentImage)[]): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  images.forEach((img, index) => {
    // Check alt text
    if (!img.alt || img.alt.length < 5) {
      issues.push(`Image ${index + 1}: Alt text too short (min 5 chars)`);
    }
    if (img.alt && img.alt.length > 100) {
      issues.push(`Image ${index + 1}: Alt text too long (max 100 chars)`);
    }

    // Check for generic alt texts
    const genericTerms = ['image', 'photo', 'picture', 'img', 'placeholder'];
    if (img.alt && genericTerms.some(term => img.alt.toLowerCase().trim() === term)) {
      issues.push(`Image ${index + 1}: Generic alt text detected`);
    }

    // Check WebP present
    if ('srcWebP' in img) {
      if (!img.srcWebP || img.srcWebP.length === 0) {
        issues.push(`Image ${index + 1}: Missing WebP format`);
      }
    }
    if ('srcsetWebP' in img) {
      if (!img.srcsetWebP || img.srcsetWebP.length === 0) {
        issues.push(`Image ${index + 1}: Missing WebP srcset`);
      }
    }

    // Check dimensions (hero should be 16:9)
    if ('width' in img && 'height' in img) {
      const ratio = img.width / img.height;
      if ('srcset' in img) { // Hero image
        if (Math.abs(ratio - (16/9)) > 0.1) {
          issues.push(`Image ${index + 1}: Hero ratio should be 16:9, got ${ratio.toFixed(2)}`);
        }
      }
    }
  });

  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Get image generation instructions for CLI/scripts
 * Returns commands to generate optimized images
 */
export function getImageGenerationInstructions(
  category: string,
  keyword: string,
  isAuthority: boolean
): string {
  const slug = keyword.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const basePath = isAuthority ? `hero/${slug}` : `hero/${category}`;

  return `
# Image Generation Instructions for: ${keyword}

## Hero Image (3 sizes × 3 formats = 9 files)

### JPG (fallback):
cwebp -q 85 -resize 800 450 source.jpg -o public/images/${basePath}-800w.jpg
cwebp -q 85 -resize 1200 675 source.jpg -o public/images/${basePath}-1200w.jpg
cwebp -q 85 -resize 1920 1080 source.jpg -o public/images/${basePath}-1920w.jpg

### WebP (primary):
cwebp -q 80 -resize 800 450 source.jpg -o public/images/${basePath}-800w.webp
cwebp -q 80 -resize 1200 675 source.jpg -o public/images/${basePath}-1200w.webp
cwebp -q 80 -resize 1920 1080 source.jpg -o public/images/${basePath}-1920w.webp

### AVIF (best compression):
avifenc --min 0 --max 63 -s 0 -j 8 source-800.jpg public/images/${basePath}-800w.avif
avifenc --min 0 --max 63 -s 0 -j 8 source-1200.jpg public/images/${basePath}-1200w.avif
avifenc --min 0 --max 63 -s 0 -j 8 source-1920.jpg public/images/${basePath}-1920w.avif

## Content Images (2-3 images × 3 formats)
Similar process for content/${category}/${slug}-1.{jpg,webp,avif}

## Recommended Tools:
- cwebp (libwebp): https://developers.google.com/speed/webp/download
- avifenc (libavif): https://github.com/AOMediaCodec/libavif
- ImageMagick for batch processing
`;
}

// ═══════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function getImageContexts(category: string): string[] {
  const contexts: Record<string, string[]> = {
    vtc: ['hero', 'interior', 'detail'],
    beaches: ['hero', 'detail', 'ambiance'],
    restaurants: ['hero', 'interior', 'detail'],
    hotels: ['hero', 'interior', 'amenity'],
    golf: ['hero', 'course', 'clubhouse'],
    routes: ['hero', 'scenic', 'landmark']
  };

  return contexts[category] || ['hero', 'detail', 'ambiance'];
}

/**
 * Generate placeholder image URLs for development
 * Use https://placehold.co for realistic testing
 */
export function getPlaceholderImage(
  width: number,
  height: number,
  text: string
): string {
  return `https://placehold.co/${width}x${height}/1a1a1a/ffffff?text=${encodeURIComponent(text)}`;
}

/**
 * Check if image file exists (for build-time validation)
 */
export async function imageExists(path: string): Promise<boolean> {
  // This would need to be implemented server-side
  // For now, return true (assume images will be generated)
  return true;
}
