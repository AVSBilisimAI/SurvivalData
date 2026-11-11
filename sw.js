const CACHE_NAME = 'avs-survival-auto';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  '.assets/js/app.js',
  './data/articles_data.js',
  './data/survival_poi.js',
  './assets/js/marked.min.js',
  './maps/leaflet.css',
  './maps/leaflet.js',
  './manifest.json',
  '.assets/icon.svg',
  './data/pharma_data.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) {
          return key !== CACHE_NAME;
        }).map(function(key) {
          return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

// Önce İnternetten En Güncel Dosyayı Çek, İnternet Yoksa Önbellekten Aç
self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(function(networkResponse) {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(function() {
        return caches.match(event.request);
      })
  );
});
