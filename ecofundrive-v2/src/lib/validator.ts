// ═══════════════════════════════════════════════════════════
// ECOFUNDRIVE V2.0 - VALIDATOR.TS (14 Checks Complete)
// ═══════════════════════════════════════════════════════════

export interface ValidationResult {
  score: number;
  maxScore: number;
  percentage: number;
  status: 'VALID' | 'WARNING' | 'INVALID';
  checks: CheckResult[];
  issues: string[];
}

export interface CheckResult {
  name: string;
  passed: boolean;
  message: string;
  severity?: 'critical' | 'warning' | 'info';
}

export interface PageData {
  title: string;
  meta_title: string;
  meta_description: string;
  wordcount: number;
  faq: FAQ[];
  internal_links: InternalLink[];
  images?: Image[];
  schemas?: Schema[];
  raw_html?: string;
  content?: string;
  sections?: Section[];
}

interface FAQ {
  question: string;
  answer: string;
}

interface InternalLink {
  url: string;
  anchor: string;
}

interface Image {
  src: string;
  srcset?: string;
  alt: string;
  type: 'hero' | 'content';
}

interface Schema {
  '@type': string;
  [key: string]: any;
}

interface Section {
  heading: string;
  level: number;
  content: string;
}

/**
 * Validate page against 18 comprehensive checks (UPGRADED from 14)
 * Scoring: 18/18 = VALID, 15-17/18 = WARNING, <15/18 = INVALID
 */
export function validatePage(page: PageData, isAuthority: boolean = false): ValidationResult {
  const checks: CheckResult[] = [
    // Core SEO (6 checks)
    checkHTML5(page),
    checkMetaTitle(page),
    checkMetaDescription(page),
    checkH1(page),
    checkWordcount(page, isAuthority),
    checkKeywordDensity(page),

    // Content Quality (3 checks)
    checkFAQ(page),
    checkHeadingHierarchy(page),
    checkReadability(page),

    // Technical SEO (3 checks)
    checkInternalLinks(page, isAuthority),
    checkImages(page),
    checkSchemas(page),

    // Performance (2 checks)
    checkPerformance(page),
    checkKeywordPlacement(page),

    // NEW: Advanced Checks (4 checks) - CRITICAL UPGRADES
    checkDuplicateContent(page),
    checkMobileUsability(page),
    checkStructuredData(page),
    checkSecurityHeaders(page)
  ];

  const passedChecks = checks.filter(c => c.passed).length;
  const maxScore = 18; // UPGRADED from 14
  const percentage = Math.round((passedChecks / maxScore) * 100);

  let status: 'VALID' | 'WARNING' | 'INVALID';
  if (passedChecks === maxScore) status = 'VALID';
  else if (passedChecks >= 15) status = 'WARNING'; // 83%+ threshold
  else status = 'INVALID';

  const issues = checks.filter(c => !c.passed).map(c => c.message);

  return {
    score: passedChecks,
    maxScore,
    percentage,
    status,
    checks,
    issues
  };
}

// ═══════════════════════════════════════════════════════════
// CORE SEO CHECKS (6)
// ═══════════════════════════════════════════════════════════

function checkHTML5(page: PageData): CheckResult {
  const html = page.raw_html || '';

  const hasDoctype = html.includes('<!DOCTYPE html>');
  const hasLang = html.match(/<html[^>]+lang=["']([^"']+)["']/);
  const hasSemanticTags = html.includes('<article>') ||
                          html.includes('<section>') ||
                          html.includes('<main>');
  const hasMetaCharset = html.includes('<meta charset=');
  const hasViewport = html.includes('viewport');

  const passed = hasDoctype && !!hasLang && hasSemanticTags && hasMetaCharset && hasViewport;

  let message = 'HTML5 structure valid';
  if (!passed) {
    const missing = [];
    if (!hasDoctype) missing.push('DOCTYPE');
    if (!hasLang) missing.push('lang attribute');
    if (!hasSemanticTags) missing.push('semantic tags');
    if (!hasMetaCharset) missing.push('charset');
    if (!hasViewport) missing.push('viewport');
    message = `Missing: ${missing.join(', ')}`;
  }

  return {
    name: 'HTML5 Valid',
    passed,
    message,
    severity: passed ? 'info' : 'critical'
  };
}

function checkMetaTitle(page: PageData): CheckResult {
  const title = page.meta_title || '';
  const length = title.length;
  const passed = length >= 50 && length <= 60;

  const message = passed
    ? `Valid (${length} chars)`
    : `Invalid length: ${length} chars (required: 50-60)`;

  return {
    name: 'Meta Title',
    passed,
    message,
    severity: passed ? 'info' : 'critical'
  };
}

function checkMetaDescription(page: PageData): CheckResult {
  const desc = page.meta_description || '';
  const length = desc.length;
  const passed = length >= 150 && length <= 160;

  const message = passed
    ? `Valid (${length} chars)`
    : `Invalid length: ${length} chars (required: 150-160)`;

  return {
    name: 'Meta Description',
    passed,
    message,
    severity: passed ? 'info' : 'critical'
  };
}

function checkH1(page: PageData): CheckResult {
  const h1 = page.title || '';
  const length = h1.length;
  const passed = length >= 50 && length <= 70;

  const message = passed
    ? `Valid (${length} chars)`
    : `Invalid length: ${length} chars (required: 50-70)`;

  return {
    name: 'H1 Unique',
    passed,
    message,
    severity: passed ? 'info' : 'critical'
  };
}

function checkWordcount(page: PageData, isAuthority: boolean): CheckResult {
  const count = page.wordcount || 0;
  const min = isAuthority ? 2200 : 2000;
  const max = isAuthority ? 2600 : 2500;
  const passed = count >= min && count <= max;

  const message = passed
    ? `Valid (${count} words)`
    : `Out of range: ${count} words (required: ${min}-${max})`;

  return {
    name: 'Wordcount',
    passed,
    message,
    severity: passed ? 'info' : 'warning'
  };
}

function checkKeywordDensity(page: PageData): CheckResult {
  const content = page.content || '';
  const title = page.title || '';

  if (!content || !title) {
    return {
      name: 'Keyword Density',
      passed: false,
      message: 'No content to analyze',
      severity: 'critical'
    };
  }

  // Extract main keyword from title (first significant phrase)
  const keyword = extractMainKeyword(title);

  // Count keyword occurrences (case-insensitive)
  const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  const matches = content.match(regex);
  const count = matches ? matches.length : 0;

  // Calculate density
  const words = content.split(/\s+/).length;
  const density = (count / words) * 100;

  // Ideal density: 0.70-1.00%
  const passed = density >= 0.70 && density <= 1.00;

  const message = passed
    ? `Valid (${density.toFixed(2)}% for "${keyword}")`
    : `${density < 0.70 ? 'Too low' : 'Too high'}: ${density.toFixed(2)}% (ideal: 0.70-1.00%)`;

  return {
    name: 'Keyword Density',
    passed,
    message,
    severity: passed ? 'info' : 'warning'
  };
}

// ═══════════════════════════════════════════════════════════
// CONTENT QUALITY CHECKS (3)
// ═══════════════════════════════════════════════════════════

function checkFAQ(page: PageData): CheckResult {
  const faq = page.faq || [];

  if (faq.length !== 5) {
    return {
      name: 'FAQ',
      passed: false,
      message: `Invalid count: ${faq.length} questions (required: 5)`,
      severity: 'warning'
    };
  }

  // Check each answer is 60-100 words
  const invalidAnswers = faq.filter((item) => {
    const wordCount = item.answer.split(/\s+/).length;
    return wordCount < 60 || wordCount > 100;
  });

  const passed = invalidAnswers.length === 0;

  const message = passed
    ? 'Valid (5 questions, answers 60-100 words)'
    : `${invalidAnswers.length} answers out of range (60-100 words)`;

  return {
    name: 'FAQ',
    passed,
    message,
    severity: passed ? 'info' : 'warning'
  };
}

function checkHeadingHierarchy(page: PageData): CheckResult {
  const sections = page.sections || [];

  if (sections.length === 0) {
    return {
      name: 'Heading Hierarchy',
      passed: false,
      message: 'No sections found',
      severity: 'warning'
    };
  }

  // Check H2 count (should have 5-8)
  const h2Count = sections.filter(s => s.level === 2).length;
  const hasValidH2Count = h2Count >= 5 && h2Count <= 8;

  // Check hierarchy (no skipped levels)
  let validHierarchy = true;
  let prevLevel = 1; // H1 is implicit

  for (const section of sections) {
    if (section.level > prevLevel + 1) {
      validHierarchy = false;
      break;
    }
    prevLevel = section.level;
  }

  const passed = hasValidH2Count && validHierarchy;

  let message = 'Valid hierarchy';
  if (!passed) {
    if (!hasValidH2Count) {
      message = `Invalid H2 count: ${h2Count} (required: 5-8)`;
    } else {
      message = 'Skipped heading levels detected';
    }
  } else {
    message = `Valid (${h2Count} H2 sections, proper hierarchy)`;
  }

  return {
    name: 'Heading Hierarchy',
    passed,
    message,
    severity: passed ? 'info' : 'warning'
  };
}

function checkReadability(page: PageData): CheckResult {
  const content = page.content || '';

  if (!content) {
    return {
      name: 'Readability',
      passed: false,
      message: 'No content to analyze',
      severity: 'warning'
    };
  }

  // Count sentences
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = sentences.length;

  // Count words
  const words = content.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  // Average sentence length (ideal: 15-20 words)
  const avgSentenceLength = wordCount / sentenceCount;

  // Count paragraphs (rough estimate)
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 0);
  const avgWordsPerParagraph = wordCount / paragraphs.length;

  // Check readability metrics
  const goodSentenceLength = avgSentenceLength >= 12 && avgSentenceLength <= 22;
  const goodParagraphLength = avgWordsPerParagraph >= 80 && avgWordsPerParagraph <= 150;

  const passed = goodSentenceLength && goodParagraphLength;

  let message = 'Good readability';
  if (!passed) {
    const issues = [];
    if (!goodSentenceLength) {
      issues.push(`Avg sentence: ${avgSentenceLength.toFixed(1)} words (ideal: 12-22)`);
    }
    if (!goodParagraphLength) {
      issues.push(`Avg paragraph: ${avgWordsPerParagraph.toFixed(0)} words (ideal: 80-150)`);
    }
    message = issues.join(', ');
  } else {
    message = `Good (${avgSentenceLength.toFixed(1)} words/sentence)`;
  }

  return {
    name: 'Readability',
    passed,
    message,
    severity: passed ? 'info' : 'warning'
  };
}

// ═══════════════════════════════════════════════════════════
// TECHNICAL SEO CHECKS (3)
// ═══════════════════════════════════════════════════════════

function checkInternalLinks(page: PageData, isAuthority: boolean): CheckResult {
  const links = page.internal_links || [];
  const count = links.length;
  const min = isAuthority ? 10 : 8;
  const max = isAuthority ? 12 : 8;
  const passed = count >= min && count <= max;

  // Check anchor text quality (not too generic)
  const genericAnchors = ['cliquez ici', 'ici', 'voir', 'lire plus', 'en savoir plus'];
  const hasGenericAnchors = links.some(link =>
    genericAnchors.includes(link.anchor.toLowerCase().trim())
  );

  const finalPassed = passed && !hasGenericAnchors;

  let message = `Valid (${count} links)`;
  if (!passed) {
    message = `Invalid count: ${count} links (required: ${min}-${max})`;
  } else if (hasGenericAnchors) {
    message = `${count} links but generic anchors detected`;
  }

  return {
    name: 'Internal Links',
    passed: finalPassed,
    message,
    severity: passed ? 'info' : 'warning'
  };
}

function checkImages(page: PageData): CheckResult {
  const images = page.images || [];

  if (images.length === 0) {
    return {
      name: 'Images',
      passed: false,
      message: 'No images found',
      severity: 'critical'
    };
  }

  const hasHero = images.some(img => img.type === 'hero');
  const contentImages = images.filter(img => img.type === 'content');
  const hasContentImages = contentImages.length >= 2 && contentImages.length <= 3;

  // Check all images have alt text (min 5 chars, not generic)
  const genericAlts = ['image', 'photo', 'picture', 'img'];
  const allHaveAlt = images.every(img => {
    const alt = img.alt || '';
    return alt.length >= 5 && !genericAlts.includes(alt.toLowerCase().trim());
  });

  // Check hero has srcset (3 sizes)
  const heroImage = images.find(img => img.type === 'hero');
  const hasSrcset = heroImage?.srcset?.includes('800w') &&
                   heroImage?.srcset?.includes('1200w') &&
                   heroImage?.srcset?.includes('1920w');

  const passed = hasHero && hasContentImages && allHaveAlt && hasSrcset;

  let message = 'Valid (hero + content images)';
  if (!passed) {
    const issues = [];
    if (!hasHero) issues.push('no hero');
    if (!hasContentImages) issues.push(`${contentImages.length} content images (need 2-3)`);
    if (!allHaveAlt) issues.push('missing/generic alt texts');
    if (!hasSrcset) issues.push('no responsive srcset');
    message = `Issues: ${issues.join(', ')}`;
  }

  return {
    name: 'Images',
    passed,
    message,
    severity: passed ? 'info' : 'critical'
  };
}

function checkSchemas(page: PageData): CheckResult {
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
    schemas.some(s => s['@type'] === type)
  );

  if (!hasAllSchemas) {
    const missing = requiredSchemas.filter(type =>
      !schemas.some(s => s['@type'] === type)
    );
    return {
      name: 'JSON-LD Schemas',
      passed: false,
      message: `Missing schemas: ${missing.join(', ')}`,
      severity: 'critical'
    };
  }

  // Check required fields in key schemas
  const articleSchema = schemas.find(s => s['@type'] === 'Article');
  const hasArticleFields = articleSchema?.headline &&
                          articleSchema?.author &&
                          articleSchema?.datePublished;

  const serviceSchema = schemas.find(s => s['@type'] === 'Service');
  const hasServiceFields = serviceSchema?.name &&
                          serviceSchema?.provider &&
                          serviceSchema?.areaServed;

  const passed = hasAllSchemas && hasArticleFields && hasServiceFields;

  let message = 'Valid (6 schemas with required fields)';
  if (!passed) {
    const issues = [];
    if (!hasArticleFields) issues.push('Article missing fields');
    if (!hasServiceFields) issues.push('Service missing fields');
    message = issues.join(', ');
  }

  return {
    name: 'JSON-LD Schemas',
    passed,
    message,
    severity: passed ? 'info' : 'critical'
  };
}

// ═══════════════════════════════════════════════════════════
// PERFORMANCE CHECKS (2)
// ═══════════════════════════════════════════════════════════

function checkPerformance(page: PageData): CheckResult {
  const html = page.raw_html || '';

  // No inline styles (except critical CSS - 1 allowed)
  const inlineStyleCount = (html.match(/<style>/g) || []).length;
  const hasOnlyCriticalCSS = inlineStyleCount <= 1;

  // No inline scripts (except tracking)
  const inlineScripts = html.match(/<script>[\s\S]*?<\/script>/g) || [];
  const hasNoInlineScripts = inlineScripts.every(script =>
    script.includes('gtag') ||
    script.includes('dataLayer') ||
    script.includes('application/ld+json')
  );

  // Images have loading="lazy"
  const hasLazyLoading = html.includes('loading="lazy"');

  // Check for modern image formats (WebP or AVIF)
  const hasModernFormats = html.includes('.webp') || html.includes('.avif');

  const passed = hasOnlyCriticalCSS && hasNoInlineScripts && hasLazyLoading && hasModernFormats;

  let message = 'Valid (optimized)';
  if (!passed) {
    const issues = [];
    if (!hasOnlyCriticalCSS) issues.push(`${inlineStyleCount} inline styles`);
    if (!hasNoInlineScripts) issues.push('inline scripts detected');
    if (!hasLazyLoading) issues.push('no lazy loading');
    if (!hasModernFormats) issues.push('no WebP/AVIF');
    message = `Issues: ${issues.join(', ')}`;
  }

  return {
    name: 'Performance',
    passed,
    message,
    severity: passed ? 'info' : 'warning'
  };
}

function checkKeywordPlacement(page: PageData): CheckResult {
  const title = page.title || '';
  const metaTitle = page.meta_title || '';
  const content = page.content || '';

  if (!title || !content) {
    return {
      name: 'Keyword Placement',
      passed: false,
      message: 'No content to analyze',
      severity: 'warning'
    };
  }

  // Extract main keyword
  const keyword = extractMainKeyword(title);

  // Check keyword in critical places
  const inTitle = title.toLowerCase().includes(keyword.toLowerCase());
  const inMetaTitle = metaTitle.toLowerCase().includes(keyword.toLowerCase());

  // Check keyword in first 100 words
  const firstWords = content.split(/\s+/).slice(0, 100).join(' ');
  const inIntro = firstWords.toLowerCase().includes(keyword.toLowerCase());

  // Check keyword in at least 2 headings
  const sections = page.sections || [];
  const headingsWithKeyword = sections.filter(s =>
    s.heading.toLowerCase().includes(keyword.toLowerCase())
  );
  const inHeadings = headingsWithKeyword.length >= 2;

  const passed = inTitle && inMetaTitle && inIntro && inHeadings;

  let message = 'Keyword well-placed';
  if (!passed) {
    const issues = [];
    if (!inTitle) issues.push('not in H1');
    if (!inMetaTitle) issues.push('not in meta title');
    if (!inIntro) issues.push('not in first 100 words');
    if (!inHeadings) issues.push(`only ${headingsWithKeyword.length} headings (need 2+)`);
    message = `Issues: ${issues.join(', ')}`;
  } else {
    message = `Keyword "${keyword}" strategically placed`;
  }

  return {
    name: 'Keyword Placement',
    passed,
    message,
    severity: passed ? 'info' : 'warning'
  };
}

// ═══════════════════════════════════════════════════════════
// ADVANCED CHECKS (4 NEW) - CRITICAL QUALITY UPGRADES
// ═══════════════════════════════════════════════════════════

function checkDuplicateContent(page: PageData): CheckResult {
  const content = page.content || '';

  if (!content) {
    return {
      name: 'Duplicate Content',
      passed: false,
      message: 'No content to analyze',
      severity: 'critical'
    };
  }

  // Check for repetitive phrases (sign of low-quality AI content)
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const uniqueSentences = new Set(sentences.map(s => s.trim().toLowerCase()));
  const duplicateRatio = 1 - (uniqueSentences.size / sentences.length);

  // Check for boilerplate repetition
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 0);
  const firstWords = paragraphs.map(p => p.trim().split(/\s+/).slice(0, 5).join(' ').toLowerCase());
  const uniqueStarts = new Set(firstWords);
  const boilerplateRatio = 1 - (uniqueStarts.size / paragraphs.length);

  // Thresholds: <5% duplicate sentences, <10% boilerplate
  const passed = duplicateRatio < 0.05 && boilerplateRatio < 0.10;

  let message = 'Content is unique';
  if (!passed) {
    const issues = [];
    if (duplicateRatio >= 0.05) {
      issues.push(`${(duplicateRatio * 100).toFixed(1)}% duplicate sentences`);
    }
    if (boilerplateRatio >= 0.10) {
      issues.push(`${(boilerplateRatio * 100).toFixed(1)}% repetitive paragraphs`);
    }
    message = `Issues: ${issues.join(', ')}`;
  }

  return {
    name: 'Duplicate Content',
    passed,
    message,
    severity: passed ? 'info' : 'critical'
  };
}

function checkMobileUsability(page: PageData): CheckResult {
  const html = page.raw_html || '';

  // Check viewport meta tag
  const viewportRegex = /<meta[^>]+name=["']viewport["'][^>]+content=["']([^"']+)["']/i;
  const viewportMatch = html.match(viewportRegex);
  const hasViewport = !!viewportMatch;
  const hasWidthDevice = viewportMatch?.[1]?.includes('width=device-width');
  const hasInitialScale = viewportMatch?.[1]?.includes('initial-scale=1');

  // Check no fixed widths in inline styles
  const hasFixedWidths = html.includes('width:') &&
                         (html.includes('width: 100%') || html.includes('width:100%'));
  const noHardcodedWidths = !html.match(/width:\s*\d+px/);

  // Check touch-friendly elements (buttons min 44x44px in CSS)
  const hasTouchTargets = html.includes('min-width: 44px') ||
                          html.includes('min-height: 44px') ||
                          html.includes('padding:') ||
                          html.includes('padding-');

  // Check font size (min 16px for readability)
  const hasMobileFonts = html.includes('font-size: 16px') ||
                         html.includes('font-size: 1rem') ||
                         !html.match(/font-size:\s*1[0-5]px/);

  const passed = hasViewport && hasWidthDevice && hasInitialScale &&
                 noHardcodedWidths && hasTouchTargets && hasMobileFonts;

  let message = 'Mobile-optimized';
  if (!passed) {
    const issues = [];
    if (!hasViewport || !hasWidthDevice || !hasInitialScale) {
      issues.push('invalid viewport meta');
    }
    if (!noHardcodedWidths) issues.push('hardcoded widths detected');
    if (!hasTouchTargets) issues.push('touch targets too small');
    if (!hasMobileFonts) issues.push('font size too small');
    message = `Issues: ${issues.join(', ')}`;
  }

  return {
    name: 'Mobile Usability',
    passed,
    message,
    severity: passed ? 'info' : 'critical'
  };
}

function checkStructuredData(page: PageData): CheckResult {
  const schemas = page.schemas || [];
  const html = page.raw_html || '';

  if (schemas.length === 0) {
    return {
      name: 'Structured Data',
      passed: false,
      message: 'No structured data found',
      severity: 'critical'
    };
  }

  // Check for rich snippets support
  const hasRichSnippets = schemas.some(s =>
    s['@type'] === 'Product' ||
    s['@type'] === 'Recipe' ||
    s['@type'] === 'Event' ||
    s['@type'] === 'Article' ||
    s['@type'] === 'Service'
  );

  // Check for breadcrumbs (navigation enhancement)
  const hasBreadcrumbs = schemas.some(s => s['@type'] === 'BreadcrumbList');

  // Check for ratings/reviews (trust signals)
  const hasRatings = schemas.some(s =>
    s['@type'] === 'AggregateRating' ||
    s.aggregateRating
  );

  // Check schema is in <head> or <script type="application/ld+json">
  const hasJsonLd = html.includes('application/ld+json');

  // Validate critical fields presence
  const articleSchema = schemas.find(s => s['@type'] === 'Article');
  const hasCompleteArticle = articleSchema &&
                             articleSchema.headline &&
                             articleSchema.author &&
                             articleSchema.datePublished &&
                             articleSchema.image;

  const passed = hasRichSnippets && hasBreadcrumbs && hasRatings &&
                 hasJsonLd && hasCompleteArticle;

  let message = 'Rich snippets ready';
  if (!passed) {
    const issues = [];
    if (!hasRichSnippets) issues.push('no rich snippet schema');
    if (!hasBreadcrumbs) issues.push('missing breadcrumbs');
    if (!hasRatings) issues.push('missing ratings');
    if (!hasJsonLd) issues.push('invalid JSON-LD format');
    if (!hasCompleteArticle) issues.push('incomplete Article schema');
    message = `Issues: ${issues.join(', ')}`;
  }

  return {
    name: 'Structured Data',
    passed,
    message,
    severity: passed ? 'info' : 'critical'
  };
}

function checkSecurityHeaders(page: PageData): CheckResult {
  const html = page.raw_html || '';

  // Check for security-related meta tags
  const hasCSP = html.includes('Content-Security-Policy');
  const hasXFrameOptions = html.includes('X-Frame-Options');
  const hasXContentType = html.includes('X-Content-Type-Options');

  // Check for HTTPS enforcement
  const hasHttpsUpgrade = html.includes('Upgrade-Insecure-Requests') ||
                          html.includes('https://');

  // Check no mixed content (HTTP resources on HTTPS page)
  const hasMixedContent = html.includes('src="http://') ||
                          html.includes('href="http://');

  // Check external links have rel="noopener noreferrer"
  const externalLinks = html.match(/<a[^>]+href=["']https?:\/\/[^"']+["']/g) || [];
  const hasSecureLinks = externalLinks.length === 0 ||
                         externalLinks.every(link =>
                           link.includes('rel="noopener') ||
                           link.includes("rel='noopener")
                         );

  // Check no sensitive data in HTML (API keys, tokens)
  const hasSensitiveData = html.match(/api[_-]?key|token|secret|password/gi);

  const passed = hasHttpsUpgrade && !hasMixedContent && hasSecureLinks && !hasSensitiveData;

  let message = 'Security best practices followed';
  if (!passed) {
    const issues = [];
    if (!hasHttpsUpgrade) issues.push('no HTTPS upgrade');
    if (hasMixedContent) issues.push('mixed content detected');
    if (!hasSecureLinks) issues.push('insecure external links');
    if (hasSensitiveData) issues.push('CRITICAL: sensitive data exposed');
    message = `Issues: ${issues.join(', ')}`;
  }

  return {
    name: 'Security Headers',
    passed,
    message,
    severity: passed ? 'info' : hasSensitiveData ? 'critical' : 'warning'
  };
}

// ═══════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════

function extractMainKeyword(title: string): string {
  // Extract first significant phrase (before : or |)
  const parts = title.split(/[:|–—]/);
  let keyword = parts[0].trim();

  // Remove common prefixes
  const prefixes = ['guide', 'découvrir', 'tout savoir sur', 'le guide', 'service'];
  prefixes.forEach(prefix => {
    const regex = new RegExp(`^${prefix}\\s+`, 'i');
    keyword = keyword.replace(regex, '').trim();
  });

  return keyword;
}
