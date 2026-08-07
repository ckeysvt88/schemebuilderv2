const CACHE = 'schemebuilders-v3-1';
const BASE  = '/';
const SHELL = BASE + 'index.html';
const ASSETS = [
  BASE,
  SHELL,
  BASE + 'manifest.json',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Network-first. Used for URLs whose filename never changes — the HTML shell
// and the manifest. A cached copy of these would pin the user to an old build,
// because index.html is what names the current asset hashes.
async function networkFirst(e, key) {
  const req   = e.request;
  const cache = await caches.open(CACHE);
  try {
    const res = await fetch(req);
    if (res.ok) e.waitUntil(cache.put(key || req, res.clone()));
    return res;
  } catch {
    const cached = await cache.match(key || req);
    if (cached) return cached;
    throw new Error('offline, not cached: ' + req.url);
  }
}

// Cache-first. Everything under /assets/ is content-hashed by Vite, so a cache
// hit cannot be stale — different content means a different filename.
async function cacheFirst(e) {
  const req    = e.request;
  const cache  = await caches.open(CACHE);
  const cached = await cache.match(req);
  if (cached) return cached;
  const res = await fetch(req);
  if (res.ok) e.waitUntil(cache.put(req, res.clone()));
  return res;
}

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;   // cross-origin: browser handles it

  if (e.request.mode === 'navigate') {
    e.respondWith(networkFirst(e, SHELL));      // offline falls back to the shell
    return;
  }
  if (url.pathname.startsWith(BASE + 'assets/')) {
    e.respondWith(cacheFirst(e));
    return;
  }
  e.respondWith(networkFirst(e));
});