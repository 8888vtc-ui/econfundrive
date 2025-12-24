/**
 * Script d'enrichissement des pages VTC locales
 * Ajoute du contenu unique, FAQ visible et sections supplémentaires
 */
const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

// Données uniques pour chaque ville
const cityData = {
    'vtc-biot': {
        intro: `Situé entre Antibes et Sophia Antipolis, le village de <strong>Biot</strong> est célèbre dans le monde entier pour son artisanat verrier. ECOFUNDRIVE vous propose un service de chauffeur privé premium pour découvrir ce joyau provençal, visiter <strong>Marineland</strong> en famille, ou rejoindre le parc technologique voisin.`,
        distance: `L'aéroport Nice Côte d'Azur se trouve à <strong>20 km</strong> (25-35 minutes selon le trafic). Nous assurons des transferts quotidiens vers et depuis Biot.`,
        services: [
            'Transferts aéroport Nice ↔ Biot',
            'Navettes Marineland pour familles',
            'Transport vers Sophia Antipolis (meetings, congrès)',
            'Excursions villages perchés (Biot, Saint-Paul, Gourdon)'
        ],
        events: 'La Fête des Potiers (mai), le marché provençal du vendredi matin'
    },
    'vtc-mougins': {
        intro: `<strong>Mougins</strong> est le village gastronomique de la Côte d'Azur par excellence. Ancien refuge de Picasso, ce village fortifié abrite aujourd'hui plusieurs restaurants étoilés Michelin. ECOFUNDRIVE vous accompagne pour vos dîners d'exception et vos parties de golf au Royal Mougins.`,
        distance: `Situé à <strong>8 km de Cannes</strong> et <strong>30 km de l'aéroport Nice</strong>, Mougins est accessible en 15-20 minutes depuis La Croisette.`,
        services: [
            'Transfert restaurant étoilé (aller-retour)',
            'Navettes Festival de Cannes → Mougins',
            'Transport vers les golfs (Royal Mougins, Cannes-Mougins)',
            'Mise à disposition événements privés'
        ],
        events: 'Les Étoiles de Mougins (festival gastronomique), expositions d\'art contemporain'
    },
    'vtc-vence': {
        intro: `<strong>Vence</strong> abrite l'un des trésors artistiques de la Côte d'Azur : la <strong>Chapelle du Rosaire</strong> décorée par Henri Matisse. Ce village médiéval authentique séduit par ses remparts, sa cathédrale romane et son marché provençal animé.`,
        distance: `Vence se trouve à <strong>22 km de Nice</strong> (30-40 minutes) et à <strong>10 km de Saint-Paul-de-Vence</strong>. Idéal pour un circuit villages perchés.`,
        services: [
            'Excursion Chapelle Matisse avec attente',
            'Circuit Saint-Paul + Vence + Gourdon (demi-journée)',
            'Transfert aéroport Nice ↔ Vence',
            'Transport pour mariages (Château Saint-Martin)'
        ],
        events: 'Le marché provençal (mardi et vendredi), les Nuits du Sud (festival été)'
    },
    'vtc-la-turbie': {
        intro: `Perchée sur la Grande Corniche, <strong>La Turbie</strong> domine Monaco de 450 mètres. Son monument romain, le <strong>Trophée des Alpes</strong>, offre le plus beau panorama sur la Principauté. Un arrêt incontournable sur la route panoramique Nice-Monaco.`,
        distance: `La Turbie est à <strong>15 km de Nice</strong> et <strong>8 km de Monaco</strong>. Le trajet par la Grande Corniche est légendaire.`,
        services: [
            'Circuit Nice → Èze → La Turbie → Monaco',
            'Pause photo au Trophée des Alpes',
            'Transferts hôtels Monaco ↔ La Turbie',
            'Transport pour événements au Restaurant La Terrasse'
        ],
        events: 'La Fête de la Saint-Michel (septembre), les visites nocturnes du Trophée (été)'
    },
    'vtc-beaulieu-sur-mer': {
        intro: `<strong>Beaulieu-sur-Mer</strong>, surnommée "la petite Afrique" pour son microclimat exceptionnel, abrite la célèbre <strong>Villa Kérylos</strong>, reconstitution d'une demeure grecque antique. Cette station balnéaire chic est le refuge des connaisseurs.`,
        distance: `Beaulieu est nichée entre Nice (<strong>10 km</strong>) et Monaco (<strong>6 km</strong>), soit 15-20 minutes de l'aéroport Nice.`,
        services: [
            'Transferts yachts Port de Beaulieu',
            'Visite Villa Kérylos avec attente',
            'Navettes vers les établissements de luxe (La Réserve)',
            'Circuit Basse Corniche (Nice-Beaulieu-Monaco)'
        ],
        events: 'Concerts d\'été à la Rotonde, le marché du samedi matin'
    },
    'vtc-villefranche-sur-mer': {
        intro: `<strong>Villefranche-sur-Mer</strong> possède l'une des plus belles rades du monde et une vieille ville aux couleurs ocres uniques. La <strong>Chapelle Cocteau</strong> et la rue Obscura attirent les amateurs d'art et d'histoire.`,
        distance: `À seulement <strong>6 km de Nice</strong> et <strong>10 km de Monaco</strong>, Villefranche est l'escale préférée des croisiéristes.`,
        services: [
            'Transferts bateaux de croisière ↔ excursions',
            'Circuit Moyenne Corniche avec arrêts photos',
            'Transport vers les restaurants du port',
            'Navettes plages (Paloma Beach, Passable)'
        ],
        events: 'La Bataille des Fleurs (Carnaval), le Combat Naval Fleuri (février)'
    },
    'vtc-roquebrune-cap-martin': {
        intro: `<strong>Roquebrune-Cap-Martin</strong> réunit le plus vieux village médiéval de France et le cap luxueux où séjournait Coco Chanel. Le château millénaire offre une vue imprenable sur Monaco. Le <strong>Cap Martin</strong> fut la villégiature de l'impératrice Eugénie.`,
        distance: `Entre Menton (<strong>3 km</strong>) et Monaco (<strong>4 km</strong>), Roquebrune est à 25-30 minutes de l'aéroport Nice.`,
        services: [
            'Transferts villas Cap Martin',
            'Visite château médiéval de Roquebrune',
            'Randonnée Le Corbusier (sentier littoral)',
            'Transport événements Vista Palace'
        ],
        events: 'La Procession de la Passion (Vendredi Saint), la plus ancienne tradition de France'
    },
    'vtc-cagnes-sur-mer': {
        intro: `<strong>Cagnes-sur-Mer</strong> offre trois visages : le Haut-de-Cagnes médiéval avec son château-musée, Cros-de-Cagnes et son port de pêche, et la station balnéaire moderne. Le <strong>Musée Renoir</strong> dans la maison du peintre est un trésor.`,
        distance: `Cagnes est à <strong>12 km de Nice</strong> et <strong>5 km de l'aéroport</strong>. Accès rapide par l'autoroute.`,
        services: [
            'Transferts hippodrome de la Côte d\'Azur',
            'Visite Musée Renoir avec attente',
            'Navettes port Cros-de-Cagnes',
            'Transport Polygone Riviera (centre commercial)'
        ],
        events: 'Les courses à l\'hippodrome, le Festival du Court-Métrage de Cagnes'
    },
    'vtc-saint-laurent-du-var': {
        intro: `<strong>Saint-Laurent-du-Var</strong> est la commune la plus proche de l'aéroport Nice, ce qui en fait un hub idéal pour les voyageurs. Le <strong>Cap 3000</strong>, plus grand centre commercial de la région, et le port de plaisance attirent visiteurs et professionnels.`,
        distance: `À <strong>3 km de l'aéroport Nice</strong>, Saint-Laurent est le point d'entrée idéal sur la Côte d'Azur.`,
        services: [
            'Transferts ultra-rapides aéroport',
            'Navettes Cap 3000 shopping',
            'Transport Port Saint-Laurent',
            'Service régulier Nice ↔ Saint-Laurent'
        ],
        events: 'Le marché provençal du dimanche, animations port de plaisance'
    },
    'vtc-vallauris-golfe-juan': {
        intro: `<strong>Vallauris</strong> est la capitale française de la céramique, où Picasso a révolutionné l'art de la poterie. <strong>Golfe-Juan</strong> est célèbre pour le débarquement de Napoléon en 1815 et ses plages familiales.`,
        distance: `Vallauris et Golfe-Juan sont à <strong>8 km d'Antibes</strong> et <strong>25 km de Nice</strong> (30-40 minutes).`,
        services: [
            'Visite ateliers de céramique avec attente',
            'Transferts plages de Golfe-Juan',
            'Circuit Route Napoléon',
            'Transport Musée Picasso (Guerre et Paix)'
        ],
        events: 'La Fête de la Poterie (août), la Reconstitution du Débarquement de Napoléon (mars)'
    },
    'vtc-grasse': {
        intro: `<strong>Grasse</strong>, capitale mondiale du parfum, abrite les maisons légendaires Fragonard, Molinard et Galimard. Cette ville perchée offre des panoramas exceptionnels et un patrimoine historique remarquable.`,
        distance: `Grasse est à <strong>40 km de Nice</strong> (45 minutes) et <strong>17 km de Cannes</strong> (25 minutes).`,
        services: [
            'Circuit des parfumeries avec visites',
            'Transferts Grasse ↔ Cannes (Festival)',
            'Excursion Route Napoléon',
            'Transport vers les villages du Pays Grassois'
        ],
        events: 'ExpoRose (mai), Jasminade (août), Fête du Jasmin'
    },
    'vtc-mandelieu-la-napoule': {
        intro: `<strong>Mandelieu-La Napoule</strong> est la destination golf de la Côte d'Azur avec ses parcours prestigieux et l'un des plus grands ports de plaisance de la région. Le château de La Napoule, forteresse médiévale restaurée par un artiste américain, domine le littoral.`,
        distance: `À <strong>9 km de Cannes</strong> et proche de l'aéroport Cannes-Mandelieu, Mandelieu est facilement accessible.`,
        services: [
            'Transferts aéroport Cannes-Mandelieu',
            'Navettes golfs (Old Course, Riviera)',
            'Transport port de La Napoule',
            'Service MIPIM et congrès Cannes'
        ],
        events: 'Mimosalia (février), les régates du Yacht Club'
    },
    'vtc-frejus-saint-raphael': {
        intro: `<strong>Fréjus</strong> et <strong>Saint-Raphaël</strong> forment un duo balnéaire aux portes de l'Estérel. Fréjus conserve un patrimoine romain exceptionnel (arènes, aqueduc) tandis que Saint-Raphaël offre plages et vie nocturne.`,
        distance: `Ces villes sont à <strong>70 km de Nice</strong> (50-60 minutes par l'autoroute) et constituent la porte d'entrée du Var.`,
        services: [
            'Transferts aéroport Nice ↔ Fréjus/Saint-Raphaël',
            'Excursions Massif de l\'Estérel',
            'Transport ports de plaisance',
            'Navettes vers Saint-Tropez'
        ],
        events: 'Les Nuits Auréliennes (spectacles antiques), le Carnaval de Fréjus'
    },
    'vtc-villeneuve-loubet': {
        intro: `<strong>Villeneuve-Loubet</strong> est la patrie d'Auguste Escoffier, le "roi des cuisiniers". Le musée qui lui est dédié et le village médiéval côtoient Marina Baie des Anges, ensemble architectural iconique des années 70.`,
        distance: `Villeneuve-Loubet est à <strong>15 km de Nice</strong> et <strong>5 km d'Antibes</strong>, avec accès direct à l'autoroute.`,
        services: [
            'Transferts Marina Baie des Anges',
            'Visite Musée Escoffier',
            'Transport vers les parcs (Marineland, Aquasplash)',
            'Navettes centres commerciaux'
        ],
        events: 'Les Journées Escoffier (gastronomie), le marché du mercredi'
    },
    'vtc-sophia-antipolis': {
        intro: `<strong>Sophia Antipolis</strong> est le premier technopôle d'Europe, abritant 2 500 entreprises et 40 000 emplois dans l'innovation. Ce hub high-tech niché dans la pinède attire dirigeants et ingénieurs du monde entier.`,
        distance: `Sophia est à <strong>23 km de l'aéroport Nice</strong> (25-40 minutes) et <strong>12 km d'Antibes</strong>.`,
        services: [
            'Transferts business aéroport ↔ Sophia',
            'Service compte entreprise (facturation mensuelle)',
            'Navettes inter-sites Sophia Antipolis',
            'Transport vers hôtels partenaires'
        ],
        events: 'Les conférences tech, séminaires d\'entreprises, SophiaConf'
    },
    'vtc-saint-paul-de-vence': {
        intro: `<strong>Saint-Paul-de-Vence</strong> est le village d'artistes le plus célèbre de France. La Fondation Maeght, les galeries d'art et la Colombe d'Or (restaurant où payaient Picasso, Matisse et Chagall) en font un lieu mythique.`,
        distance: `Saint-Paul est à <strong>20 km de Nice</strong> (25-35 minutes) et <strong>5 km de Vence</strong>.`,
        services: [
            'Excursion demi-journée avec visite village',
            'Transport Fondation Maeght',
            'Dîner Colombe d\'Or (aller-retour)',
            'Circuit villages perchés'
        ],
        events: 'Les expositions Fondation Maeght, le marché artisanal'
    },
    'vtc-juan-les-pins': {
        intro: `<strong>Juan-les-Pins</strong> est LA station balnéaire Art Déco de la Côte d'Azur, célèbre dans le monde entier pour le <strong>Festival Jazz à Juan</strong> (juillet). Vie nocturne animée, plages de sable fin et pinèdes ombragées font son charme.`,
        distance: `Juan-les-Pins est à <strong>22 km de Nice</strong> (25-35 minutes) et jouxte Antibes.`,
        services: [
            'Navettes Festival Jazz à Juan (juillet)',
            'Transferts plages et restaurants',
            'Service récupération nocturne (clubs)',
            'Transport vers le port d\'Antibes'
        ],
        events: 'Jazz à Juan (juillet), les soirées estivales'
    }
};

// Template de section enrichie
function generateEnrichedSection(city, data) {
    return `
    <!-- Section Intro enrichie -->
    <section class="container py-xl fade-in-section">
      <div class="intro-content">
        <h2>Votre Chauffeur Privé à ${city}</h2>
        <p class="intro-text">${data.intro}</p>
        <p class="intro-distance"><strong>📍 Distance :</strong> ${data.distance}</p>
      </div>
    </section>

    <!-- Nos services -->
    <section class="container py-xl bg-light rounded-lg fade-in-section">
      <h2 class="text-center mb-lg">Nos Services VTC à ${city}</h2>
      <div class="services-list">
        <ul class="check-list">
          ${data.services.map(s => `<li>✓ ${s}</li>`).join('\n          ')}
        </ul>
        <div class="text-center mt-lg">
          <a href="/contact" class="btn-gold">Demander un devis gratuit</a>
        </div>
      </div>
    </section>
`;
}

// Fonction pour enrichir une page
function enrichPage(filePath, cityKey) {
    const data = cityData[cityKey];
    if (!data) return false;

    let content = fs.readFileSync(filePath, 'utf8');

    // Extraire le nom de la ville du cityKey
    const cityName = cityKey.replace('vtc-', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-');

    // Vérifier si déjà enrichi
    if (content.includes('intro-content') || content.includes('Votre Chauffeur Privé')) {
        console.log(`⏭️  ${cityKey} - déjà enrichi`);
        return false;
    }

    // Trouver où insérer (après le H1 et description)
    const insertPoint = content.indexOf('</div>\n\n    \n    <section class="container py-xl fade-in-section">\n      <h2 class="text-center mb-lg">Tarifs');

    if (insertPoint === -1) {
        console.log(`⚠️  ${cityKey} - structure non trouvée`);
        return false;
    }

    // Générer le contenu enrichi
    const enrichedContent = generateEnrichedSection(cityName, data);

    // Insérer le contenu
    const newContent = content.slice(0, insertPoint + 6) + enrichedContent + content.slice(insertPoint + 6);

    // Ajouter les styles si pas présents
    if (!newContent.includes('.intro-content')) {
        const styleInsert = `
  .intro-content { max-width: 800px; margin: 0 auto; text-align: center; }
  .intro-text { font-size: 1.1rem; line-height: 1.8; margin-bottom: 1.5rem; }
  .intro-distance { background: #f0f9f0; padding: 1rem; border-radius: 8px; display: inline-block; }
  .services-list { max-width: 600px; margin: 0 auto; }
  .check-list { list-style: none; padding: 0; text-align: left; }
  .check-list li { padding: 0.75rem 0; border-bottom: 1px solid #eee; font-size: 1.05rem; }
  .check-list li:last-child { border-bottom: none; }
  .btn-gold { background: #d4af37; color: #000; padding: 1rem 2rem; border-radius: 50px; text-decoration: none; font-weight: 600; display: inline-block; transition: all 0.3s; }
  .btn-gold:hover { background: #b8941f; transform: translateY(-2px); }
  .bg-light { background: #f9f9f9; padding: 2rem; }
`;
        const styleIndex = newContent.indexOf('.bg-gold-light');
        if (styleIndex !== -1) {
            const finalContent = newContent.slice(0, styleIndex) + styleInsert + '\n  ' + newContent.slice(styleIndex);
            fs.writeFileSync(filePath, finalContent);
            console.log(`✅ ${cityKey} - enrichi avec succès`);
            return true;
        }
    }

    fs.writeFileSync(filePath, newContent);
    console.log(`✅ ${cityKey} - enrichi avec succès`);
    return true;
}

// Parcourir toutes les pages VTC
console.log('🔧 Enrichissement des pages VTC courtes...\n');

let enriched = 0;
for (const cityKey of Object.keys(cityData)) {
    const filePath = path.join(pagesDir, `${cityKey}.astro`);
    if (fs.existsSync(filePath)) {
        if (enrichPage(filePath, cityKey)) enriched++;
    } else {
        console.log(`❌ ${cityKey} - fichier non trouvé`);
    }
}

console.log(`\n✨ ${enriched} pages enrichies !`);
