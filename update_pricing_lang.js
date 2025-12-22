const fs = require('fs');
const path = require('path');

const langDirs = ['en', 'it', 'ru'];
const baseDir = path.join(__dirname, 'src/pages');

langDirs.forEach(lang => {
    const dir = path.join(baseDir, lang);
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);

    files.forEach(file => {
        if (!file.endsWith('.astro')) return;

        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');

        // Regex pour trouver <PricingRequest ... /> sans prop lang
        // On cherche <PricingRequest (qui n'a pas lang=)
        if (content.includes('<PricingRequest') && !content.includes(`<PricingRequest lang="${lang}"`)) {
            // Remplace <PricingRequest /> ou <PricingRequest prop="..." />
            // Cas simple : <PricingRequest /> -> <PricingRequest lang="xx" />
            content = content.replace(/<PricingRequest\s*\/?>/g, `<PricingRequest lang="${lang}" />`);

            // Cas avec props existantes (s'il y en a)
            // <PricingRequest cityName="..." /> -> <PricingRequest lang="xx" cityName="..." />
            content = content.replace(/<PricingRequest\s+([^>]+)\s*\/?>/g, (match, props) => {
                if (props.includes('lang=')) return match;
                return `<PricingRequest lang="${lang}" ${props} />`;
            });

            console.log(`Updated ${lang}/${file}`);
            fs.writeFileSync(filePath, content, 'utf8');
        }
    });
});
