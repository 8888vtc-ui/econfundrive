const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Mapping des images par page
const imageMapping = {
  'index': {
    hero: '/assets/img/hero/hero-main.webp',
    destinations: [
      '/assets/img/destinations/nice-destination.webp',
      '/assets/img/destinations/cannes-destination.webp',
      '/assets/img/destinations/monaco-destination.webp',
      '/assets/img/destinations/saint-tropez-destination.webp'
    ]
  },
  'vtc-nice': {
    hero: [
      '/assets/img/hero/nice-hero-1.webp',
      '/assets/img/hero/nice-hero-2.webp'
    ],
    destinations: [
      '/assets/img/destinations/nice-destination-1.webp',
      '/assets/img/destinations/nice-destination-2.webp'
    ]
  },
  'vtc-cannes': {
    hero: [
      '/assets/img/hero/cannes-hero-1.webp',
      '/assets/img/hero/cannes-hero-2.webp'
    ],
    destinations: [
      '/assets/img/destinations/cannes-destination-1.webp',
      '/assets/img/destinations/cannes-destination-2.webp'
    ]
  },
  'vtc-monaco': {
    hero: [
      '/assets/img/hero/monaco-hero-1.webp',
      '/assets/img/hero/monaco-hero-2.webp'
    ],
    destinations: [
      '/assets/img/destinations/monaco-destination-1.webp',
      '/assets/img/destinations/monaco-destination-2.webp'
    ]
  },
  'vtc-saint-tropez': {
    hero: [
      '/assets/img/hero/saint-tropez-hero-1.webp',
      '/assets/img/hero/saint-tropez-hero-2.webp'
    ],
    destinations: [
      '/assets/img/destinations/saint-tropez-destination-1.webp',
      '/assets/img/destinations/saint-tropez-destination-2.webp'
    ]
  },
  'a-propos': {
    about: [
      '/assets/img/about/about-chauffeur.webp',
      '/assets/img/about/about-vehicle.webp',
      '/assets/img/about/about-certification.webp'
    ]
  },
  'services': {
    services: [
      '/assets/img/services/service-airport.webp',
      '/assets/img/services/service-business.webp',
      '/assets/img/services/service-wedding.webp'
    ]
  }
};

// Mettre à jour les images dans une page
function updatePageImages(pageFile, pageName) {
  let content = fs.readFileSync(pageFile, 'utf8');
  const mapping = imageMapping[pageName];
  
  if (!mapping) return false;
  
  let modified = false;
  
  // Remplacer les images hero
  if (mapping.hero) {
    const heroImages = Array.isArray(mapping.hero) ? mapping.hero : [mapping.hero];
    
    // Remplacer la première image hero trouvée
    const heroPattern = /(<img[^>]*src=["'])([^"']*hero[^"']*)(["'][^>]*>)/gi;
    let heroMatch;
    let heroIndex = 0;
    
    while ((heroMatch = heroPattern.exec(content)) !== null && heroIndex < heroImages.length) {
      const newSrc = heroImages[heroIndex];
      content = content.replace(heroMatch[0], heroMatch[0].replace(heroMatch[2], newSrc));
      heroIndex++;
      modified = true;
    }
  }
  
  // Remplacer les images destinations
  if (mapping.destinations) {
    const destPattern = /(<img[^>]*src=["'])([^"']*destinations[^"']*)(["'][^>]*>)/gi;
    let destMatch;
    let destIndex = 0;
    const replacements = [];
    
    while ((destMatch = destPattern.exec(content)) !== null && destIndex < mapping.destinations.length) {
      replacements.push({
        old: destMatch[0],
        new: destMatch[0].replace(destMatch[2], mapping.destinations[destIndex])
      });
      destIndex++;
    }
    
    replacements.forEach(({ old, new: newContent }) => {
      content = content.replace(old, newContent);
      modified = true;
    });
  }
  
  // Remplacer les images about
  if (mapping.about) {
    const aboutPattern = /(<img[^>]*src=["'])([^"']*about[^"']*)(["'][^>]*>)/gi;
    let aboutMatch;
    let aboutIndex = 0;
    const replacements = [];
    
    while ((aboutMatch = aboutPattern.exec(content)) !== null && aboutIndex < mapping.about.length) {
      replacements.push({
        old: aboutMatch[0],
        new: aboutMatch[0].replace(aboutMatch[2], mapping.about[aboutIndex])
      });
      aboutIndex++;
    }
    
    replacements.forEach(({ old, new: newContent }) => {
      content = content.replace(old, newContent);
      modified = true;
    });
  }
  
  // Remplacer les images services
  if (mapping.services) {
    const servicePattern = /(<img[^>]*src=["'])([^"']*services[^"']*)(["'][^>]*>)/gi;
    let serviceMatch;
    let serviceIndex = 0;
    const replacements = [];
    
    while ((serviceMatch = servicePattern.exec(content)) !== null && serviceIndex < mapping.services.length) {
      replacements.push({
        old: serviceMatch[0],
        new: serviceMatch[0].replace(serviceMatch[2], mapping.services[serviceIndex])
      });
      serviceIndex++;
    }
    
    replacements.forEach(({ old, new: newContent }) => {
      content = content.replace(old, newContent);
      modified = true;
    });
  }
  
  if (modified) {
    fs.writeFileSync(pageFile, content, 'utf8');
    return true;
  }
  
  return false;
}

// Traiter toutes les pages
const pages = glob.sync('src/pages/**/*.astro', { cwd: path.join(__dirname, '..') });
let updatedCount = 0;

console.log('\n🔄 MISE À JOUR DES IMAGES DANS LES PAGES\n');
console.log('='.repeat(50));

pages.forEach(pageFile => {
  const fullPath = path.join(__dirname, '..', pageFile);
  const pageName = path.basename(pageFile, '.astro');
  
  if (imageMapping[pageName]) {
    const updated = updatePageImages(fullPath, pageName);
    if (updated) {
      console.log(`✅ ${pageName}`);
      updatedCount++;
    }
  }
});

console.log(`\n✅ ${updatedCount} pages mises à jour\n`);

