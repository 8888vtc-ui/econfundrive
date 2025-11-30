# Script pour nettoyer les dossiers images dupliqués
# Supprime les dossiers optimized/optimized/... récursifs

$optimizedPath = "public\assets\img\optimized"

if (Test-Path $optimizedPath) {
    Write-Host "Nettoyage des dossiers dupliqués..." -ForegroundColor Yellow
    
    # Trouver tous les dossiers "optimized" imbriqués
    $duplicateFolders = Get-ChildItem -Path $optimizedPath -Recurse -Directory | 
        Where-Object { $_.Name -eq "optimized" -and $_.FullName -ne $optimizedPath }
    
    $count = ($duplicateFolders | Measure-Object).Count
    
    if ($count -gt 0) {
        Write-Host "Trouvé $count dossiers dupliqués" -ForegroundColor Cyan
        
        # Supprimer les dossiers dupliqués (garder seulement le premier niveau)
        foreach ($folder in $duplicateFolders) {
            Write-Host "Suppression: $($folder.FullName)" -ForegroundColor Gray
            Remove-Item -Path $folder.FullName -Recurse -Force
        }
        
        Write-Host "`n✅ Nettoyage terminé: $count dossiers supprimés" -ForegroundColor Green
    } else {
        Write-Host "Aucun dossier dupliqué trouvé" -ForegroundColor Green
    }
} else {
    Write-Host "Dossier optimized non trouvé" -ForegroundColor Yellow
}

