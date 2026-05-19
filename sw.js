const CACHE_NAME = 'guide-plus-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // キャッシュにあればそれを返し、なければネットワークから取得
      return response || fetch(event.request);
    }).catch(() => {
      // オフライン時にエラーが出た場合のフォールバック（必要に応じて）
      return caches.match('./index.html');
    })
  );
});
