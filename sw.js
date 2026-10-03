const CACHE_NAME = 'smart-wallet-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/app.js',
    '/styles.css',
    '/manifest.json',
    '/icon/icon-192.png',
    '/icon/icon-512.png'
];

// সার্ভিস ওয়ার্কার ইনস্টল করার সময় ফাইলগুলো ক্যাশ করা
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS_TO_CACHE))
    );
});

// নেটওয়ার্ক রিকোয়েস্ট ক্যাচ করে অফলাইনে ফাইল সার্ভ করা
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => response || fetch(event.request))
    );
});