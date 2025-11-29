# Require WebP.ImageTools module
if (-not (Get-Module -ListAvailable -Name WebP.ImageTools)) {
    Install-Module -Name WebP.ImageTools -Force -Scope CurrentUser
}
Import-Module WebP.ImageTools

# Optimize all WebP images
Get-ChildItem -Path assets\img -Filter *.webp -Recurse | ForEach-Object {
    Optimize-WebP $_.FullName -Quality 85
}
