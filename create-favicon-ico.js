const fs = require('fs');
const path = require('path');
const pngToIco = require('png-to-ico');

const inputPng = path.join(__dirname, 'assets', 'img', 'favicon', 'favicon-32x32.png');
const outputIco = path.join(__dirname, 'assets', 'img', 'favicon', 'favicon.ico');

async function createFaviconIco() {
  try {
    const ico = await pngToIco(inputPng);
    fs.writeFileSync(outputIco, ico);
    console.log(`Fichier créé: ${outputIco}`);
  } catch (error) {
    console.error('Erreur lors de la création du fichier ICO:', error);
    process.exit(1);
  }
}

createFaviconIco();
