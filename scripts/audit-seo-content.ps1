# Audit SEO On-Page et Contenu Complet - Site ECOFUNDRIVE
$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "AUDIT SEO ON-PAGE ET CONTENU COMPLET" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$report = @{
    TotalPages = 0
    PagesWithIssues = @()
    Statistics = @{}
}

# Trouver tous les fichiers .astro dans src/pages
$pageFiles = Get-ChildItem -Path "src\pages" -Filter "*.astro" -Recurse

$report.TotalPages = $pageFiles.Count

Write-Host "Analyse de $($pageFiles.Count) pages..." -ForegroundColor Yellow
Write-Host ""

foreach ($file in $pageFiles) {
    try {
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        $relativePath = $file.FullName.Replace($PWD.Path + '\', '')
        $pageIssues = @()
        
        # 1. VERIFICATION TITLE
        if ($content -match "const title = `"([^`"]+)`"") {
            $title = $matches[1]
            $titleLength = $title.Length
            
            if ($titleLength -lt 30) {
                $pageIssues += "TITLE TROP COURT ($titleLength caracteres, minimum 50)"
            }
            if ($titleLength -gt 60) {
                $pageIssues += "TITLE TROP LONG ($titleLength caracteres, maximum 60)"
            }
        } else {
            $pageIssues += "TITLE MANQUANT"
        }
        
        # 2. VERIFICATION DESCRIPTION
        if ($content -match "const description = `"([^`"]+)`"") {
            $description = $matches[1]
            $descLength = $description.Length
            
            if ($descLength -lt 120) {
                $pageIssues += "DESCRIPTION TROP COURTE ($descLength caracteres, minimum 150)"
            }
            if ($descLength -gt 160) {
                $pageIssues += "DESCRIPTION TROP LONGUE ($descLength caracteres, maximum 160)"
            }
        } else {
            $pageIssues += "DESCRIPTION MANQUANTE"
        }
        
        # 3. VERIFICATION KEYWORDS
        if ($content -notmatch "const keywords = \[") {
            $pageIssues += "KEYWORDS MANQUANTS"
        } else {
            $keywordsMatch = [regex]::Match($content, "const keywords = \[([^\]]+)\]", [System.Text.RegularExpressions.RegexOptions]::Singleline)
            if ($keywordsMatch.Success) {
                $keywordsContent = $keywordsMatch.Groups[1].Value
                $keywordCount = ([regex]::Matches($keywordsContent, "'[^']+'")).Count
                if ($keywordCount -lt 5) {
                    $pageIssues += "PEU DE KEYWORDS ($keywordCount, minimum 5 recommande)"
                }
            }
        }
        
        # 4. VERIFICATION H1
        if ($content -notmatch "<h1[^>]*>") {
            $pageIssues += "H1 MANQUANT"
        } else {
            $h1Matches = [regex]::Matches($content, "<h1[^>]*>([^<]+)</h1>", [System.Text.RegularExpressions.RegexOptions]::Singleline)
            if ($h1Matches.Count -gt 1) {
                $pageIssues += "MULTIPLES H1 ($($h1Matches.Count), maximum 1)"
            }
        }
        
        # 5. VERIFICATION STRUCTURE H2/H3
        $h2Count = ([regex]::Matches($content, "<h2[^>]*>")).Count
        $h3Count = ([regex]::Matches($content, "<h3[^>]*>")).Count
        
        if ($h2Count -eq 0) {
            $pageIssues += "AUCUN H2 (structure manquante)"
        }
        if ($h2Count -lt 2 -and $content.Length -gt 1000) {
            $pageIssues += "PEU DE H2 ($h2Count pour contenu long, minimum 2-3 recommande)"
        }
        
        # 6. VERIFICATION IMAGES (alt text)
        $imgMatches = [regex]::Matches($content, "<img[^>]+>|<OptimizedImage[^>]+>", [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
        $imgWithoutAlt = 0
        foreach ($img in $imgMatches) {
            if ($img.Value -notmatch "alt=`"[^`"]+`"") {
                $imgWithoutAlt++
            }
        }
        if ($imgWithoutAlt -gt 0) {
            $pageIssues += "IMAGES SANS ALT ($imgWithoutAlt image(s))"
        }
        
        # 7. VERIFICATION LIENS INTERNES
        $internalLinks = ([regex]::Matches($content, 'href="(/[^"]+)"')).Count
        if ($internalLinks -lt 2) {
            $pageIssues += "PEU DE LIENS INTERNES ($internalLinks, minimum 2-3 recommande)"
        }
        
        # 8. VERIFICATION CONTENU (nombre de mots)
        $textContent = $content -replace "---.*?---", "" -replace "<[^>]+>", " " -replace "\s+", " "
        $wordCount = ($textContent.Trim() -split "\s+").Count
        
        if ($wordCount -lt 300) {
            $pageIssues += "CONTENU TROP FAIBLE ($wordCount mots, minimum 400 recommande)"
        }
        if ($wordCount -lt 500 -and $file.Name -match "index|services") {
            $pageIssues += "CONTENU INSUFFISANT POUR PAGE PRINCIPALE ($wordCount mots, minimum 800 recommande)"
        }
        if ($wordCount -lt 1000 -and $file.Name -match "guide-") {
            $pageIssues += "CONTENU INSUFFISANT POUR GUIDE ($wordCount mots, minimum 1200 recommande)"
        }
        
        # 9. VERIFICATION CANONICAL
        if ($content -notmatch "canonical") {
            $pageIssues += "CANONICAL NON SPECIFIE (utilise la valeur par defaut)"
        }
        
        # 10. VERIFICATION SCHEMA.ORG
        if ($content -notmatch "schema|Schema") {
            $pageIssues += "SCHEMA.ORG MANQUANT (utilise le schema de base uniquement)"
        }
        
        # 11. VERIFICATION BREADCRUMBS
        if ($file.Name -ne "index.astro" -and $file.Directory.Name -ne "en" -and $file.Directory.Name -ne "it" -and $file.Directory.Name -ne "ru" -and $content -notmatch "breadcrumbItems") {
            $pageIssues += "BREADCRUMBS MANQUANTS (recommandé pour SEO)"
        }
        
        # Ajouter aux statistiques
        if (-not $report.Statistics.ContainsKey("TotalWords")) {
            $report.Statistics["TotalWords"] = 0
            $report.Statistics["TotalH2"] = 0
            $report.Statistics["TotalH3"] = 0
            $report.Statistics["TotalImages"] = 0
            $report.Statistics["TotalInternalLinks"] = 0
        }
        
        $report.Statistics["TotalWords"] += $wordCount
        $report.Statistics["TotalH2"] += $h2Count
        $report.Statistics["TotalH3"] += $h3Count
        $report.Statistics["TotalImages"] += $imgMatches.Count
        $report.Statistics["TotalInternalLinks"] += $internalLinks
        
        # Si des problèmes trouvés, ajouter à la liste
        if ($pageIssues.Count -gt 0) {
            $report.PagesWithIssues += @{
                Page = $relativePath
                Issues = $pageIssues
                WordCount = $wordCount
                H2Count = $h2Count
                H3Count = $h3Count
                Images = $imgMatches.Count
                InternalLinks = $internalLinks
            }
            
            Write-Host "⚠ $relativePath" -ForegroundColor Yellow
            foreach ($issue in $pageIssues) {
                Write-Host "   - $issue" -ForegroundColor Red
            }
        } else {
            Write-Host "✓ $relativePath" -ForegroundColor Green
        }
        
    } catch {
        Write-Host "✗ ERREUR: $($file.Name) - $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "RESUME DE L'AUDIT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Total de pages analysees: $($report.TotalPages)" -ForegroundColor White
$pagesWithIssuesCount = $report.PagesWithIssues.Count
$color = if ($pagesWithIssuesCount -eq 0) { "Green" } else { "Yellow" }
Write-Host "Pages avec problemes: $pagesWithIssuesCount" -ForegroundColor $color
Write-Host ""

if ($report.Statistics.Count -gt 0) {
    $totalWords = $report.Statistics.TotalWords
    $totalH2 = $report.Statistics.TotalH2
    $totalH3 = $report.Statistics.TotalH3
    $totalImages = $report.Statistics.TotalImages
    $totalLinks = $report.Statistics.TotalInternalLinks
    
    Write-Host "STATISTIQUES GLOBALES:" -ForegroundColor Cyan
    Write-Host "  - Total de mots: $totalWords" -ForegroundColor White
    $avgWords = [math]::Round($totalWords / $report.TotalPages, 0)
    Write-Host "  - Mots moyens par page: $avgWords" -ForegroundColor White
    Write-Host "  - Total H2: $totalH2" -ForegroundColor White
    Write-Host "  - Total H3: $totalH3" -ForegroundColor White
    Write-Host "  - Total images: $totalImages" -ForegroundColor White
    Write-Host "  - Total liens internes: $totalLinks" -ForegroundColor White
    Write-Host ""
}

# Sauvegarder le rapport
$reportJson = $report | ConvertTo-Json -Depth 10
$reportPath = "seo-content-audit-report.json"
$reportJson | Out-File -FilePath $reportPath -Encoding UTF8

Write-Host "Rapport sauvegarde dans: $reportPath" -ForegroundColor Green
Write-Host ""
Write-Host "TERMINE" -ForegroundColor Green
