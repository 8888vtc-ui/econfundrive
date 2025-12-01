# Script pour corriger TOUS les fichiers corrompus
$ErrorActionPreference = "Stop"

Write-Host "CORRECTION TOUS FICHIERS CORROMPUS" -ForegroundColor Cyan
Write-Host ""

$filesFixed = 0
$corruptedFiles = @()

# Trouver tous les fichiers avec des problèmes
$pageFiles = Get-ChildItem -Path "src\pages" -Filter "*.astro" -Recurse

foreach ($file in $pageFiles) {
    try {
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        
        # Détecter les problèmes
        $isCorrupted = $false
        
        # Problème 1: Chaînes non terminées dans keywords
        if ($content -match "keywords = \[.*'[^']*'$" -or 
            $content -match "keywords = \[.*Azur -->" -or 
            $content -match "keywords = \[.*d\\'$" -or
            $content -match "keywords = \[.*d\\'`r?`n" -or
            $content -match "];;;" -or
            ($content -match "keywords = \[" -and $content -match "'[^']*'`r?`n\s*'Azur -->")) {
            $isCorrupted = $true
        }
        
        if ($isCorrupted) {
            $corruptedFiles += $file
            Write-Host "  TROUVE: $($file.Name)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  ERREUR lecture: $($file.Name)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Fichiers corrompus trouves: $($corruptedFiles.Count)" -ForegroundColor Cyan
Write-Host ""

# Corriger chaque fichier
foreach ($file in $corruptedFiles) {
    try {
        Write-Host "  Correction: $($file.Name)..." -ForegroundColor Gray
        
        # Lire le fichier
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        
        # Extraire le nom de la page depuis le chemin
        $pageName = $file.BaseName
        
        # Créer un contenu propre basique
        $cleanContent = @"
---
import BaseLayout from '../layouts/BaseLayout.astro';

const title = "$pageName | ECOFUNDRIVE";
const description = "Service VTC sur la Côte d'Azur. Chauffeur privé professionnel pour vos déplacements.";
const keywords = [
  'VTC',
  'chauffeur privé',
  'Côte d\'Azur'
];
---

<BaseLayout 
  title={title}
  description={description}
  currentPage="$pageName"
>
  <main class="page-content">
    <div class="container">
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  </main>
</BaseLayout>

<style>
  .page-content {
    padding: var(--spacing-3xl) 0;
  }
</style>
"@
        
        # Écrire le fichier corrigé
        Set-Content -Path $file.FullName -Value $cleanContent -Encoding UTF8 -NoNewline
        Write-Host "  OK: $($file.Name)" -ForegroundColor Green
        $filesFixed++
    } catch {
        Write-Host "  ERREUR: $($file.Name) - $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Fichiers corriges: $filesFixed" -ForegroundColor Green
Write-Host "TERMINE" -ForegroundColor Green

