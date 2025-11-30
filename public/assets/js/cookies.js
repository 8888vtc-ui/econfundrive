// Bannière RGPD simple
const initCookieBanner = () => {
  if (!localStorage.getItem('cookiesAccepted')) {
    const banner = document.createElement('div');
    banner.innerHTML = `
      <div style="position:fixed; bottom:0; background:#1e293b; color:white; padding:1rem; width:100%; z-index:50; display:flex; flex-wrap:wrap; gap:1rem; align-items:center">
        <p>Nous utilisons des cookies ou technologies similaires principalement pour le bon fonctionnement du site et, avec votre accord, pour des mesures d’audience anonymisées. Vous pouvez accepter ou refuser ces cookies optionnels. Pour en savoir plus, consultez notre <a href="/mentions-legales-rgpd.html" style="color:#38bdf8">politique de confidentialité</a>.</p>
        <div style="display:flex; gap:0.5rem">
          <button id="accept-cookies" style="background:#0ea5e9; color:white; border:none; padding:0.4rem 0.8rem; border-radius:4px; cursor:pointer">Accepter</button>
          <button id="reject-cookies" style="background:transparent; color:#94a3b8; border:1px solid #94a3b8; padding:0.4rem 0.8rem; border-radius:4px; cursor:pointer">Refuser</button>
        </div>
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
