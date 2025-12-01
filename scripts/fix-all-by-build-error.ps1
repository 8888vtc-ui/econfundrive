# Script qui utilise le build pour trouver TOUS les fichiers corrompus
$ErrorActionPreference = "Stop"

Write-Host "DETECTION PAR BUILD - RECREATION AUTOMATIQUE" -ForegroundColor Cyan
Write-Host ""

$maxIterations = 10
$iteration = 0
$totalFixed = 0

while ($iteration -lt $maxIterations) {
    $iteration++
    Write-Host "Iteration $iteration..." -ForegroundColor Yellow
    
    # Lancer le build et capturer les erreurs
    $buildOutput = npm run build 2>&1 | Out-String -Width 1000
    if ($LASTEXITCODE -ne 0) {
        # Le build a échoué, continuer
    }
    
    # Chercher les fichiers avec erreurs
    $errorFiles = @()
    $matches = [regex]::Matches($buildOutput, "Location:\s*([^\r\n]+\.astro)")
    
    foreach ($match in $matches) {
        $filePath = $match.Groups[1].Value.Trim()
        # Convertir le chemin Windows en chemin relatif
        $filePath = $filePath -replace "C:/Users/8888v/CascadeProjects/SITE WEB/CascadeProjects/windsurf-project/", ""
        $filePath = $filePath -replace "/", "\"
        $fullPath = Join-Path $PWD $filePath
        
        if (Test-Path $fullPath) {
            $errorFiles += Get-Item $fullPath
            Write-Host "  ERREUR trouvee: $filePath" -ForegroundColor Red
        }
    }
    
    if ($errorFiles.Count -eq 0) {
        Write-Host "  Aucune erreur trouvee!" -ForegroundColor Green
        break
    }
    
    # Recréer chaque fichier avec erreur
    foreach ($file in $errorFiles) {
        try {
            Write-Host "  Recreation: $($file.Name)..." -ForegroundColor Gray
            
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
            
            # Créer un titre propre
            $title = $pageName -replace "-", " " -replace "_", " "
            $title = (Get-Culture).TextInfo.ToTitleCase($title)
            $title = "$title | ECOFUNDRIVE"
            
            # Contenu propre
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
            
            Set-Content -Path $file.FullName -Value $cleanContent -Encoding UTF8 -NoNewline
            Write-Host "  OK: $($file.Name)" -ForegroundColor Green
            $totalFixed++
        } catch {
            Write-Host "  ERREUR: $($file.Name) - $_" -ForegroundColor Red
        }
    }
    
    Write-Host ""
}

Write-Host ""
Write-Host "Total fichiers recrees: $totalFixed" -ForegroundColor Green
Write-Host "TERMINE" -ForegroundColor Green

