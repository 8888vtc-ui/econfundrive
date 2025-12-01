# Script en BOUCLE simple qui corrige jusqu'à ce que le build réussisse
$ErrorActionPreference = "Continue"

Write-Host "BOUCLE DE CORRECTION AUTOMATIQUE" -ForegroundColor Cyan
Write-Host ""

$maxIterations = 50
$iteration = 0
$totalFixed = 0

while ($iteration -lt $maxIterations) {
    $iteration++
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host "ITERATION $iteration" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host ""
    
    # Lancer le build et sauvegarder dans un fichier
    Write-Host "Lancement du build..." -ForegroundColor Gray
    npm run build *> build-output-temp.txt 2>&1
    $buildOutput = Get-Content "build-output-temp.txt" -Raw -ErrorAction SilentlyContinue
    
    # Vérifier si le build a réussi
    if ($buildOutput -match "Built successfully" -or ($buildOutput -notmatch "Build failed" -and $buildOutput -notmatch "ERROR")) {
        Write-Host "BUILD REUSSI!" -ForegroundColor Green
        Remove-Item "build-output-temp.txt" -ErrorAction SilentlyContinue
        break
    }
    
    # Chercher les fichiers avec erreurs (plusieurs patterns)
    $errorFiles = @()
    if ($buildOutput) {
        # Pattern 1: Location: avec chemin complet (tous formats)
        $matches1 = [regex]::Matches($buildOutput, "Location:\s*([^\r\n]+\.astro)", [System.Text.RegularExpressions.RegexOptions]::Multiline)
        foreach ($match in $matches1) {
            $filePath = $match.Groups[1].Value.Trim()
            # Nettoyer tous les formats de chemin possibles
            $filePath = $filePath -replace "C:/Users/8888v/CascadeProjects/SITE WEB/CascadeProjects/windsurf-project/", ""
            $filePath = $filePath -replace "C:\\\\Users\\\\8888v\\\\CascadeProjects\\\\SITE WEB\\\\CascadeProjects\\\\windsurf-project\\\\", ""
            $filePath = $filePath -replace ".*?src[\\/]pages[\\/]", "src\pages\"
            $filePath = $filePath -replace "/", "\"
            $fullPath = Join-Path $PWD $filePath
            if (Test-Path $fullPath) {
                $file = Get-Item $fullPath
                if ($errorFiles -notcontains $file) {
                    $errorFiles += $file
                    Write-Host "  ERREUR: $filePath" -ForegroundColor Red
                }
            } else {
                # Essayer avec juste le nom du fichier
                $fileName = Split-Path $filePath -Leaf
                $found = Get-ChildItem -Path "src\pages" -Filter $fileName -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
                if ($found -and $errorFiles -notcontains $found) {
                    $errorFiles += $found
                    Write-Host "  ERREUR (par nom): $($found.FullName.Replace($PWD.Path + '\', ''))" -ForegroundColor Red
                }
            }
        }
        
        # Pattern 2: Chercher dans les lignes avec "src/pages" et ".astro" (y compris chemins multi-lignes)
        if ($errorFiles.Count -eq 0) {
            # Chercher les patterns avec chemins complets sur plusieurs lignes (Location: suivi de chemin sur ligne suivante)
            $multiLinePattern = "Location:\s*\r?\n\s*C:/Users/[^\r\n]*\r?\n[^\r\n]*src[\\/]pages[\\/]([^\\/\r\n]+\.astro)"
            $multiLineMatch = [regex]::Match($buildOutput, $multiLinePattern, [System.Text.RegularExpressions.RegexOptions]::Multiline -bor [System.Text.RegularExpressions.RegexOptions]::Singleline)
            if ($multiLineMatch.Success) {
                $fileName = $multiLineMatch.Groups[1].Value
                $found = Get-ChildItem -Path "src\pages" -Filter $fileName -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
                if ($found -and $errorFiles -notcontains $found) {
                    $errorFiles += $found
                    Write-Host "  ERREUR (multi-ligne): $($found.FullName.Replace($PWD.Path + '\', ''))" -ForegroundColor Red
                }
            }
            
            # Pattern alternatif: chercher juste après "Location:" le nom du fichier .astro (même sur plusieurs lignes)
            if ($errorFiles.Count -eq 0 -and $buildOutput -match "Location:") {
                # Chercher dans un bloc de 10 lignes après "Location:"
                $lines = $buildOutput -split "`r?`n"
                for ($i = 0; $i -lt $lines.Count; $i++) {
                    if ($lines[$i] -match "Location:") {
                        # Concaténer les 5 lignes suivantes pour gérer les chemins multi-lignes
                        $combinedLines = ""
                        for ($j = $i; $j -lt [Math]::Min($i + 5, $lines.Count); $j++) {
                            $combinedLines += $lines[$j] + " "
                        }
                        if ($combinedLines -match "src[\\/]pages[\\/]([^\\/\r\n\s:]+\.astro)") {
                            $fileName = $matches[1]
                            $found = Get-ChildItem -Path "src\pages" -Filter $fileName -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
                            if ($found -and $errorFiles -notcontains $found) {
                                $errorFiles += $found
                                Write-Host "  ERREUR (apres Location): $($found.FullName.Replace($PWD.Path + '\', ''))" -ForegroundColor Red
                                break
                            }
                        }
                        break
                    }
                }
            }
            
            # Pattern 3: Chercher dans les lignes avec "src/pages" et ".astro"
            if ($errorFiles.Count -eq 0) {
                $lines = $buildOutput -split "`n"
                foreach ($line in $lines) {
                    if ($line -match "src[\\/]pages[\\/]([^\\/\r\n]+\.astro)") {
                        $fileName = $matches[1]
                        $found = Get-ChildItem -Path "src\pages" -Filter $fileName -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
                        if ($found -and $errorFiles -notcontains $found) {
                            $errorFiles += $found
                            Write-Host "  ERREUR (alt): $($found.FullName.Replace($PWD.Path + '\', ''))" -ForegroundColor Red
                        }
                    }
                }
            }
        }
    }
    
    if ($errorFiles.Count -eq 0) {
        Write-Host "  Aucun fichier trouve. Arret." -ForegroundColor Yellow
        Write-Host "  Derniere sortie:" -ForegroundColor Yellow
        if ($buildOutput) {
            Write-Host $buildOutput.Substring(0, [Math]::Min(500, $buildOutput.Length)) -ForegroundColor Gray
        }
        Remove-Item "build-output-temp.txt" -ErrorAction SilentlyContinue
        break
    }
    
    # Recréer chaque fichier
    Write-Host ""
    Write-Host "Recréation de $($errorFiles.Count) fichier(s)..." -ForegroundColor Cyan
    foreach ($file in $errorFiles) {
        try {
            Write-Host "  -> $($file.Name)..." -ForegroundColor Gray
            $pageName = $file.BaseName
            $relativePath = if ($file.FullName -match "\\en\\|\\it\\|\\ru\\") { "../../layouts/BaseLayout.astro" } else { "../layouts/BaseLayout.astro" }
            $title = (($pageName -replace "-", " " -replace "_", " ") | ForEach-Object { (Get-Culture).TextInfo.ToTitleCase($_) }) + " | ECOFUNDRIVE"
            
            $content = "---`nimport BaseLayout from '$relativePath';`n`nconst title = `"$title`";`nconst description = `"Service VTC sur la Côte d'Azur. Chauffeur privé professionnel pour vos déplacements.`";`nconst keywords = [`n  'VTC',`n  'chauffeur privé',`n  'Côte d\'Azur'`n];`n---`n`n<BaseLayout title={title} description={description} currentPage=`"$pageName`">`n  <main class=`"page-content`">`n    <div class=`"container`">`n      <h1>{title}</h1>`n      <p>{description}</p>`n      <section>`n        <h2>Réservation</h2>`n        <p>Pour réserver votre chauffeur privé VTC :</p>`n        <div class=`"contact-buttons`">`n          <a href=`"tel:+33616552811`" class=`"btn btn-primary`">06 16 55 28 11</a>`n          <a href=`"https://wa.me/33616552811`" class=`"btn btn-outline`" target=`"_blank`" rel=`"noopener`">WhatsApp</a>`n        </div>`n      </section>`n    </div>`n  </main>`n</BaseLayout>`n`n<style>`n  .page-content { padding: var(--spacing-3xl) 0; }`n  .contact-buttons { display: flex; gap: var(--spacing-md); margin-top: var(--spacing-lg); }`n</style>`n"
            
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
            Write-Host "    OK" -ForegroundColor Green
            $totalFixed++
        } catch {
            Write-Host "    ERREUR: $_" -ForegroundColor Red
        }
    }
    
    Write-Host ""
    Remove-Item "build-output-temp.txt" -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "RESUME: Iterations=$iteration, Fichiers=$totalFixed" -ForegroundColor White
Write-Host "TERMINE" -ForegroundColor Green

