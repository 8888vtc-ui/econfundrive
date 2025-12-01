# Script final pour corriger TOUS les tableaux keywords
$ErrorActionPreference = "Stop"

Write-Host "CORRECTION FINALE KEYWORDS - TOUS LES FICHIERS" -ForegroundColor Cyan
Write-Host ""

$filesModified = 0
$filesSkipped = 0

$pageFiles = Get-ChildItem -Path "src\pages" -Filter "*.astro" -Recurse

foreach ($file in $pageFiles) {
    try {
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        $originalContent = $content
        $changed = $false
        
        # Pattern: trouver tous les tableaux keywords avec éléments séparés par espaces
        # Exemple: ['mot1' 'mot2'] ou ['mot1', 'mot2' 'mot3']
        if ($content -match "keywords\s*=\s*\[") {
            # Extraire la section keywords complète
            $keywordsMatch = [regex]::Match($content, "const keywords = \[([^\]]+)\];", [System.Text.RegularExpressions.RegexOptions]::Singleline)
            
            if ($keywordsMatch.Success) {
                $keywordsContent = $keywordsMatch.Groups[1].Value
                
                # Extraire tous les mots-clés (entre guillemets simples)
                $keywordMatches = [regex]::Matches($keywordsContent, "'([^']+)'")
                $keywords = @()
                
                foreach ($match in $keywordMatches) {
                    $keyword = $match.Groups[1].Value.Trim()
                    # Ignorer les mots-clés vides ou invalides
                    if ($keyword -and $keyword -notmatch "^[,\s]*$" -and $keyword -notmatch "^\.\.\/" -and $keyword.Length -gt 1) {
                        $keywords += $keyword
                    }
                }
                
                # Si on a trouvé des mots-clés valides, reconstruire le tableau
                if ($keywords.Count -gt 0) {
                    $keywordsString = ($keywords | ForEach-Object { "  '$_'" }) -join ",`n"
                    $newKeywords = "const keywords = [`n$keywordsString`n];"
                    
                    # Remplacer l'ancien tableau
                    $content = $content -replace "const keywords = \[[^\]]+\];", $newKeywords
                    $changed = $true
                }
            }
        }
        
        if ($changed -and $content -ne $originalContent) {
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
            Write-Host "  OK $($file.Name) - $($keywords.Count) mots-cles" -ForegroundColor Green
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

