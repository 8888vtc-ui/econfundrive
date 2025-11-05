// ═══════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════

const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'a', 'span', 'div', 'blockquote', 'code', 'pre'
];

const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  'a': ['href', 'title', 'target', 'rel'],
  'span': ['class'],
  'div': ['class'],
  'code': ['class']
};

const DANGEROUS_PROTOCOLS = ['javascript:', 'data:', 'vbscript:', 'file:'];

/**
 * Basic HTML sanitization for AI-generated content
 * Removes dangerous tags, attributes, and protocols
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';

  let sanitized = html;

  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  sanitized = sanitized.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');
  
  DANGEROUS_PROTOCOLS.forEach(protocol => {
    const regex = new RegExp(`(href|src)\\s*=\\s*["']?${protocol}`, 'gi');
    sanitized = sanitized.replace(regex, '$1="#"');
  });
  
  sanitized = sanitized.replace(/<(iframe|object|embed|applet|meta|link|base)[^>]*>/gi, '');
  
  sanitized = sanitized.replace(/<img[^>]*onerror[^>]*>/gi, '');
  sanitized = sanitized.replace(/javascript:/gi, '');
  
  return sanitized;
}

/**
 * Sanitize text content (strip all HTML)
 */
export function sanitizeText(text: string): string {
  if (!text) return '';
  return text.replace(/<[^>]*>/g, '').trim();
}

/**
 * Sanitize URL for safe use in href attributes
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '#';
  
  const trimmed = url.trim().toLowerCase();
  
  for (const protocol of DANGEROUS_PROTOCOLS) {
    if (trimmed.startsWith(protocol)) {
      return '#';
    }
  }
  
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('#')
  ) {
    return url.trim();
  }
  
  return '#';
}
