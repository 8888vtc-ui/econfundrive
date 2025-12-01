# Guide : Utiliser les APIs configurées dans Cursor

## ⚠️ Important

Les **intégrations de Cursor** sont utilisées par Cursor lui-même (pour l'IA, etc.), mais **ne sont PAS automatiquement disponibles** dans votre projet Astro/Netlify.

Vous devez les configurer séparément dans votre projet.

---

## 📋 Méthode 1 : Variables d'environnement locales (Développement)

### Étape 1 : Récupérer vos clés API depuis Cursor

1. Ouvrez **Cursor Settings** (Ctrl+, ou Cmd+,)
2. Allez dans **Settings** → **Integrations** ou **API Keys**
3. Notez vos clés API :
   - `DEEPSEEK_API_KEY` (DeepSeek v3)
   - `REPLICATE_API_TOKEN` (Replicate pour images)
   - `RESEND_API_KEY` (Resend pour emails)
   - Autres APIs que vous avez configurées

### Étape 2 : Créer le fichier `.env.local`

Créez un fichier `.env.local` à la racine du projet :

```bash
# .env.local (ne sera PAS commité dans Git)
DEEPSEEK_API_KEY=sk-votre_cle_deepseek_ici
REPLICATE_API_TOKEN=r8_votre_token_replicate_ici
RESEND_API_KEY=re_votre_cle_resend_ici
```

### Étape 3 : Utiliser dans le code

#### Dans Netlify Functions (Node.js)
```javascript
// netlify/functions/chatbot.js
const deepseekKey = process.env.DEEPSEEK_API_KEY;
```

#### Dans les scripts Node.js
```javascript
// scripts/generate-images.js
const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
```

#### Dans Astro (côté serveur uniquement)
```javascript
// src/pages/ma-page.astro
const apiKey = import.meta.env.DEEPSEEK_API_KEY; // ⚠️ Seulement côté serveur
```

---

## 🌐 Méthode 2 : Netlify (Production)

### Configuration dans Netlify Dashboard

1. Allez sur https://app.netlify.com
2. Sélectionnez votre site **ecofundrive.com**
3. **Site settings** → **Environment variables**
4. Ajoutez chaque variable :

| Key | Value | Scopes |
|-----|-------|--------|
| `deepseek_api_key` | `sk-votre_cle_ici` | Functions |
| `replicate_api_token` | `r8_votre_token_ici` | Functions |
| `resend_api_key` | `re_votre_cle_ici` | Functions |

### Référence dans `netlify.toml`

Le fichier `netlify.toml` référence ces variables :

```toml
[functions.environment]
  DEEPSEEK_API_KEY = "@deepseek_api_key"  # Référence à la variable Netlify
  REPLICATE_API_TOKEN = "@replicate_api_token"
  RESEND_API_KEY = "@resend_api_key"
```

Le `@` indique que c'est une variable Netlify, pas une valeur directe.

---

## 🔧 APIs actuellement utilisées dans le projet

### 1. DeepSeek v3 (Chatbot)
- **Fichier** : `netlify/functions/chatbot.js`
- **Variable** : `DEEPSEEK_API_KEY`
- **Usage** : Chatbot guide touristique
- **Modèle** : `deepseek-chat` (configurable via `DEEPSEEK_MODEL`)

### 2. Replicate (Génération d'images)
- **Fichiers** : `scripts/generate-images.js`, `generate-luxe-assets.js`
- **Variable** : `REPLICATE_API_TOKEN`
- **Usage** : Génération d'images pour le site

### 3. Resend (Emails)
- **Fichier** : `netlify/functions/submit-booking.js`
- **Variable** : `RESEND_API_KEY`
- **Usage** : Envoi d'emails de réservation

---

## ✅ Vérification

### Test local
```bash
# Vérifier que les variables sont chargées
node -e "require('dotenv').config({ path: '.env.local' }); console.log(process.env.DEEPSEEK_API_KEY ? '✅ DEEPSEEK_API_KEY trouvée' : '❌ DEEPSEEK_API_KEY manquante')"
```

### Test Netlify
1. Allez dans **Netlify Dashboard** → **Functions** → **Logs**
2. Testez le chatbot sur le site
3. Vérifiez les logs pour voir si l'API est appelée correctement

---

## 🚨 Sécurité

- ✅ **NE JAMAIS** commiter `.env.local` dans Git (déjà dans `.gitignore`)
- ✅ **NE JAMAIS** mettre les clés directement dans le code
- ✅ Utiliser les variables d'environnement Netlify pour la production
- ✅ Utiliser `.env.local` uniquement pour le développement local

---

## 📝 Résumé rapide

1. **Récupérer** vos clés depuis Cursor Settings → Integrations
2. **Créer** `.env.local` avec vos clés (développement)
3. **Configurer** dans Netlify Dashboard → Environment Variables (production)
4. **Utiliser** via `process.env.NOM_VARIABLE` dans le code

---

## ❓ Problèmes courants

### "API key not found"
- Vérifiez que `.env.local` existe et contient la clé
- Vérifiez l'orthographe exacte de la variable
- Pour Netlify : vérifiez dans Dashboard → Environment Variables

### "Unauthorized" ou "401"
- Vérifiez que la clé API est correcte
- Vérifiez que la clé n'a pas expiré
- Vérifiez les permissions de la clé API

### Variables non disponibles dans Astro
- Les variables `import.meta.env.*` ne sont disponibles que côté serveur
- Utilisez `process.env.*` dans les Netlify Functions
- Pour le client, utilisez `import.meta.env.PUBLIC_*` (préfixe PUBLIC requis)

