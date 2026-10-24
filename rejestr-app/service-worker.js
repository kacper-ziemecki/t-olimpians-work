const CACHE_NAME = 'rejestr-lekcji-v13';
const ASSETS = [
  './rejestr-lekcji.html',
  './manifest.json',
  './logo.png',
  './icon-192.png?v=11',
  './icon-512.png?v=11',
  './icon-192-maskable.png?v=11',
  './icon-512-maskable.png?v=11',
  './apple-touch-icon.png?v=11'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      // cache: 'reload' omija pamiec podreczna przegladarki, zeby nie zapisac starych plikow
      return cache.addAll(ASSETS.map(function (url) { return new Request(url, { cache: 'reload' }); }));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (key) { return key !== CACHE_NAME; })
            .map(function (key) { return caches.delete(key); })
      );
    })
  );
  self.clients.claim();
});

function networkFirst(req) {
  return fetch(req).then(function (response) {
    if (response && response.status === 200 && req.method === 'GET') {
      const clone = response.clone();
      caches.open(CACHE_NAME).then(function (cache) { cache.put(req, clone); });
    }
    return response;
  }).catch(function () {
    return caches.match(req);
  });
}

self.addEventListener('fetch', function (event) {
  const req = event.request;
  const url = new URL(req.url);
  const isHTML = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');
  // Manifest i ikony: zawsze najpierw siec, zeby telefon mogl wykryc nowa ikone zainstalowanej aplikacji.
  const isIdentity = /\/(manifest\.json|icon-[\w-]+\.png|apple-touch-icon\.png)$/.test(url.pathname);

  if (isHTML || isIdentity) {
    // Cache sluzy tylko jako zapasowa wersja offline.
    event.respondWith(networkFirst(req));
    return;
  }

  // Pozostale zasoby: najpierw cache, potem siec.
  event.respondWith(
    caches.match(req).then(function (cached) {
      return cached || fetch(req).then(function (response) {
        if (response && response.status === 200 && req.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(function (cache) { cache.put(req, clone); });
        }
        return response;
      }).catch(function () {
        return cached;
      });
    })
  );
});
