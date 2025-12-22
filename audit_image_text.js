const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, 'src/pages');

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.endsWith('.astro')) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });

    return arrayOfFiles;
}

const files = getAllFiles(projectRoot);
let issues = [];

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const isEnglish = file.includes('\\en\\') || file.includes('/en/');

    // Regex to find SectionImageText components
    const componentRegex = /<SectionImageText([\s\S]*?)<\/SectionImageText>|<SectionImageText([\s\S]*?)\/>/g;
    let match;

    while ((match = componentRegex.exec(content)) !== null) {
        const propsAndContent = match[0];

        // Check for alt text
        const altMatch = propsAndContent.match(/alt=["'](.*?)["']/);
        if (!altMatch) {
            issues.push({
                file: file.replace(projectRoot, ''),
                issue: 'Missing alt text in SectionImageText',
                snippet: propsAndContent.substring(0, 50) + '...'
            });
        } else if (altMatch[1].length < 5) {
            issues.push({
                file: file.replace(projectRoot, ''),
                issue: `Weak alt text: "${altMatch[1]}"`,
                snippet: propsAndContent.substring(0, 50) + '...'
            });
        }

        // Check for French content in English files
        if (isEnglish) {
            const lowerContent = propsAndContent.toLowerCase();
            const frenchKeywords = ['voiture', 'chauffeur', 'réserver', 'aéroport', 'côte d\'azur', 'nous contacter'];
            const foundFrench = frenchKeywords.filter(kw => lowerContent.includes(kw));

            if (foundFrench.length > 0) {
                issues.push({
                    file: file.replace(projectRoot, ''),
                    issue: `Potential French content in English file: ${foundFrench.join(', ')}`,
                    snippet: propsAndContent.substring(0, 50) + '...'
                });
            }
        }
    }
});

console.log(JSON.stringify(issues, null, 2));
