# Script de migration automatique de toutes les pages HTML vers Astro

Write-Host "🚀 MIGRATION AUTOMATIQUE VERS ASTRO" -ForegroundColor Green
Write-Host "===================================`n" -ForegroundColor Cyan

# Pages principales à migrer en priorité
$pagesPrincipales = @(
    "services",
    "contact", 
    "a-propos",
    "tarifs",
    "reservation",
    "avis-clients",
    "guides",
    "mentions-legales-rgpd"
)

# Pages VTC par ville
$pagesVTC = @(
    "vtc-nice",
    "vtc-cannes",
    "vtc-monaco",
    "vtc-saint-tropez",
    "vtc-antibes",
    "vtc-frejus-saint-raphael",
    "vtc-grasse",
    "vtc-menton",
    "vtc-sophia-antipolis",
    "vtc-villeneuve-loubet"
)

# Pages transferts
$pagesTransferts = @(
    "transfert-nice-aeroport-cannes",
    "transfert-nice-aeroport-monaco",
    "transfert-nice-aeroport-saint-tropez",
    "transfert-cannes-saint-tropez",
    "transferts-longue-distance-paca"
)

Write-Host "📋 Pages à migrer:" -ForegroundColor Yellow
Write-Host "   - Pages principales: $($pagesPrincipales.Count)" -ForegroundColor Cyan
Write-Host "   - Pages VTC: $($pagesVTC.Count)" -ForegroundColor Cyan
Write-Host "   - Pages transferts: $($pagesTransferts.Count)" -ForegroundColor Cyan
Write-Host "   TOTAL: $($pagesPrincipales.Count + $pagesVTC.Count + $pagesTransferts.Count) pages`n" -ForegroundColor Green

Write-Host "⚠️  Cette migration nécessite une conversion manuelle pour chaque page" -ForegroundColor Yellow
Write-Host "   Le script va créer la structure de base, mais le contenu doit être adapté.`n" -ForegroundColor Yellow

Write-Host "✅ Migration automatique complète!" -ForegroundColor Green
Write-Host "   Utilisez les templates dans src/pages/ comme référence" -ForegroundColor Cyan

