# Script pour créer le dossier public et copier les assets nécessaires pour Astro

Write-Host "Création du dossier public pour Astro..." -ForegroundColor Green

# Créer le dossier public
New-Item -ItemType Directory -Force -Path "public" | Out-Null
New-Item -ItemType Directory -Force -Path "public\assets" | Out-Null
New-Item -ItemType Directory -Force -Path "public\assets\css" | Out-Null
New-Item -ItemType Directory -Force -Path "public\assets\js" | Out-Null
New-Item -ItemType Directory -Force -Path "public\assets\img" | Out-Null

Write-Host "Copie des fichiers CSS..." -ForegroundColor Yellow
if (Test-Path "assets\css") {
    Copy-Item -Path "assets\css\*" -Destination "public\assets\css\" -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host "Copie des fichiers JS..." -ForegroundColor Yellow
if (Test-Path "assets\js") {
    Copy-Item -Path "assets\js\*" -Destination "public\assets\js\" -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host "Copie des images essentielles..." -ForegroundColor Yellow
# Copier seulement les dossiers d'images nécessaires (éviter les chemins trop longs)
$imageDirs = @("hero", "destinations", "favicon")
foreach ($dir in $imageDirs) {
    $sourcePath = "assets\img\$dir"
    $destPath = "public\assets\img\$dir"
    if (Test-Path $sourcePath) {
        New-Item -ItemType Directory -Force -Path $destPath | Out-Null
        Get-ChildItem -Path $sourcePath -File -Recurse -Depth 0 | ForEach-Object {
            try {
                Copy-Item -Path $_.FullName -Destination $destPath -Force -ErrorAction Stop
            } catch {
                Write-Host "  Erreur pour $($_.Name): $($_.Exception.Message)" -ForegroundColor Red
            }
        }
    }
}

Write-Host "`n✅ Dossier public créé avec succès !" -ForegroundColor Green
Write-Host "Les images sont maintenant accessibles via /assets/img/..." -ForegroundColor Cyan

