// ═══════════════════════════════════════════════════════════
// ECOFUNDRIVE V2.0 - LINKS.TS (Internal Linking System)
// ═══════════════════════════════════════════════════════════

export interface InternalLink {
  anchor: string;
  url: string;
  context: string;
}

export interface Page {
  id: number;
  keyword: string;
  slug: string;
  category: string;
  language: string;
  authority: boolean;
}

/**
 * Category relationships for internal linking
 */
const CATEGORY_LINKS = {
  vtc: ['beaches', 'restaurants', 'hotels', 'golf'],
  beaches: ['vtc', 'restaurants', 'hotels'],
  restaurants: ['vtc', 'hotels', 'beaches'],
  hotels: ['vtc', 'restaurants', 'beaches'],
  golf: ['vtc', 'hotels'],
  routes: ['vtc', 'beaches', 'restaurants']
};

/**
 * Get related pages for internal linking
 * @param currentPage - The current page
 * @param allPages - All available pages
 * @param count - Number of links needed (8 for standard, 10-12 for authority)
 */
export function getRelatedPages(
  currentPage: Page,
  allPages: Page[],
  count: number
): Page[] {
  const relatedCategories = CATEGORY_LINKS[currentPage.category as keyof typeof CATEGORY_LINKS] || [];
  
  // Filter pages by language and related categories
  let candidates = allPages.filter(page => 
    page.id !== currentPage.id &&
    page.language === currentPage.language &&
    relatedCategories.includes(page.category)
  );

  // Priority to authority pages (30% ratio)
  const authorityPages = candidates.filter(p => p.authority);
  const standardPages = candidates.filter(p => !p.authority);

  const authorityCount = Math.ceil(count * 0.3);
  const standardCount = count - authorityCount;

  const selected = [
    ...authorityPages.slice(0, authorityCount),
    ...standardPages.slice(0, standardCount)
  ];

  return selected.slice(0, count);
}

/**
 * Generate internal links with natural anchors
 * @param relatedPages - Pages to link to
 * @param currentCategory - Current page category
 */
export function generateInternalLinks(
  relatedPages: Page[],
  currentCategory: string
): InternalLink[] {
  return relatedPages.map(page => {
    const anchor = generateAnchor(page.keyword, currentCategory);
    const context = generateContext(anchor, page.category);
    
    return {
      anchor,
      url: \`/\${page.language}/\${page.slug}.html\`,
      context
    };
  });
}

/**
 * Generate natural anchor text (3-5 words)
 */
function generateAnchor(keyword: string, category: string): string {
  // Extract main keywords (3-5 words)
  const words = keyword.split(' ').slice(0, 4);
  return words.join(' ');
}

/**
 * Generate context sentence for the link
 */
function generateContext(anchor: string, targetCategory: string): string {
  const templates = {
    beaches: \`Découvrez également notre service de \${anchor} pour un confort optimal.\`,
    restaurants: \`Pour vos dîners gastronomiques, consultez \${anchor}.\`,
    hotels: \`Profitez de nos transferts vers \${anchor} en toute sérénité.\`,
    vtc: \`Réservez votre \${anchor} dès maintenant.\`,
    golf: \`Accédez aux meilleurs parcours avec \${anchor}.\`,
    routes: \`Explorez la région avec \${anchor}.\`
  };

  return templates[targetCategory as keyof typeof templates] || \`En savoir plus sur \${anchor}.\`;
}

/**
 * Calculate link density
 * @param wordcount - Total words in content
 * @param linkCount - Number of internal links
 */
export function calculateLinkDensity(wordcount: number, linkCount: number): number {
  return (linkCount / wordcount) * 100;
}

/**
 * Validate link density against SEO rules
 * Standard: 0.70-1.00%
 * Authority: 0.70-1.20%
 */
export function validateLinkDensity(
  wordcount: number,
  linkCount: number,
  isAuthority: boolean
): { valid: boolean; density: number } {
  const density = calculateLinkDensity(wordcount, linkCount);
  
  if (isAuthority) {
    return {
      valid: density >= 0.70 && density <= 1.20,
      density
    };
  }
  
  return {
    valid: density >= 0.70 && density <= 1.00,
    density
  };
}
