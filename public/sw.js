/* Universo · Service Worker
 * Estratégias:
 *  - Precache: shell mínimo (offline + ícones)
 *  - HTML navegação: network-first com fallback /offline
 *  - APIs internas: stale-while-revalidate (TTL 1h)
 *  - Imagens externas (NASA): cache-first com TTL 7d
 *  - Assets _next/static: cache-first imutável
 */

const VERSION = "v1";
const PRECACHE = `universo-precache-${VERSION}`;
const HTML_CACHE = `universo-html-${VERSION}`;
const API_CACHE = `universo-api-${VERSION}`;
const IMAGE_CACHE = `universo-img-${VERSION}`;
const STATIC_CACHE = `universo-static-${VERSION}`;

const PRECACHE_URLS = ["/offline", "/icon.svg", "/icon-maskable.svg", "/manifest.webmanifest"];

const API_TTL_MS = 60 * 60 * 1000;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(PRECACHE).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  const expected = new Set([PRECACHE, HTML_CACHE, API_CACHE, IMAGE_CACHE, STATIC_CACHE]);
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => !expected.has(k)).map((k) => caches.delete(k))),
    ).then(() => self.clients.claim()),
  );
});

const isExpired = (response, ttl) => {
  const stored = response.headers.get("sw-cached-at");
  if (!stored) return false;
  return Date.now() - Number(stored) > ttl;
};

const stamp = async (response) => {
  const blob = await response.clone().blob();
  const headers = new Headers(response.headers);
  headers.set("sw-cached-at", String(Date.now()));
  return new Response(blob, { status: response.status, statusText: response.statusText, headers });
};

const networkFirstHTML = async (request) => {
  try {
    const fresh = await fetch(request);
    const cache = await caches.open(HTML_CACHE);
    cache.put(request, fresh.clone());
    return fresh;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    const offline = await caches.match("/offline");
    return offline ?? new Response("Offline", { status: 503 });
  }
};

const staleWhileRevalidate = async (request, cacheName, ttl) => {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request)
    .then(async (response) => {
      if (response.ok) {
        const stamped = await stamp(response);
        cache.put(request, stamped.clone());
        return stamped;
      }
      return response;
    })
    .catch(() => cached);

  if (cached && !isExpired(cached, ttl)) return cached;
  return (await fetchPromise) ?? cached ?? new Response("Offline", { status: 503 });
};

const cacheFirst = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    return cached ?? new Response("", { status: 504 });
  }
};

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    if (request.destination === "image") {
      event.respondWith(cacheFirst(request, IMAGE_CACHE));
    }
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(networkFirstHTML(request));
    return;
  }

  if (url.pathname.startsWith("/api/")) {
    event.respondWith(staleWhileRevalidate(request, API_CACHE, API_TTL_MS));
    return;
  }

  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/_next/image")) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  if (request.destination === "image") {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
  }
});

self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") self.skipWaiting();
});
