# Script de déploiement Netlify pour ECOFUNDRIVE
# Token: nfp_haap1Bxhsa3ZH3Ghc3pdUYdVhbDJF49V7d2f
# Project ID: 2a354129-00a5-4128-9c1e-8236192b5bfa

param(
    [string]$Method = "cli"  # "cli" ou "api"
)

$NETLIFY_TOKEN = "nfp_haap1Bxhsa3ZH3Ghc3pdUYdVhbDJF49V7d2f"
$PROJECT_ID = "2a354129-00a5-4128-9c1e-8236192b5bfa"
$SITE_ID = "econfundrive"  # À ajuster si nécessaire

Write-Host "🚀 Déploiement sur Netlify..." -ForegroundColor Green
Write-Host "Project ID: $PROJECT_ID" -ForegroundColor Cyan

# Vérifier que le dossier public existe
if (-not (Test-Path "public")) {
    Write-Host "❌ Dossier public manquant. Création..." -ForegroundColor Yellow
    if (Test-Path "setup-public.ps1") {
        .\setup-public.ps1
    } else {
        Write-Host "❌ Script setup-public.ps1 introuvable!" -ForegroundColor Red
        exit 1
    }
}

# Vérifier que Astro est installé
Write-Host "📦 Vérification des dépendances..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules\astro")) {
    Write-Host "Installation d'Astro..." -ForegroundColor Yellow
    npm install astro@^4.0.0 @astrojs/netlify@^5.0.0 sharp@^0.34.5
}

# Build du projet
Write-Host "🔨 Build du projet Astro..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du build!" -ForegroundColor Red
    exit 1
}

# Vérifier que dist existe
if (-not (Test-Path "dist")) {
    Write-Host "❌ Dossier dist manquant après le build!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build réussi!" -ForegroundColor Green

# Méthode 1: Netlify CLI
if ($Method -eq "cli") {
    Write-Host "📤 Déploiement via Netlify CLI..." -ForegroundColor Yellow
    
    # Vérifier si Netlify CLI est installé
    $netlifyInstalled = Get-Command netlify -ErrorAction SilentlyContinue
    if (-not $netlifyInstalled) {
        Write-Host "Installation de Netlify CLI..." -ForegroundColor Yellow
        npm install -g netlify-cli
    }
    
    # Déployer
    $env:NETLIFY_AUTH_TOKEN = $NETLIFY_TOKEN
    netlify deploy --prod --dir=dist --site=$PROJECT_ID
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Déploiement réussi!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erreur lors du déploiement!" -ForegroundColor Red
        exit 1
    }
}
# Méthode 2: API REST Netlify
elseif ($Method -eq "api") {
    Write-Host "📤 Déploiement via API Netlify..." -ForegroundColor Yellow
    
    # Créer un zip du dossier dist
    $zipPath = "dist-deploy.zip"
    if (Test-Path $zipPath) {
        Remove-Item $zipPath
    }
    
    Write-Host "📦 Création de l'archive..." -ForegroundColor Yellow
    Compress-Archive -Path "dist\*" -DestinationPath $zipPath -Force
    
    # Upload via API
    Write-Host "📤 Upload sur Netlify..." -ForegroundColor Yellow
    
    $headers = @{
        "Authorization" = "Bearer $NETLIFY_TOKEN"
        "Content-Type" = "application/zip"
    }
    
    $zipBytes = [System.IO.File]::ReadAllBytes((Resolve-Path $zipPath))
    
    try {
        $response = Invoke-RestMethod -Uri "https://api.netlify.com/api/v1/sites/$PROJECT_ID/deploys" `
            -Method POST `
            -Headers $headers `
            -Body $zipBytes `
            -ContentType "application/zip"
        
        Write-Host "✅ Déploiement initié!" -ForegroundColor Green
        Write-Host "URL: $($response.deploy_ssl_url)" -ForegroundColor Cyan
        
        # Nettoyer
        Remove-Item $zipPath -ErrorAction SilentlyContinue
    } catch {
        Write-Host "❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n🎉 Déploiement terminé!" -ForegroundColor Green

