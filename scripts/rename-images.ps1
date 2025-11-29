Get-ChildItem -Path 'assets/img' -Filter *.webp -Recurse | ForEach-Object { 
    $newName = $_.Name -replace 'vtc-', ''
    $newName = $newName -replace 'private-driver', 'cities'
    Rename-Item -Path $_.FullName -NewName $newName
}
