# 🚀 Instructions de Déploiement Netlify

## ✅ Informations de Connexion

- **Token Netlify** : `nfp_haap1Bxhsa3ZH3Ghc3pdUYdVhbDJF49V7d2f`
- **Project ID** : `2a354129-00a5-4128-9c1e-8236192b5bfa`
- **Repository GitHub** : https://github.com/8888vtc-ui/econfundrive

## 🎯 Option 1 : Déploiement Automatique (Recommandé)

### Push sur GitHub → Netlify déploie automatiquement

```powershell
# 1. Ajouter tous les fichiers
git add .

# 2. Commit
git commit -m "Migration Astro: bot graphics fixé, structure optimisée"

# 3. Push sur GitHub
git push origin main
```

**Netlify détectera automatiquement** le push et déploiera avec la configuration dans `netlify-astro.toml`.

## 🎯 Option 2 : Déploiement Direct Netlify

### Méthode A : Script Automatique (Tout-en-un)

```powershell
.\deploy-all.ps1
```

Ce script :
1. ✅ Vérifie le dossier `public/`
2. ✅ Installe les dépendances si nécessaire
3. ✅ Build le projet Astro
4. ✅ Propose de push sur GitHub
5. ✅ Déploie sur Netlify

### Méthode B : Script Netlify Seul

```powershell
.\deploy-netlify.ps1
```

### Méthode C : Netlify CLI Manuel

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter avec le token
$env:NETLIFY_AUTH_TOKEN = "nfp_haap1Bxhsa3ZH3Ghc3pdUYdVhbDJF49V7d2f"

# Déployer
netlify deploy --prod --dir=dist --site=2a354129-00a5-4128-9c1e-8236192b5bfa
```

## 📋 Checklist Avant Déploiement

- [x] Dossier `public/` créé avec assets
- [x] Configuration Netlify (`netlify-astro.toml`)
- [x] Scripts de déploiement créés
- [ ] Dépendances installées (`npm install`)
- [ ] Build testé localement (`npm run build`)
- [ ] Images vérifiées (dossier `public/assets/img/`)

## 🔧 Configuration Netlify

Le fichier `netlify-astro.toml` est configuré avec :
- **Build command** : `npm run build`
- **Publish directory** : `dist`
- **Functions directory** : `netlify/functions`
- **Node version** : 18

## 🚀 Étapes Rapides

### Pour déployer maintenant :

```powershell
# 1. S'assurer que public existe
if (-not (Test-Path public)) { .\setup-public.ps1 }

# 2. Installer les dépendances
npm install astro@^4.0.0 @astrojs/netlify@^5.0.0 sharp@^0.34.5

# 3. Build
npm run build

# 4. Déployer (choisir une méthode)
# Option A: Push Git (déploiement auto)
git add . && git commit -m "Migration Astro" && git push

# Option B: Script automatique
.\deploy-all.ps1

# Option C: Netlify CLI direct
netlify deploy --prod --dir=dist --site=2a354129-00a5-4128-9c1e-8236192b5bfa
```

## ✅ Vérifications Post-Déploiement

1. **Site accessible** : Vérifier l'URL Netlify
2. **Images** : Toutes les images s'affichent
3. **Chatbot** : Avatar visible dans le chat
4. **Fonctions** : API chatbot fonctionne
5. **Performance** : Lighthouse score

## 🐛 Dépannage

### Erreur "dist not found"
```bash
npm run build
```

### Erreur "public not found"
```powershell
.\setup-public.ps1
```

### Erreur de token Netlify
Vérifier que le token dans `deploy-netlify.ps1` est correct

### Erreur de build
```bash
npm install
npm run build
```

## 📊 Fichiers Créés pour Déploiement

- ✅ `deploy-all.ps1` - Script complet (Git + Netlify)
- ✅ `deploy-netlify.ps1` - Script Netlify seul
- ✅ `netlify-astro.toml` - Configuration Netlify
- ✅ `.netlifyrc` - Configuration Netlify CLI
- ✅ `DEPLOY.md` - Documentation complète

## 🎉 Prêt à Déployer !

**Commande rapide** :
```powershell
.\deploy-all.ps1
```

Ou simplement push sur GitHub pour déploiement automatique !

---

**Status** : ✅ Tout est prêt pour le déploiement

