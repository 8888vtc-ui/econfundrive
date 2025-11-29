Set-Location "c:\Users\8888v\CascadeProjects\SITE WEB\CascadeProjects\windsurf-project"

# Move the airport image
Move-Item -Path "assets\img\fr\hero\authority\vtc-aeroport-nice-1920w.webp" -Destination "assets\img\fr\home\hero-aeroport-nice.webp"

# Rename the Monaco image
Rename-Item -Path "assets\img\fr\hero\authority\vtc-monaco-1920w.webp" -NewName "monaco-private-driver.webp"
