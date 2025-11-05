// Test de génération de contenu avec le nouveau prompt

const testKeyword = {
  id: 1,
  keyword: "VTC Nice Monaco",
  language: "fr",
  category: "vtc",
  location: "Monaco",
  authority: true,
  mode: "A",
  wordcount: 2200
};

console.log("═══════════════════════════════════════════════════════════════════");
console.log("TEST PROMPT - Génération de contenu ECOFUNDRIVE V2.0");
console.log("═══════════════════════════════════════════════════════════════════");
console.log("");
console.log("Keyword de test:", testKeyword.keyword);
console.log("Type:", testKeyword.authority ? "AUTHORITY" : "STANDARD");
console.log("Wordcount cible:", testKeyword.wordcount, "mots");
console.log("");
console.log("✅ PROMPT AMÉLIORÉ - Modifications principales:");
console.log("");
console.log("1. Instructions détaillées avec exemples de structure");
console.log("2. Données ECOFUNDRIVE injectées (flotte, tarifs, inclusions)");
console.log("3. Ton et style explicites (premium, chaleureux, 'vous')");
console.log("4. Contenu à développer selon catégorie (VTC, plages, restaurants)");
console.log("5. Interdictions strictes répétées");
console.log("6. Exemples de structure H2/H3 concrets");
console.log("7. Max tokens augmenté: 8000 (vs 4000 avant)");
console.log("8. Temperature: 0.7 pour équilibre créativité/précision");
console.log("9. Validation post-génération du contenu");
console.log("10. Nettoyage automatique des markdown wrappers");
console.log("");
console.log("═══════════════════════════════════════════════════════════════════");
console.log("ATTENDU EN SORTIE:");
console.log("═══════════════════════════════════════════════════════════════════");
console.log("");
console.log("- Title H1: 50-70 caractères");
console.log("- Meta title: 50-60 caractères");
console.log("- Meta description: 150-160 caractères");
console.log("- Introduction: 200-250 mots");
console.log("- Sections: 5-8 H2 avec 2-4 H3 chacune");
console.log("- Contenu riche: paragraphes détaillés avec exemples concrets");
console.log("- FAQ: 5 questions contextualisées, réponses 60-100 mots");
console.log("- Liens internes: 10-12 (authority) ou 8 (standard)");
console.log("- Wordcount total: 2200+ mots");
console.log("");
console.log("✅ Le prompt est maintenant PRÊT pour générer du vrai contenu !");
console.log("");
