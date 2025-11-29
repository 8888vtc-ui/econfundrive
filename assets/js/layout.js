// Injecte automatiquement le header, le footer, le bouton WhatsApp et le bot
// depuis la page d’accueil sur les autres pages, pour éviter les duplications.

document.addEventListener("DOMContentLoaded", async () => {
  const hasHeader = document.querySelector("header.site-header");
  const hasFooter = document.querySelector("footer.site-footer");
  const hasWhatsApp = document.querySelector(".whatsapp-floating");
  const hasChatToggle = document.querySelector(".chatbot-toggle");
  const hasChatPanel = document.querySelector(".chatbot-panel");

  // Si tout est déjà présent (ex. sur l’accueil), on ne fait rien
  if (hasHeader && hasFooter && hasWhatsApp && hasChatToggle && hasChatPanel) {
    return;
  }

  try {
    const res = await fetch("/index.html", { credentials: "same-origin" });
    if (!res.ok) return;

    const text = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");

    if (!hasHeader) {
      const header = doc.querySelector("header.site-header");
      if (header) {
        document.body.insertBefore(header.cloneNode(true), document.body.firstChild || null);
      }
    }

    if (!hasFooter) {
      const footer = doc.querySelector("footer.site-footer");
      if (footer) {
        document.body.appendChild(footer.cloneNode(true));
      }
    }

    if (!hasWhatsApp) {
      const wa = doc.querySelector(".whatsapp-floating");
      if (wa) {
        document.body.appendChild(wa.cloneNode(true));
      }
    }

    if (!hasChatToggle || !hasChatPanel) {
      const toggle = doc.querySelector(".chatbot-toggle");
      const panel = doc.querySelector(".chatbot-panel");
      if (!hasChatToggle && toggle) {
        document.body.appendChild(toggle.cloneNode(true));
      }
      if (!hasChatPanel && panel) {
        document.body.appendChild(panel.cloneNode(true));
      }
    }
  } catch (e) {
    console.error("Erreur injection layout", e);
  }
});
