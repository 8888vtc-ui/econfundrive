/**
 * Menu Navigation Mobile - ECOFUNDRIVE
 * JavaScript externe pour éviter les conflits et améliorer les performances
 */

(function() {
  'use strict';
  
  // Attendre que le DOM soit prêt
  function initMenu() {
    const navToggle = document.getElementById('nav-toggle-btn');
    const navMenu = document.getElementById('nav-menu-mobile');
    const menuOverlay = document.getElementById('menu-overlay');
    const menuClose = document.getElementById('mobile-menu-close');
    const body = document.body;
    
    // Vérifier que les éléments existent
    if (!navToggle || !navMenu) {
      if (console && console.warn) {
        console.warn('Menu mobile elements not found');
      }
      return;
    }
    
    /**
     * Ouvrir le menu mobile
     */
    function openMenu() {
      navMenu.classList.add('open');
      if (menuOverlay) {
        menuOverlay.classList.add('active');
        menuOverlay.setAttribute('aria-hidden', 'false');
      }
      navToggle.setAttribute('aria-expanded', 'true');
      navToggle.classList.add('active');
      body.classList.add('menu-open');
    }
    
    /**
     * Fermer le menu mobile
     */
    function closeMenu() {
      navMenu.classList.remove('open');
      if (menuOverlay) {
        menuOverlay.classList.remove('active');
        menuOverlay.setAttribute('aria-hidden', 'true');
      }
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.classList.remove('active');
      body.classList.remove('menu-open');
    }
    
    /**
     * Toggle le menu mobile
     */
    function toggleMenu() {
      if (navMenu.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    }
    
    /**
     * Gérer le clic sur le bouton hamburger
     */
    if (navToggle) {
      navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        toggleMenu();
      });
      
      // Support touch pour mobile
      navToggle.addEventListener('touchend', (e) => {
        e.stopPropagation();
        e.preventDefault();
        toggleMenu();
      });
    }
    
    /**
     * Gérer le clic sur le bouton fermer
     */
    if (menuClose) {
      menuClose.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        closeMenu();
      });
      
      menuClose.addEventListener('touchend', (e) => {
        e.stopPropagation();
        e.preventDefault();
        closeMenu();
      });
    }
    
    /**
     * Gérer le clic sur l'overlay
     */
    if (menuOverlay) {
      menuOverlay.addEventListener('click', (e) => {
        if (e.target === menuOverlay) {
          closeMenu();
        }
      });
      
      menuOverlay.addEventListener('touchend', (e) => {
        if (e.target === menuOverlay) {
          closeMenu();
        }
      });
    }
    
    /**
     * Fermer le menu au clic sur un lien
     */
    const navLinks = navMenu.querySelectorAll('.mobile-menu-links a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        setTimeout(() => closeMenu(), 100);
      });
      
      link.addEventListener('touchend', () => {
        setTimeout(() => closeMenu(), 100);
      });
    });
    
    /**
     * Fermer le menu avec la touche Escape
     */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMenu();
      }
    });
    
    /**
     * Fermer le menu au resize si on passe en desktop
     */
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navMenu.classList.contains('open')) {
        closeMenu();
      }
    });
    
    /**
     * Empêcher la propagation des clics dans le menu
     */
    navMenu.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
  
  // Initialiser le menu quand le DOM est prêt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMenu);
  } else {
    // DOM déjà chargé
    initMenu();
  }
})();

