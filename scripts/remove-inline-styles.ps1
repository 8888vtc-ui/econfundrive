# Script pour supprimer tous les blocs <style> des fichiers .astro
# Usage: .\scripts\remove-inline-styles.ps1

$ErrorActionPreference = "Stop"

Write-Host "SUPPRESSION DES STYLES INLINE" -ForegroundColor Cyan
Write-Host ""

$filesModified = 0
$filesSkipped = 0

# Fonction pour supprimer les blocs <style>
function Remove-StyleBlocks {
    param([string]$content)
    
    # Pattern pour matcher <style>...</style> (y compris avec attributs)
    $pattern = '(?s)<style[^>]*>.*?</style>'
    
    # Supprimer tous les blocs style
    $newContent = $content -replace $pattern, ''
    
    return $newContent
}

# Traiter les pages
Write-Host "Traitement des pages..." -ForegroundColor Yellow
$pageFiles = Get-ChildItem -Path "src\pages" -Filter "*.astro" -Recurse

foreach ($file in $pageFiles) {
    try {
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        
        if ($content -match '<style') {
            $newContent = Remove-StyleBlocks -content $content
            
            # Vérifier si le contenu a changé
            if ($newContent -ne $content) {
                # Nettoyer les lignes vides multiples (max 2 lignes vides consécutives)
                $newContent = $newContent -replace "(\r?\n\s*){3,}", "`r`n`r`n"
                
                Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8 -NoNewline
                Write-Host "  OK $($file.Name)" -ForegroundColor Green
                $filesModified++
            } else {
                Write-Host "  WARN $($file.Name) - Aucun changement" -ForegroundColor Yellow
                $filesSkipped++
            }
        } else {
            Write-Host "  SKIP $($file.Name) - Pas de style" -ForegroundColor Gray
            $filesSkipped++
        }
    } catch {
        Write-Host "  ERREUR sur $($file.Name): $_" -ForegroundColor Red
    }
}

# Traiter les composants
Write-Host ""
Write-Host "Traitement des composants..." -ForegroundColor Yellow
$componentFiles = Get-ChildItem -Path "src\components" -Filter "*.astro" -Recurse -ErrorAction SilentlyContinue

if ($componentFiles) {
    foreach ($file in $componentFiles) {
        try {
            $content = Get-Content $file.FullName -Raw -Encoding UTF8
            
            if ($content -match '<style') {
                $newContent = Remove-StyleBlocks -content $content
                
                if ($newContent -ne $content) {
                    $newContent = $newContent -replace "(\r?\n\s*){3,}", "`r`n`r`n"
                    
                    Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8 -NoNewline
                    Write-Host "  OK $($file.Name)" -ForegroundColor Green
                    $filesModified++
                } else {
                    Write-Host "  WARN $($file.Name) - Aucun changement" -ForegroundColor Yellow
                    $filesSkipped++
                }
            } else {
                Write-Host "  SKIP $($file.Name) - Pas de style" -ForegroundColor Gray
                $filesSkipped++
            }
        } catch {
            Write-Host "  ERREUR sur $($file.Name): $_" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "RESUME:" -ForegroundColor Cyan
Write-Host "  Fichiers modifies: $filesModified" -ForegroundColor Green
Write-Host "  Fichiers ignores: $filesSkipped" -ForegroundColor Gray
Write-Host ""
Write-Host "TERMINE" -ForegroundColor Green

