# Script complet pour générer les assets luxe et adapter le design

Write-Host "🎨 CRÉATION DESIGN LUXE CHAUFFEUR" -ForegroundColor Green
Write-Host "==================================`n" -ForegroundColor Cyan

# 1. Vérifier les clés API
Write-Host "🔑 Étape 1: Vérification des clés API..." -ForegroundColor Yellow
$hasReplicate = $env:REPLICATE_API_TOKEN
if ($hasReplicate) {
    Write-Host "   ✅ REPLICATE_API_TOKEN trouvé" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  REPLICATE_API_TOKEN non défini" -ForegroundColor Yellow
    Write-Host "   💡 Créez un fichier .env avec:" -ForegroundColor Cyan
    Write-Host "      REPLICATE_API_TOKEN=r8_votre_cle" -ForegroundColor Gray
    Write-Host "      REPLICATE_MODEL_VERSION=version_id" -ForegroundColor Gray
}

# 2. Générer les images luxe
Write-Host "`n📸 Étape 2: Génération des images luxe..." -ForegroundColor Yellow
if ($hasReplicate) {
    node generate-luxe-assets.js
} else {
    Write-Host "   ⏭️  Génération d'images ignorée (clé API manquante)" -ForegroundColor Yellow
    Write-Host "   💡 Les placeholders seront utilisés" -ForegroundColor Cyan
}

# 3. Copier le CSS luxe
Write-Host "`n🎨 Étape 3: Installation du CSS luxe..." -ForegroundColor Yellow
if (Test-Path "src\assets\css\luxe-chauffeur.css") {
    Copy-Item -Path "src\assets\css\luxe-chauffeur.css" -Destination "public\assets\css\luxe-chauffeur.css" -Force
    Copy-Item -Path "src\assets\css\luxe-chauffeur.css" -Destination "assets\css\luxe-chauffeur.css" -Force
    Write-Host "   ✅ CSS luxe installé" -ForegroundColor Green
} else {
    Write-Host "   ❌ CSS luxe non trouvé!" -ForegroundColor Red
}

# 4. Créer les dossiers pour les assets
Write-Host "`n📁 Étape 4: Création des dossiers..." -ForegroundColor Yellow
$dirs = @(
    "public\assets\img\hero",
    "public\assets\img\logo",
    "assets\img\hero",
    "assets\img\logo"
)
foreach ($dir in $dirs) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
}
Write-Host "   ✅ Dossiers créés" -ForegroundColor Green

# 5. Résumé
Write-Host "`n📊 RÉSUMÉ" -ForegroundColor Green
Write-Host "==========" -ForegroundColor Cyan
Write-Host "CSS luxe: $(if (Test-Path "public\assets\css\luxe-chauffeur.css") { "✅" } else { "❌" })" -ForegroundColor $(if (Test-Path "public\assets\css\luxe-chauffeur.css") { "Green" } else { "Red" })
Write-Host "Images luxe: $(if (Test-Path "public\assets\img\hero\chauffeur-luxe-background.webp") { "✅" } else { "⚠️  À générer" })" -ForegroundColor $(if (Test-Path "public\assets\img\hero\chauffeur-luxe-background.webp") { "Green" } else { "Yellow" })
Write-Host "Logo: $(if (Test-Path "public\assets\img\logo\ecofundrive-logo-concept.webp") { "✅" } else { "⚠️  À générer" })" -ForegroundColor $(if (Test-Path "public\assets\img\logo\ecofundrive-logo-concept.webp") { "Green" } else { "Yellow" })

Write-Host "`n✅ Configuration luxe terminée!" -ForegroundColor Green
Write-Host "   Rebuild et déployez pour voir le nouveau design" -ForegroundColor Cyan

