# Script complet de déploiement : Git + Netlify
# Token Netlify: nfp_haap1Bxhsa3ZH3Ghc3pdUYdVhbDJF49V7d2f
# Project ID: 2a354129-00a5-4128-9c1e-8236192b5bfa

param(
    [switch]$SkipGit = $false,
    [switch]$SkipNetlify = $false,
    [switch]$BuildOnly = $false
)

$NETLIFY_TOKEN = "nfp_haap1Bxhsa3ZH3Ghc3pdUYdVhbDJF49V7d2f"
$PROJECT_ID = "2a354129-00a5-4128-9c1e-8236192b5bfa"

Write-Host "`n🚀 DÉPLOIEMENT COMPLET ECOFUNDRIVE" -ForegroundColor Green
Write-Host "====================================`n" -ForegroundColor Cyan

# Étape 1: Vérifier le dossier public
Write-Host "📁 Étape 1: Vérification du dossier public..." -ForegroundColor Yellow
if (-not (Test-Path "public")) {
    Write-Host "   Création du dossier public..." -ForegroundColor Yellow
    if (Test-Path "setup-public.ps1") {
        .\setup-public.ps1
    } else {
        Write-Host "   ❌ Script setup-public.ps1 introuvable!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "   ✅ Dossier public existe" -ForegroundColor Green
}

# Étape 2: Installer les dépendances
Write-Host "`n📦 Étape 2: Vérification des dépendances..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules\astro")) {
    Write-Host "   Installation d'Astro..." -ForegroundColor Yellow
    npm install astro@^4.0.0 @astrojs/netlify@^5.0.0 sharp@^0.34.5
} else {
    Write-Host "   ✅ Astro installé" -ForegroundColor Green
}

# Étape 3: Build
Write-Host "`n🔨 Étape 3: Build du projet..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "   ❌ Erreur lors du build!" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "dist")) {
    Write-Host "   ❌ Dossier dist manquant!" -ForegroundColor Red
    exit 1
}

Write-Host "   ✅ Build réussi!" -ForegroundColor Green

if ($BuildOnly) {
    Write-Host "`n✅ Build terminé (mode build-only)" -ForegroundColor Green
    exit 0
}

# Étape 4: Push sur GitHub
if (-not $SkipGit) {
    Write-Host "`n📤 Étape 4: Push sur GitHub..." -ForegroundColor Yellow
    
    $gitStatus = git status --porcelain
    if ($gitStatus) {
        Write-Host "   Fichiers modifiés détectés" -ForegroundColor Cyan
        
        # Demander confirmation
        $confirm = Read-Host "   Voulez-vous commit et push? (O/N)"
        if ($confirm -eq "O" -or $confirm -eq "o") {
            git add .
            git commit -m "Migration vers Astro: bot graphics fixé, structure optimisée"
            git push origin main
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "   ✅ Push sur GitHub réussi!" -ForegroundColor Green
            } else {
                Write-Host "   ⚠️ Erreur lors du push Git (continuation...)" -ForegroundColor Yellow
            }
        } else {
            Write-Host "   ⏭️ Push Git ignoré" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   ✅ Aucun changement à commiter" -ForegroundColor Green
    }
}

# Étape 5: Déploiement Netlify
if (-not $SkipNetlify) {
    Write-Host "`n🌐 Étape 5: Déploiement sur Netlify..." -ForegroundColor Yellow
    
    # Vérifier si Netlify CLI est installé
    $netlifyInstalled = Get-Command netlify -ErrorAction SilentlyContinue
    
    if ($netlifyInstalled) {
        Write-Host "   Déploiement via Netlify CLI..." -ForegroundColor Cyan
        $env:NETLIFY_AUTH_TOKEN = $NETLIFY_TOKEN
        netlify deploy --prod --dir=dist --site=$PROJECT_ID
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ Déploiement Netlify réussi!" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️ Erreur lors du déploiement Netlify" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   Netlify CLI non installé. Installation..." -ForegroundColor Yellow
        npm install -g netlify-cli
        
        $env:NETLIFY_AUTH_TOKEN = $NETLIFY_TOKEN
        netlify deploy --prod --dir=dist --site=$PROJECT_ID
    }
}

Write-Host "`n🎉 DÉPLOIEMENT TERMINÉ!" -ForegroundColor Green
Write-Host "====================================`n" -ForegroundColor Cyan

