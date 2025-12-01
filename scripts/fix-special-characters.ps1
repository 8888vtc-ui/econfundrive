# Script pour corriger TOUS les caracteres speciaux mal encodes
$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "CORRECTION CARACTERES SPECIAUX" -ForegroundColor Cyan
Write-Host ""

$filesModified = 0

# Trouver tous les fichiers .astro
$pageFiles = Get-ChildItem -Path "src\pages" -Filter "*.astro" -Recurse

foreach ($file in $pageFiles) {
    try {
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        $originalContent = $content
        
        # Corrections avec remplacements multiples
        $content = $content -replace 'CÃ´te', 'Côte'
        $content = $content -replace 'privÃ©', 'privé'
        $content = $content -replace 'RÃ©servation', 'Réservation'
        $content = $content -replace 'rÃ©server', 'réserver'
        $content = $content -replace 'rÃ©servation', 'réservation'
        $content = $content -replace 'dÃ©placement', 'déplacement'
        $content = $content -replace 'dÃ©placements', 'déplacements'
        $content = $content -replace 'chauffeur privÃ©', 'chauffeur privé'
        
        # Caracteres individuels
        $content = $content -replace 'Ã©', 'é'
        $content = $content -replace 'Ã ', 'à'
        $content = $content -replace 'Ã§', 'ç'
        $content = $content -replace 'Ã¨', 'è'
        $content = $content -replace 'Ãª', 'ê'
        $content = $content -replace 'Ã®', 'î'
        $content = $content -replace 'Ã´', 'ô'
        $content = $content -replace 'Ã»', 'û'
        
        # Majuscules
        $content = $content -replace 'Ã‰', 'É'
        $content = $content -replace 'Ã€', 'À'
        $content = $content -replace 'Ã‡', 'Ç'
        $content = $content -replace 'Ãˆ', 'È'
        $content = $content -replace 'ÃŠ', 'Ê'
        $content = $content -replace 'ÃŽ', 'Î'
        $content = $content -replace 'Ã"', 'Ô'
        $content = $content -replace 'Ã›', 'Û'
        
        # Guillemets et apostrophes (utiliser des codes)
        $content = $content -replace [char]0x2019, "'"
        $content = $content -replace [char]0x201C, '"'
        $content = $content -replace [char]0x201D, '"'
        $content = $content -replace 'â€™', "'"
        $content = $content -replace 'â€œ', '"'
        $content = $content -replace 'â€', '"'
        
        if ($content -ne $originalContent) {
            # Sauvegarder en UTF-8 sans BOM
            $utf8NoBom = New-Object System.Text.UTF8Encoding $false
            [System.IO.File]::WriteAllText($file.FullName, $content, $utf8NoBom)
            Write-Host "  CORRIGE: $($file.FullName.Replace($PWD.Path + '\', ''))" -ForegroundColor Green
            $filesModified++
        }
    } catch {
        Write-Host "  ERREUR $($file.Name): $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Fichiers modifies: $filesModified" -ForegroundColor Green
Write-Host "TERMINE" -ForegroundColor Green
