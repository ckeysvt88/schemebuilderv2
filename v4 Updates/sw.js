// CFB26 DC Scheme Builder — Service Worker
// Cache version: bump this string any time you deploy a new version of the app
const CACHE = 'cfb26-dc-v3';

const PRECACHE = [
  '/',
  '/index.html',
  'https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.5/babel.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js',
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap'
];

// Install: cache everything upfront
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(PRECACHE).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

// Activate: delete old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch: cache-first for CDN + app shell, network-first for everything else
self.addEventListener('fetch', e => {
  const url = e.request.url;

  // Skip non-GET and browser extensions
  if (e.request.method !== 'GET' || url.startsWith('chrome-extension')) return;

  // Cache-first strategy for the app shell and CDN assets
  const isCacheable =
    url.includes('cdnjs.cloudflare.com') ||
    url.includes('fonts.googleapis.com') ||
    url.includes('fonts.gstatic.com') ||
    url.endsWith('.html') ||
    url.endsWith('/') ||
    url === self.location.origin + '/';

  if (isCacheable) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return res;
        }).catch(() => caches.match('/index.html'));
      })
    );
    return;
  }

  // Network-first for Google Analytics and everything else
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
