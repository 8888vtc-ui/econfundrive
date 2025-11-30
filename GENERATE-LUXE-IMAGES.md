# 🎨 Génération des Images Luxe avec Replicate

## 📸 Images à Générer

### 1. Image de Fond Chauffeur Luxe
**Fichier** : `assets/img/hero/chauffeur-luxe-background.webp`

**Prompt Replicate** :
```
Ultra premium luxury private driver background: elegant black luxury sedan with professional chauffeur in dark business suit standing beside the car, French Riviera coastal road at golden hour, sophisticated atmosphere, cinematic lighting, premium quality, no text, no logos, professional photography style, 4K quality, wide angle composition perfect for website hero background
```

### 2. Logo Concept
**Fichier** : `assets/img/logo/ecofundrive-logo-concept.webp`

**Prompt Replicate** :
```
Professional luxury logo concept for ECOFUNDRIVE: elegant typography, gold and black color scheme, minimalist design, premium feel, suitable for private driver service, clean and sophisticated, no text overlay, just visual concept
```

## 🚀 Génération

### Option 1 : Avec Clés API Replicate

1. **Créer fichier `.env`** :
```env
REPLICATE_API_TOKEN=r8_votre_cle_replicate
REPLICATE_MODEL_VERSION=black-forest-labs/flux-pro
```

2. **Générer les images** :
```bash
node generate-luxe-assets.js
```

### Option 2 : Sans API (Placeholders)

Le CSS fonctionne avec des gradients de fallback si les images ne sont pas disponibles.

## 📁 Structure

```
assets/img/
├── hero/
│   └── chauffeur-luxe-background.webp  ← Image de fond
└── logo/
    └── ecofundrive-logo-concept.webp    ← Logo concept
```

## ✅ CSS Luxe Activé

Le fichier `luxe-chauffeur.css` est maintenant chargé dans `BaseLayout.astro` et applique :
- ✅ Image de fond avec overlay
- ✅ Palette noir & or premium
- ✅ Logo SVG professionnel
- ✅ Design luxe sur tous les éléments

---

**Status** : ✅ CSS luxe prêt - Images à générer avec Replicate

