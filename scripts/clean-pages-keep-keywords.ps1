# Script pour supprimer tout le contenu et ne garder que les mots-clés
# Usage: .\scripts\clean-pages-keep-keywords.ps1

$ErrorActionPreference = "Stop"

Write-Host "NETTOYAGE COMPLET - GARDER UNIQUEMENT LES MOTS-CLES" -ForegroundColor Cyan
Write-Host ""

# Charger les mots-clés depuis keyword-research-report.json
$keywordsJson = Get-Content "keyword-research-report.json" -Raw -Encoding UTF8 | ConvertFrom-Json

# Créer un mapping page -> mots-clés
$pageKeywords = @{}

# Mots-clés existants (généraux)
$pageKeywords["index"] = $keywordsJson.existingKeywords.fr
$pageKeywords["services"] = @("service VTC entreprise Côte d'Azur", "chauffeur privé pour mariage Côte d'Azur", "VTC avec siège enfant Nice", "chauffeur anglais Côte d'Azur")
$pageKeywords["reservation"] = @("réserver chauffeur privé Nice", "comment réserver un chauffeur VTC Nice")
$pageKeywords["tarifs"] = @("combien coûte un VTC Nice Monaco")
$pageKeywords["vtc-nice"] = @("VTC pas cher Nice aéroport", "chauffeur VTC 24h/24 Nice", "VTC Nice", "transfert aéroport Nice")
$pageKeywords["vtc-cannes"] = @("VTC Cannes", "transfert aéroport Cannes")
$pageKeywords["vtc-monaco"] = @("chauffeur avec voiture de luxe Monaco", "VTC Monaco")
$pageKeywords["vtc-saint-tropez"] = @("VTC Saint-Tropez")
$pageKeywords["vtc-antibes"] = @("VTC Antibes Juan-les-Pins")
$pageKeywords["vtc-villeneuve-loubet"] = @("VTC Villeneuve-Loubet")
$pageKeywords["vtc-sophia-antipolis"] = @("chauffeur Sophia-Antipolis")
$pageKeywords["vtc-aeroport-nice-prix"] = @("VTC aéroport Nice prix", "transfert aéroport Nice tarif", "chauffeur aéroport Nice")
$pageKeywords["chauffeur-24h-nice"] = @("VTC 24h Nice", "chauffeur nuit Nice", "VTC urgence Nice")
$pageKeywords["chauffeur-anglais-nice"] = @("chauffeur anglais Nice", "English driver Nice", "chauffeur bilingue")
$pageKeywords["vtc-entreprise-cote-azur"] = @("VTC entreprise", "chauffeur corporate", "transport professionnel")
$pageKeywords["vtc-mariage-cote-azur"] = @("VTC mariage", "chauffeur mariage", "transport mariés")
$pageKeywords["guide-vtc-ou-taxi-aeroport-nice"] = @("quelle différence entre VTC et taxi Nice")
$pageKeywords["transfert-nice-aeroport-monaco"] = @("chauffeur VTC aéroport Nice prix")
$pageKeywords["transfert-nice-aeroport-cannes"] = @("transfert aéroport Nice centre-ville")

# Fonction pour créer un template minimal avec mots-clés
function Create-MinimalTemplate {
    param(
        [string]$pageName,
        [array]$keywords,
        [string]$title,
        [string]$description
    )
    
    $keywordsList = ""
    if ($keywords -and $keywords.Count -gt 0) {
        $keywordsList = "`n`n<!-- Mots-clés SEO: " + ($keywords -join ", ") + " -->"
    }
    
    $template = @"
---
import BaseLayout from '../layouts/BaseLayout.astro';

const title = "$title";
const description = "$description";
const keywords = [$(if ($keywords) { "`n  " + ($keywords | ForEach-Object { "'$_'" }) -join ",`n  " + "`n" } else { "" })];
---
$keywordsList

<BaseLayout 
  title={title}
  description={description}
  currentPage="$pageName"
>
  <main>
    <h1>{title}</h1>
    <p>{description}</p>
    
    <!-- Mots-clés à intégrer dans le contenu: -->
    <!-- $(if ($keywords) { $keywords -join ", " } else { "Aucun mot-clé défini" }) -->
  </main>
</BaseLayout>
"@
    
    return $template
}

# Traiter toutes les pages
Write-Host "Traitement des pages..." -ForegroundColor Yellow
$pageFiles = Get-ChildItem -Path "src\pages" -Filter "*.astro" -Recurse

$filesModified = 0
$filesSkipped = 0

foreach ($file in $pageFiles) {
    try {
        # Extraire le nom de la page (sans extension et sans chemin)
        $pageName = $file.BaseName
        $relativePath = $file.FullName.Replace((Get-Location).Path + "\src\pages\", "").Replace("\", "/")
        $pageSlug = $relativePath.Replace(".astro", "").Replace("/", "-")
        
        # Chercher les mots-clés pour cette page
        $keywords = @()
        $title = ""
        $description = ""
        
        # Chercher dans pageKeywords
        foreach ($key in $pageKeywords.Keys) {
            if ($pageSlug -like "*$key*" -or $pageName -eq $key) {
                $keywords = $pageKeywords[$key]
                break
            }
        }
        
        # Si pas trouvé, chercher dans keywordOpportunities
        if ($keywords.Count -eq 0) {
            foreach ($opp in $keywordsJson.keywordOpportunities.fr) {
                if ($opp.page -eq $pageSlug -or $opp.page -eq $pageName) {
                    $keywords += $opp.keyword
                }
            }
        }
        
        # Si toujours pas trouvé, utiliser des mots-clés généraux
        if ($keywords.Count -eq 0) {
            $keywords = @("chauffeur privé VTC", "VTC Côte d'Azur")
        }
        
        # Générer title et description basés sur les mots-clés
        if (-not $title) {
            $mainKeyword = $keywords[0]
            $title = "$mainKeyword | ECOFUNDRIVE"
            $description = "Service de $mainKeyword sur la Côte d'Azur. " + ($keywords -join ", ")
        }
        
        # Créer le template minimal
        $newContent = Create-MinimalTemplate -pageName $pageName -keywords $keywords -title $title -description $description
        
        # Écrire le fichier
        Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8 -NoNewline
        Write-Host "  OK $($file.Name) - $(@($keywords).Count) mots-cles" -ForegroundColor Green
        $filesModified++
        
    } catch {
        Write-Host "  ERREUR sur $($file.Name): $_" -ForegroundColor Red
        $filesSkipped++
    }
}

Write-Host ""
Write-Host "RESUME:" -ForegroundColor Cyan
Write-Host "  Fichiers modifies: $filesModified" -ForegroundColor Green
Write-Host "  Fichiers ignores: $filesSkipped" -ForegroundColor Gray
Write-Host ""
Write-Host "TERMINE" -ForegroundColor Green

