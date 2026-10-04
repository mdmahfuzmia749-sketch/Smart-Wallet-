const CACHE_NAME = 'smart-wallet-v1';
const ASSETS_TO_CACHE = [
    '/',
    './index.html',
    './app.js',
    './styles.css',
    './manifest.json',
    './icon/icon-192.png',
    './icon/icon-512.png'
];

// সার্ভিস ওয়ার্কার ইনস্টল করার সময় ফাইলগুলো ক্যাশ করা
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS_TO_CACHE))
    );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
