/**
 * ECOFUNDRIVE V2.0 - Schema Validator
 * Vérifie que chaque page HTML contient exactement 6 schemas JSON-LD
 */

const fs = require('fs');
const path = require('path');

// Couleurs pour le terminal
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

/**
 * Compte les schemas JSON-LD dans un fichier HTML
 */
function countSchemas(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const schemaMatches = content.match(/<script type="application\/ld\+json">/g);
  return schemaMatches ? schemaMatches.length : 0;
}

/**
 * Extrait les types de schemas
 */
function extractSchemaTypes(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const schemaRegex = /<script type="application\/ld\+json">(.*?)<\/script>/gs;
  const types = [];

  let match;
  while ((match = schemaRegex.exec(content)) !== null) {
    try {
      const jsonContent = match[1].trim();
      const schema = JSON.parse(jsonContent);
      types.push(schema['@type'] || 'Unknown');
    } catch (e) {
      types.push('Invalid JSON');
    }
  }

  return types;
}

/**
 * Valide un fichier HTML
 */
function validateFile(filePath) {
  const schemaCount = countSchemas(filePath);
  const schemaTypes = extractSchemaTypes(filePath);
  const fileName = path.basename(filePath);

  const status = schemaCount === 6
    ? `${colors.green}✅ OK${colors.reset}`
    : `${colors.red}❌ FAIL${colors.reset}`;

  console.log(`\n${status} ${fileName}: ${schemaCount}/6 schemas`);

  if (schemaTypes.length > 0) {
    console.log(`   Types: ${schemaTypes.join(', ')}`);
  }

  return schemaCount === 6;
}

/**
 * Valide tous les fichiers HTML dans un dossier
 */
function validateDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.log(`${colors.red}❌ Directory not found: ${dirPath}${colors.reset}`);
    return;
  }

  const files = fs.readdirSync(dirPath);
  const htmlFiles = files.filter(f => f.endsWith('.html'));

  console.log(`${colors.blue}═══════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}ECOFUNDRIVE V2.0 - Schema Validator${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════════════${colors.reset}`);
  console.log(`\nScanning: ${dirPath}`);
  console.log(`Found: ${htmlFiles.length} HTML files\n`);

  let passCount = 0;
  let failCount = 0;

  htmlFiles.forEach(file => {
    const filePath = path.join(dirPath, file);
    const passed = validateFile(filePath);
    if (passed) passCount++;
    else failCount++;
  });

  console.log(`\n${colors.blue}═══════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.green}✅ Passed: ${passCount}${colors.reset}`);
  console.log(`${colors.red}❌ Failed: ${failCount}${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════════════${colors.reset}\n`);
}

// Main execution
const distPath = path.join(__dirname, 'dist');
const frPath = path.join(distPath, 'fr');

console.log('Validating root HTML files...');
validateDirectory(distPath);

if (fs.existsSync(frPath)) {
  console.log('\nValidating French pages...');
  validateDirectory(frPath);
}
