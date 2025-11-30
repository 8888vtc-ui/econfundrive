# 🚀 Guide de Déploiement Netlify

## Informations de Déploiement

- **Token Netlify** : `nfp_haap1Bxhsa3ZH3Ghc3pdUYdVhbDJF49V7d2f`
- **Project ID** : `2a354129-00a5-4128-9c1e-8236192b5bfa`
- **Repository GitHub** : https://github.com/8888vtc-ui/econfundrive

## 🎯 Méthodes de Déploiement

### Option 1 : Déploiement Automatique via GitHub (Recommandé)

1. **Push sur GitHub** :
   ```bash
   git add .
   git commit -m "Migration vers Astro avec bot graphics fixé"
   git push origin main
   ```

2. **Netlify détectera automatiquement** le push et déploiera

3. **Configuration Netlify** :
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`

### Option 2 : Déploiement Direct via Script PowerShell

```powershell
.\deploy-netlify.ps1
```

Ou avec méthode API :
```powershell
.\deploy-netlify.ps1 -Method api
```

### Option 3 : Netlify CLI

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter
netlify login

# Déployer
netlify deploy --prod --dir=dist
```

## 📋 Prérequis

1. **Installer les dépendances** :
   ```bash
   npm install astro@^4.0.0 @astrojs/netlify@^5.0.0 sharp@^0.34.5
   ```

2. **Créer le dossier public** (si pas déjà fait) :
   ```powershell
   .\setup-public.ps1
   ```

3. **Build du projet** :
   ```bash
   npm run build
   ```

## ✅ Vérifications Avant Déploiement

- [ ] Dossier `public/` existe avec les assets
- [ ] Dossier `dist/` généré après build
- [ ] Toutes les images sont accessibles
- [ ] Le chatbot fonctionne avec avatar visible
- [ ] Les fonctions Netlify sont dans `netlify/functions/`

## 🔧 Configuration Netlify

Le fichier `netlify-astro.toml` contient :
- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`
- Variables d'environnement pour les fonctions

## 🐛 Dépannage

### Erreur "dist not found"
```bash
npm run build
```

### Erreur "public not found"
```powershell
.\setup-public.ps1
```

### Erreur de build Astro
```bash
npm install
npm run build
```

### Images ne s'affichent pas
Vérifier que `public/assets/img/` contient les images

## 📊 Après Déploiement

1. Vérifier l'URL du site sur Netlify
2. Tester le chatbot (avatar doit être visible)
3. Vérifier que les images s'affichent
4. Tester les fonctions Netlify (chatbot API)

---

**Status** : ✅ Prêt pour déploiement

