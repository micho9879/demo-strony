/* ═══════════════════════════════════════════════════════════════
   Service Worker — Testy UDT
   Cache-first dla statycznych zasobów, network-first dla danych JSON
   Zmień CACHE_VER przy każdym deploy żeby wymusić odświeżenie.
   ═══════════════════════════════════════════════════════════════ */

const CACHE_VER = 'udt-v56';

// Pliki do precache przy instalacji
const PRECACHE = [
  './',
  './index.html',
  './style.css?v=56',
  './app.js?v=56',
  './img/bhp-icon.png'
];

// ─── INSTALL: Precache kluczowych plików ────────────────────
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_VER).then(cache => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

// ─── ACTIVATE: Usuń stare cache ─────────────────────────────
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_VER).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ─── FETCH: Strategia cachowania ────────────────────────────
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // NIE cachuj: Firebase, Firestore, analytics, Telegram, external CDN
  if (
    url.hostname.includes('firebaseio') ||
    url.hostname.includes('googleapis') ||
    url.hostname.includes('gstatic') ||
    url.hostname.includes('firebase') ||
    url.hostname.includes('telegram') ||
    url.hostname.includes('api.telegram') ||
    url.hostname.includes('cloudflare') ||
    e.request.method !== 'GET'
  ) {
    return;
  }

  // Pliki JSON z danymi (pytania, opisy) — network-first z cache fallback
  if (url.pathname.endsWith('.json')) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_VER).then(c => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // GitHub raw SVG ikony — cache-first
  if (url.hostname.includes('raw.githubusercontent.com')) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_VER).then(c => c.put(e.request, clone));
          }
          return res;
        });
      })
    );
    return;
  }

  // Wszystko inne (HTML, CSS, JS, obrazki) — cache-first
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res.ok && url.origin === self.location.origin) {
          const clone = res.clone();
          caches.open(CACHE_VER).then(c => c.put(e.request, clone));
        }
        return res;
      });
    })
  );
});
