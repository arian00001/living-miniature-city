// Keeps the city on the device: the heavy GLB models and hashed assets are cached the
// first time they arrive, so a second visit never downloads them again and the scene
// still opens offline.
const VERSION = 'living-city-v1';
const SHELL = ['/'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(VERSION)
      .then((cache) => cache.addAll(SHELL))
      .catch(() => undefined)
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((key) => key !== VERSION).map((key) => caches.delete(key)));
      await self.clients.claim();
    })(),
  );
});

const ASSET = /\/assets\//;
const MODEL = /\.(glb|gltf|bin|hdr|exr|woff2?|ttf|otf|png|jpe?g|webp|svg)$/i;

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Pages: always try the network first so a new deploy shows up, fall back to the shell.
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request);
          const cache = await caches.open(VERSION);
          cache.put('/', fresh.clone());
          return fresh;
        } catch {
          const cache = await caches.open(VERSION);
          return (await cache.match('/')) || (await cache.match('/index.html')) || Response.error();
        }
      })(),
    );
    return;
  }

  // Models, hashed bundles and fonts: cache first, network only on a miss.
  if (ASSET.test(url.pathname) || MODEL.test(url.pathname)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(VERSION);
        const hit = await cache.match(request);
        if (hit) return hit;
        const response = await fetch(request);
        if (response.ok || response.type === 'opaque') cache.put(request, response.clone());
        return response;
      })(),
    );
  }
});