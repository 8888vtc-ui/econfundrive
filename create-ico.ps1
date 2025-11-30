# Chemin d'entrée et de sortie
$inputPng = "assets\img\favicon\favicon-32x32.png"
$outputIco = "assets\img\favicon\favicon.ico"

# Vérifier si le fichier source existe
if (-not (Test-Path $inputPng)) {
    Write-Error "Le fichier source $inputPng n'existe pas."
    exit 1
}

# Créer un objet Image à partir du fichier PNG
Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile((Resolve-Path $inputPng))

# Créer un nouvel icône à partir de l'image
$icon = [System.Drawing.Icon]::FromHandle((New-Object System.Drawing.Bitmap($img, 32, 32)).GetHicon())

# Créer un flux de fichier pour enregistrer l'icône
$fs = [System.IO.File]::Create((Resolve-Path .).Path + "\" + $outputIco)

# Enregistrer l'icône dans le flux de fichier
$icon.Save($fs)

# Fermer les flux et libérer les ressources
$fs.Close()
$icon.Dispose()
$img.Dispose()

Write-Host "Fichier ICO créé avec succès : $outputIco"
