# ⚡ Quick Start - Migration Astro

## 🎯 Problème Résolu

✅ **Bot Graphics Fixé** : Le chatbot affiche maintenant un avatar SVG personnalisé au lieu d'une image manquante.

## 🚀 Démarrage Rapide (3 étapes)

### 1. Installer les dépendances

```bash
cd CascadeProjects/windsurf-project
npm install astro@^4.0.0 @astrojs/netlify@^5.0.0 sharp@^0.34.5
```

### 2. Lancer le serveur de développement

```bash
npm run dev
```

Ouvre votre navigateur sur `http://localhost:4321`

### 3. Vérifier le chatbot

1. Cliquez sur le bouton chat en bas à droite
2. ✅ L'avatar de David devrait maintenant être visible dans l'en-tête du chat
3. ✅ Le chat fonctionne normalement

## 📁 Fichiers Créés

```
src/
├── components/
│   ├── Chatbot.astro      ← ✅ Avatar SVG fixé ici
│   ├── Header.astro
│   ├── Footer.astro
│   └── WhatsAppButton.astro
├── layouts/
│   └── BaseLayout.astro
└── pages/
    └── index.astro        ← Page d'accueil migrée
```

## 🔄 Migration Progressive

Vous pouvez migrer progressivement :

1. **Garder les pages HTML existantes** - Elles continuent de fonctionner
2. **Créer les nouvelles pages en Astro** - Une par une
3. **Tester chaque page** - Avant de supprimer l'ancienne

## 🎨 Ce qui change

### Avant (HTML statique)
```html
<!-- Duplication sur chaque page -->
<header>...</header>
<footer>...</footer>
<script src="chatbot.js"></script>
```

### Après (Astro)
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="..." description="...">
  <!-- Contenu unique de la page -->
</BaseLayout>
```

## ✅ Checklist

- [x] Structure Astro créée
- [x] Bot graphics fixé (avatar SVG)
- [x] Composants réutilisables
- [x] Page d'accueil migrée
- [ ] Autres pages à migrer (optionnel)

## 🆘 Problèmes Courants

### "Cannot find module 'astro'"
```bash
npm install
```

### "Port 4321 already in use"
```bash
# Utiliser un autre port
npm run dev -- --port 3000
```

### Le chatbot ne s'ouvre pas
Vérifiez que `chatbot.js` est toujours chargé dans `BaseLayout.astro` ou utilisez le composant `Chatbot.astro` inclus.

## 📚 Documentation Complète

- [README-ASTRO.md](README-ASTRO.md) - Guide complet
- [MIGRATION-ASTRO.md](MIGRATION-ASTRO.md) - Détails de migration

---

**Prêt à démarrer ?** Lancez `npm run dev` et testez le chatbot ! 🚀

