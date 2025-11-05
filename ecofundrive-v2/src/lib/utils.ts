// ═══════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════

/**
 * Simple hash function for consistent variations
 * Same input always produces same hash (stable across builds)
 * 
 * @param str - String to hash
 * @returns Positive integer hash value
 */
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}
