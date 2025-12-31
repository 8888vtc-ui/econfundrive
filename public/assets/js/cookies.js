// Bannière RGPD optimisée pour mobile
const initCookieBanner = () => {
  if (!localStorage.getItem('cookiesAccepted') && !localStorage.getItem('cookiesRejected')) {
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.innerHTML = `
        <p>Nous utilisons des cookies pour le bon fonctionnement du site et, avec votre accord, pour des mesures d'audience anonymisées. 
        <a href="/mentions-legales-rgpd.html">Politique de confidentialité</a></p>
        <div class="cookie-buttons">
          <button id="accept-cookies" class="cookie-btn cookie-btn-accept">Accepter</button>
          <button id="reject-cookies" class="cookie-btn cookie-btn-reject">Refuser</button>
        </div>
    `;
    document.body.appendChild(banner);

    document.getElementById('accept-cookies').addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'true');
      banner.remove();
    });

    document.getElementById('reject-cookies').addEventListener('click', () => {
      localStorage.setItem('cookiesRejected', 'true');
      banner.remove();
    });
  }
};

document.addEventListener('DOMContentLoaded', initCookieBanner);
