# Script pour corriger la syntaxe des tableaux keywords dans les pages .astro
$ErrorActionPreference = "Stop"

Write-Host "CORRECTION SYNTAXE KEYWORDS" -ForegroundColor Cyan
Write-Host ""

$filesModified = 0
$filesSkipped = 0

$pageFiles = Get-ChildItem -Path "src\pages" -Filter "*.astro" -Recurse

foreach ($file in $pageFiles) {
    try {
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        
        # Pattern pour trouver les tableaux keywords mal formés (éléments séparés par espaces au lieu de virgules)
        # Exemple: ['mot1' 'mot2'] au lieu de ['mot1', 'mot2']
        $pattern = "keywords\s*=\s*\[\s*'([^']+)'\s+'([^']+)'(\s+'([^']+)')*\]"
        
        if ($content -match $pattern) {
            # Extraire tous les mots-clés
            $matches = [regex]::Matches($content, "'([^']+)'")
            $keywords = @()
            
            foreach ($match in $matches) {
                if ($match.Groups[1].Value) {
                    $keywords += $match.Groups[1].Value
                }
            }
            
            # Reconstruire le tableau avec des virgules
            $keywordsString = ($keywords | ForEach-Object { "  '$_'" }) -join ",`n"
            $newKeywords = "const keywords = [`n$keywordsString`n];"
            
            # Remplacer l'ancien tableau
            $oldPattern = "const keywords = \[[^\]]+\];"
            $newContent = $content -replace $oldPattern, $newKeywords
            
            if ($newContent -ne $content) {
                Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8 -NoNewline
                Write-Host "  OK $($file.Name) - $($keywords.Count) mots-cles" -ForegroundColor Green
                $filesModified++
            } else {
                Write-Host "  SKIP $($file.Name) - Pas de changement" -ForegroundColor Gray
                $filesSkipped++
            }
        } else {
            Write-Host "  SKIP $($file.Name) - Pas de pattern" -ForegroundColor Gray
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

