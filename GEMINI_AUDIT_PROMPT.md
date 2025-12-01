# PROMPT POUR AUDIT COMPLET DU SITE ECOFUNDRIVE VIA GEMINI

Tu es un expert en audit de sites web, SEO, performance, accessibilité et développement web. Je te demande de faire un audit complet et approfondi du site web ECOFUNDRIVE (https://www.ecofundrive.com), un site de chauffeur privé VTC sur la Côte d'Azur.

## CONTEXTE DU SITE

- **Type** : Site Astro (framework statique)
- **Domaine** : ecofundrive.com
- **Activité** : Chauffeur privé VTC, transferts aéroport, transport premium
- **Langues** : Français (principal), Anglais, Italien, Russe
- **Pages** : ~70 pages statiques
- **Déploiement** : Netlify

## MISSION : AUDIT COMPLET MULTI-DIMENSIONS

Effectue un audit exhaustif en analysant les aspects suivants :

### 1. SEO TECHNIQUE ET ON-PAGE

**Schema.org et Rich Snippets :**
- Vérifie la présence et la validité du Schema.org LocalBusiness
- Contrôle que les 20 avis clients sont bien dans le Schema.org Review
- Vérifie AggregateRating (5.0/5.0 avec 26 avis)
- Teste si les rich snippets apparaissent dans Google Search Console
- Vérifie BreadcrumbList, FAQPage, Article schemas
- Contrôle les sameAs (Trustindex, Facebook)

**Meta Tags :**
- Title tags (50-60 caractères, uniques par page)
- Meta descriptions (150-160 caractères, uniques)
- Keywords (pertinence et optimisation)
- Canonical URLs (présence et validité)
- Hreflang tags (fr, en, it, ru)
- Open Graph tags (Facebook)
- Twitter Cards

**Structure HTML :**
- Hiérarchie H1-H6 (un seul H1 par page)
- Structure sémantique (header, main, footer, nav, article, section)
- Alt text sur toutes les images
- Liens internes (3-5 par page minimum)
- Sitemap.xml présent et valide
- Robots.txt optimisé

### 2. SYSTÈME D'AVIS CLIENTS

**Vérifications spécifiques :**
- Les 20 avis de Trustindex sont-ils tous présents dans le Schema.org ?
- Le composant ReviewsDisplay affiche-t-il bien 6 avis sur toutes les pages (sauf /avis-clients) ?
- La page /avis-clients affiche-t-elle tous les 20 avis ?
- Les avis apparaissent-ils dans les rich snippets Google (test avec Google Rich Results Test) ?
- Le lien Trustindex est-il présent et fonctionnel ?
- Le bouton "Laisser un avis" redirige-t-il vers Trustindex ?

**Fichiers à vérifier :**
- `src/data/reviews.ts` : 20 avis présents
- `src/components/ReviewsDisplay.astro` : Composant fonctionnel
- `src/components/ReviewsSchema.astro` : Schema.org pour avis
- `src/layouts/BaseLayout.astro` : Schema.org avec tous les avis
- `src/pages/avis-clients.astro` : Page complète avec tous les avis

### 3. PERFORMANCE ET CORE WEB VITALS

**Métriques à analyser :**
- LCP (Largest Contentful Paint) < 2.5s
- FID (First Input Delay) < 100ms
- CLS (Cumulative Layout Shift) < 0.1
- TTI (Time to Interactive) < 3.5s
- Score Lighthouse (objectif > 90)

**Optimisations à vérifier :**
- Images optimisées (WebP, AVIF, lazy loading, srcset)
- Font preloading (Poppins)
- CSS critique inline (< 14KB)
- JavaScript defer/async
- Compression gzip/brotli
- Service Worker (PWA)
- Cache headers

### 4. ACCESSIBILITÉ (WCAG 2.1 AA)

**Points de contrôle :**
- Contraste couleurs (4.5:1 minimum pour texte normal)
- Navigation clavier complète
- Focus visible sur éléments interactifs
- ARIA labels sur boutons, liens, formulaires
- Skip links présents
- Alt text descriptifs (pas juste "image")
- Touch targets 44x44px minimum
- Structure sémantique HTML5

### 5. RESPONSIVE ET MOBILE

**Vérifications :**
- Menu hamburger fonctionnel sur mobile
- WhatsApp button fixe visible et accessible sur mobile
- Chatbot fixe visible et accessible sur mobile
- Images responsive (srcset, sizes)
- Layout adaptatif (flexbox, grid)
- Textes lisibles sans zoom
- Boutons accessibles (taille, espacement)

### 6. STRUCTURE ET COMPOSANTS

**Composants essentiels à vérifier :**
- Header.astro : Navigation, menu mobile
- Footer.astro : Liens, Trustindex, Facebook
- Breadcrumb.astro : Fil d'Ariane fonctionnel
- WhatsAppButton.astro : Bouton fixe, position correcte
- Chatbot.astro : Fonctionnel, position correcte
- ReviewsDisplay.astro : Affichage des avis
- ReviewsSchema.astro : Schema.org avis
- SectionImageText.astro : Composant image+texte

### 7. CSS ET STYLES

**Fichiers CSS modulaires :**
- `/assets/css/base.css` : Styles de base
- `/assets/css/components.css` : Composants
- `/assets/css/utilities.css` : Utilitaires
- `/assets/css/performance.css` : Optimisations
- `/assets/css/accessibility.css` : Accessibilité
- `/assets/css/white-override.css` : Override fond blanc

**Vérifications :**
- Fond blanc forcé dans BaseLayout
- Couleurs cohérentes
- Pas de CSS inline excessif
- Variables CSS utilisées

### 8. LIENS ET NAVIGATION

**Vérifications :**
- Tous les liens internes fonctionnels
- Pas de liens cassés (404)
- Liens externes avec rel="noopener noreferrer"
- Navigation logique et intuitive
- Breadcrumbs sur toutes les pages principales
- Sitemap à jour

### 9. CONTENU ET QUALITÉ

**Analyse du contenu :**
- Minimum 400 mots par page principale
- Minimum 1200 mots pour les guides
- Contenu unique (pas de duplication)
- Mots-clés pertinents et naturels
- FAQs présentes où approprié
- Call-to-actions clairs

### 10. SÉCURITÉ ET CONFORMITÉ

**Points à vérifier :**
- HTTPS activé
- Headers de sécurité (CSP, X-Frame-Options, etc.)
- Cookies conformes RGPD
- Mentions légales présentes
- Politique de confidentialité
- Formulaires sécurisés

## FORMAT DE RÉPONSE ATTENDU

Fournis un rapport structuré avec :

1. **Résumé exécutif** : Score global, points forts, points à améliorer
2. **Détails par catégorie** : Pour chaque section ci-dessus
3. **Priorités** : 
   - 🔴 Critique (à corriger immédiatement)
   - 🟡 Important (à corriger rapidement)
   - 🟢 Amélioration (optimisation future)
4. **Recommandations concrètes** : Actions précises à entreprendre
5. **Tests à effectuer** :
   - Google Rich Results Test (pour les avis)
   - Google Search Console
   - PageSpeed Insights
   - Lighthouse
   - WAVE (accessibilité)
   - W3C Validator

## INFORMATIONS TECHNIQUES À UTILISER

- Framework : Astro
- Build : 70 pages statiques
- Déploiement : Netlify
- Avis : 20 avis Trustindex intégrés
- Note : 5.0/5.0 avec 26 avis vérifiés
- Schema.org : LocalBusiness avec tous les avis

## QUESTIONS SPÉCIFIQUES

1. Les avis clients apparaissent-ils dans les rich snippets Google ?
2. Le système d'avis est-il correctement implémenté pour la SERP ?
3. Y a-t-il des erreurs critiques qui empêchent le bon référencement ?
4. La performance est-elle optimale pour le mobile ?
5. L'accessibilité est-elle conforme WCAG 2.1 AA ?

---

**Commence l'audit maintenant et fournis un rapport détaillé et actionnable.**
