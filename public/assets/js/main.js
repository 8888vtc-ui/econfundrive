// Scripts globaux: FAQ toggle, breadcrumbs, Core Web Vitals hints, etc.

// FAQ accordéon
document.addEventListener("click", (event) => {
  const header = event.target.closest(".faq-question");
  if (!header) return;
  const item = header.closest(".faq-item");
  if (!item) return;
  item.classList.toggle("open");
});

// Marquer la date de mise à jour automatiquement si un élément .js-last-updated existe
const lastUpdatedEl = document.querySelector(".js-last-updated");
if (lastUpdatedEl) {
  const now = new Date();
  const formatted = now.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  lastUpdatedEl.textContent = formatted;
}

// Menu mobile géré directement dans Header.astro - pas de duplication ici
