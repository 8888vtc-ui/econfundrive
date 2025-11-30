// Configuration du Service Worker
const CACHE_NAME = 'ecofundrive-cache-v1';
const OFFLINE_URL = '/offline.html';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/assets/css/main.css',
  '/assets/css/vtc-style.css',
  '/assets/js/main.js',
  '/assets/js/chatbot.js',
  '/assets/js/cookies.js',
  '/assets/js/navigation.js',
  '/assets/img/optimized/hero-aeroport-nice.webp',
  '/assets/img/optimized/vtc-tesla-nice.webp',
  '/assets/fonts/poppins-v20-latin-regular.woff2',
  '/assets/fonts/poppins-v20-latin-500.woff2',
  '/assets/fonts/poppins-v20-latin-600.woff2',
  '/assets/fonts/poppins-v20-latin-700.woff2',
  OFFLINE_URL
];

// Installation du Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Mise en cache des ressources statiques');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activation du Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Nettoyage de l\'ancien cache :', cache);
            return caches.delete(cache);
          }
        })
      );
    })
    .then(() => self.clients.claim())
  );
});

// Stratégie de mise en cache : Cache First, puis réseau
self.addEventListener('fetch', event => {
  // Ignorer les requêtes non-GET et les requêtes vers des domaines externes
  if (event.request.method !== 'GET') return;
  
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== location.origin) return;

  // Pour les requêtes de navigation, essayer le réseau d'abord, puis le cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Mettre à jour le cache avec la nouvelle réponse
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, responseToCache));
          return response;
        })
        .catch(() => {
          // Si le réseau échoue, essayer le cache
          return caches.match(event.request)
            .then(response => response || caches.match(OFFLINE_URL));
        })
    );
    return;
  }

  // Pour les autres requêtes, essayer le cache d'abord, puis le réseau
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request)
          .then(response => {
            // Mettre en cache les nouvelles réponses pour les requêtes GET
            if (response && response.status === 200 && response.type === 'basic') {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, responseToCache));
            }
            return response;
          });
      })
  );
});

// Gestion des messages (pour la mise à jour du contenu)
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
