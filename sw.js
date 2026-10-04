const CACHE_NAME = 'smart-wallet-v1';

const ASSETS_TO_CACHE = [
  './',
  './index.html'
];

// সার্ভিস ওয়ার্কার ইনস্টল এবং ফাইল ক্যাশ করা
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log('Caching assets...');
      for (const asset of ASSETS_TO_CACHE) {
        try {
          await cache.add(asset);
        } catch (err) {
          console.warn('Failed to cache:', asset);
        }
      }
    }).then(() => self.skipWaiting())
  );
});

// পুরনো ক্যাশ ডিলিট করে নতুন সার্ভিস ওয়ার্কার একটিভেট করা
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Deleting old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// অফলাইনে ক্যাশ থেকে ফাইল লোড করা
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).catch(() => {
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});
