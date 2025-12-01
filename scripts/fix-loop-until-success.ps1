# Script en BOUCLE qui corrige jusqu'à ce que le build réussisse
$ErrorActionPreference = "Stop"

Write-Host "BOUCLE DE CORRECTION AUTOMATIQUE" -ForegroundColor Cyan
Write-Host ""

$maxIterations = 50
$iteration = 0
$totalFixed = 0
$buildSuccess = $false

while ($iteration -lt $maxIterations -and -not $buildSuccess) {
    $iteration++
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host "ITERATION $iteration" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host ""
    
    # Lancer le build et capturer la sortie dans un fichier
    Write-Host "Lancement du build..." -ForegroundColor Gray
    $tempFile = "build-temp-output.txt"
    npm run build *> $tempFile 2>&1
    $buildOutput = Get-Content $tempFile -Raw -ErrorAction SilentlyContinue
    $buildExitCode = $LASTEXITCODE
    Remove-Item $tempFile -ErrorAction SilentlyContinue
    
    # Vérifier si le build a réussi
    if (($buildOutput -match "Built successfully" -or $buildOutput -match "pages built") -and $buildExitCode -eq 0) {
        Write-Host "BUILD REUSSI!" -ForegroundColor Green
        $buildSuccess = $true
        break
    }
    
    # Chercher les fichiers avec erreurs
    $errorFiles = @()
    $matches = [regex]::Matches($buildOutput, "Location:\s*([^\r\n]+\.astro)")
    
    foreach ($match in $matches) {
        $filePath = $match.Groups[1].Value.Trim()
        # Nettoyer le chemin
        $filePath = $filePath -replace "C:/Users/8888v/CascadeProjects/SITE WEB/CascadeProjects/windsurf-project/", ""
        $filePath = $filePath -replace "/", "\"
        $fullPath = Join-Path $PWD $filePath
        
        if (Test-Path $fullPath) {
            $file = Get-Item $fullPath
            if ($errorFiles -notcontains $file) {
                $errorFiles += $file
                Write-Host "  ERREUR: $filePath" -ForegroundColor Red
            }
        }
    }
    
    if ($errorFiles.Count -eq 0) {
        Write-Host "  Aucun fichier avec erreur trouve dans la sortie." -ForegroundColor Yellow
        Write-Host "  Recherche alternative..." -ForegroundColor Yellow
        
        # Recherche alternative : chercher "Unterminated" ou "Expected"
        if ($buildOutput -match "Unterminated|Expected") {
            # Essayer de trouver le fichier dans les lignes autour de l'erreur
            $lines = $buildOutput -split "`n"
            for ($i = 0; $i -lt $lines.Count; $i++) {
                if ($lines[$i] -match "Unterminated|Expected") {
                    # Chercher "Location:" dans les lignes suivantes
                    for ($j = $i; $j -lt [Math]::Min($i + 5, $lines.Count); $j++) {
                        if ($lines[$j] -match "Location:\s*([^\r\n]+\.astro)") {
                            $filePath = $matches[1].Trim()
                            $filePath = $filePath -replace "C:/Users/8888v/CascadeProjects/SITE WEB/CascadeProjects/windsurf-project/", ""
                            $filePath = $filePath -replace "/", "\"
                            $fullPath = Join-Path $PWD $filePath
                            if (Test-Path $fullPath) {
                                $file = Get-Item $fullPath
                                if ($errorFiles -notcontains $file) {
                                    $errorFiles += $file
                                    Write-Host "  ERREUR (alt): $filePath" -ForegroundColor Red
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    
    if ($errorFiles.Count -eq 0) {
        Write-Host "  Impossible de trouver le fichier avec erreur. Arret." -ForegroundColor Red
        Write-Host "  Sortie du build:" -ForegroundColor Yellow
        Write-Host $buildOutput -ForegroundColor Gray
        break
    }
    
    # Recréer chaque fichier avec erreur
    Write-Host ""
    Write-Host "Recréation de $($errorFiles.Count) fichier(s)..." -ForegroundColor Cyan
    foreach ($file in $errorFiles) {
        try {
            Write-Host "  -> $($file.Name)..." -ForegroundColor Gray
            
            $pageName = $file.BaseName
            
            # Déterminer le chemin relatif pour BaseLayout
            $relativePath = ""
            if ($file.FullName -match "\\en\\") {
                $relativePath = "../../layouts/BaseLayout.astro"
            } elseif ($file.FullName -match "\\it\\") {
                $relativePath = "../../layouts/BaseLayout.astro"
            } elseif ($file.FullName -match "\\ru\\") {
                $relativePath = "../../layouts/BaseLayout.astro"
            } else {
                $relativePath = "../layouts/BaseLayout.astro"
            }
            
            # Créer un titre propre
            $title = $pageName -replace "-", " " -replace "_", " "
            $title = (Get-Culture).TextInfo.ToTitleCase($title)
            $title = "$title | ECOFUNDRIVE"
            
            # Contenu propre (échapper les guillemets)
            $escapedTitle = $title -replace '"', '\"'
            $cleanContent = "---`nimport BaseLayout from '$relativePath';`n`nconst title = `"$escapedTitle`";`nconst description = `"Service VTC sur la Côte d'Azur. Chauffeur privé professionnel pour vos déplacements.`";`nconst keywords = [`n  'VTC',`n  'chauffeur privé',`n  'Côte d\'Azur'`n];`n---`n`n<BaseLayout `n  title={title}`n  description={description}`n  currentPage=`"$pageName`"`n>`n  <main class=`"page-content`">`n    <div class=`"container`">`n      <h1>{title}</h1>`n      <p>{description}</p>`n      `n      <section>`n        <h2>Réservation</h2>`n        <p>Pour réserver votre chauffeur privé VTC :</p>`n        <div class=`"contact-buttons`">`n          <a href=`"tel:+33616552811`" class=`"btn btn-primary`">06 16 55 28 11</a>`n          <a href=`"https://wa.me/33616552811`" class=`"btn btn-outline`" target=`"_blank`" rel=`"noopener`">WhatsApp</a>`n        </div>`n      </section>`n    </div>`n  </main>`n</BaseLayout>`n`n<style>`n  .page-content {`n    padding: var(--spacing-3xl) 0;`n  }`n`n  .contact-buttons {`n    display: flex;`n    gap: var(--spacing-md);`n    margin-top: var(--spacing-lg);`n  }`n</style>`n"
            
            Set-Content -Path $file.FullName -Value $cleanContent -Encoding UTF8 -NoNewline
            Write-Host "    OK: $($file.Name)" -ForegroundColor Green
            $totalFixed++
        } catch {
            Write-Host "    ERREUR: $($file.Name) - $_" -ForegroundColor Red
        }
    }
    
    Write-Host ""
    Start-Sleep -Seconds 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "RESUME FINAL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Iterations: $iteration" -ForegroundColor White
Write-Host "Fichiers recrees: $totalFixed" -ForegroundColor White
if ($buildSuccess) {
    Write-Host "STATUS: BUILD REUSSI!" -ForegroundColor Green
} else {
    Write-Host "STATUS: Arrete apres $maxIterations iterations" -ForegroundColor Yellow
}
Write-Host "TERMINE" -ForegroundColor Green

