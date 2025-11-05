// ═══════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════

import keywordsTest from '../content/keywords/keywords-test.json';
import keywordsSeed from '../content/keywords/keywords-15-test.json';
import keywordsFull from '../content/keywords/keywords-70.json';

export interface Keyword {
  id: number;
  keyword: string;
  url: string;
  language: 'fr' | 'en';
  category: string;
  location: string;
  authority: boolean;
  mode: 'A' | 'B';
  wordcount: number;
  meta_title?: string;
  meta_description?: string;
}

export const CATEGORY_MAP = {
  fr: {
    vtc: 'vtc',
    restaurant: 'restaurants',
    hotel: 'hotels',
    beach: 'plages',
    golf: 'golf',
    yacht: 'yachts',
  },
  en: {
    vtc: 'vtc',
    restaurant: 'restaurants',
    hotel: 'hotels',
    beach: 'beaches',
    golf: 'golf',
    yacht: 'yachts',
  }
};

export function getActiveKeywords(): Keyword[] {
  const CONTENT_MODE = import.meta.env.CONTENT_MODE || 'test';
  
  const keywordsData = CONTENT_MODE === 'seed' 
    ? keywordsSeed 
    : CONTENT_MODE === 'full' 
      ? keywordsFull 
      : keywordsTest;
  
  return keywordsData.keywords as Keyword[];
}

export function listCategories(lang: 'fr' | 'en'): string[] {
  const keywords = getActiveKeywords();
  const categories = new Set<string>();
  
  keywords
    .filter(k => k.language === lang)
    .forEach(k => categories.add(k.category));
  
  return Array.from(categories).sort();
}

export function getCategorySlug(category: string, lang: 'fr' | 'en'): string {
  const map = CATEGORY_MAP[lang] as Record<string, string>;
  return map[category] || category;
}

export function filterByCategory(lang: 'fr' | 'en', category: string): Keyword[] {
  const keywords = getActiveKeywords();
  return keywords.filter(k => k.language === lang && k.category === category);
}

export function filterByLocation(location: string, lang?: 'fr' | 'en'): Keyword[] {
  const keywords = getActiveKeywords();
  return keywords.filter(k => {
    const matchesLocation = k.location.toLowerCase().includes(location.toLowerCase());
    const matchesLang = !lang || k.language === lang;
    return matchesLocation && matchesLang;
  });
}

export function findRelated(
  keyword: Keyword,
  options: {
    sameCategory?: boolean;
    sameLocation?: boolean;
    modeBias?: 'A' | 'B' | 'opposite';
    limit?: number;
  } = {}
): Keyword[] {
  const {
    sameCategory = true,
    sameLocation = false,
    modeBias = undefined,
    limit = 6
  } = options;
  
  const keywords = getActiveKeywords();
  const related: Array<{ keyword: Keyword; score: number }> = [];
  
  for (const k of keywords) {
    if (k.id === keyword.id) continue;
    
    if (k.language !== keyword.language) continue;
    
    let score = 0;
    
    if (sameCategory && k.category === keyword.category) {
      score += 10;
    }
    
    if (sameLocation) {
      if (k.location === keyword.location) {
        score += 8;
      } else if (
        k.location.toLowerCase().includes(keyword.location.toLowerCase()) ||
        keyword.location.toLowerCase().includes(k.location.toLowerCase())
      ) {
        score += 4;
      }
    }
    
    if (modeBias === 'opposite') {
      if (k.mode !== keyword.mode) {
        score += 6;
      }
    } else if (modeBias) {
      if (k.mode === modeBias) {
        score += 6;
      }
    }
    
    if (k.authority) {
      score += 2;
    }
    
    if (score > 0) {
      related.push({ keyword: k, score });
    }
  }
  
  return related
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(r => r.keyword);
}

export function buildCanonical(lang: 'fr' | 'en', slug: string): string {
  return `https://ecofundrive.com/${lang}/${slug}`;
}

export function exists(slug: string, lang: 'fr' | 'en'): boolean {
  const keywords = getActiveKeywords();
  return keywords.some(k => k.keyword === slug && k.language === lang);
}

export function validateInternalLinks(links: Array<{ url: string; anchor: string; context: string }>): Array<{ url: string; anchor: string; context: string }> {
  return links.filter(link => {
    const match = link.url.match(/^\/(fr|en)\/([^\/]+)/);
    if (!match) return false;
    
    const [, lang, slug] = match;
    return exists(slug, lang as 'fr' | 'en');
  });
}

export function getKeyword(slug: string, lang: 'fr' | 'en'): Keyword | undefined {
  const keywords = getActiveKeywords();
  return keywords.find(k => k.keyword === slug && k.language === lang);
}

export function getKeywordsByLanguage(lang: 'fr' | 'en'): Keyword[] {
  const keywords = getActiveKeywords();
  return keywords.filter(k => k.language === lang);
}

export function getKeywordStats() {
  const keywords = getActiveKeywords();
  const stats = {
    total: keywords.length,
    byLanguage: {
      fr: keywords.filter(k => k.language === 'fr').length,
      en: keywords.filter(k => k.language === 'en').length,
    },
    byMode: {
      A: keywords.filter(k => k.mode === 'A').length,
      B: keywords.filter(k => k.mode === 'B').length,
    },
    byCategory: {} as Record<string, number>,
    byLocation: {} as Record<string, number>,
  };
  
  keywords.forEach(k => {
    stats.byCategory[k.category] = (stats.byCategory[k.category] || 0) + 1;
    stats.byLocation[k.location] = (stats.byLocation[k.location] || 0) + 1;
  });
  
  return stats;
}
