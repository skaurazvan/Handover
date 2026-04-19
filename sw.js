// Service Worker for Shift Handover PWA
// Caches the app shell so it works offline

const CACHE_NAME = 'handover-v1';
const ASSETS = [
  './',
  './handover.html',
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap'
];

// Install: pre-cache the essentials
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS).catch(() => {
        // Don't fail install if some assets can't be cached
        return cache.add('./handover.html').catch(() => {});
      }))
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: cache-first strategy with network fallback
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        // Only cache successful same-origin or CORS responses
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, clone).catch(() => {});
          });
        }
        return response;
      }).catch(() => {
        // Fallback: return the cached HTML for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('./handover.html');
        }
      });
    })
  );
});
