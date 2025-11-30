# 🔑 Configuration Netlify - Variables d'Environnement

## ⚠️ IMPORTANT : Configuration Requise

Pour que le **bot fonctionne correctement**, vous devez configurer les variables d'environnement sur Netlify.

## 📋 Étapes de Configuration

### 1. Accéder aux Variables d'Environnement

1. Allez sur : https://app.netlify.com/sites/ecofundrive/settings/env
2. Ou : Netlify Dashboard > Votre site > Site settings > Environment variables

### 2. Ajouter les Variables

Cliquez sur **"Add a variable"** et ajoutez :

#### 🔴 OBLIGATOIRE pour le Bot

```
Variable name: OPENAI_API_KEY
Value: sk-votre_cle_openai_ici
Scope: All scopes (ou Production seulement)
```

```
Variable name: OPENAI_MODEL
Value: gpt-4o
Scope: All scopes
```

#### 🟡 OPTIONNEL pour Générer des Images

Si vous avez une clé Replicate pour générer des images :

```
Variable name: REPLICATE_API_TOKEN
Value: r8_votre_cle_replicate
Scope: All scopes
```

```
Variable name: REPLICATE_MODEL_VERSION
Value: version_id_du_modele
Scope: All scopes
```

### 3. Redéployer

Après avoir ajouté les variables :

1. Allez dans **Deploys**
2. Cliquez sur **"Trigger deploy"** > **"Clear cache and deploy site"**

Ou via CLI :
```bash
netlify deploy --prod
```

## 🔍 Vérification

### Tester le Bot

1. Ouvrez https://ecofundrive.com
2. Cliquez sur le bouton chat (en bas à droite)
3. Envoyez un message
4. Le bot devrait répondre avec l'IA OpenAI

### Si le Bot ne Fonctionne Pas

1. Vérifiez les logs Netlify :
   - https://app.netlify.com/sites/ecofundrive/functions
   - Cliquez sur `deepseek-chat` pour voir les logs

2. Vérifiez que `OPENAI_API_KEY` est bien configurée :
   - Dashboard > Site settings > Environment variables
   - Doit être visible avec le scope "Production"

3. Vérifiez les erreurs dans la console du navigateur (F12)

## 📝 Notes

- **Sans `OPENAI_API_KEY`** : Le bot affichera un message de fallback
- **Avec `OPENAI_API_KEY`** : Le bot utilisera GPT-4o pour répondre intelligemment
- Les variables sont **sensibles** - ne les partagez jamais publiquement

## 🆘 Support

Si vous avez des problèmes :
1. Vérifiez les logs Netlify Functions
2. Vérifiez que la clé OpenAI est valide
3. Vérifiez que le modèle `gpt-4o` est disponible sur votre compte OpenAI

---

**Status** : ⚠️ Configuration requise sur Netlify Dashboard

