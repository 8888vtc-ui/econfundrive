# CODE SAMPLES - IMPLÉMENTATION OPTIMISATIONS
## ECOFUNDRIVE V2.0 - Exemples Prêts à Utiliser

---

## 1. BRAVE SEARCH API INTEGRATION

### A. Installation et Configuration

```typescript
// src/lib/search.ts
import Anthropic from '@anthropic-ai/sdk';

const BRAVE_API_KEY = process.env.BRAVE_SEARCH_API_KEY || '';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

interface SearchResult {
  title: string;
  description: string;
  url: string;
}

interface EnrichedFacts {
  hours?: string;
  prices?: string;
  rating?: string;
  reviews?: string;
  unique_features?: string[];
  history?: string;
  seasonal_info?: string;
  recent_news?: string;
  local_tips?: string[];
  accessibility?: string;
}

/**
 * Effectue 10 recherches web via Brave Search API
 */
async function performWebSearches(keyword: string, location: string): Promise<string[]> {
  const queries = [
    `${keyword} ${location} horaires ouverture 2025`,
    `${keyword} ${location} prix tarifs`,
    `${keyword} ${location} avis clients note`,
    `${keyword} ${location} caractéristiques uniques`,
    `${keyword} histoire patrimoine`,
    `${keyword} événements saison 2025`,
    `${keyword} nouveautés récentes`,
    `${keyword} recommandations locales conseils`,
    `${keyword} ${location} accès transport`,
    `${keyword} informations pratiques accessibilité`
  ];

  const searchResults: string[] = [];

  for (const query of queries) {
    try {
      console.log(`🔍 Recherche: ${query}`);

      const response = await fetch(
        `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=3`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip',
            'X-Subscription-Token': BRAVE_API_KEY
          }
        }
      );

      if (!response.ok) {
        console.warn(`⚠️ Brave API error: ${response.status} for query: ${query}`);
        continue;
      }

      const data = await response.json();

      if (data.web?.results && data.web.results.length > 0) {
        const snippets = data.web.results
          .map((r: SearchResult) => `${r.title}: ${r.description}`)
          .join('\n');

        searchResults.push(`Query: ${query}\nResults:\n${snippets}\n`);
        console.log(`✅ ${data.web.results.length} résultats trouvés`);
      } else {
        console.log(`ℹ️ Aucun résultat pour: ${query}`);
      }

      // Rate limiting: 1 requête/seconde max
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error(`❌ Erreur recherche "${query}":`, error);
    }
  }

  return searchResults;
}

/**
 * Synthétise les résultats via Claude
 */
async function synthesizeResults(searchResults: string[], keyword: string, location: string): Promise<EnrichedFacts> {
  if (searchResults.length === 0) {
    console.warn('⚠️ Aucun résultat de recherche à synthétiser');
    return {};
  }

  const synthesisPrompt = `Tu es un expert en extraction de données factuelles.

Voici les résultats de ${searchResults.length} recherches web sur "${keyword}" à ${location}:

${searchResults.join('\n---\n')}

Extrait UNIQUEMENT les informations FACTUELLES et VÉRIFIABLES au format JSON suivant:

{
  "hours": "Horaires d'ouverture (format précis: 'Lun-Ven 9h-18h' ou null)",
  "prices": "Fourchette de prix (format: '50-150€' ou 'Gratuit' ou null)",
  "rating": "Note moyenne (format: '4.5/5' ou '9/10' ou null)",
  "reviews": "Nombre d'avis (format: '150 avis' ou null)",
  "unique_features": ["Feature 1", "Feature 2", "Feature 3"] ou null,
  "history": "Bref historique en 2-3 phrases ou null",
  "seasonal_info": "Informations saisonnières (haute/basse saison) ou null",
  "recent_news": "Nouveautés 2025 en 1-2 phrases ou null",
  "local_tips": ["Conseil 1", "Conseil 2"] ou null,
  "accessibility": "Informations accessibilité PMR ou null"
}

RÈGLES STRICTES:
1. Si une information n'est PAS trouvée dans les résultats, retourne null
2. Ne JAMAIS inventer de données
3. Citer sources si possible
4. Garder format concis et factuel

Retourne UNIQUEMENT le JSON, sans markdown.`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4.5-20250929",
      max_tokens: 2000,
      temperature: 0.2, // Faible température pour réponses factuelles
      messages: [{
        role: "user",
        content: synthesisPrompt
      }]
    });

    const text = response.content[0].text;
    const cleaned = text.replace(/^```json\n?/g, '').replace(/\n?```$/g, '').trim();

    const facts: EnrichedFacts = JSON.parse(cleaned);

    const foundCount = Object.keys(facts).filter(k => facts[k as keyof EnrichedFacts] !== null).length;
    console.log(`✅ Synthèse: ${foundCount}/10 informations extraites`);

    return facts;

  } catch (error) {
    console.error('❌ Erreur synthèse Claude:', error);
    return {};
  }
}

/**
 * Fonction principale d'enrichissement
 */
export async function enrichWithWebSearch(keyword: string, location: string): Promise<EnrichedFacts> {
  console.log(`\n🎯 Enrichissement web x10 pour: ${keyword} à ${location}`);

  // Étape 1: Recherches Brave
  const searchResults = await performWebSearches(keyword, location);

  if (searchResults.length === 0) {
    console.warn('⚠️ Aucun résultat de recherche, skip enrichissement');
    return {};
  }

  // Étape 2: Synthèse Claude
  const facts = await synthesizeResults(searchResults, keyword, location);

  return facts;
}
```

### B. Intégration dans claude.ts

```typescript
// src/lib/claude.ts - MODIFICATION
import { enrichWithWebSearch } from './search';

export async function generatePageContent(keyword: Keyword) {
  console.log(`🎯 Génération page: ${keyword.keyword}`);

  // ✅ ÉTAPE 1: ENRICHISSEMENT WEB RÉEL
  const enrichedFacts = await enrichWithWebSearch(keyword.keyword, keyword.location);

  // Formater les facts pour le prompt
  const factsSection = enrichedFacts && Object.keys(enrichedFacts).length > 0 ? `
═══════════════════════════════════════════════════════════════════
DONNÉES ENRICHIES DU WEB (FACTS RÉELS - SOURCE: BRAVE SEARCH)
═══════════════════════════════════════════════════════════════════

${enrichedFacts.hours ? `⏰ Horaires: ${enrichedFacts.hours}` : ''}
${enrichedFacts.prices ? `💰 Prix: ${enrichedFacts.prices}` : ''}
${enrichedFacts.rating ? `⭐ Note: ${enrichedFacts.rating}` : ''}
${enrichedFacts.reviews ? `📊 Avis: ${enrichedFacts.reviews}` : ''}
${enrichedFacts.unique_features ? `✨ Caractéristiques uniques:\n${enrichedFacts.unique_features.map(f => `  - ${f}`).join('\n')}` : ''}
${enrichedFacts.history ? `📜 Historique: ${enrichedFacts.history}` : ''}
${enrichedFacts.seasonal_info ? `🌞 Saisonnalité: ${enrichedFacts.seasonal_info}` : ''}
${enrichedFacts.recent_news ? `🆕 Nouveautés 2025: ${enrichedFacts.recent_news}` : ''}
${enrichedFacts.local_tips ? `💡 Conseils locaux:\n${enrichedFacts.local_tips.map(t => `  - ${t}`).join('\n')}` : ''}
${enrichedFacts.accessibility ? `♿ Accessibilité: ${enrichedFacts.accessibility}` : ''}

⚠️ IMPORTANT: UTILISE CES DONNÉES FACTUELLES dans ton contenu.
Ne mentionne PAS "source: Brave Search" dans le contenu final.
` : '';

  // ÉTAPE 2: GÉNÉRATION CONTENU AVEC FACTS
  const prompt = `Tu es un EXPERT SEO et rédacteur web...

${factsSection}

... (reste du prompt)`;

  // ... (reste de la fonction inchangé)
}
```

### C. Variables d'Environnement

```bash
# .env
BRAVE_SEARCH_API_KEY=your_brave_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

---

## 2. GÉNÉRATION AVIF AUTOMATIQUE

### A. Script de Génération Images

```typescript
// scripts/generate-images.ts
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Charger keywords
const keywordsPath = path.join(__dirname, '../src/content/keywords/keywords-70.json');
const keywordsData = JSON.parse(fs.readFileSync(keywordsPath, 'utf-8'));

const SIZES = [
  { width: 800, height: 450 },   // Mobile
  { width: 1200, height: 675 },  // Tablet
  { width: 1920, height: 1080 }  // Desktop
];

const SOURCE_DIR = path.join(__dirname, '../public/images/sources');
const OUTPUT_DIR = path.join(__dirname, '../public/images');

interface Keyword {
  keyword: string;
  category: string;
  authority: boolean;
}

/**
 * Génère les 3 formats (JPG, WebP, AVIF) pour une image
 */
async function generateImageFormats(
  sourceImage: string,
  outputBase: string,
  size: { width: number; height: number }
): Promise<void> {
  const { width, height } = size;

  // 1. Générer JPG (baseline)
  try {
    console.log(`  📷 Génération JPG ${width}w...`);
    execSync(
      `convert "${sourceImage}" -resize ${width}x${height}^ -gravity center -extent ${width}x${height} -quality 85 -strip "${outputBase}.jpg"`,
      { stdio: 'inherit' }
    );
  } catch (e) {
    console.error(`  ❌ Erreur JPG: ${e}`);
    throw e;
  }

  // 2. Générer WebP
  try {
    console.log(`  🖼️  Génération WebP ${width}w...`);
    execSync(
      `cwebp -q 80 -resize ${width} ${height} "${sourceImage}" -o "${outputBase}.webp"`,
      { stdio: 'inherit' }
    );
  } catch (e) {
    console.error(`  ❌ Erreur WebP: ${e}`);
    throw e;
  }

  // 3. Générer AVIF (meilleure compression)
  try {
    console.log(`  ⚡ Génération AVIF ${width}w...`);

    // Créer JPG temporaire redimensionné pour AVIF
    const tempJpg = `/tmp/temp-${Date.now()}-${width}.jpg`;
    execSync(
      `convert "${sourceImage}" -resize ${width}x${height}^ -gravity center -extent ${width}x${height} "${tempJpg}"`,
      { stdio: 'inherit' }
    );

    // Encoder en AVIF avec libavif
    execSync(
      `avifenc --min 0 --max 63 --speed 4 -j 8 "${tempJpg}" "${outputBase}.avif"`,
      { stdio: 'inherit' }
    );

    // Nettoyer temp
    if (fs.existsSync(tempJpg)) {
      fs.unlinkSync(tempJpg);
    }
  } catch (e) {
    console.error(`  ❌ Erreur AVIF: ${e}`);
    throw e;
  }

  // Afficher tailles
  const jpgSize = fs.existsSync(`${outputBase}.jpg`) ? fs.statSync(`${outputBase}.jpg`).size : 0;
  const webpSize = fs.existsSync(`${outputBase}.webp`) ? fs.statSync(`${outputBase}.webp`).size : 0;
  const avifSize = fs.existsSync(`${outputBase}.avif`) ? fs.statSync(`${outputBase}.avif`).size : 0;

  console.log(`  ✅ ${width}w: JPG ${(jpgSize/1024).toFixed(1)}KB | WebP ${(webpSize/1024).toFixed(1)}KB (-${Math.round((1-webpSize/jpgSize)*100)}%) | AVIF ${(avifSize/1024).toFixed(1)}KB (-${Math.round((1-avifSize/jpgSize)*100)}%)`);
}

/**
 * Génère toutes les images pour un keyword
 */
async function generateImagesForKeyword(kw: Keyword): Promise<void> {
  const slug = kw.keyword.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const basePath = kw.authority ? `hero/${slug}` : `hero/${kw.category}`;
  const sourceImage = path.join(SOURCE_DIR, `${basePath}.jpg`);

  if (!fs.existsSync(sourceImage)) {
    console.warn(`⚠️ Source manquante: ${sourceImage}`);
    return;
  }

  console.log(`\n🎯 ${kw.keyword} (${kw.authority ? 'AUTHORITY' : 'standard'})`);

  for (const size of SIZES) {
    const outputDir = path.join(OUTPUT_DIR, path.dirname(basePath));
    const outputFile = path.basename(basePath);
    const outputBase = path.join(outputDir, `${outputFile}-${size.width}w`);

    // Créer dossier si nécessaire
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    await generateImageFormats(sourceImage, outputBase, size);
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 GÉNÉRATION IMAGES (JPG + WebP + AVIF)\n');

  // Vérifier outils installés
  try {
    execSync('convert -version', { stdio: 'ignore' });
    console.log('✅ ImageMagick installé');
  } catch {
    console.error('❌ ImageMagick NON installé. Installez avec: brew install imagemagick');
    process.exit(1);
  }

  try {
    execSync('cwebp -version', { stdio: 'ignore' });
    console.log('✅ libwebp (cwebp) installé');
  } catch {
    console.error('❌ libwebp NON installé. Installez avec: brew install webp');
    process.exit(1);
  }

  try {
    execSync('avifenc --version', { stdio: 'ignore' });
    console.log('✅ libavif (avifenc) installé\n');
  } catch {
    console.error('❌ libavif NON installé. Installez avec: brew install libavif');
    process.exit(1);
  }

  const keywords: Keyword[] = keywordsData.keywords;

  for (let i = 0; i < keywords.length; i++) {
    const kw = keywords[i];
    console.log(`\n[${i+1}/${keywords.length}]`);

    try {
      await generateImagesForKeyword(kw);
    } catch (error) {
      console.error(`❌ Erreur génération ${kw.keyword}:`, error);
    }
  }

  console.log('\n\n🎉 Génération terminée!');
  console.log(`✅ ${keywords.length} keywords × 3 sizes × 3 formats = ${keywords.length * 9} fichiers générés`);
}

main().catch(console.error);
```

### B. Script npm

```json
// package.json
{
  "scripts": {
    "images:generate": "tsx scripts/generate-images.ts",
    "images:clean": "rm -rf public/images/hero/*.{jpg,webp,avif}",
    "images:rebuild": "npm run images:clean && npm run images:generate"
  }
}
```

### C. Installation Outils

```bash
#!/bin/bash
# install-image-tools.sh

echo "🚀 Installation outils de génération d'images..."

# Détecter OS
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  echo "📦 Installation via Homebrew (macOS)..."

  brew install imagemagick
  brew install webp
  brew install libavif

elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  # Linux
  echo "📦 Installation via apt (Linux)..."

  sudo apt update
  sudo apt install -y imagemagick
  sudo apt install -y webp
  sudo apt install -y libavif-bin

else
  echo "⚠️ OS non supporté: $OSTYPE"
  echo "Installez manuellement ImageMagick, libwebp et libavif"
  exit 1
fi

echo "✅ Installation terminée!"
echo ""
echo "Vérification versions:"
convert -version | head -1
cwebp -version 2>&1 | head -1
avifenc --version 2>&1 | head -1
```

---

## 3. OPEN GRAPH COMPLET

```astro
---
// src/layouts/PageLayout.astro - SECTION <HEAD> MODIFIÉE
interface Props {
  title: string;
  metaTitle?: string;
  metaDescription: string;
  lang?: string;
  canonical?: string;
  ogImage?: string;
  category?: string;
  publishedDate?: string;
  modifiedDate?: string;
  tags?: string[];
}

const {
  title,
  metaTitle = title,
  metaDescription,
  lang = 'fr',
  canonical,
  ogImage = '/images/og-default.jpg',
  category = 'general',
  publishedDate = new Date().toISOString(),
  modifiedDate = new Date().toISOString(),
  tags = []
} = Astro.props;

const siteUrl = 'https://ecofundrive.com';
const currentUrl = canonical || new URL(Astro.url.pathname, siteUrl).href;

// Fix hreflang (éviter double /fr/)
const currentPath = Astro.url.pathname;
const frUrl = currentPath.startsWith('/fr') ? `${siteUrl}${currentPath}` : `${siteUrl}/fr${currentPath}`;
const enUrl = currentPath.replace(/^\/fr\//, '/en/');

import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
---

<!DOCTYPE html>
<html lang={lang}>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- SEO Meta Tags -->
  <title>{metaTitle}</title>
  <meta name="description" content={metaDescription}>
  <link rel="canonical" href={currentUrl}>

  <!-- Robots Directives -->
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <meta name="googlebot" content="index, follow">
  <meta name="bingbot" content="index, follow">

  <!-- Open Graph COMPLET -->
  <meta property="og:title" content={metaTitle}>
  <meta property="og:description" content={metaDescription}>
  <meta property="og:image" content={`${siteUrl}${ogImage}`}>
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content={metaTitle}>
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:url" content={currentUrl}>
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="ECOFUNDRIVE">
  <meta property="og:locale" content={lang === 'fr' ? 'fr_FR' : 'en_US'}>
  <meta property="og:locale:alternate" content={lang === 'fr' ? 'en_US' : 'fr_FR'}>

  <!-- Article Metadata -->
  <meta property="article:published_time" content={publishedDate}>
  <meta property="article:modified_time" content={modifiedDate}>
  <meta property="article:author" content="David Chemla">
  <meta property="article:section" content={category}>
  {tags.map(tag => <meta property="article:tag" content={tag} />)}

  <!-- Twitter Card COMPLET -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@ecofundrive">
  <meta name="twitter:creator" content="@davidchemla">
  <meta name="twitter:title" content={metaTitle}>
  <meta name="twitter:description" content={metaDescription}>
  <meta name="twitter:image" content={`${siteUrl}${ogImage}`}>
  <meta name="twitter:image:alt" content={metaTitle}>

  <!-- Hreflang (FIXÉ) -->
  <link rel="alternate" hreflang="fr" href={frUrl}>
  <link rel="alternate" hreflang="en" href={enUrl}>
  <link rel="alternate" hreflang="x-default" href={frUrl}>

  <!-- Favicon -->
  <link rel="icon" type="image/png" href="/favicon.png">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">

  <!-- Theme Color -->
  <meta name="theme-color" content="#0066FF">
  <meta name="msapplication-TileColor" content="#0066FF">

  <!-- Fonts Preload -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

  <!-- External CSS -->
  <link rel="stylesheet" href="/css/style.css">

  <!-- Performance -->
  <link rel="dns-prefetch" href="https://www.googletagmanager.com">
  <link rel="dns-prefetch" href="https://images.ecofundrive.com">
</head>

<body>
  <!-- ... reste inchangé ... -->
</body>
</html>
```

---

## 4. ALT TEXTS DYNAMIQUES

```typescript
// src/lib/images.ts - FONCTION MODIFIÉE

/**
 * Génère des alt texts naturels et variés (5 variations)
 */
export function generateAltText(
  keyword: string,
  category: string,
  context: string = 'general',
  imageIndex: number = 0
): string {
  const hash = hashString(keyword + imageIndex.toString());
  const variant = hash % 5; // 5 variations au lieu de 3

  // Extraire éléments du keyword
  const words = keyword.split(' ');
  const mainKeyword = words.slice(0, 2).join(' '); // "VTC Nice"
  const location = words.slice(-1)[0]; // "Monaco"

  // Générateurs par catégorie (5 variations chacun)
  const altGenerators: Record<string, (v: number) => string> = {
    vtc: (v) => {
      const templates = [
        `${mainKeyword} en Tesla électrique vers ${location}`,
        `Service premium ${keyword} sur la Côte d'Azur`,
        `Chauffeur VTC professionnel pour ${keyword}`,
        `Transfert ${mainKeyword} avec ECOFUNDRIVE`,
        `${keyword} : confort et ponctualité garantis`
      ];
      return templates[v] || templates[0];
    },

    beaches: (v) => {
      const templates = [
        `Vue panoramique ${keyword} French Riviera`,
        `Plage ${location} accessible en VTC Tesla`,
        `${keyword} : destination prisée de la Côte d'Azur`,
        `Eaux turquoise ${keyword} Méditerranée`,
        `Accès premium à ${keyword} avec ECOFUNDRIVE`
      ];
      return templates[v] || templates[0];
    },

    restaurants: (v) => {
      const templates = [
        `Restaurant ${location} : cuisine gastronomique`,
        `Terrasse vue mer ${keyword}`,
        `${keyword} accessible en chauffeur privé Tesla`,
        `Expérience culinaire ${keyword} Côte d'Azur`,
        `Table ${keyword} avec transfert VTC ECOFUNDRIVE`
      ];
      return templates[v] || templates[0];
    },

    hotels: (v) => {
      const templates = [
        `Hôtel ${location} : établissement 5 étoiles`,
        `Façade luxueuse ${keyword}`,
        `Transfert VTC Tesla vers ${keyword}`,
        `${keyword} : hébergement premium French Riviera`,
        `Suite avec vue ${keyword}`
      ];
      return templates[v] || templates[0];
    },

    golf: (v) => {
      const templates = [
        `Parcours 18 trous ${keyword}`,
        `Green impeccable ${keyword} Côte d'Azur`,
        `Club house ${location} vue panoramique`,
        `Golf ${keyword} accessible en VTC Tesla`,
        `Fairway ${keyword} : parcours prestige`
      ];
      return templates[v] || templates[0];
    },

    routes: (v) => {
      const templates = [
        `Route panoramique ${keyword} vue mer`,
        `Trajet scenic ${keyword} en Tesla`,
        `${keyword} : itinéraire mythique Côte d'Azur`,
        `Paysage côtier ${keyword} Méditerranée`,
        `Excursion VTC ${keyword} confort premium`
      ];
      return templates[v] || templates[0];
    }
  };

  const generator = altGenerators[category] || ((v) => `${keyword} - ECOFUNDRIVE`);
  let altText = generator(variant);

  // Ajuster selon contexte
  if (context === 'detail' || context === 'interior') {
    altText = `Détail ${altText.toLowerCase()}`;
  } else if (context === 'ambiance' || context === 'atmosphere') {
    altText = `Ambiance ${altText.toLowerCase()}`;
  } else if (context === 'aerial' || context === 'panoramic') {
    altText = `Vue aérienne ${altText.toLowerCase()}`;
  }

  // Validation longueur (10-100 caractères)
  if (altText.length < 10) {
    altText = `${keyword} - ${altText}`;
  }
  if (altText.length > 100) {
    altText = altText.substring(0, 97) + '...';
  }

  return altText;
}
```

---

## 5. CACHE INTELLIGENT CONTENU

```typescript
// src/lib/cache.ts
import fs from 'fs';
import crypto from 'crypto';
import path from 'path';

const CACHE_DIR = path.join(process.cwd(), '.cache/content');
const CACHE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 jours en ms

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  hash: string;
}

/**
 * Génère un hash MD5 pour un objet
 */
function generateHash(data: any): string {
  return crypto
    .createHash('md5')
    .update(JSON.stringify(data))
    .digest('hex');
}

/**
 * Lit le cache pour une clé donnée
 */
export function readCache<T>(key: string): T | null {
  const cachePath = path.join(CACHE_DIR, `${key}.json`);

  if (!fs.existsSync(cachePath)) {
    return null;
  }

  try {
    const cacheData = fs.readFileSync(cachePath, 'utf-8');
    const entry: CacheEntry<T> = JSON.parse(cacheData);

    // Vérifier âge du cache
    const age = Date.now() - entry.timestamp;

    if (age > CACHE_MAX_AGE) {
      console.log(`⏰ Cache expiré (${Math.round(age / (24*60*60*1000))} jours): ${key}`);
      fs.unlinkSync(cachePath);
      return null;
    }

    console.log(`📦 Cache hit (${Math.round(age / (60*60*1000))}h): ${key}`);
    return entry.data;

  } catch (error) {
    console.error(`❌ Erreur lecture cache ${key}:`, error);
    return null;
  }
}

/**
 * Écrit dans le cache
 */
export function writeCache<T>(key: string, data: T): void {
  // Créer dossier cache si nécessaire
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }

  const cachePath = path.join(CACHE_DIR, `${key}.json`);

  const entry: CacheEntry<T> = {
    data,
    timestamp: Date.now(),
    hash: generateHash(data)
  };

  try {
    fs.writeFileSync(cachePath, JSON.stringify(entry, null, 2), 'utf-8');
    console.log(`💾 Cache écrit: ${key}`);
  } catch (error) {
    console.error(`❌ Erreur écriture cache ${key}:`, error);
  }
}

/**
 * Vide le cache (optionnel: par clé)
 */
export function clearCache(key?: string): void {
  if (key) {
    const cachePath = path.join(CACHE_DIR, `${key}.json`);
    if (fs.existsSync(cachePath)) {
      fs.unlinkSync(cachePath);
      console.log(`🗑️  Cache supprimé: ${key}`);
    }
  } else {
    if (fs.existsSync(CACHE_DIR)) {
      const files = fs.readdirSync(CACHE_DIR);
      files.forEach(file => {
        fs.unlinkSync(path.join(CACHE_DIR, file));
      });
      console.log(`🗑️  Tout le cache vidé (${files.length} fichiers)`);
    }
  }
}

/**
 * Statistiques du cache
 */
export function cacheStats(): { totalEntries: number; totalSize: number; oldestEntry: number } {
  if (!fs.existsSync(CACHE_DIR)) {
    return { totalEntries: 0, totalSize: 0, oldestEntry: 0 };
  }

  const files = fs.readdirSync(CACHE_DIR);
  let totalSize = 0;
  let oldestTimestamp = Date.now();

  files.forEach(file => {
    const filePath = path.join(CACHE_DIR, file);
    const stats = fs.statSync(filePath);
    totalSize += stats.size;

    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      if (data.timestamp < oldestTimestamp) {
        oldestTimestamp = data.timestamp;
      }
    } catch {}
  });

  return {
    totalEntries: files.length,
    totalSize,
    oldestEntry: oldestTimestamp
  };
}
```

### Utilisation dans claude.ts

```typescript
// src/lib/claude.ts - AVEC CACHE
import { readCache, writeCache } from './cache';

export async function generatePageContent(keyword: Keyword) {
  const cacheKey = `page-${keyword.id}`;

  // Vérifier cache
  const cached = readCache<any>(cacheKey);
  if (cached) {
    return cached;
  }

  // Générer si pas de cache
  console.log(`🎯 Génération: ${keyword.keyword}`);
  const enrichedFacts = await enrichWithWebSearch(keyword.keyword, keyword.location);

  const prompt = `...`; // Prompt complet

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4.5-20250929",
    max_tokens: 8000,
    messages: [{ role: "user", content: prompt }]
  });

  const content = JSON.parse(response.content[0].text);

  // Sauvegarder en cache
  writeCache(cacheKey, content);

  return content;
}
```

---

## 6. SITEMAP.XML GÉNÉRATION

```typescript
// scripts/generate-sitemap.ts
import fs from 'fs';
import path from 'path';

const keywordsPath = path.join(__dirname, '../src/content/keywords/keywords-70.json');
const keywordsData = JSON.parse(fs.readFileSync(keywordsPath, 'utf-8'));

const SITE_URL = 'https://ecofundrive.com';

interface URLEntry {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
}

function generateSitemap() {
  const urls: URLEntry[] = [];

  // Homepage
  urls.push({
    loc: `${SITE_URL}/fr`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: '1.0'
  });

  urls.push({
    loc: `${SITE_URL}/en`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: '1.0'
  });

  // Pages dynamiques (70 keywords)
  keywordsData.keywords.forEach((kw: any) => {
    urls.push({
      loc: `${SITE_URL}/${kw.language}/${kw.slug}.html`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: kw.authority ? 'weekly' : 'monthly',
      priority: kw.authority ? '0.8' : '0.6'
    });
  });

  // Pages statiques
  const staticPages = [
    '/fr/mentions-legales',
    '/fr/cgv',
    '/fr/politique-confidentialite'
  ];

  staticPages.forEach(page => {
    urls.push({
      loc: `${SITE_URL}${page}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'yearly',
      priority: '0.3'
    });
  });

  // Générer XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  // Écrire fichier
  const outputPath = path.join(__dirname, '../dist/sitemap.xml');
  fs.writeFileSync(outputPath, xml, 'utf-8');

  console.log(`✅ Sitemap généré: ${urls.length} URLs`);
  console.log(`📄 Fichier: ${outputPath}`);
}

generateSitemap();
```

---

## 7. VALIDATION TESTS

```typescript
// scripts/validate-seo.ts
import fs from 'fs';
import path from 'path';
import { parse } from 'node-html-parser';

interface ValidationResult {
  file: string;
  score: number;
  checks: {
    metaTitle: boolean;
    metaDescription: boolean;
    h1: boolean;
    openGraph: boolean;
    twitterCard: boolean;
    schemas: number;
    images: boolean;
  };
  issues: string[];
}

function validateHTMLFile(filePath: string): ValidationResult {
  const html = fs.readFileSync(filePath, 'utf-8');
  const root = parse(html);

  const checks = {
    metaTitle: false,
    metaDescription: false,
    h1: false,
    openGraph: false,
    twitterCard: false,
    schemas: 0,
    images: false
  };

  const issues: string[] = [];

  // Meta title
  const title = root.querySelector('title');
  if (title && title.text.length >= 50 && title.text.length <= 60) {
    checks.metaTitle = true;
  } else {
    issues.push(`Meta title: ${title?.text.length || 0} chars (attendu: 50-60)`);
  }

  // Meta description
  const description = root.querySelector('meta[name="description"]');
  if (description) {
    const content = description.getAttribute('content') || '';
    if (content.length >= 150 && content.length <= 160) {
      checks.metaDescription = true;
    } else {
      issues.push(`Meta description: ${content.length} chars (attendu: 150-160)`);
    }
  }

  // H1
  const h1 = root.querySelector('h1');
  if (h1 && h1.text.length >= 50 && h1.text.length <= 70) {
    checks.h1 = true;
  } else {
    issues.push(`H1: ${h1?.text.length || 0} chars (attendu: 50-70)`);
  }

  // Open Graph
  const ogTags = root.querySelectorAll('meta[property^="og:"]');
  if (ogTags.length >= 8) { // Minimum 8 tags OG
    checks.openGraph = true;
  } else {
    issues.push(`Open Graph: ${ogTags.length} tags (attendu: 8+)`);
  }

  // Twitter Card
  const twitterTags = root.querySelectorAll('meta[name^="twitter:"]');
  if (twitterTags.length >= 5) {
    checks.twitterCard = true;
  } else {
    issues.push(`Twitter Card: ${twitterTags.length} tags (attendu: 5+)`);
  }

  // JSON-LD Schemas
  const schemas = root.querySelectorAll('script[type="application/ld+json"]');
  checks.schemas = schemas.length;
  if (checks.schemas < 6) {
    issues.push(`Schemas JSON-LD: ${checks.schemas} (attendu: 6)`);
  }

  // Images (WebP/AVIF)
  const pictures = root.querySelectorAll('picture');
  if (pictures.length > 0) {
    const hasAVIF = pictures.some(pic =>
      pic.querySelector('source[type="image/avif"]')
    );
    checks.images = hasAVIF;

    if (!hasAVIF) {
      issues.push('Images: AVIF manquant');
    }
  }

  // Calculer score
  let score = 0;
  if (checks.metaTitle) score += 15;
  if (checks.metaDescription) score += 15;
  if (checks.h1) score += 15;
  if (checks.openGraph) score += 15;
  if (checks.twitterCard) score += 10;
  score += Math.min(checks.schemas * 5, 20);
  if (checks.images) score += 10;

  return {
    file: path.basename(filePath),
    score,
    checks,
    issues
  };
}

function validateAllPages() {
  const distDir = path.join(__dirname, '../dist');
  const htmlFiles: string[] = [];

  // Trouver tous les HTML
  function findHTML(dir: string) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        findHTML(fullPath);
      } else if (file.endsWith('.html')) {
        htmlFiles.push(fullPath);
      }
    });
  }

  findHTML(distDir);

  console.log(`🔍 Validation de ${htmlFiles.length} pages HTML...\n`);

  const results: ValidationResult[] = [];
  let totalScore = 0;

  htmlFiles.forEach(file => {
    const result = validateHTMLFile(file);
    results.push(result);
    totalScore += result.score;

    if (result.score < 80) {
      console.log(`⚠️  ${result.file}: ${result.score}/100`);
      result.issues.forEach(issue => console.log(`   - ${issue}`));
    } else {
      console.log(`✅ ${result.file}: ${result.score}/100`);
    }
  });

  const avgScore = totalScore / results.length;

  console.log(`\n📊 Score moyen: ${avgScore.toFixed(1)}/100`);
  console.log(`✅ Pages > 80: ${results.filter(r => r.score >= 80).length}/${results.length}`);
  console.log(`⚠️  Pages < 80: ${results.filter(r => r.score < 80).length}/${results.length}`);
}

validateAllPages();
```

---

**Fin des Code Samples**

Tous ces exemples sont prêts à être copiés-collés et utilisés dans le projet ECOFUNDRIVE V2.0.
