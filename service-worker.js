const CACHE_NAME = 'handover-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.mode === 'navigate') {
    // Network-first for the main page so updates show on first launch
    e.respondWith(
      fetch(req)
        .then(r => {
          const copy = r.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, copy));
          return r;
        })
        .catch(() => caches.match(req).then(c => c || caches.match('./index.html')))
    );
  } else {
    // Cache-first for static assets (icons, manifest)
    e.respondWith(caches.match(req).then(c => c || fetch(req)));
  }
});
