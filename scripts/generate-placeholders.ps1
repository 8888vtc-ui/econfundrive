$missingImages = @(
    'assets/img/fr/reservation/booking-steps.webp',
    'assets/img/fr/legal/rgpd-signature.webp',
    'assets/img/fr/services/service-corporate.webp',
    'assets/img/fr/home/hero-business.webp',
    'assets/img/en/booking/en-booking-process.webp',
    'assets/img/en/nice-private-driver/business-transfers.webp',
    'assets/img/en/cannes-private-driver/festivals.webp',
    'assets/img/fr/services/service-events.webp'
)

foreach ($image in $missingImages) {
    $directory = [System.IO.Path]::GetDirectoryName($image)
    if (-not (Test-Path $directory)) {
        New-Item -ItemType Directory -Path $directory -Force
    }
    New-Item -ItemType File -Path $image -Force
}
