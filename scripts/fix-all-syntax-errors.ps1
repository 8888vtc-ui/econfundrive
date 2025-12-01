# Script pour corriger TOUS les problèmes de syntaxe dans les fichiers .astro
$ErrorActionPreference = "Stop"

Write-Host "CORRECTION COMPLETE DES ERREURS DE SYNTAXE" -ForegroundColor Cyan
Write-Host ""

$filesModified = 0
$filesSkipped = 0
$errors = 0

$pageFiles = Get-ChildItem -Path "src\pages" -Filter "*.astro" -Recurse

foreach ($file in $pageFiles) {
    try {
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        $originalContent = $content
        $changed = $false
        
        # 1. Corriger les imports BaseLayout dans les sous-dossiers (en/, it/, ru/)
        if ($file.FullName -match "\\en\\|\\it\\|\\ru\\") {
            if ($content -match "import BaseLayout from '\.\./layouts") {
                $content = $content -replace "import BaseLayout from '\.\./layouts", "import BaseLayout from '../../layouts"
                $changed = $true
            }
        }
        
        # 2. Corriger les tableaux keywords avec chaînes non terminées
        # Pattern: 'mot' sans virgule ou guillemet fermant
        if ($content -match "keywords\s*=\s*\[") {
            # Trouver la section keywords
            $keywordsMatch = [regex]::Match($content, "const keywords = \[([^\]]+)\];", [System.Text.RegularExpressions.RegexOptions]::Singleline)
            
            if ($keywordsMatch.Success) {
                $keywordsContent = $keywordsMatch.Groups[1].Value
                
                # Extraire tous les mots-clés valides (entre guillemets simples complets)
                $keywordMatches = [regex]::Matches($keywordsContent, "'([^']+)'")
                $keywords = @()
                
                foreach ($match in $keywordMatches) {
                    $keyword = $match.Groups[1].Value.Trim()
                    # Ignorer les mots-clés invalides
                    if ($keyword -and 
                        $keyword.Length -gt 1 -and 
                        $keyword -notmatch "^\.\.\/" -and 
                        $keyword -notmatch "^Azur\." -and
                        $keyword -notmatch "^'") {
                        $keywords += $keyword
                    }
                }
                
                # Si on a trouvé des mots-clés valides, reconstruire le tableau
                if ($keywords.Count -gt 0) {
                    $keywordsString = ($keywords | ForEach-Object { "  '$_'" }) -join ",`n"
                    $newKeywords = "const keywords = [`n$keywordsString`n];"
                    
                    # Remplacer l'ancien tableau (pattern plus large pour capturer tout)
                    $oldPattern = "const keywords = \[[^\]]+\];"
                    $content = $content -replace $oldPattern, $newKeywords
                    $changed = $true
                } else {
                    # Si aucun mot-clé valide, créer un tableau vide ou avec des mots-clés par défaut
                    $newKeywords = "const keywords = [`n  'VTC',`n  'chauffeur privé'`n];"
                    $oldPattern = "const keywords = \[[^\]]+\];"
                    $content = $content -replace $oldPattern, $newKeywords
                    $changed = $true
                }
            }
        }
        
        # 3. Corriger les chaînes non terminées dans les tableaux keywords
        # Pattern: 'mot' suivi directement de ]; sans virgule
        if ($content -match "keywords\s*=\s*\[") {
            # Remplacer 'mot'] par 'mot',] dans les tableaux keywords
            $content = $content -replace "('([^']+)')\s*\]", "`$1,`n];"
            # Puis nettoyer les virgules en double avant ]
            $content = $content -replace ",\s*,\s*\]", ",`n];"
            $content = $content -replace ",\s*\]", "`n];"
            if ($content -ne $originalContent) {
                $changed = $true
            }
        }
        
        # 4. Corriger les tableaux keywords avec éléments séparés par espaces au lieu de virgules
        # Pattern: ['mot1' 'mot2'] -> ['mot1', 'mot2']
        if ($content -match "keywords\s*=\s*\[\s*'[^']+'\s+'[^']+'") {
            # Extraire tous les mots-clés
            $allMatches = [regex]::Matches($content, "'([^']+)'")
            $keywords = @()
            
            foreach ($match in $allMatches) {
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
                $changed = $true
            }
        }
        
        # 5. Nettoyer les duplications de "const keywords"
        if (([regex]::Matches($content, "const keywords = \[")).Count -gt 1) {
            # Garder seulement le premier
            $firstMatch = [regex]::Match($content, "const keywords = \[[^\]]+\];", [System.Text.RegularExpressions.RegexOptions]::Singleline)
            if ($firstMatch.Success) {
                $firstKeywords = $firstMatch.Value
                $content = $content -replace "const keywords = \[[^\]]+\];", ""
                # Remettre le premier au bon endroit
                $content = $content -replace "(import BaseLayout[^;]+;)", "`$1`n`nconst keywords = [`n  'VTC',`n  'chauffeur privé'`n];"
                $changed = $true
            }
        }
        
        if ($changed -and $content -ne $originalContent) {
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
            Write-Host "  OK $($file.Name)" -ForegroundColor Green
            $filesModified++
        } else {
            $filesSkipped++
        }
    } catch {
        Write-Host "  ERREUR sur $($file.Name): $_" -ForegroundColor Red
        $errors++
    }
}

Write-Host ""
Write-Host "RESUME:" -ForegroundColor Cyan
Write-Host "  Fichiers modifiés: $filesModified" -ForegroundColor Green
Write-Host "  Fichiers ignorés: $filesSkipped" -ForegroundColor Gray
if ($errors -gt 0) {
    Write-Host "  Erreurs: $errors" -ForegroundColor Red
}
Write-Host ""
Write-Host "TERMINE" -ForegroundColor Green

