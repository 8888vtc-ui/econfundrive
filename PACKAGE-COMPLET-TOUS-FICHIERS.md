# ðŸ“¦ PACK AGE COMPLET ECOFUNDRIVE V2.0 - TOUS LES FICHIERS

**Version:** 2.0-PRODUCTION  
**Date:** 2 Novembre 2025  
**Utilisation:** Copier chaque section dans le fichier correspondant de votre projet Astro

---

## ðŸ“‹ TABLE DES MATIÃˆRES

1. [Installation Rapide](#installation)
2. [Fichiers JavaScript (4)](#javascript)
3. [Fichier CSS (1)](#css)
4. [Fichiers TypeScript (3)](#typescript)
5. [Fichiers Config (4)](#config)
6. [Documentation (3)](#documentation)

---

## ðŸš€ INSTALLATION RAPIDE {#installation}

### Ã‰tape 1 : CrÃ©er projet Astro

```bash
npm create astro@latest ecofundrive-v2
cd ecofundrive-v2
```

### Ã‰tape 2 : CrÃ©er structure

```bash
mkdir -p public/{css,js} src/{lib,content/keywords} docs
```

### Ã‰tape 3 : Copier les fichiers

Suivre les sections ci-dessous pour crÃ©er chaque fichier.

---

## ðŸ“œ FICHIERS JAVASCRIPT {#javascript}

### 1. `/public/js/main.js`

```javascript
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// ECOFUNDRIVE V2.0 - MAIN.JS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

/**
 * Mobile Navigation Toggle
 */
function toggleMobileMenu() {
    const nav = document.querySelector('.nav-mobile');
    if (nav) {
        nav.classList.toggle('active');
    }
}

/**
 * Smooth Scroll to Anchors
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/**
 * Cookie Banner Display
 */
document.addEventListener('DOMContentLoaded', function() {
    const cookieBanner = document.getElementById('cookie-banner');
    const consent = localStorage.getItem('cookieConsent');
    
    if (!consent && cookieBanner) {
        cookieBanner.style.display = 'block';
    }
});

/**
 * External Links Security
 */
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="http"]');
    links.forEach(link => {
        if (!link.hostname.includes('ecofundrive.com')) {
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
});
```

---

### 2. `/public/js/cookies.js`

```javascript
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// ECOFUNDRIVE V2.0 - COOKIES.JS (RGPD Compliance)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
    return null;
}

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
}

function acceptCookies() {
    setCookie('consent', 'accepted', 365);
    setCookie('analytics', 'true', 365);
    
    const banner = document.getElementById('cookie-banner');
    if (banner) {
        banner.style.display = 'none';
    }
    
    if (typeof initGTM === 'function') {
        initGTM();
    }
}

function refuseCookies() {
    setCookie('consent', 'refused', 365);
    setCookie('analytics', 'false', 365);
    
    const banner = document.getElementById('cookie-banner');
    if (banner) {
        banner.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const consent = getCookie('consent');
    const banner = document.getElementById('cookie-banner');
    
    if (!consent && banner) {
        banner.style.display = 'block';
    } else if (consent === 'accepted' && typeof initGTM === 'function') {
        initGTM();
    }
});

// Global exposure
window.getCookie = getCookie;
window.acceptCookies = acceptCookies;
window.refuseCookies = refuseCookies;
```

---

### 3. `/public/js/tracking.js`

```javascript
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// ECOFUNDRIVE V2.0 - TRACKING.JS (Google Tag Manager)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

/**
 * Initialize Google Tag Manager
 * Only if user accepted analytics cookies
 */
function initGTM() {
    if (getCookie('analytics') === 'true') {
        (function(w,d,s,l,i){
            w[l]=w[l]||[];
            w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
            const f=d.getElementsByTagName(s)[0];
            const j=d.createElement(s);
            const dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;
            j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-NMMBXS4T');
        
        console.log('âœ… Google Tag Manager initialized');
    }
}

/**
 * Track WhatsApp Click
 * @param {string} location - Where CTA was clicked (hero, mid, end)
 */
function trackWhatsAppClick(location) {
    if (typeof window.dataLayer !== 'undefined') {
        window.dataLayer.push({
            'event': 'whatsapp_click',
            'location': location,
            'page': window.location.pathname
        });
        
        console.log(`ðŸ“Š WhatsApp click tracked: ${location}`);
    }
}

// Auto-init if consent already given
document.addEventListener('DOMContentLoaded', function() {
    if (getCookie('analytics') === 'true') {
        initGTM();
    }
});

// Global exposure
window.initGTM = initGTM;
window.trackWhatsAppClick = trackWhatsAppClick;
```

---

### 4. `/public/js/trustindex.js`

```javascript
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// ECOFUNDRIVE V2.0 - TRUSTINDEX.JS (Reviews Widget)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

/**
 * Lazy Load Trustindex Widget
 * Loads after 1 second to improve initial page load
 */
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        const script = document.createElement('script');
        script.src = 'https://cdn.trustindex.io/loader.js?6e6475e260715241c236fb004f3';
        script.async = true;
        script.defer = true;
        
        script.onload = function() {
            console.log('âœ… Trustindex widget loaded');
        };
        
        script.onerror = function() {
            console.warn('âš ï¸ Trustindex widget failed to load');
        };
        
        document.body.appendChild(script);
    }, 1000); // Wait 1 second before loading
});
```

---

## ðŸŽ¨ FICHIER CSS {#css}

### `/public/css/style.css`

**Note:** Le CSS complet fait >1000 lignes. Voici la structure essentielle. **Copiez le fichier `style-v45-hybrid.css` du projet existant** vers `/public/css/style.css`.

Si vous n'avez pas accÃ¨s au fichier, voici la structure minimale pour dÃ©marrer :

```css
/* ECOFUNDRIVE V2.0 - CSS MINIMAL */

:root {
  --primary: #1a1a1a;
  --accent: #0066ff;
  --whatsapp: #25D366;
  --font-heading: 'Montserrat', sans-serif;
  --font-body: 'Open Sans', sans-serif;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-body);
  line-height: 1.7;
  color: var(--primary);
}

/* Header */
header {
  position: sticky;
  top: 0;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 1000;
  padding: 1rem 2rem;
}

/* Hero */
.hero {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: linear-gradient(135deg, rgba(26,26,26,0.7), rgba(0,102,255,0.2));
}

.hero h1 {
  color: white;
  font-size: clamp(2.5rem, 5vw, 4rem);
  text-shadow: 2px 2px 8px rgba(0,0,0,0.5);
}

/* CTA WhatsApp */
.cta-whatsapp {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--whatsapp);
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: transform 0.3s ease;
}

.cta-whatsapp:hover {
  transform: scale(1.05);
}

/* Responsive */
@media (max-width: 768px) {
  .hero h1 {
    font-size: 2.5rem;
  }
}
```

**âš ï¸ IMPORTANT:** Pour le CSS complet production-ready, copiez `style-v45-hybrid.css` du projet existant.

---

## ðŸ“˜ FICHIERS TYPESCRIPT {#typescript}

### 1. `/src/lib/config.ts`

```typescript
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// ECOFUNDRIVE V2.0 - CONFIG.TS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

export const siteConfig = {
  // Entreprise
  company: {
    name: 'ECOFUNDRIVE',
    siret: '91224469600015',
    siren: '912244696',
    legalForm: 'Entreprise individuelle',
    activity: 'VTC premium Tesla Ã©lectrique'
  },
  
  // SiÃ¨ge social
  headquarters: {
    address: '1001 Avenue de la Batterie',
    postalCode: '06270',
    city: 'Villeneuve-Loubet',
    department: 'Alpes-Maritimes (06)',
    region: 'Provence-Alpes-CÃ´te d\'Azur',
    country: 'France'
  },
  
  // Contacts
  contact: {
    email: '8888vtc@gmail.com',
    phone: '+33 6 16 55 28 11',
    whatsapp: 'https://wa.me/33616552811'
  },
  
  // Tracking
  tracking: {
    gtm: 'GTM-NMMBXS4T',
    trustindexWidget: '6e6475e260715241c236fb004f3'
  },
  
  // Auteur
  author: {
    name: 'David Chemla',
    title: 'Local Guide Google Niveau 6',
    specialty: 'Expert CÃ´te d\'Azur depuis 15 ans',
    profileUrl: 'https://maps.app.goo.gl/qPAanSvPmAxxmhZZA'
  },
  
  // Avis
  reviews: {
    platform: 'Trustindex',
    rating: '5.0',
    total: 26,
    displayText: '26 avis vÃ©rifiÃ©s 5.0â˜… - ECOFUNDRIVE'
  },
  
  // Flotte
  fleet: [
    {
      model: 'Tesla Model 3',
      capacity: '5 passagers',
      luggage: '2 grandes valises',
      trunk: '425L',
      hourlyRate: '70â‚¬/h'
    },
    {
      model: 'Tesla Model S',
      capacity: '5 passagers',
      luggage: '3 grandes valises',
      trunk: '804L',
      hourlyRate: '100â‚¬/h'
    },
    {
      model: 'Tesla Model X',
      capacity: '6 passagers',
      luggage: '4+ valises',
      trunk: '2180L',
      hourlyRate: '120â‚¬/h',
      feature: 'Portes Falcon Wing'
    },
    {
      model: 'Van Ã©lectrique',
      capacity: '8 passagers',
      luggage: '6+ valises',
      hourlyRate: '120â‚¬/h'
    }
  ],
  
  // Tarifs standards
  pricing: {
    niceMonaco: {
      distance: '22 km',
      duration: '25 minutes',
      model3: '80â‚¬',
      modelS: '96â‚¬',
      modelX: '104â‚¬',
      van: '112â‚¬'
    },
    niceCannes: {
      distance: '27 km',
      duration: '30 minutes',
      model3: '100â‚¬',
      modelS: '120â‚¬',
      modelX: '130â‚¬',
      van: '140â‚¬'
    },
    hourly: {
      minimum: '3 heures',
      model3: '70â‚¬/h',
      modelS: '100â‚¬/h',
      modelX: '120â‚¬/h',
      van: '120â‚¬/h'
    }
  },
  
  // Inclusions
  inclusions: [
    'Chauffeur professionnel bilingue (franÃ§ais/anglais)',
    'Suivi vol temps rÃ©el (aÃ©roport Nice)',
    'Eau fraÃ®che + chargeurs USB offerts',
    'WiFi gratuit embarquÃ©',
    '15 minutes d\'attente gratuites',
    'Assurance tous risques incluse',
    'Parking + pÃ©ages inclus',
    'SiÃ¨ges enfants disponibles sur demande',
    'Assistance 24/7'
  ]
};
```

---

### 2. `/src/lib/claude.ts`

```typescript
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// ECOFUNDRIVE V2.0 - CLAUDE.TS (API Integration)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

import Anthropic from '@anthropic-ai/sdk';
import { siteConfig } from './config';

const anthropic = new Anthropic({
  apiKey: import.meta.env.ANTHROPIC_API_KEY
});

interface Keyword {
  id: number;
  keyword: string;
  language: string;
  category: string;
  location: string;
  authority: boolean;
  mode: string;
  wordcount?: number;
}

export async function generatePageContent(keyword: Keyword) {
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
- SIRET: ${siteConfig.company.siret}
- Email: ${siteConfig.contact.email}
- TÃ©lÃ©phone: ${siteConfig.contact.phone}
- Avis: ${siteConfig.reviews.displayText}
- Auteur: ${siteConfig.author.name}, ${siteConfig.author.title}

RÃˆGLES STRICTES:
1. Contenu 100% unique (0% duplicate)
2. Ton: Premium, professionnel, engageant
3. Style: Paragraphes courts (3-4 lignes max)
4. SEO: DensitÃ© keyword 0.70-1.00%
5. FAQ: 5 questions contextualisÃ©es (60-100 mots/rÃ©ponse)
6. Backlinks: ${keyword.authority ? '10-12' : '8'} liens internes naturels
7. CTA: ${keyword.mode === 'A' ? '1 CTA end-article' : '3 CTAs (top/mid/end)'}

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

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4.5-20250929",
      max_tokens: 4000,
      messages: [{
        role: "user",
        content: prompt
      }]
    });

    const content = JSON.parse(response.content[0].text);
    return content;
    
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
}
```

---

### 3. `/src/lib/fluxpro.ts`

```typescript
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// ECOFUNDRIVE V2.0 - FLUXPRO.TS (Image Generation)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

// NOTE: Adapter selon l'API rÃ©elle de Flux Pro
// Ceci est un template Ã  ajuster

interface ImageOptions {
  prompt: string;
  width: number;
  height: number;
  quality: 'high' | 'medium';
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
    
  vtc: `Scenic coastal road French Riviera at sunset, luxury electric car silhouette, 
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

export async function generateHeroImage(category: string, keyword: string) {
  const prompt = PROMPTS_BY_CATEGORY[category] || PROMPTS_BY_CATEGORY.beaches;
  
  // TODO: ImplÃ©menter l'appel API Flux Pro rÃ©el
  // Exemple de structure:
  
  try {
    /*
    const response = await fetch('https://api.flux-pro.com/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.FLUX_PRO_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        width: 1920,
        height: 1080,
        quality: 'high',
        format: 'webp'
      })
    });
    
    const image = await response.blob();
    */
    
    // Pour l'instant, retourner un placeholder
    console.log(`ðŸŽ¨ Generating image for: ${keyword} (${category})`);
    console.log(`ðŸ“ Prompt: ${prompt.substring(0, 100)}...`);
    
    return {
      success: true,
      message: 'Image generation placeholder - implement Flux Pro API'
    };
    
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}

export async function resizeImage(image: Blob, targetWidth: number) {
  // Utiliser Sharp ou librairie similaire
  // TODO: ImplÃ©menter redimensionnement 800/1200/1920w
  
  console.log(`ðŸ“ Resizing image to ${targetWidth}w`);
  
  return {
    success: true,
    message: 'Resize placeholder - implement Sharp'
  };
}
```

---

## âš™ï¸ FICHIERS CONFIG {#config}

### 1. `/astro.config.mjs`

```javascript
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
  }
});
```

---

### 2. `/package.json`

```json
{
  "name": "ecofundrive-v2",
  "version": "2.0.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.30.0",
    "astro": "^4.0.0"
  },
  "devDependencies": {
    "@astrojs/netlify": "^5.0.0",
    "typescript": "^5.0.0"
  }
}
```

---

### 3. `/tsconfig.json`

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

---

### 4. `/.env.example`

```env
# API Keys (RENOMMER EN .env ET COMPLÃ‰TER)
ANTHROPIC_API_KEY=votre-cle-claude-ici
FLUX_PRO_API_KEY=votre-cle-flux-ici

# Site Config
SITE_URL=https://ecofundrive.com
```

---

## ðŸ“š DOCUMENTATION {#documentation}

### 1. `/docs/01-DONNEES-ECOFUNDRIVE.md`

```markdown
# DONNÃ‰ES ECOFUNDRIVE - RÃ‰FÃ‰RENCE RAPIDE

## Entreprise
- SIRET: 91224469600015
- Email: 8888vtc@gmail.com  
- TÃ©lÃ©phone: +33 6 16 55 28 11

## Avis
- Trustindex: 26 avis 5.0â˜…
- Widget ID: 6e6475e260715241c236fb004f3

## Tracking
- GTM: GTM-NMMBXS4T

## Auteur
- Nom: David Chemla
- Titre: Local Guide Google Niveau 6
- URL: https://maps.app.goo.gl/qPAanSvPmAxxmhZZA

## Tarifs Standards
- Nice-Monaco (22km): Model 3: 80â‚¬ | Model S: 96â‚¬
- Nice-Cannes (27km): Model 3: 100â‚¬ | Model S: 120â‚¬
- Horaire (min 3h): Model 3: 70â‚¬/h | Model S: 100â‚¬/h

## Interdictions
- âŒ Prix fixes Saint-Tropez
- âŒ Mentionner "Google Reviews ECOFUNDRIVE"
- âŒ Comparer avec Uber
```

---

### 2. `/docs/02-GUIDE-IMAGES-FLUX.md`

```markdown
# GUIDE GÃ‰NÃ‰RATION IMAGES FLUX PRO

## Contraintes ABSOLUES
- âŒ AUCUN logo visible
- âŒ AUCUNE marque commerciale
- âŒ AUCUN texte sur l'image
- âœ… Paysages purs uniquement

## Prompts par CatÃ©gorie

Voir fichier `src/lib/fluxpro.ts` pour les prompts complets.

## Tailles Requises
- Mobile: 800w
- Tablet: 1200w
- Desktop: 1920w

## Format
- WebP progressif 88%
- Poids: <250KB hero, <150KB content
```

---

### 3. `/docs/03-REGLES-SEO.md`

```markdown
# 10 RÃˆGLES SEO ESSENTIELLES

1. **Title:** 50-60 caractÃ¨res, keyword au dÃ©but
2. **Meta Description:** 150-160 caractÃ¨res unique
3. **H1:** Unique, keyword au dÃ©but
4. **Structure:** H2 (5-8), H3 (2-4 par H2)
5. **Wordcount:** 2000-2500 mots (standard), 2200-2600 (authority)
6. **Images:** Hero 3 tailles + 2-3 content, alt texts 5-20 mots
7. **Links:** 8 (standard) ou 10-12 (authority), densitÃ© 0.70-1.20%
8. **FAQ:** 5 questions, 60-100 mots/rÃ©ponse
9. **Schemas:** 6 JSON-LD (Article, Service, FAQ, Breadcrumb, Rating, Organization)
10. **Performance:** Lighthouse 100/100, LCP <1.0s
```

---

## âœ… CHECKLIST FINALE

Avant de dÃ©marrer la production :

```
FICHIERS CRÃ‰Ã‰S:
[ ] public/js/main.js
[ ] public/js/cookies.js
[ ] public/js/tracking.js
[ ] public/js/trustindex.js
[ ] public/css/style.css (copier style-v45-hybrid.css)
[ ] src/lib/config.ts
[ ] src/lib/claude.ts
[ ] src/lib/fluxpro.ts
[ ] src/content/keywords/keywords-70.json
[ ] astro.config.mjs
[ ] package.json
[ ] tsconfig.json
[ ] .env (avec API keys)

INSTALLATION:
[ ] npm install exÃ©cutÃ©
[ ] npm run dev fonctionne
[ ] npm run build fonctionne (0 erreur)

VALIDATION:
[ ] 1 page test gÃ©nÃ©rÃ©e
[ ] Lighthouse >95
[ ] CSS/JS externes chargÃ©s
[ ] 0 erreur console
```

---

## ðŸš€ DÃ‰MARRAGE PRODUCTION

Une fois tous les fichiers en place :

```bash
# Test 1 page
npm run dev

# Build 70 pages
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

---

**TOUS LES FICHIERS SONT PRÃŠTS !** Suivez les sections ci-dessus pour crÃ©er chaque fichier dans votre projet. ðŸŽ‰
