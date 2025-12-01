# Script pour corriger TOUS les tableaux keywords mal formés
$ErrorActionPreference = "Stop"

Write-Host "CORRECTION COMPLÈTE KEYWORDS" -ForegroundColor Cyan
Write-Host ""

$filesModified = 0
$filesSkipped = 0

$pageFiles = Get-ChildItem -Path "src\pages" -Filter "*.astro" -Recurse

foreach ($file in $pageFiles) {
    try {
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        $originalContent = $content
        
        # Pattern 1: ['mot1' 'mot2'] -> ['mot1', 'mot2']
        $pattern1 = "keywords\s*=\s*\[\s*'([^']+)'\s+'([^']+)'(\s+'([^']+)')*\s*\]"
        if ($content -match $pattern1) {
            # Extraire tous les mots-clés
            $matches = [regex]::Matches($content, "'([^']+)'")
            $keywords = @()
            
            foreach ($match in $matches) {
                if ($match.Groups[1].Value -and $match.Groups[1].Value -notmatch "^[,\s]*$") {
                    $keywords += $match.Groups[1].Value
                }
            }
            
            if ($keywords.Count -gt 0) {
                # Reconstruire le tableau avec des virgules
                $keywordsString = ($keywords | ForEach-Object { "  '$_'" }) -join ",`n"
                $newKeywords = "const keywords = [`n$keywordsString`n];"
                
                # Remplacer l'ancien tableau (pattern plus large)
                $oldPattern = "const keywords = \[[^\]]+\];"
                $content = $content -replace $oldPattern, $newKeywords
            }
        }
        
        # Pattern 2: Corriger les virgules manquantes dans les tableaux multi-éléments
        $pattern2 = "keywords\s*=\s*\[\s*'([^']+)',\s*'([^']+)'\s+'([^']+)'"
        if ($content -match $pattern2) {
            $content = $content -replace "('\s+)'", "',`n  '"
        }
        
        if ($content -ne $originalContent) {
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
            Write-Host "  OK $($file.Name)" -ForegroundColor Green
            $filesModified++
        } else {
            $filesSkipped++
        }
    } catch {
        Write-Host "  ERREUR sur $($file.Name): $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "RESUME:" -ForegroundColor Cyan
Write-Host "  Fichiers modifies: $filesModified" -ForegroundColor Green
Write-Host "  Fichiers ignores: $filesSkipped" -ForegroundColor Gray
Write-Host ""
Write-Host "TERMINE" -ForegroundColor Green

