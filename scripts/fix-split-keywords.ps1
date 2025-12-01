# Script pour corriger les mots-clés séparés (Côte d\' et Azur)
$ErrorActionPreference = "Stop"

Write-Host "CORRECTION MOTS-CLES SEPARES" -ForegroundColor Cyan
Write-Host ""

$filesModified = 0

$pageFiles = Get-ChildItem -Path "src\pages" -Filter "*.astro" -Recurse

foreach ($file in $pageFiles) {
    try {
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        $originalContent = $content
        
        # Corriger les patterns: 'mot Côte d\', suivi de 'Azur',
        $content = $content -replace "'([^']* Côte d\\),`r?`n\s+'Azur',", "'`$1Azur',"
        $content = $content -replace "'([^']* Côte d\\),`r?`n\s+'Azur'`r?`n\s*\];", "'`$1Azur'`n];"
        
        # Corriger aussi sans virgule
        $content = $content -replace "'([^']* Côte d\\')`r?`n\s+'Azur',", "'`$1Azur',"
        $content = $content -replace "'([^']* Côte d\\')`r?`n\s+'Azur'`r?`n\s*\];", "'`$1Azur'`n];"
        
        # Corriger les chaînes non terminées avec \
        $content = $content -replace "'([^']* Côte d)\\'`r?`n\s*'Azur'", "'`$1\'Azur'"
        $content = $content -replace "'([^']* Côte d)\\'`r?`n\s*'Azur',", "'`$1\'Azur',"
        
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

