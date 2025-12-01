# Script pour corriger l'encodage UTF-8 dans les fichiers .astro

Write-Host "Correction de l'encodage UTF-8 dans les fichiers sources..." -ForegroundColor Cyan

# Dictionnaire des corrections
$corrections = @{
    'coÃ»te' = 'coûte'
    'CÃ´te' = 'Côte'
    'Ã©' = 'é'
    'Ã¨' = 'è'
    'Ãª' = 'ê'
    'Ã ' = 'à'
    'Ã§' = 'ç'
    'Ã¹' = 'ù'
    'Ã®' = 'î'
    'Ã´' = 'ô'
    'Ã«' = 'ë'
    'Ã¯' = 'ï'
    'Ã¼' = 'ü'
    'Ã‰' = 'É'
    'Ã€' = 'À'
    'aÃ©roport' = 'aéroport'
    'privÃ©' = 'privé'
    'rÃ©server' = 'réserver'
    'dÃ©placements' = 'déplacements'
    'RÃ©servation' = 'Réservation'
    'clÃ©s' = 'clés'
    'intÃ©grer' = 'intégrer'
}

# Trouver tous les fichiers .astro
$files = Get-ChildItem -Path ".\src\pages" -Filter "*.astro" -Recurse

$totalFiles = 0
$totalCorrections = 0

foreach ($file in $files) {
    Write-Host "Traitement: $($file.Name)" -ForegroundColor Yellow
    
    # Lire le contenu
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    $fileCorrections = 0
    
    # Appliquer corrections
    foreach ($wrong in $corrections.Keys) {
        $correct = $corrections[$wrong]
        if ($content -match [regex]::Escape($wrong)) {
            $count = ([regex]::Matches($content, [regex]::Escape($wrong))).Count
            $content = $content -replace [regex]::Escape($wrong), $correct
            $fileCorrections += $count
            Write-Host "  Corrige: $wrong -> $correct ($count fois)" -ForegroundColor Green
        }
    }
    
    # Sauvegarder si modifié
    if ($content -ne $originalContent) {
        $utf8NoBom = New-Object System.Text.UTF8Encoding $false
        [System.IO.File]::WriteAllText($file.FullName, $content, $utf8NoBom)
        
        $totalFiles++
        $totalCorrections += $fileCorrections
        Write-Host "  Sauvegarde: $fileCorrections corrections" -ForegroundColor Cyan
    }
}

Write-Host ""
Write-Host "TERMINE!" -ForegroundColor Green
Write-Host "Fichiers corriges: $totalFiles" -ForegroundColor White
Write-Host "Total corrections: $totalCorrections" -ForegroundColor White
Write-Host ""
Write-Host "PROCHAINE ETAPE: npm run build" -ForegroundColor Yellow
