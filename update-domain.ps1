# Script pour mettre à jour les anciennes références de domaine
$oldDomain = "davidchemla-vtc.fr"
$newDomain = "ecofundrive.com"

# Fonction pour remplacer le texte dans un fichier
function Update-FileContent {
    param (
        [string]$filePath,
        [string]$oldText,
        [string]$newText
    )
    
    $content = Get-Content -Path $filePath -Raw
    $newContent = $content -replace [regex]::Escape($oldText), $newText
    
    if ($newContent -ne $content) {
        Set-Content -Path $filePath -Value $newContent -NoNewline
        Write-Host "Mis à jour : $filePath"
    }
}

# Récupérer tous les fichiers HTML
$htmlFiles = Get-ChildItem -Path .\ -Recurse -Include *.html -File

foreach ($file in $htmlFiles) {
    Update-FileContent -filePath $file.FullName -oldText $oldDomain -newText $newDomain
}

# Vérifier aussi les fichiers CSS et JS pour d'éventuelles URLs
$otherFiles = Get-ChildItem -Path .\ -Recurse -Include *.css,*.js -File

foreach ($file in $otherFiles) {
    Update-FileContent -filePath $file.FullName -oldText $oldDomain -newText $newDomain
}

Write-Host "Mise à jour terminée. Vérifiez les modifications avant de les pousser en production."
Write-Host "N'oubliez pas de configurer les redirections 301 sur votre serveur web."
