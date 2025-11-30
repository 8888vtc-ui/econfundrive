# Script pour corriger le bot et les images
# Vérifie et corrige les problèmes du chatbot et des images

Write-Host "🔧 CORRECTION BOT ET IMAGES" -ForegroundColor Green
Write-Host "==========================`n" -ForegroundColor Cyan

# 1. Vérifier les images manquantes
Write-Host "📸 Étape 1: Vérification des images..." -ForegroundColor Yellow

$imagesNeeded = @(
    "public\assets\img\hero\hero-aeroport-nice.webp",
    "public\assets\img\destinations\plage-beau-rivage-nice.jpg",
    "public\assets\img\destinations\vtc-tesla-cannes.jpg",
    "public\assets\img\destinations\vtc-tesla-monaco.jpg",
    "public\assets\img\destinations\nikki-beach-saint-tropez.jpg"
)

$imagesMissing = @()
foreach ($img in $imagesNeeded) {
    if (-not (Test-Path $img)) {
        $imagesMissing += $img
        Write-Host "   ❌ Manquante: $img" -ForegroundColor Red
    } else {
        Write-Host "   ✅ Présente: $img" -ForegroundColor Green
    }
}

# 2. Copier les images depuis assets vers public si nécessaire
Write-Host "`n📁 Étape 2: Synchronisation des images..." -ForegroundColor Yellow
if ($imagesMissing.Count -gt 0) {
    Write-Host "   Copie des images depuis assets/ vers public/..." -ForegroundColor Cyan
    
    # Copier hero
    if (Test-Path "assets\img\hero") {
        $dest = "public\assets\img\hero"
        New-Item -ItemType Directory -Force -Path $dest | Out-Null
        Copy-Item -Path "assets\img\hero\*" -Destination $dest -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "   ✅ Images hero copiées" -ForegroundColor Green
    }
    
    # Copier destinations
    if (Test-Path "assets\img\destinations") {
        $dest = "public\assets\img\destinations"
        New-Item -ItemType Directory -Force -Path $dest | Out-Null
        Copy-Item -Path "assets\img\destinations\*" -Destination $dest -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "   ✅ Images destinations copiées" -ForegroundColor Green
    }
}

# 3. Vérifier la fonction Netlify du bot
Write-Host "`n🤖 Étape 3: Vérification du bot..." -ForegroundColor Yellow
if (Test-Path "netlify\functions\deepseek-chat.js") {
    Write-Host "   ✅ Fonction deepseek-chat.js trouvée" -ForegroundColor Green
    
    # Vérifier si OpenAI est configuré
    $functionContent = Get-Content "netlify\functions\deepseek-chat.js" -Raw
    if ($functionContent -match "OPENAI_API_KEY") {
        Write-Host "   ⚠️  Variable OPENAI_API_KEY nécessaire sur Netlify" -ForegroundColor Yellow
        Write-Host "   📝 Configurez-la dans Netlify Dashboard > Site settings > Environment variables" -ForegroundColor Cyan
    }
} else {
    Write-Host "   ❌ Fonction deepseek-chat.js introuvable!" -ForegroundColor Red
}

# 4. Vérifier le composant Chatbot Astro
Write-Host "`n🔍 Étape 4: Vérification du composant Chatbot..." -ForegroundColor Yellow
if (Test-Path "src\components\Chatbot.astro") {
    Write-Host "   ✅ Composant Chatbot.astro trouvé" -ForegroundColor Green
} else {
    Write-Host "   ❌ Composant Chatbot.astro introuvable!" -ForegroundColor Red
}

# 5. Vérifier les variables d'environnement
Write-Host "`n🔑 Étape 5: Vérification des clés API..." -ForegroundColor Yellow

# Chercher .env
$envFiles = @(".env", ".env.local", ".env.production")
$foundEnv = $false

foreach ($envFile in $envFiles) {
    if (Test-Path $envFile) {
        Write-Host "   ✅ Fichier $envFile trouvé" -ForegroundColor Green
        $foundEnv = $true
        
        # Lire les variables (sans afficher les valeurs sensibles)
        $content = Get-Content $envFile -ErrorAction SilentlyContinue
        if ($content) {
            $hasReplicate = $content | Where-Object { $_ -match "REPLICATE" }
            $hasOpenAI = $content | Where-Object { $_ -match "OPENAI" }
            
            if ($hasReplicate) {
                Write-Host "   ✅ Clé REPLICATE trouvée" -ForegroundColor Green
            }
            if ($hasOpenAI) {
                Write-Host "   ✅ Clé OPENAI trouvée" -ForegroundColor Green
            }
        }
        break
    }
}

if (-not $foundEnv) {
    Write-Host "   ⚠️  Aucun fichier .env trouvé" -ForegroundColor Yellow
    Write-Host "   💡 Créez un fichier .env avec:" -ForegroundColor Cyan
    Write-Host "      REPLICATE_API_TOKEN=votre_cle" -ForegroundColor Gray
    Write-Host "      REPLICATE_MODEL_VERSION=votre_version" -ForegroundColor Gray
    Write-Host "      OPENAI_API_KEY=votre_cle" -ForegroundColor Gray
}

# 6. Résumé
Write-Host "`n📊 RÉSUMÉ" -ForegroundColor Green
Write-Host "==========" -ForegroundColor Cyan
Write-Host "Images manquantes: $($imagesMissing.Count)" -ForegroundColor $(if ($imagesMissing.Count -eq 0) { "Green" } else { "Yellow" })
Write-Host "Bot fonction: $(if (Test-Path "netlify\functions\deepseek-chat.js") { "✅" } else { "❌" })" -ForegroundColor $(if (Test-Path "netlify\functions\deepseek-chat.js") { "Green" } else { "Red" })
Write-Host "Variables d'environnement: $(if ($foundEnv) { "✅" } else { "⚠️" })" -ForegroundColor $(if ($foundEnv) { "Green" } else { "Yellow" })

Write-Host "`n✅ Vérification terminée!" -ForegroundColor Green

