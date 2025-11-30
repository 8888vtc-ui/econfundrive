/**
 * FIX MOBILE FLOATING - Force le positionnement fixe sur mobile
 * Solution radicale : top/left fixes (pas de transform)
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
  
  // Fonction pour calculer top fixe (milieu vertical)
  function getWhatsAppTop() {
    return (window.innerHeight - 44) / 2; // 44px = min-height
  }
  
  function getChatbotToggleTop() {
    return (window.innerHeight - 44) / 2 - 60; // 60px d'espace avec WhatsApp
  }
  
  function getChatbotContainerTop() {
    return (window.innerHeight - 44) / 2 - 20; // 20px de décalage
  }
  
  // Fonction pour forcer le positionnement avec top/left fixes
  function forcePosition() {
    if (whatsappButton) {
      const top = getWhatsAppTop();
      whatsappButton.style.position = 'fixed';
      whatsappButton.style.top = top + 'px';
      whatsappButton.style.left = '15px';
      whatsappButton.style.transform = 'none'; // PAS DE TRANSFORM
      whatsappButton.style.zIndex = '99999';
      whatsappButton.style.display = 'flex';
      whatsappButton.style.visibility = 'visible';
      whatsappButton.style.opacity = '1';
    }
    
    if (chatbotToggle) {
      const top = getChatbotToggleTop();
      chatbotToggle.style.position = 'fixed';
      chatbotToggle.style.top = top + 'px';
      chatbotToggle.style.left = '15px';
      chatbotToggle.style.transform = 'none'; // PAS DE TRANSFORM
      chatbotToggle.style.zIndex = '99998';
      chatbotToggle.style.display = 'flex';
      chatbotToggle.style.visibility = 'visible';
      chatbotToggle.style.opacity = '1';
    }
    
    if (chatbotContainer && chatbotContainer.classList.contains('open')) {
      const top = getChatbotContainerTop();
      chatbotContainer.style.position = 'fixed';
      chatbotContainer.style.top = top + 'px';
      chatbotContainer.style.left = '15px';
      chatbotContainer.style.transform = 'none'; // PAS DE TRANSFORM
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
    scrollTimeout = setTimeout(forcePosition, 50); // Plus rapide
  }, { passive: true });
  
  // Écouter le resize pour recalculer
  window.addEventListener('resize', function() {
    forcePosition();
  }, { passive: true });
  
  // Observer les mutations DOM
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
