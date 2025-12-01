# Script simple pour corriger les tableaux keywords
$ErrorActionPreference = "Stop"

Write-Host "CORRECTION FINALE KEYWORDS" -ForegroundColor Cyan
Write-Host ""

$filesModified = 0

$pageFiles = Get-ChildItem -Path "src\pages" -Filter "*.astro" -Recurse

foreach ($file in $pageFiles) {
    try {
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        $originalContent = $content
        
        # 1. Corriger les ];;; en ];
        $content = $content -replace "\];;;+", "];"
        
        # 2. Corriger les chaînes non terminées dans keywords (ligne se terminant par ' sans virgule ni guillemet)
        # Pattern: 'mot' suivi de ]; ou ];;; ou ligne vide puis ];
        if ($content -match "keywords\s*=\s*\[") {
            # Trouver toutes les lignes avec des chaînes non terminées dans le contexte keywords
            $lines = $content -split "`n"
            $newLines = @()
            $inKeywords = $false
            $fixed = $false
            
            for ($i = 0; $i -lt $lines.Count; $i++) {
                $line = $lines[$i]
                
                if ($line -match "keywords\s*=\s*\[") {
                    $inKeywords = $true
                }
                
                if ($inKeywords) {
                    # Si la ligne se termine par ' sans virgule ni guillemet fermant, corriger
                    if ($line -match "^(\s*)'([^']*)'$" -and $line -notmatch "," -and $line -notmatch "'[^']*',") {
                        # C'est une chaîne non terminée, la compléter
                        $keyword = $matches[2]
                        if ($keyword -match "Côte d\\?$" -or $keyword -match "d\\?$") {
                            $line = $line -replace "'([^']*)'$", "'`$1Azur',"
                            $fixed = $true
                        } elseif ($keyword.Length -gt 1) {
                            $line = $line + ","
                            $fixed = $true
                        }
                    }
                    
                    # Si la ligne suivante est ]; ou ];;;, s'assurer que la ligne actuelle se termine par ,
                    if ($i + 1 -lt $lines.Count -and $lines[$i + 1] -match "^\s*\];") {
                        if ($line -match "^(\s*)'([^']+)'$" -and $line -notmatch ",") {
                            $line = $line + ","
                            $fixed = $true
                        }
                    }
                }
                
                if ($line -match "\];") {
                    $inKeywords = $false
                }
                
                $newLines += $line
            }
            
            if ($fixed) {
                $content = $newLines -join "`n"
            }
        }
        
        # 3. Corriger les tableaux keywords avec éléments séparés par espaces
        if ($content -match "keywords\s*=\s*\[\s*'[^']+'\s+'[^']+'") {
            $keywordMatches = [regex]::Matches($content, "'([^']+)'")
            $keywords = @()
            
            foreach ($match in $keywordMatches) {
                $keyword = $match.Groups[1].Value.Trim()
                if ($keyword -and $keyword.Length -gt 1 -and $keyword -notmatch "^\.\.\/" -and $keyword -notmatch "^Azur\.") {
                    $keywords += $keyword
                }
            }
            
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

