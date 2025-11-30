# 🖼️ Solution Complète pour les Images

## ❌ Problèmes Identifiés

1. **16 images manquantes** dans `/assets/img/optimized/` (dossier supprimé)
2. **Chemins obsolètes** vers `optimized/` dans plusieurs pages
3. **Images dupliquées** sur certaines pages
4. **Structure désorganisée** avec dossiers dupliqués

## ✅ Solution Proposée

### 1. Structure Propre et Organisée

```
public/assets/img/
├── hero/              # Images hero principales
│   ├── hero-main.webp
│   ├── nice-hero-1.webp
│   ├── nice-hero-2.webp
│   ├── cannes-hero-1.webp
│   ├── cannes-hero-2.webp
│   ├── monaco-hero-1.webp
│   ├── monaco-hero-2.webp
│   ├── saint-tropez-hero-1.webp
│   └── saint-tropez-hero-2.webp
├── destinations/      # Images de destinations
│   ├── nice-destination.webp
│   ├── nice-destination-1.webp
│   ├── nice-destination-2.webp
│   ├── cannes-destination.webp
│   ├── cannes-destination-1.webp
│   ├── cannes-destination-2.webp
│   ├── monaco-destination.webp
│   ├── monaco-destination-1.webp
│   ├── monaco-destination-2.webp
│   ├── saint-tropez-destination.webp
│   ├── saint-tropez-destination-1.webp
│   └── saint-tropez-destination-2.webp
├── about/             # Images page À propos
│   ├── about-chauffeur.webp
│   ├── about-vehicle.webp
│   └── about-certification.webp
└── services/          # Images page Services
    ├── service-airport.webp
    ├── service-business.webp
    └── service-wedding.webp
```

### 2. Mapping des Images par Page (Aucune Duplication)

- **index** : 1 hero + 4 destinations (uniques)
- **vtc-nice** : 4 images (2 hero + 2 destinations, uniques)
- **vtc-cannes** : 4 images (2 hero + 2 destinations, uniques)
- **vtc-monaco** : 4 images (2 hero + 2 destinations, uniques)
- **vtc-saint-tropez** : 4 images (2 hero + 2 destinations, uniques)
- **a-propos** : 3 images (uniques)
- **services** : 3 images (uniques)

### 3. Génération avec Replicate

**Caractéristiques des images générées :**
- ✅ Aucun nom de lieu réel
- ✅ Photos liées au contexte (VTC, berline premium, côte méditerranéenne générique)
- ✅ Chaque image est unique
- ✅ Format WebP pour optimisation
- ✅ Prompts génériques sans monuments reconnaissables

### 4. Scripts Créés

1. **`scripts/fix-all-images-complete.js`**
   - Corrige tous les chemins dans les pages
   - Supprime les références à `/optimized/`
   - Applique le mapping propre

2. **`scripts/generate-all-images.js`**
   - Génère toutes les images manquantes avec Replicate
   - Prompts sans noms de lieux
   - Images contextuelles et uniques

3. **`scripts/clean-and-reorganize-images.js`**
   - Nettoie la structure
   - Crée les dossiers nécessaires

## 🚀 Étapes d'Exécution

### Étape 1 : Nettoyer et Corriger les Chemins
```bash
node scripts/fix-all-images-complete.js
```

### Étape 2 : Générer les Images Manquantes
```bash
# Configurer REPLICATE_API_TOKEN dans .env
node scripts/generate-all-images.js
```

### Étape 3 : Vérifier
```bash
node scripts/check-images.js
```

## 📊 Résultat Attendu

- ✅ 0 image manquante
- ✅ Aucune duplication par page
- ✅ Structure propre et organisée
- ✅ Tous les chemins corrigés
- ✅ Images génériques sans noms de lieux

