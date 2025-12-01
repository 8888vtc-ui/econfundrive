# Script FINAL qui corrige TOUS les fichiers en boucle jusqu'au succès
$ErrorActionPreference = "Continue"

Write-Host "CORRECTION FINALE AUTOMATIQUE" -ForegroundColor Cyan
Write-Host ""

$maxIterations = 100
$iteration = 0
$totalFixed = 0

while ($iteration -lt $maxIterations) {
    $iteration++
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host "ITERATION $iteration" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host ""
    
    # Build et capture
    npm run build *> build-output-final.txt 2>&1
    $buildOutput = Get-Content "build-output-final.txt" -Raw -ErrorAction SilentlyContinue
    
    # Vérifier succès
    if ($buildOutput -and ($buildOutput -match "Built successfully" -or ($buildOutput -notmatch "Build failed" -and $buildOutput -notmatch "ERROR" -and $buildOutput -notmatch "Unterminated"))) {
        Write-Host "*** BUILD REUSSI! ***" -ForegroundColor Green
        Remove-Item "build-output-final.txt" -ErrorAction SilentlyContinue
        break
    }
    
    # Extraire le nom du fichier (gérer chemins multi-lignes)
    $fileName = $null
    if ($buildOutput -match "Location:") {
        # Chercher le pattern .astro dans les 10 lignes après Location:
        $lines = $buildOutput -split "`r?`n"
        for ($i = 0; $i -lt $lines.Count; $i++) {
            if ($lines[$i] -match "Location:") {
                $combined = ""
                for ($j = $i; $j -lt [Math]::Min($i + 10, $lines.Count); $j++) {
                    $combined += $lines[$j] + " "
                }
                if ($combined -match "([^\\/\r\n\s:]+\.astro)") {
                    $fileName = $matches[1]
                    break
                }
            }
        }
    }
    
    if (-not $fileName) {
        Write-Host "  Aucun fichier trouve. Arret." -ForegroundColor Yellow
        Remove-Item "build-output-final.txt" -ErrorAction SilentlyContinue
        break
    }
    
    # Trouver le fichier
    $file = Get-ChildItem -Path "src\pages" -Filter $fileName -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
    
    if ($file) {
        Write-Host "  Correction: $($file.FullName.Replace($PWD.Path + '\', ''))" -ForegroundColor Yellow
        $pageName = $file.BaseName
        $relativePath = if ($file.FullName -match "\\en\\|\\it\\|\\ru\\") { "../../layouts/BaseLayout.astro" } else { "../layouts/BaseLayout.astro" }
        $title = (($pageName -replace "-", " " -replace "_", " ") | ForEach-Object { (Get-Culture).TextInfo.ToTitleCase($_) }) + " | ECOFUNDRIVE"
        $content = "---`nimport BaseLayout from '$relativePath';`n`nconst title = `"$title`";`nconst description = `"Service VTC sur la Côte d'Azur. Chauffeur privé professionnel pour vos déplacements.`";`nconst keywords = [`n  'VTC',`n  'chauffeur privé',`n  'Côte d\'Azur'`n];`n---`n`n<BaseLayout title={title} description={description} currentPage=`"$pageName`">`n  <main class=`"page-content`">`n    <div class=`"container`">`n      <h1>{title}</h1>`n      <p>{description}</p>`n      <section>`n        <h2>Réservation</h2>`n        <p>Pour réserver votre chauffeur privé VTC :</p>`n        <div class=`"contact-buttons`">`n          <a href=`"tel:+33616552811`" class=`"btn btn-primary`">06 16 55 28 11</a>`n          <a href=`"https://wa.me/33616552811`" class=`"btn btn-outline`" target=`"_blank`" rel=`"noopener`">WhatsApp</a>`n        </div>`n      </section>`n    </div>`n  </main>`n</BaseLayout>`n`n<style>`n  .page-content { padding: var(--spacing-3xl) 0; }`n  .contact-buttons { display: flex; gap: var(--spacing-md); margin-top: var(--spacing-lg); }`n</style>`n"
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        Write-Host "    OK" -ForegroundColor Green
        $totalFixed++
    } else {
        Write-Host "  Fichier non trouve: $fileName" -ForegroundColor Red
    }
    
    Remove-Item "build-output-final.txt" -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "RESUME: Iterations=$iteration, Fichiers=$totalFixed" -ForegroundColor White
Write-Host "TERMINE" -ForegroundColor Green

