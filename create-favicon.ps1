# Chemin d'entrée et de sortie
$inputPng = "assets\img\favicon\favicon-32x32.png"
$outputIco = "assets\img\favicon\favicon.ico"

# Vérifier si le fichier source existe
if (-not (Test-Path $inputPng)) {
    Write-Error "Le fichier source $inputPng n'existe pas."
    exit 1
}

# Créer un objet Bitmap à partir du fichier PNG
Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile((Resolve-Path $inputPng))

# Créer un flux mémoire pour stocker l'ICO
$ms = New-Object System.IO.MemoryStream

# Enregistrer le bitmap en tant qu'ICO dans le flux mémoire
$bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Ico)

# Écrire le contenu du flux mémoire dans un fichier
[System.IO.File]::WriteAllBytes((Resolve-Path .).Path + "\" + $outputIco, $ms.ToArray())

# Nettoyer
$ms.Dispose()
$bmp.Dispose()

Write-Host "Fichier ICO créé avec succès : $outputIco"
