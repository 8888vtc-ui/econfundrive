/**
 * FIX MOBILE FLOATING - Force le positionnement fixe sur mobile
 * Solution radicale pour WhatsApp et Chatbot qui disparaissent sur mobile
 */
(function() {
  'use strict';
  
  // Détecter si on est sur mobile
  const isMobile = window.innerWidth <= 768;
  
  if (!isMobile) {
    return; // Pas besoin sur desktop
  }
  
  const whatsappButton = document.querySelector('.whatsapp-button');
  const chatbotToggle = document.querySelector('.chatbot-toggle');
  const chatbotContainer = document.querySelector('.chatbot-container');
  
  // Fonction pour forcer le positionnement
  function forcePosition() {
    if (whatsappButton) {
      whatsappButton.style.position = 'fixed';
      whatsappButton.style.zIndex = '99999';
      whatsappButton.style.display = 'flex';
      whatsappButton.style.visibility = 'visible';
      whatsappButton.style.opacity = '1';
    }
    
    if (chatbotToggle) {
      chatbotToggle.style.position = 'fixed';
      chatbotToggle.style.zIndex = '99998';
      chatbotToggle.style.display = 'flex';
      chatbotToggle.style.visibility = 'visible';
      chatbotToggle.style.opacity = '1';
    }
    
    if (chatbotContainer && chatbotContainer.classList.contains('open')) {
      chatbotContainer.style.position = 'fixed';
      chatbotContainer.style.zIndex = '99997';
      chatbotContainer.style.display = 'flex';
      chatbotContainer.style.visibility = 'visible';
      chatbotContainer.style.opacity = '1';
    }
  }
  
  // Forcer immédiatement
  forcePosition();
  
  // Forcer à chaque frame (solution radicale)
  let rafId;
  function maintainPosition() {
    forcePosition();
    rafId = requestAnimationFrame(maintainPosition);
  }
  
  // Démarrer le maintien de position
  maintainPosition();
  
  // Écouter le scroll pour forcer la position
  let scrollTimeout;
  window.addEventListener('scroll', function() {
    forcePosition();
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(forcePosition, 100);
  }, { passive: true });
  
  // Écouter le resize
  window.addEventListener('resize', function() {
    forcePosition();
  }, { passive: true });
  
  // Observer les mutations DOM (si les éléments sont ajoutés dynamiquement)
  if (window.MutationObserver) {
    const observer = new MutationObserver(function() {
      forcePosition();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  }
  
  // Forcer aussi après le chargement complet
  window.addEventListener('load', forcePosition);
  document.addEventListener('DOMContentLoaded', forcePosition);
  
  // Nettoyer à la déconnexion
  window.addEventListener('beforeunload', function() {
    if (rafId) {
      cancelAnimationFrame(rafId);
    }
  });
})();

