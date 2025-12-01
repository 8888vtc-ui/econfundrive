# Script complet pour corriger TOUS les problèmes de keywords
$ErrorActionPreference = "Stop"

Write-Host "CORRECTION COMPLETE KEYWORDS" -ForegroundColor Cyan
Write-Host ""

$filesModified = 0

$pageFiles = Get-ChildItem -Path "src\pages" -Filter "*.astro" -Recurse

foreach ($file in $pageFiles) {
    try {
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        $originalContent = $content
        
        # 1. Fusionner les chaînes séparées: 'mot Côte d\', suivi de 'Azur',
        $content = $content -replace "'([^']* Côte d)\\'([^']*)',`r?`n\s+'Azur',", "'`$1\'Azur',"
        $content = $content -replace "'([^']* Côte d)\\'([^']*)'`r?`n\s+'Azur',", "'`$1\'Azur',"
        $content = $content -replace "'([^']* Côte d)\\'([^']*)'`r?`n\s+'Azur'`r?`n\s*\];", "'`$1\'Azur'`n];"
        
        # 2. Corriger les chaînes avec \Azur (manque apostrophe)
        $content = $content -replace "'([^']* Côte d)\\Azur'", "'`$1\'Azur'"
        
        # 3. Corriger les ];;; en ];
        $content = $content -replace "\];;;+", "];"
        
        # 4. Si le fichier a encore des problèmes, reconstruire complètement le tableau keywords
        if ($content -match "keywords\s*=\s*\[") {
            $keywordMatches = [regex]::Matches($content, "'([^']+)'")
            $keywords = @()
            
            foreach ($match in $keywordMatches) {
                $keyword = $match.Groups[1].Value.Trim()
                # Ignorer les mots-clés invalides ou partiels
                if ($keyword -and 
                    $keyword.Length -gt 1 -and 
                    $keyword -ne "Azur" -and
                    $keyword -notmatch "^\.\.\/" -and 
                    $keyword -notmatch "^Azur\." -and
                    $keyword -notmatch "^'") {
                    # Fusionner si c'est "Côte d" suivi de "Azur" dans les matches suivants
                    if ($keyword -match "Côte d\\?$") {
                        # Chercher le match suivant qui est "Azur"
                        $nextIndex = $match.Index + $match.Length
                        $nextMatch = $keywordMatches | Where-Object { $_.Index -gt $nextIndex -and $_.Groups[1].Value.Trim() -eq "Azur" } | Select-Object -First 1
                        if ($nextMatch) {
                            $keyword = $keyword + "'Azur"
                            # Ignorer le match "Azur" suivant
                            continue
                        }
                    }
                    $keywords += $keyword
                }
            }
            
            # Si on a des mots-clés valides, reconstruire
            if ($keywords.Count -gt 0) {
                $keywordsString = ($keywords | ForEach-Object { "  '$_'" }) -join ",`n"
                $newKeywords = "const keywords = [`n$keywordsString`n];"
                $oldPattern = "const keywords = \[[^\]]+\];"
                $content = $content -replace $oldPattern, $newKeywords
            }
        }
        
        if ($content -ne $originalContent) {
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
            Write-Host "  OK $($file.Name)" -ForegroundColor Green
            $filesModified++
        }
    } catch {
        Write-Host "  ERREUR $($file.Name): $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Fichiers modifies: $filesModified" -ForegroundColor Green
Write-Host "TERMINE" -ForegroundColor Green

