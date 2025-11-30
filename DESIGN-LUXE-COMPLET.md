# 🎨 Design Luxe Chauffeur - Guide Complet

## ✅ Ce qui a été Créé

### 1. CSS Luxe Premium ✅
- **Fichier** : `src/assets/css/luxe-chauffeur.css`
- **Style** : Noir profond & Or élégant
- **Caractéristiques** :
  - Image de fond avec overlay
  - Palette couleurs premium (noir & or)
  - Ombres et effets de glow doré
  - Transitions fluides
  - Design responsive

### 2. Logo Professionnel ✅
- **Fichier** : `src/components/Logo.astro`
- **Type** : SVG vectoriel avec gradient or
- **Style** : Minimaliste et élégant
- **Caractéristiques** :
  - Symbole voiture stylisé
  - Gradient or premium
  - Effet glow
  - Responsive

### 3. Image de Fond ✅
- **Fichier** : `assets/img/hero/chauffeur-luxe-background.webp`
- **Status** : À générer avec Replicate
- **Style** : Chauffeur professionnel avec voiture luxe

## 🎨 Palette de Couleurs Luxe

```css
--luxe-black: #0a0a0a        /* Noir profond */
--luxe-gold: #d4af37          /* Or premium */
--luxe-gold-light: #f4e4bc    /* Or clair */
--luxe-gold-dark: #b8941f     /* Or foncé */
```

## 📸 Génération des Images avec Replicate

### Configuration Requise

1. **Créer fichier `.env`** :
```env
REPLICATE_API_TOKEN=r8_votre_cle_ici
REPLICATE_MODEL_VERSION=black-forest-labs/flux-pro
```

2. **Générer les images** :
```bash
node generate-luxe-assets.js
```

### Images à Générer

1. **Image de fond chauffeur** :
   - Prompt optimisé pour voiture luxe + chauffeur professionnel
   - Format : 16:9, WebP, qualité 90
   - Style : Cinématique, golden hour

2. **Logo concept** :
   - Design minimaliste premium
   - Couleurs : Or & Noir

## 🚀 Activation

Le CSS luxe est automatiquement chargé dans `BaseLayout.astro` :
```astro
<link rel="stylesheet" href="/assets/css/luxe-chauffeur.css" />
```

## 🎯 Effets Visuels

- ✅ **Image de fond** : Chauffeur luxe en overlay subtil
- ✅ **Header** : Bordure or, backdrop blur
- ✅ **Cards** : Effet hover avec glow doré
- ✅ **Buttons** : Gradient or avec shadow
- ✅ **Logo** : SVG avec gradient et glow

## 📱 Responsive

Le design s'adapte automatiquement :
- Mobile : Image de fond scroll (pas fixed)
- Tablette : Ajustements de tailles
- Desktop : Effets complets

## 🔧 Personnalisation

Pour ajuster l'intensité de l'image de fond :
```css
body::before {
  opacity: 0.15;  /* Ajuster entre 0.1 et 0.3 */
  filter: brightness(0.4) contrast(1.3);
}
```

---

**Status** : ✅ Design luxe activé - Images à générer avec Replicate

