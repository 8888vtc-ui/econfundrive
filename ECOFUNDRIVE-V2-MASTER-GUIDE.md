# ðŸš€ ECOFUNDRIVE V2.0 - MASTER GUIDE COMPLET

**Version:** 2.0 PRODUCTION-READY  
**Date:** 2 Novembre 2025  
**Pour:** Claude Assistant IA  
**Mission:** GÃ©nÃ©ration automatique 70 pages SEO ECOFUNDRIVE

---

## ðŸ“‹ TABLE DES MATIÃˆRES

1. [MISSION & OBJECTIFS](#mission)
2. [ARCHITECTURE TECHNIQUE V2.0](#architecture)
3. [DONNÃ‰ES ECOFUNDRIVE (CONSERVÃ‰ES)](#donnees-conservees)
4. [RÃˆGLES SEO & QUALITÃ‰](#regles-seo)
5. [GÃ‰NÃ‰RATION CONTENU (CLAUDE API)](#generation-contenu)
6. [GÃ‰NÃ‰RATION IMAGES (FLUX PRO)](#generation-images)
7. [WORKFLOW DE PRODUCTION](#workflow)
8. [STRUCTURE PROJET ASTRO](#structure-projet)
9. [VALIDATION & DÃ‰PLOIEMENT](#validation)
10. [CHECKLIST COMPLÃˆTE](#checklist)

---

## ðŸŽ¯ MISSION & OBJECTIFS {#mission}

### Mission Principale

```yaml
Objectif: GÃ©nÃ©rer 70 pages HTML SEO-optimisÃ©es
Service: VTC Tesla premium CÃ´te d'Azur
Client: ECOFUNDRIVE
MarchÃ©s: France (FR) + International (EN)
Zones: Monaco, Nice, Cannes, Saint-Tropez, Antibes
```

### Standards QualitÃ© V2.0

```yaml
Performance:
  lighthouse_score: "100/100 garanti"
  lcp: "<1.0s"
  cls: "<0.1"
  fid: "<100ms"
  
Contenu:
  wordcount: "2000-2500 mots"
  unicite: "100% unique (0% duplicate)"
  seo_density: "0.70-1.00%"
  faq: "5 questions contextualisÃ©es"
  
Images:
  style: "Paysages cinÃ©matiques SANS logos"
  source: "Flux Pro (gÃ©nÃ©ration IA)"
  format: "WebP progressif 88%"
  tailles: "800w/1200w/1920w (responsive)"
  
Architecture:
  framework: "Astro 4.x (SSG ultra-rapide)"
  build_time: "2-3 minutes (70 pages)"
  contenu_api: "Claude API (Sonnet 4.5)"
  images_api: "Flux Pro (gÃ©nÃ©ration)"
```

---

## ðŸ—ï¸ ARCHITECTURE TECHNIQUE V2.0 {#architecture}

### Stack Technique Complet

```yaml
Framework: Astro 4.x
â”œâ”€ Type: SSG (Static Site Generator)
â”œâ”€ Performance: 100/100 Lighthouse garanti
â”œâ”€ Build: 2-3 min pour 70 pages
â”œâ”€ Output: HTML pur (0 JavaScript par dÃ©faut)
â””â”€ Deploy: Netlify (adapter officiel)

GÃ©nÃ©ration Contenu: Claude API
â”œâ”€ ModÃ¨le: claude-sonnet-4.5-20250929
â”œâ”€ Usage: Build time (pas runtime)
â”œâ”€ Output: JSON structurÃ© â†’ HTML
â””â”€ CoÃ»t: ~$5 total (70 pages)

GÃ©nÃ©ration Images: Flux Pro
â”œâ”€ Type: AI image generation
â”œâ”€ Style: Paysages cinÃ©matiques professionnels
â”œâ”€ Contrainte: AUCUN logo, AUCUNE marque visible
â”œâ”€ Formats: 3 tailles WebP (800/1200/1920w)
â””â”€ CoÃ»t: Selon API Flux Pro

HÃ©bergement: Netlify
â”œâ”€ Plan: Gratuit (100GB/mois)
â”œâ”€ SSL: Auto (Let's Encrypt)
â”œâ”€ CDN: Global
â””â”€ Deploy: Git push automatique
```

### Pourquoi Astro 4.x ?

```
âœ… PERFORMANCE ULTIME
â”œâ”€ 0 JavaScript par dÃ©faut (HTML pur)
â”œâ”€ Lighthouse 100/100 automatique
â”œâ”€ LCP < 1s garanti
â”œâ”€ Build 70 pages: 2-3 min (vs 35+ min Next.js)
â””â”€ Core Web Vitals: Parfaits

âœ… SEO PARFAIT
â”œâ”€ Static-first (Google prÃ©fÃ¨re HTML statique)
â”œâ”€ Meta tags automatiques
â”œâ”€ Sitemap XML auto-gÃ©nÃ©rÃ©
â”œâ”€ Schemas JSON-LD natifs
â””â”€ Zero hydration issues

âœ… GÃ‰NÃ‰RATION CONTENU
â”œâ”€ Claude API au build time (pas de timeout)
â”œâ”€ Content Collections type-safe
â”œâ”€ Validation automatique TypeScript
â””â”€ Hot reload dÃ©veloppement rapide

âœ… COMPATIBLE PRODUCTION
â”œâ”€ Adapter Netlify officiel
â”œâ”€ Deploy en 1 commande
â”œâ”€ Preview branches automatiques
â””â”€ Edge functions si besoin

âœ… MAINTENABLE
â”œâ”€ TypeScript natif
â”œâ”€ Structure claire et simple
â”œâ”€ CommunautÃ© active 2025
â””â”€ Documentation excellente
```

---

## ðŸ’Ž DONNÃ‰ES ECOFUNDRIVE (CONSERVÃ‰ES) {#donnees-conservees}

### 1. IdentitÃ© Entreprise

```yaml
Entreprise:
  nom: "ECOFUNDRIVE"
  siret: "91224469600015"
  siren: "912244696"
  forme_juridique: "Entreprise individuelle"
  activite: "VTC premium Tesla Ã©lectrique"
  naf: "4932Z"

SiÃ¨ge_Social:
  adresse: "1001 Avenue de la Batterie"
  code_postal: "06270"
  ville: "Villeneuve-Loubet"
  departement: "Alpes-Maritimes (06)"
  region: "Provence-Alpes-CÃ´te d'Azur"
  pays: "France"

Contacts:
  email: "8888vtc@gmail.com"
  telephone: "+33 6 16 55 28 11"
  whatsapp: "https://wa.me/33616552811"
  
Tracking:
  google_tag_manager: "GTM-NMMBXS4T"
  trustindex_widget: "6e6475e260715241c236fb004f3"
```

### 2. Auteur & Avis

```yaml
Auteur:
  nom: "David Chemla"
  titre: "Local Guide Google Niveau 6"
  specialite: "Expert CÃ´te d'Azur depuis 15 ans"
  profil_google: "https://maps.app.goo.gl/qPAanSvPmAxxmhZZA"
  role: "RÃ©dacteur expert (byline obligatoire)"
  schema_required: "Person JSON-LD"

Avis_Clients:
  plateforme: "Trustindex"
  note: "5.0/5"
  total_avis: 26
  texte_affichage: "26 avis vÃ©rifiÃ©s 5.0â˜… - ECOFUNDRIVE"
  
ATTENTION:
  - David Chemla = Local Guide (avis personnels Google)
  - ECOFUNDRIVE = Trustindex (avis entreprise)
  - NE PAS confondre les deux
  - Pas de Google My Business ECOFUNDRIVE (n'existe pas)
```

### 3. Flotte Tesla

```yaml
Vehicules:
  Model_3:
    capacite: "5 passagers"
    valises: "2 grandes valises"
    coffre: "425L"
    tarif_horaire: "70â‚¬/h"
    standing: "Confort"
    
  Model_S:
    capacite: "5 passagers"
    valises: "3 grandes valises"
    coffre: "804L"
    tarif_horaire: "100â‚¬/h"
    standing: "Premium"
    
  Model_X:
    capacite: "6 passagers"
    valises: "4+ valises"
    coffre: "2180L"
    tarif_horaire: "120â‚¬/h"
    particularite: "Portes Falcon Wing"
    standing: "Luxe"
    
  Van_Electrique:
    capacite: "8 passagers"
    valises: "6+ valises"
    tarif_horaire: "120â‚¬/h"
    standing: "Groupe"
```

### 4. Tarifs Standards

```yaml
Nice_Aeroport_Monaco:
  distance: "22 km"
  duree: "25 minutes"
  prix:
    model_3: "80â‚¬"
    model_s: "96â‚¬"
    model_x: "104â‚¬"
    van: "112â‚¬"

Nice_Cannes:
  distance: "27 km"
  duree: "30 minutes"
  prix:
    model_3: "100â‚¬"
    model_s: "120â‚¬"
    model_x: "130â‚¬"
    van: "140â‚¬"

Service_Horaire:
  minimum: "3 heures"
  tarifs:
    model_3: "70â‚¬/h"
    model_s: "100â‚¬/h"
    model_x: "120â‚¬/h"
    van: "120â‚¬/h"

EXCEPTION_SAINT_TROPEZ:
  affichage: "Tarifs sur demande"
  raison: "Distance variable + saison haute"
  INTERDIT: "Afficher des prix fixes"
  OBLIGATOIRE: "Toujours Ã©crire 'Tarifs personnalisÃ©s'"
```

### 5. Inclusions Service (9 obligatoires)

```yaml
Inclusions_Toujours_Mentionner:
  1: "Chauffeur professionnel bilingue (franÃ§ais/anglais)"
  2: "Suivi vol temps rÃ©el (aÃ©roport Nice)"
  3: "Eau fraÃ®che + chargeurs USB offerts"
  4: "WiFi gratuit embarquÃ©"
  5: "15 minutes d'attente gratuites"
  6: "Assurance tous risques incluse"
  7: "Parking + pÃ©ages inclus"
  8: "SiÃ¨ges enfants disponibles sur demande"
  9: "Assistance 24/7"
```

### 6. Interdictions Absolues

```yaml
INTERDICTIONS:
  Mention_Uber:
    INTERDIT: "Comparer avec Uber"
    RAISON: "Positionnement premium"
    AUTORISE: "Applications gÃ©nÃ©ralistes, services Ã©quivalents"
    
  Google_Reviews_ECOFUNDRIVE:
    INTERDIT: "Mentionner Google Reviews ECOFUNDRIVE"
    RAISON: "Google My Business n'existe pas"
    AUTORISE: "Trustindex uniquement"
    
  Prix_Fixes_Saint_Tropez:
    INTERDIT: "Afficher des tarifs fixes"
    RAISON: "Distance variable + saison"
    OBLIGATION: "Ã‰crire 'Tarifs sur demande'"
    
  DonnÃ©es_InventÃ©es:
    INTERDIT: "Inventer historique, partenariats, certifications"
    OBLIGATION: "Faits vÃ©rifiables uniquement"
```

### 7. Charte Graphique & Design

```yaml
Couleurs:
  primaire: "#1a1a1a"        # Noir Ã©lÃ©gant
  secondaire: "#f8f9fa"       # Blanc cassÃ©
  accent: "#0066ff"           # Bleu Tesla
  accent_dark: "#0052cc"      # Bleu foncÃ© hover
  texte: "#333333"            # Gris texte
  texte_light: "#666666"      # Gris clair
  bordure: "#e0e0e0"          # Bordure subtle
  whatsapp: "#25D366"         # Vert WhatsApp

Typographie:
  heading: "Montserrat, sans-serif"
  body: "Open Sans, sans-serif"
  poids:
    light: 300
    normal: 400
    medium: 500
    semibold: 600
    bold: 700

Responsive_Breakpoints:
  mobile: "< 768px"
  tablet: "768px - 1024px"
  desktop: "> 1024px"
  
Font_Sizes:
  mobile:
    h1: "2.5rem"
    h2: "2rem"
    h3: "1.5rem"
    body: "1rem"
  desktop:
    h1: "4rem"
    h2: "2.5rem"
    h3: "1.5rem"
    body: "1rem"
```

---

## ðŸ“ RÃˆGLES SEO & QUALITÃ‰ {#regles-seo}

### 10 RÃ¨gles SEO Essentielles

```yaml
1_Title_Tag:
  longueur: "50-60 caractÃ¨res"
  format: "[Keyword] | VTC Tesla Premium [Ville]"
  unique: true
  keyword: "Obligatoire au dÃ©but"
  
2_Meta_Description:
  longueur: "150-160 caractÃ¨res"
  format: "Descriptif + appel action + mention Tesla"
  unique: true
  engagement: "Incitatif Ã  cliquer"
  
3_H1_Principal:
  quantite: "1 seul H1 par page"
  longueur: "50-70 caractÃ¨res"
  keyword: "Obligatoire au dÃ©but"
  format: "[Keyword] : Description courte"
  
4_Structure_Headings:
  h2: "5-8 par page"
  h3: "2-4 sous chaque H2 si section >300 mots"
  h4_h5_h6: "Interdits (inutiles SEO)"
  hierarchie: "Stricte (H1 > H2 > H3)"
  
5_Wordcount:
  standard: "2000-2500 mots"
  authority: "2200-2600 mots"
  legal: "800-1500 mots"
  
6_Images:
  hero: "3 tailles WebP (800/1200/1920w)"
  content: "2-3 images lazy loading"
  alt_text: "5-20 mots descriptifs"
  poids_max: "250KB hero, 150KB content"
  style: "Paysages cinÃ©matiques SANS logos"
  
7_Internal_Links:
  standard: "8 liens internes"
  authority: "10-12 liens internes"
  density: "0.70-1.00% (standard), 0.70-1.20% (authority)"
  anchors: "3-5 mots descriptifs naturels"
  ratio: "70% luxury / 30% services"
  
8_FAQ_Section:
  quantite: "5 questions exactement"
  longueur: "60-100 mots/rÃ©ponse"
  unique: "100% contextualisÃ©es Ã  la page"
  schema: "FAQPage JSON-LD obligatoire"
  backlinks: "2-3 questions avec liens internes"
  
9_Schemas_JSON_LD:
  obligatoires:
    - "Article (contenu principal)"
    - "Service ou LocalBusiness (ECOFUNDRIVE)"
    - "FAQPage (5 questions)"
    - "BreadcrumbList (navigation)"
    - "AggregateRating (Trustindex 26 avis)"
    - "Organization (entreprise)"
  format: "JSON-LD inline <script type='application/ld+json'>"
  exception: "Seul code inline autorisÃ© (reste 100% externe)"
  
10_Technical_Standards:
  html5: "DOCTYPE + lang attribute (fr ou en)"
  mobile: "100% responsive"
  performance: "LCP <2.5s, CLS <0.1, FID <100ms"
  canonical: "URL absolue HTTPS"
  hreflang: "Bidirectionnel fr/en + x-default"
  sitemap: "Auto-gÃ©nÃ©rÃ© par Astro"
```

### Standards QualitÃ©

```yaml
Performance:
  lighthouse: "100/100"
  lcp: "<1.0s"
  fid: "<100ms"
  cls: "<0.1"
  ttfb: "<0.8s"

SEO:
  title_unique: true
  meta_unique: true
  h1_unique: true
  canonical: true
  hreflang: true
  schemas: "6 minimum"
  
Accessibilite:
  wcag_level: "AA minimum"
  alt_texts: "Obligatoires"
  aria_labels: "Si nÃ©cessaire"
  contraste: "4.5:1 minimum"
  
Securite:
  https: "Obligatoire"
  csp: "Strict (pas de 'unsafe-inline')"
  cookies: "RGPD compliant"
```

---

## ðŸ¤– GÃ‰NÃ‰RATION CONTENU (CLAUDE API) {#generation-contenu}

### Configuration API Claude

```javascript
// lib/claude.ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export async function generatePageContent(keyword, config) {
  const prompt = `
Tu es un expert SEO et rÃ©dacteur web spÃ©cialisÃ© dans le secteur VTC premium.

CONTEXTE:
- Service: ECOFUNDRIVE (VTC Tesla premium CÃ´te d'Azur)
- Page: ${keyword.keyword}
- Langue: ${keyword.language}
- CatÃ©gorie: ${keyword.category}
- Ville: ${keyword.location}
- Wordcount cible: ${keyword.wordcount || 2200} mots

DONNÃ‰ES FIXES (NE JAMAIS MODIFIER):
- SIRET: 91224469600015
- Email: 8888vtc@gmail.com
- TÃ©lÃ©phone: +33 6 16 55 28 11
- Avis: 26 avis vÃ©rifiÃ©s 5.0â˜… Trustindex
- Auteur: David Chemla, Local Guide Google Niveau 6

RÃˆGLES STRICTES:
1. Contenu 100% unique (0% duplicate)
2. Ton: Premium, professionnel, engageant
3. Style: Paragraphes courts (3-4 lignes max)
4. SEO: DensitÃ© keyword 0.70-1.00%
5. FAQ: 5 questions contextualisÃ©es (60-100 mots/rÃ©ponse)
6. Backlinks: 8-10 liens internes naturels
7. CTA: IntÃ©grer appels Ã  l'action WhatsApp contextuels

INTERDICTIONS ABSOLUES:
- âŒ Prix fixes pour Saint-Tropez (Ã©crire "Tarifs sur demande")
- âŒ Mentionner "Google Reviews ECOFUNDRIVE"
- âŒ Comparer avec Uber
- âŒ Inventer des donnÃ©es ECOFUNDRIVE
- âŒ Dates prÃ©cises Ã©vÃ©nements ECOFUNDRIVE

FORMAT DE SORTIE JSON:
{
  "title": "H1 de la page (50-70 caractÃ¨res)",
  "meta_title": "Title tag (50-60 caractÃ¨res)",
  "meta_description": "Meta description (150-160 caractÃ¨res)",
  "introduction": "Paragraphe intro (200-250 mots)",
  "sections": [
    {
      "h2": "Titre section",
      "content": "Contenu paragraphes",
      "h3": [
        {
          "title": "Sous-titre",
          "content": "Contenu"
        }
      ]
    }
  ],
  "faq": [
    {
      "question": "Question 1",
      "answer": "RÃ©ponse 60-100 mots"
    }
  ],
  "internal_links": [
    {
      "anchor": "Texte du lien",
      "url": "/fr/page-cible.html",
      "context": "Phrase complÃ¨te avec le lien"
    }
  ],
  "wordcount": 2200
}

GÃ©nÃ¨re maintenant le contenu SEO optimisÃ© pour cette page.
`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4.5-20250929",
    max_tokens: 4000,
    messages: [{
      role: "user",
      content: prompt
    }]
  });

  return JSON.parse(response.content[0].text);
}
```

### CoÃ»t EstimÃ© API Claude

```yaml
GÃ©nÃ©ration_Contenu:
  modÃ¨le: "claude-sonnet-4.5-20250929"
  tokens_entrÃ©e: "~1000 tokens/page"
  tokens_sortie: "~2500 tokens/page"
  coÃ»t_unitaire: "~$0.05/page"
  total_70_pages: "~$3.50"
  
FAQ_Generation:
  tokens_sortie: "~500 tokens/page"
  coÃ»t_unitaire: "~$0.01/page"
  total_70_pages: "~$0.70"
  
Buffer_Corrections:
  marge_erreur: "~20%"
  coÃ»t_estimÃ©: "~$1.00"
  
TOTAL_API_CLAUDE: "~$5.20"
```

---

## ðŸŽ¨ GÃ‰NÃ‰RATION IMAGES (FLUX PRO) {#generation-images}

### SpÃ©cifications Images V2.0

```yaml
Style_Requis:
  type: "Paysages cinÃ©matiques professionnels"
  ambiance: "Luxe, Ã©lÃ©gant, lumineux"
  couleurs: "Chaudes, mÃ©diterranÃ©ennes, vibrantes"
  moment: "Golden hour, lumiÃ¨re naturelle"
  composition: "Rule of thirds, profondeur de champ"
  
CONTRAINTES_ABSOLUES:
  âŒ AUCUN logo visible
  âŒ AUCUNE marque commerciale
  âŒ AUCUN texte sur l'image
  âŒ AUCUNE personne identifiable (GDPR)
  âœ… Paysages purs uniquement
  âœ… Architecture luxe sans branding
  âœ… VÃ©hicules gÃ©nÃ©riques (pas Tesla identifiable)
  
QualitÃ©:
  rÃ©solution_base: "1920x1080 minimum"
  format: "WebP progressif"
  compression: "88%"
  poids_hero: "<250KB"
  poids_content: "<150KB"
  
Tailles_Responsive:
  mobile: "800w"
  tablet: "1200w"
  desktop: "1920w"
```

### Prompts Flux Pro par CatÃ©gorie

```yaml
Hero_Beaches:
  prompt: |
    Cinematic aerial view of pristine Mediterranean beach at golden hour,
    turquoise crystal-clear water, white sand, luxury beach clubs with
    elegant parasols (no logos), palm trees, French Riviera coastline,
    professional photography, warm colors, depth of field, 8K quality,
    NO text, NO logos, NO branding, landscape orientation

Hero_Restaurants:
  prompt: |
    Elegant fine dining restaurant terrace overlooking Mediterranean sea,
    sunset golden light, sophisticated table settings, coastal view,
    French Riviera architecture, luxury ambiance, warm tones, professional
    photography, shallow depth of field, NO logos, NO people faces,
    NO text, landscape format, 8K quality

Hero_Hotels:
  prompt: |
    Luxury 5-star hotel infinity pool overlooking Mediterranean,
    sunset reflection on water, modern elegant architecture, lounge
    chairs (no branding), panoramic sea view, palm trees, warm
    golden hour light, professional architectural photography,
    NO logos, NO text, landscape 16:9, 8K quality

Hero_VTC:
  prompt: |
    Scenic coastal road French Riviera at sunset, luxury electric
    car silhouette, Mediterranean sea view, winding road through
    mountains, golden hour lighting, cinematic composition, warm
    colors, professional photography, NO license plate visible,
    NO car brand logos, landscape format, 8K quality

Hero_Golf:
  prompt: |
    Pristine golf course with Mediterranean sea view, perfectly
    manicured green, sunset golden light, coastal landscape,
    French Riviera scenery, professional golf photography,
    warm tones, depth of field, NO logos, NO text, NO people
    faces, landscape orientation, 8K quality

Hero_Vineyards:
  prompt: |
    Provence vineyard rows at golden hour, rolling hills,
    Mediterranean landscape, warm sunset light, organized vine
    rows, professional landscape photography, rich colors,
    depth of field, NO winery logos, NO text, NO people,
    landscape format 16:9, 8K quality
```

### GÃ©nÃ©ration Automatique

```javascript
// lib/imageGenerator.ts
import { FluxAPI } from '@flux/sdk'; // Exemple d'import

const flux = new FluxAPI({
  apiKey: process.env.FLUX_PRO_API_KEY
});

export async function generateHeroImage(keyword, category) {
  const prompts = {
    beaches: "Cinematic aerial view of pristine Mediterranean beach...",
    restaurants: "Elegant fine dining restaurant terrace...",
    hotels: "Luxury 5-star hotel infinity pool...",
    vtc: "Scenic coastal road French Riviera...",
    golf: "Pristine golf course with Mediterranean sea view...",
    vineyards: "Provence vineyard rows at golden hour..."
  };

  const prompt = prompts[category] || prompts.beaches;

  // GÃ©nÃ©ration image haute rÃ©solution
  const image = await flux.generate({
    prompt: prompt,
    width: 1920,
    height: 1080,
    quality: 'high',
    format: 'webp'
  });

  // Conversion 3 tailles responsive
  const sizes = await Promise.all([
    resizeImage(image, 800),  // Mobile
    resizeImage(image, 1200), // Tablet
    image // Desktop (1920w original)
  ]);

  return {
    desktop: sizes[2],
    tablet: sizes[1],
    mobile: sizes[0]
  };
}

async function resizeImage(image, targetWidth) {
  // Utiliser Sharp ou librairie similaire
  const sharp = require('sharp');
  
  return await sharp(image)
    .resize(targetWidth)
    .webp({ quality: 88 })
    .toBuffer();
}
```

### Organisation Fichiers Images

```
/public/images/
â”œâ”€â”€ hero/
â”‚   â”œâ”€â”€ authority/
â”‚   â”‚   â”œâ”€â”€ vtc-monaco-1920w.webp
â”‚   â”‚   â”œâ”€â”€ vtc-monaco-1200w.webp
â”‚   â”‚   â”œâ”€â”€ vtc-monaco-800w.webp
â”‚   â”‚   â””â”€â”€ ... (25-30 pages authority)
â”‚   â””â”€â”€ shared/
â”‚       â”œâ”€â”€ beaches-generic-1920w.webp
â”‚       â”œâ”€â”€ restaurants-generic-1920w.webp
â”‚       â””â”€â”€ ... (groupes par catÃ©gorie)
â”‚
â””â”€â”€ content/
    â”œâ”€â”€ beaches/
    â”‚   â”œâ”€â”€ beach-sunset-1.webp
    â”‚   â”œâ”€â”€ beach-parasols-1.webp
    â”‚   â””â”€â”€ ... (8 images rÃ©utilisables)
    â”œâ”€â”€ restaurants/
    â”‚   â””â”€â”€ ... (8 images)
    â”œâ”€â”€ hotels/
    â”‚   â””â”€â”€ ... (6 images)
    â””â”€â”€ ... (autres catÃ©gories)
```

---

## âš™ï¸ WORKFLOW DE PRODUCTION {#workflow}

### Processus 5 Ã‰tapes (20 min/page)

```yaml
Etape_1_Recherche:
  durÃ©e: "5 minutes"
  actions:
    - "5+ recherches web (facts, horaires, coordonnÃ©es)"
    - "VÃ©rification Google Maps (adresse, avis, photos)"
    - "Consultation TripAdvisor/Yelp si pertinent"
  output: "Notes structurÃ©es 200-300 mots"
  outils:
    - web_search
    - google_maps
  
Etape_2_Generation_Contenu:
  durÃ©e: "8 minutes"
  actions:
    - "Appel API Claude (Sonnet 4.5)"
    - "Prompt contextualisÃ© avec keyword + facts"
    - "Parsing rÃ©ponse JSON structurÃ©"
    - "Validation wordcount (2000-2500 mots)"
  output: "Contenu HTML structurÃ© + FAQ 5Q"
  api: "Claude Anthropic"
  
Etape_3_Generation_Images:
  durÃ©e: "3 minutes"
  actions:
    - "GÃ©nÃ©ration hero image (Flux Pro)"
    - "Conversion 3 tailles WebP (800/1200/1920w)"
    - "SÃ©lection 2-3 content images (banque ou gÃ©nÃ©ration)"
    - "Validation alt texts descriptifs"
  output: "4-6 fichiers WebP optimisÃ©s"
  api: "Flux Pro"
  
Etape_4_Compilation_HTML:
  durÃ©e: "2 minutes"
  actions:
    - "Astro build automatique"
    - "Injection contenu dans layout"
    - "GÃ©nÃ©ration 6 schemas JSON-LD"
    - "Optimisation images (lazy loading, srcset)"
  output: "HTML statique optimisÃ©"
  framework: "Astro 4.x"
  
Etape_5_Validation:
  durÃ©e: "2 minutes"
  actions:
    - "10 checks qualitÃ© essentiels"
    - "Lighthouse test (doit Ãªtre 100/100)"
    - "Preview local"
    - "Validation liens internes"
  output: "Page validÃ©e ou corrections"
  outils:
    - lighthouse
    - html_validator

Total_Temps: "20 minutes/page"
Timeline_70_Pages: "23 heures = 3 jours ouvrÃ©s"
```

### 10 Checks QualitÃ© (Validation SimplifiÃ©e)

```yaml
Checks_Obligatoires:
  1: "âœ… HTML5 valide (DOCTYPE + lang attribute)"
  2: "âœ… Meta title unique <60 caractÃ¨res"
  3: "âœ… Meta description unique <160 caractÃ¨res"
  4: "âœ… H1 unique avec keyword au dÃ©but"
  5: "âœ… Wordcount 2000-2500 mots"
  6: "âœ… FAQ 5 questions uniques"
  7: "âœ… 8-10 liens internes contextuels"
  8: "âœ… Images WebP optimisÃ©es + alt texts"
  9: "âœ… 6 schemas JSON-LD (Article, Service, FAQ, Breadcrumb, Rating, Organization)"
  10: "âœ… Mobile responsive + Lighthouse 100/100"

Decision_Automatique:
  validation: "âœ… 10/10 checks = VALID â†’ Livrer"
  warning: "âš ï¸ 8-9/10 checks = WARNING â†’ Corriger mineurs puis livrer"
  invalid: "âŒ <8/10 checks = INVALID â†’ RegÃ©nÃ©rer complÃ¨tement"

Auto_Validation: true
Manual_Review: false
```

---

## ðŸ—‚ï¸ STRUCTURE PROJET ASTRO {#structure-projet}

### Architecture Fichiers ComplÃ¨te

```
ecofundrive-v2/
â”‚
â”œâ”€â”€ ðŸ“š src/
â”‚   â”œâ”€â”€ pages/
â”‚   â”‚   â””â”€â”€ [lang]/
â”‚   â”‚       â””â”€â”€ [slug].astro          # Routes dynamiques
â”‚   â”‚
â”‚   â”œâ”€â”€ content/
â”‚   â”‚   â”œâ”€â”€ config.ts                 # Schema validation TypeScript
â”‚   â”‚   â””â”€â”€ keywords/
â”‚   â”‚       â””â”€â”€ keywords-70.json      # 70 pages sÃ©lectionnÃ©es
â”‚   â”‚
â”‚   â”œâ”€â”€ layouts/
â”‚   â”‚   â””â”€â”€ PageLayout.astro          # Layout principal rÃ©utilisable
â”‚   â”‚
â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”œâ”€â”€ Header.astro              # Navigation sticky
â”‚   â”‚   â”œâ”€â”€ Footer.astro              # Footer 3 colonnes
â”‚   â”‚   â”œâ”€â”€ Hero.astro                # Hero section responsive
â”‚   â”‚   â”œâ”€â”€ ContentSection.astro      # Section contenu
â”‚   â”‚   â”œâ”€â”€ FAQ.astro                 # Section FAQ + schema
â”‚   â”‚   â”œâ”€â”€ CTA.astro                 # Bouton WhatsApp
â”‚   â”‚   â”œâ”€â”€ Breadcrumb.astro          # Fil d'Ariane
â”‚   â”‚   â””â”€â”€ Schemas.astro             # JSON-LD schemas
â”‚   â”‚
â”‚   â”œâ”€â”€ lib/
â”‚   â”‚   â”œâ”€â”€ config.ts                 # Config ECOFUNDRIVE
â”‚   â”‚   â”œâ”€â”€ claude.ts                 # API Claude integration
â”‚   â”‚   â”œâ”€â”€ fluxpro.ts                # API Flux Pro integration
â”‚   â”‚   â”œâ”€â”€ seo.ts                    # Fonctions SEO helpers
â”‚   â”‚   â”œâ”€â”€ images.ts                 # Image management
â”‚   â”‚   â””â”€â”€ validators.ts             # Validation functions
â”‚   â”‚
â”‚   â””â”€â”€ styles/
â”‚       â””â”€â”€ global.css                # CSS unifiÃ© externe
â”‚
â”œâ”€â”€ ðŸŽ¨ public/
â”‚   â”œâ”€â”€ css/
â”‚   â”‚   â””â”€â”€ style.css                 # CSS externe
â”‚   â”œâ”€â”€ js/
â”‚   â”‚   â”œâ”€â”€ main.js                   # Fonctions gÃ©nÃ©rales
â”‚   â”‚   â”œâ”€â”€ cookies.js                # RGPD compliance
â”‚   â”‚   â”œâ”€â”€ tracking.js               # GTM + analytics
â”‚   â”‚   â””â”€â”€ trustindex.js             # Widget avis
â”‚   â””â”€â”€ images/
â”‚       â”œâ”€â”€ hero/
â”‚       â”‚   â”œâ”€â”€ authority/            # Images uniques authority
â”‚       â”‚   â””â”€â”€ shared/               # Images partagÃ©es standard
â”‚       â”œâ”€â”€ content/                  # Images contenu
â”‚       â””â”€â”€ fleet/                    # Images flotte Tesla
â”‚
â”œâ”€â”€ âš™ï¸ Configuration
â”‚   â”œâ”€â”€ astro.config.mjs              # Config Astro
â”‚   â”œâ”€â”€ tsconfig.json                 # Config TypeScript
â”‚   â”œâ”€â”€ package.json                  # Dependencies
â”‚   â””â”€â”€ .env                          # API keys (SECRET)
â”‚
â””â”€â”€ ðŸ“– docs/
    â”œâ”€â”€ 00-README.md                  # Vue d'ensemble
    â”œâ”€â”€ 01-CONFIG.md                  # DonnÃ©es ECOFUNDRIVE
    â”œâ”€â”€ 02-KEYWORDS-70.md             # Liste pages
    â”œâ”€â”€ 03-SEO-RULES.md               # 10 rÃ¨gles SEO
    â”œâ”€â”€ 04-IMAGES.md                  # Guide images
    â””â”€â”€ 05-DEPLOY.md                  # DÃ©ploiement
```

### Configuration Astro

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

export default defineConfig({
  output: 'static',
  adapter: netlify(),
  site: 'https://ecofundrive.com',
  
  build: {
    inlineStylesheets: 'never', // Toujours CSS externe
    format: 'file'
  },
  
  vite: {
    build: {
      cssCodeSplit: false // CSS unifiÃ©
    }
  },
  
  integrations: [],
  
  // SEO automatique
  sitemap: true,
  
  // Compression
  compressHTML: true
});
```

### Keywords JSON Structure

```json
{
  "keywords": [
    {
      "id": 1,
      "keyword": "vtc-monaco",
      "url": "/fr/vtc-monaco.html",
      "language": "fr",
      "category": "vtc",
      "location": "monaco",
      "authority": true,
      "mode": "B",
      "meta_title": "VTC Monaco | Chauffeur PrivÃ© Tesla Premium",
      "meta_description": "Service VTC Monaco avec Tesla. Chauffeur privÃ© bilingue, tarifs transparents. RÃ©servation 24/7.",
      "h1": "VTC Monaco : Votre Chauffeur PrivÃ© Tesla",
      "wordcount": 2200,
      "images": {
        "hero_style": "Monaco cityscape sunset luxury",
        "content_topics": ["Monaco casino", "Port Hercule", "Tesla interior"]
      }
    }
  ]
}
```

---

## âœ… VALIDATION & DÃ‰PLOIEMENT {#validation}

### Tests PrÃ©-DÃ©ploiement

```yaml
Tests_Performance:
  lighthouse:
    score_requis: "100/100"
    lcp: "<1.0s"
    fid: "<100ms"
    cls: "<0.1"
  
  pagespeed_insights:
    mobile: ">90"
    desktop: ">95"

Tests_SEO:
  title_unicity: "100% unique (70/70)"
  meta_unicity: "100% unique (70/70)"
  h1_unicity: "100% unique (70/70)"
  schemas_valid: "420 schemas valides (6Ã—70)"
  sitemap_generated: true
  robots_txt: true

Tests_Accessibilite:
  wcag_aa: "Conforme"
  alt_texts: "100% prÃ©sents"
  contraste: "4.5:1 minimum"
  keyboard_navigation: true

Tests_Securite:
  https_only: true
  csp_strict: true
  no_inline_code: true
  headers_security: true
```

### Processus DÃ©ploiement

```bash
# 1. Build production
npm run build
# â†’ Output: dist/ (70 pages HTML statiques)
# â†’ Temps: 2-3 minutes
# â†’ Taille: ~15MB total

# 2. Preview local
npm run preview
# â†’ http://localhost:4321
# â†’ Test complet fonctionnalitÃ©s

# 3. Deploy Netlify (automatique)
git push origin main
# â†’ Netlify dÃ©tecte push
# â†’ Build automatique
# â†’ Deploy sur CDN global
# â†’ SSL auto-configurÃ©
# â†’ Temps total: ~5 minutes

# 4. VÃ©rification post-deploy
curl -I https://ecofundrive.com
# â†’ Status: 200 OK
# â†’ Content-Type: text/html
# â†’ Cache-Control configurÃ©

# 5. Test Ã©chantillon pages
for page in vtc-monaco nice-cannes club-55; do
  lighthouse https://ecofundrive.com/fr/$page.html
done
```

---

## ðŸ“‹ CHECKLIST COMPLÃˆTE {#checklist}

### Phase 1 : Setup Projet (Jour 1 - 4h)

```
â˜ CrÃ©er projet Astro (npm create astro@latest)
â˜ Installer dÃ©pendances (@anthropic-ai/sdk, @flux/sdk)
â˜ Configurer .env (ANTHROPIC_API_KEY, FLUX_PRO_API_KEY)
â˜ CrÃ©er structure dossiers (src, public, docs)
â˜ Copier fichiers externes (CSS, JS)
â˜ CrÃ©er keywords-70.json
â˜ Configurer astro.config.mjs
â˜ Tester build 1 page tÃ©moin
â˜ Valider Lighthouse >95
```

### Phase 2 : Configuration (Jour 1-2 - 4h)

```
â˜ CrÃ©er 01-CONFIG.md (donnÃ©es ECOFUNDRIVE)
â˜ CrÃ©er 02-KEYWORDS-70.md (liste pages)
â˜ CrÃ©er 03-SEO-RULES.md (10 rÃ¨gles)
â˜ CrÃ©er Content Collections schema (config.ts)
â˜ CrÃ©er PageLayout.astro (layout principal)
â˜ CrÃ©er composants (Header, Footer, Hero, FAQ, CTA, Schemas)
â˜ Tester build 5 pages
â˜ Valider structure HTML
```

### Phase 3 : Images (Jour 2-3 - 6h)

```
â˜ Configurer API Flux Pro
â˜ Tester gÃ©nÃ©ration 5 hero images
â˜ Valider style (paysages SANS logos)
â˜ CrÃ©er script conversion 3 tailles (800/1200/1920w)
â˜ GÃ©nÃ©rer 30 hero images authority
â˜ GÃ©nÃ©rer 40 hero images standard (groupes)
â˜ Sourcer/gÃ©nÃ©rer 40 content images banque
â˜ Optimiser WebP 88%
â˜ CrÃ©er alt texts (5-20 mots)
â˜ Organiser /public/images/
â˜ Tester responsive srcset
â˜ Valider LCP <1.0s
```

### Phase 4 : GÃ©nÃ©ration Contenu (Jour 3-5 - 23h)

```
â˜ Configurer API Claude
â˜ Tester gÃ©nÃ©ration 5 pages
â˜ Valider wordcount 2000-2500
â˜ Valider FAQ uniques
â˜ Valider liens internes
â˜ GÃ©nÃ©rer batch 1 (15 pages) - 5h
â˜ GÃ©nÃ©rer batch 2 (15 pages) - 5h
â˜ GÃ©nÃ©rer batch 3 (15 pages) - 5h
â˜ GÃ©nÃ©rer batch 4 (15 pages) - 5h
â˜ GÃ©nÃ©rer batch 5 (10 pages) - 3h
â˜ Valider 10 checks par page
â˜ Corriger si nÃ©cessaire
â˜ Test Ã©chantillon Lighthouse
```

### Phase 5 : Validation (Jour 5 - 2h)

```
â˜ Build production complet (npm run build)
â˜ Test preview local (npm run preview)
â˜ Lighthouse test 10 pages Ã©chantillon
â˜ Validation HTML W3C (5 pages)
â˜ Test mobile responsive (5 pages)
â˜ VÃ©rification schemas JSON-LD (validator.schema.org)
â˜ Test navigation complÃ¨te
â˜ VÃ©rification liens internes (pas de 404)
â˜ Test cookies banner
â˜ Test tracking WhatsApp
â˜ Test Trustindex widget
```

### Phase 6 : DÃ©ploiement (Jour 5 - 1h)

```
â˜ Push Git repository
â˜ Connecter Netlify
â˜ Configurer domaine ecofundrive.com
â˜ Activer SSL automatique
â˜ Premier deploy
â˜ Tester URLs production (10 pages)
â˜ Google Search Console setup
â˜ Soumettre sitemap.xml
â˜ Google Tag Manager vÃ©rification
â˜ Trustindex widget vÃ©rification
```

### Phase 7 : Monitoring (Semaine 1-2)

```
â˜ Lighthouse 70 pages (Ã©chantillon quotidien 10)
â˜ Google Search Console monitoring
â˜ Core Web Vitals check
â˜ Analytics trafic
â˜ Conversions WhatsApp tracking
â˜ Corrections mineures si nÃ©cessaire
â˜ Attendre indexation Google (7-14 jours)
â˜ Analyser premiÃ¨res positions
â˜ Rapport hebdomadaire
```

---

## ðŸ’° BUDGET ESTIMÃ‰

```yaml
CoÃ»ts_DÃ©veloppement:
  api_claude:
    generation_contenu: "$3.50"
    generation_faq: "$0.70"
    corrections: "$1.00"
    total: "$5.20"
  
  api_flux_pro:
    hero_authority_30: "$XX.XX"  # Selon tarifs Flux Pro
    hero_shared_40: "$XX.XX"
    content_images_40: "$XX.XX"
    total: "$XX.XX"  # Ã€ estimer selon API

CoÃ»ts_HÃ©bergement:
  netlify:
    plan: "Gratuit"
    bande_passante: "100GB/mois"
    builds: "300 min/mois"
    total: "$0.00"
  
  domaine:
    ecofundrive_com: "$15/an"
    renouvellement: "Annuel"
    total: "$15.00"

TOTAL_PROJET: "$20.20 + Images Flux Pro"

Maintenance_Mensuelle:
  regeneration_pages: "$0.25"
  nouvelles_pages: "$0.50"
  total: "<$1.00/mois"
```

---

## ðŸŽ¯ RÃ‰SUMÃ‰ EXÃ‰CUTIF

### Points ClÃ©s V2.0

```
âœ… ARCHITECTURE OPTIMALE
â”œâ”€ Astro 4.x (SSG ultra-rapide)
â”œâ”€ Build 70 pages: 2-3 min (vs 35+ min Next.js)
â”œâ”€ Lighthouse 100/100 garanti
â”œâ”€ Performance: LCP <1.0s
â””â”€ Maintenance: Simple et scalable

âœ… GÃ‰NÃ‰RATION AUTOMATISÃ‰E
â”œâ”€ Contenu: Claude API (Sonnet 4.5)
â”œâ”€ Images: Flux Pro (paysages sans logos)
â”œâ”€ Validation: 10 checks automatiques
â””â”€ Timeline: 5 jours (vs 2.5 mois ancien)

âœ… QUALITÃ‰ PREMIUM
â”œâ”€ Contenu: 2000-2500 mots uniques
â”œâ”€ SEO: DensitÃ© 0.70-1.00%
â”œâ”€ Images: CinÃ©matiques professionnelles
â”œâ”€ Performance: 100/100 Lighthouse
â””â”€ Budget: ~$20 + Flux Pro

âœ… DONNÃ‰ES CONSERVÃ‰ES
â”œâ”€ SIRET, contacts, tarifs, flotte
â”œâ”€ RÃ¨gles SEO (10 essentielles)
â”œâ”€ Charte graphique complÃ¨te
â”œâ”€ Scripts externes (JS/CSS)
â””â”€ Standards qualitÃ© stricts
```

### Prochaines Ã‰tapes ImmÃ©diates

```
1. âœ… Valider ce document master
2. ðŸ“¦ Setup projet Astro (15 min)
3. ðŸ”‘ Configurer API keys (5 min)
4. ðŸŽ¨ Tester gÃ©nÃ©ration images Flux Pro (30 min)
5. ðŸ¤– Tester gÃ©nÃ©ration contenu Claude (30 min)
6. ðŸš€ GÃ©nÃ©rer 5 pages test complÃ¨tes (2h)
7. âœ… Valider qualitÃ© (30 min)
8. ðŸŽ¯ Lancer production 70 pages (3 jours)
9. ðŸŒ Deploy Netlify (30 min)
10. ðŸ“Š Monitoring & optimisation (ongoing)
```

---

## ðŸ“ž SUPPORT & RÃ‰FÃ‰RENCES

### Documentation Technique

- **Astro:** https://docs.astro.build
- **Claude API:** https://docs.anthropic.com
- **Flux Pro:** [Documentation API Flux Pro]
- **Netlify:** https://docs.netlify.com

### Fichiers de RÃ©fÃ©rence

- **01-CORE-CONFIG.md** : DonnÃ©es fixes ECOFUNDRIVE (SIRET, contacts, tarifs)
- **ECOFUNDRIVE-V2-MASTER-BRIEFING.md** : Document de refonte V2.0
- **NEXTJS-ARCHITECTURE-V2-COMPLETE.md** : Ancien systÃ¨me (rÃ©fÃ©rence)

### Validation & Tests

- **Lighthouse:** https://pagespeed.web.dev
- **Schema Validator:** https://validator.schema.org
- **HTML Validator:** https://validator.w3.org
- **Mobile Test:** https://search.google.com/test/mobile-friendly

---

**Version:** 2.0.0 MASTER PRODUCTION-READY  
**Date:** 2 Novembre 2025  
**Status:** âœ… PRÃŠT Ã€ DÃ‰MARRER  
**Objectif:** 70 pages SEO premium en 5 jours  

ðŸš€ **LET'S BUILD ECOFUNDRIVE V2!**
