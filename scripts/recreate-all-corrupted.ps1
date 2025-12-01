# Script pour RECREER tous les fichiers corrompus
$ErrorActionPreference = "Stop"

Write-Host "RECREATION TOUS FICHIERS CORROMPUS" -ForegroundColor Cyan
Write-Host ""

$filesRecreated = 0
$corruptedFiles = @()

# Trouver tous les fichiers .astro
$pageFiles = Get-ChildItem -Path "src\pages" -Filter "*.astro" -Recurse

foreach ($file in $pageFiles) {
    try {
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        
        # Détecter les problèmes de syntaxe
        $isCorrupted = $false
        
        # Problème 1: Chaînes non terminées dans keywords
        if ($content -match "keywords = \[.*'[^']*'$" -or 
            $content -match "keywords = \[.*Azur -->" -or 
            $content -match "keywords = \[.*d\\'$" -or
            $content -match "keywords = \[.*d\\'`r?`n" -or
            $content -match "];;;" -or
            $content -match "keywords = \[.*'[^']*'`r?`n\s*'Azur -->" -or
            $content -match "keywords = \[.*'[^']*'`r?`n\s*'Azur'`r?`n\s*\];" -or
            ($content -match "keywords = \[" -and $content -match "'[^']*'`r?`n\s*'Azur -->")) {
            $isCorrupted = $true
        }
        
        # Problème 2: Duplications de const keywords
        $keywordsCount = ([regex]::Matches($content, "const keywords = \[")).Count
        if ($keywordsCount -gt 1) {
            $isCorrupted = $true
        }
        
        # Problème 3: Chaînes avec encodage corrompu
        if ($content -match "privÃ©" -or $content -match "CÃ´te" -or $content -match "dAzur" -and $content -notmatch "d'Azur") {
            # Vérifier si c'est vraiment corrompu (pas juste dans les commentaires)
            if ($content -match "const keywords = \[.*privÃ©" -or $content -match "const keywords = \[.*CÃ´te" -or $content -match "const keywords = \[.*dAzur") {
                $isCorrupted = $true
            }
        }
        
        if ($isCorrupted) {
            $corruptedFiles += $file
            Write-Host "  CORROMPU: $($file.Name)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  ERREUR lecture: $($file.Name)" -ForegroundColor Red
        $corruptedFiles += $file
    }
}

Write-Host ""
Write-Host "Fichiers corrompus trouves: $($corruptedFiles.Count)" -ForegroundColor Cyan
Write-Host ""

# Recréer chaque fichier
foreach ($file in $corruptedFiles) {
    try {
        Write-Host "  Recreation: $($file.Name)..." -ForegroundColor Gray
        
        # Extraire le nom de la page depuis le chemin
        $pageName = $file.BaseName
        
        # Déterminer le chemin relatif pour BaseLayout
        $relativePath = ""
        if ($file.FullName -match "\\en\\") {
            $relativePath = "../../layouts/BaseLayout.astro"
        } elseif ($file.FullName -match "\\it\\|\\ru\\") {
            $relativePath = "../../layouts/BaseLayout.astro"
        } else {
            $relativePath = "../layouts/BaseLayout.astro"
        }
        
        # Créer un titre propre depuis le nom de fichier
        $title = $pageName -replace "-", " " -replace "_", " "
        $title = (Get-Culture).TextInfo.ToTitleCase($title)
        $title = "$title | ECOFUNDRIVE"
        
        # Créer un contenu propre
        $cleanContent = @"
---
import BaseLayout from '$relativePath';

const title = "$title";
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
      
      <section>
        <h2>Réservation</h2>
        <p>Pour réserver votre chauffeur privé VTC :</p>
        <div class="contact-buttons">
          <a href="tel:+33616552811" class="btn btn-primary">06 16 55 28 11</a>
          <a href="https://wa.me/33616552811" class="btn btn-outline" target="_blank" rel="noopener">WhatsApp</a>
        </div>
      </section>
    </div>
  </main>
</BaseLayout>

<style>
  .page-content {
    padding: var(--spacing-3xl) 0;
  }

  .contact-buttons {
    display: flex;
    gap: var(--spacing-md);
    margin-top: var(--spacing-lg);
  }
</style>
"@
        
        # Écrire le fichier recréé
        Set-Content -Path $file.FullName -Value $cleanContent -Encoding UTF8 -NoNewline
        Write-Host "  OK: $($file.Name)" -ForegroundColor Green
        $filesRecreated++
    } catch {
        Write-Host "  ERREUR: $($file.Name) - $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Fichiers recrees: $filesRecreated" -ForegroundColor Green
Write-Host "TERMINE" -ForegroundColor Green

