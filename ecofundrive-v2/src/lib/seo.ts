// ═══════════════════════════════════════════════════════════
// ECOFUNDRIVE V2.0 - SEO.TS (Enhanced with Variations)
// ═══════════════════════════════════════════════════════════

export interface SEOValidation {
  valid: boolean;
  score: number;
  checks: {
    html5Valid: boolean;
    metaTitle: boolean;
    metaDescription: boolean;
    h1Unique: boolean;
    wordcount: boolean;
    faqComplete: boolean;
    internalLinks: boolean;
    images: boolean;
    schemas: boolean;
    performance: boolean;
  };
  issues: string[];
}

/**
 * Generate optimized meta title with 4 variations
 * Rule: 50-60 characters, keyword at beginning
 * Variations avoid repetitive patterns detected by Google
 */
export function generateMetaTitle(keyword: string, location: string, category: string): string {
  const isVTC = category === 'vtc' || category === 'transport';
  const hash = hashString(keyword);
  const variant = hash % 4; // 4 variations

  let title: string;

  if (isVTC) {
    // Commercial patterns for VTC pages
    switch (variant) {
      case 0:
        title = `${keyword} | ECOFUNDRIVE VTC Tesla ${location}`;
        break;
      case 1:
        title = `${keyword} - Chauffeur Privé Tesla ${location}`;
        break;
      case 2:
        title = `VTC Tesla ${location} | ${keyword} Premium`;
        break;
      case 3:
        title = `${keyword} : Service VTC Électrique ${location}`;
        break;
      default:
        title = `${keyword} | ECOFUNDRIVE VTC Tesla ${location}`;
    }
  } else {
    // Editorial patterns for place pages
    switch (variant) {
      case 0:
        title = `${keyword} : Guide Complet ${location}`;
        break;
      case 1:
        title = `Découvrir ${keyword} - ${location} Guide`;
        break;
      case 2:
        title = `${keyword} ${location} | Infos & Accès VTC`;
        break;
      case 3:
        title = `Guide ${keyword} : Tout Savoir ${location}`;
        break;
      default:
        title = `${keyword} : Guide Complet ${location}`;
    }
  }

  // Ensure 50-60 chars, cut at word boundary
  if (title.length > 60) {
    const lastSpace = title.substring(0, 57).lastIndexOf(' ');
    title = title.substring(0, lastSpace > 40 ? lastSpace : 57).trim() + '...';
  }

  return title;
}

/**
 * Generate optimized meta description with 4 variations
 * Rule: 150-160 characters
 * Variations avoid duplicate content penalties
 */
export function generateMetaDescription(keyword: string, location: string, category: string): string {
  const isVTC = category === 'vtc' || category === 'transport';
  const hash = hashString(keyword);
  const variant = hash % 4; // 4 variations

  let desc: string;

  if (isVTC) {
    // Commercial descriptions for VTC pages
    switch (variant) {
      case 0:
        desc = `${keyword} avec ECOFUNDRIVE : VTC Tesla premium à ${location}. Service haute qualité, chauffeur bilingue, 26 avis 5★. Réservation 24/7.`;
        break;
      case 1:
        desc = `Service ${keyword} en Tesla électrique. Chauffeur privé professionnel à ${location}. Confort premium, ponctualité garantie. Réservez maintenant.`;
        break;
      case 2:
        desc = `${keyword} : réservez votre VTC Tesla à ${location}. Trajet écologique, luxe et sérénité. 26 avis clients 5 étoiles. Disponible 24h/24.`;
        break;
      case 3:
        desc = `Chauffeur VTC Tesla pour ${keyword}. Service premium ${location}, véhicule électrique haut de gamme. Réservation facile, tarifs transparents.`;
        break;
      default:
        desc = `${keyword} avec ECOFUNDRIVE : VTC Tesla premium à ${location}. Service haute qualité, chauffeur bilingue, 26 avis 5★. Réservation 24/7.`;
    }
  } else {
    // Editorial descriptions for place pages
    switch (variant) {
      case 0:
        desc = `Découvrez ${keyword} à ${location} : guide complet avec horaires, tarifs, avis. Comment s'y rendre en VTC Tesla pour un trajet confortable.`;
        break;
      case 1:
        desc = `${keyword} ${location} : tout savoir sur ce lieu unique. Informations pratiques, histoire, conseils. Accès facile en chauffeur privé Tesla.`;
        break;
      case 2:
        desc = `Guide ${keyword} : caractéristiques, ambiance, meilleurs moments. Rejoignez ${location} en VTC électrique pour une expérience premium.`;
        break;
      case 3:
        desc = `${keyword} à ${location} : présentation détaillée, avis visiteurs, accès. Service VTC Tesla disponible pour un trajet sans stress.`;
        break;
      default:
        desc = `Découvrez ${keyword} à ${location} : guide complet avec horaires, tarifs, avis. Comment s'y rendre en VTC Tesla pour un trajet confortable.`;
    }
  }

  // Ensure 150-160 chars, cut at word boundary
  if (desc.length > 160) {
    const lastSpace = desc.substring(0, 157).lastIndexOf(' ');
    desc = desc.substring(0, lastSpace > 140 ? lastSpace : 157).trim() + '...';
  }

  return desc;
}

/**
 * Generate H1 title with contextual enrichment
 * Rule: 50-70 characters, keyword at beginning
 * Adds context based on category and authority status
 */
export function generateH1(keyword: string, category: string, location: string, isAuthority: boolean): string {
  const hash = hashString(keyword);
  const variant = hash % 3; // 3 variations
  const isVTC = category === 'vtc' || category === 'transport';

  let h1: string;

  if (isVTC) {
    // Commercial H1 for VTC pages
    if (isAuthority) {
      switch (variant) {
        case 0:
          h1 = `${keyword} : Votre Chauffeur Privé Tesla à ${location}`;
          break;
        case 1:
          h1 = `Service VTC Tesla Premium pour ${keyword}`;
          break;
        case 2:
          h1 = `${keyword} en Tesla Électrique - Service Haut de Gamme`;
          break;
        default:
          h1 = `${keyword} : Votre Chauffeur Privé Tesla à ${location}`;
      }
    } else {
      h1 = `${keyword} avec ECOFUNDRIVE`;
    }
  } else {
    // Editorial H1 for place pages
    if (isAuthority) {
      switch (variant) {
        case 0:
          h1 = `${keyword} : Le Guide Complet ${location}`;
          break;
        case 1:
          h1 = `Tout Savoir sur ${keyword} à ${location}`;
          break;
        case 2:
          h1 = `${keyword} - Découverte & Accès VTC Tesla`;
          break;
        default:
          h1 = `${keyword} : Le Guide Complet ${location}`;
      }
    } else {
      h1 = `${keyword} à ${location}`;
    }
  }

  // Ensure 50-70 chars
  if (h1.length > 70) {
    const lastSpace = h1.substring(0, 67).lastIndexOf(' ');
    h1 = h1.substring(0, lastSpace > 50 ? lastSpace : 67).trim() + '...';
  }

  return h1;
}

/**
 * Simple hash function for consistent variations
 * Same keyword always gets same variant (stable across builds)
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Validate page against 10 SEO rules
 */
export function validateSEO(page: any, isAuthority: boolean = false): SEOValidation {
  const checks = {
    html5Valid: checkHTML5(page),
    metaTitle: checkMetaTitle(page),
    metaDescription: checkMetaDescription(page),
    h1Unique: checkH1(page),
    wordcount: checkWordcount(page, isAuthority),
    faqComplete: checkFAQ(page),
    internalLinks: checkInternalLinks(page, isAuthority),
    images: checkImages(page),
    schemas: checkSchemas(page),
    performance: checkPerformance(page)
  };

  const issues: string[] = [];
  let score = 0;

  Object.entries(checks).forEach(([key, value]) => {
    if (value) score++;
    else issues.push(`Failed: ${key}`);
  });

  return {
    valid: score >= 8,
    score,
    checks,
    issues
  };
}

// ═══════════════════════════════════════════════════════════
// INDIVIDUAL CHECKS (10 RULES)
// ═══════════════════════════════════════════════════════════

function checkHTML5(page: any): boolean {
  // Check DOCTYPE, lang attribute, semantic structure
  const html = page.raw_html || '';

  const hasDoctype = html.includes('<!DOCTYPE html>');
  const hasLang = html.includes('lang=');
  const hasSemanticTags = html.includes('<article>') || html.includes('<section>') || html.includes('<main>');

  return hasDoctype && hasLang && hasSemanticTags;
}

function checkMetaTitle(page: any): boolean {
  const title = page.meta_title || '';
  return title.length >= 50 && title.length <= 60;
}

function checkMetaDescription(page: any): boolean {
  const desc = page.meta_description || '';
  return desc.length >= 150 && desc.length <= 160;
}

function checkH1(page: any): boolean {
  const h1 = page.title || '';
  return h1.length >= 50 && h1.length <= 70;
}

function checkWordcount(page: any, isAuthority: boolean): boolean {
  const count = page.wordcount || 0;
  if (isAuthority) {
    return count >= 2200 && count <= 2600;
  }
  return count >= 2000 && count <= 2500;
}

function checkFAQ(page: any): boolean {
  const faq = page.faq || [];
  if (faq.length !== 5) return false;

  // Check each answer is 60-100 words
  return faq.every((item: any) => {
    const wordCount = item.answer.split(' ').length;
    return wordCount >= 60 && wordCount <= 100;
  });
}

function checkInternalLinks(page: any, isAuthority: boolean): boolean {
  const links = page.internal_links || [];
  const expectedCount = isAuthority ? 10 : 8;
  const maxCount = isAuthority ? 12 : 8;

  return links.length >= expectedCount && links.length <= maxCount;
}

function checkImages(page: any): boolean {
  // Check hero 3 sizes + 2-3 content images
  const images = page.images || [];

  const hasHero = images.some((img: any) => img.type === 'hero');
  const contentImages = images.filter((img: any) => img.type === 'content');
  const hasContentImages = contentImages.length >= 2 && contentImages.length <= 3;

  // Check all images have alt text (min 5 chars)
  const allHaveAlt = images.every((img: any) => img.alt && img.alt.length >= 5);

  // Check hero has srcset (3 sizes)
  const heroImage = images.find((img: any) => img.type === 'hero');
  const hasSrcset = heroImage?.srcset?.includes('800w') &&
                   heroImage?.srcset?.includes('1200w') &&
                   heroImage?.srcset?.includes('1920w');

  return hasHero && hasContentImages && allHaveAlt && hasSrcset;
}

function checkSchemas(page: any): boolean {
  // Check 6 JSON-LD schemas present
  const schemas = page.schemas || [];

  const requiredSchemas = [
    'Article',
    'Service',
    'FAQPage',
    'BreadcrumbList',
    'AggregateRating',
    'Organization'
  ];

  const hasAllSchemas = requiredSchemas.every(type =>
    schemas.some((s: any) => s['@type'] === type)
  );

  // Check schemas have required fields
  const articleSchema = schemas.find((s: any) => s['@type'] === 'Article');
  const hasArticleFields = articleSchema?.headline &&
                          articleSchema?.author &&
                          articleSchema?.datePublished;

  const serviceSchema = schemas.find((s: any) => s['@type'] === 'Service');
  const hasServiceFields = serviceSchema?.name &&
                          serviceSchema?.provider &&
                          serviceSchema?.areaServed;

  return hasAllSchemas && hasArticleFields && hasServiceFields;
}

function checkPerformance(page: any): boolean {
  // Check CSS/JS external, images optimized
  const html = page.raw_html || '';

  // No inline styles (except critical CSS)
  const inlineStyleCount = (html.match(/<style>/g) || []).length;
  const hasOnlyCriticalCSS = inlineStyleCount <= 1;

  // No inline scripts (except tracking)
  const inlineScriptCount = (html.match(/<script>(?!.*gtag)(?!.*dataLayer)/g) || []).length;
  const hasNoInlineScripts = inlineScriptCount === 0;

  // Images have loading="lazy"
  const hasLazyLoading = html.includes('loading="lazy"');

  // Check for modern image formats (WebP or AVIF)
  const hasModernFormats = html.includes('.webp') || html.includes('.avif');

  return hasOnlyCriticalCSS && hasNoInlineScripts && hasLazyLoading && hasModernFormats;
}
