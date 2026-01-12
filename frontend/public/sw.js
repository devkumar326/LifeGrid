const APP_SHELL_CACHE = "lifegrid-shell-v2";
const RUNTIME_CACHE = "lifegrid-runtime-v2";
const OFFLINE_FALLBACK = "/";

const APP_SHELL_URLS = [
  OFFLINE_FALLBACK,
  "/dashboard",
  "/events",
  "/manifest.webmanifest",
  "/favicon.ico",
  "/lifegridIcn.png",
];

const SHELL_PATHS = new Set(["/", "/dashboard", "/events"]);

function sendOfflineSignal() {
  self.clients
    .matchAll({ includeUncontrolled: true, type: "window" })
    .then((clients) => {
      clients.forEach((client) =>
        client.postMessage({ type: "OFFLINE_FALLBACK" })
      );
    })
    .catch(() => {});
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(APP_SHELL_CACHE);
        await cache.addAll(APP_SHELL_URLS);
        // Allow browsers that support it to warm navigation responses
        await self.registration?.navigationPreload?.enable?.();
      } catch (err) {
        console.error("SW install failed", err);
      }
    })()
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => ![APP_SHELL_CACHE, RUNTIME_CACHE].includes(key))
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

async function cacheFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  if (cached) {
    return cached;
  }
  const response = await fetch(request);
  cache.put(request, response.clone());
  return response;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((response) => {
      cache.put(request, response.clone());
      return response;
    })
    .catch((err) => {
      sendOfflineSignal();
      if (cached) return cached;
      throw err;
    });

  return cached || fetchPromise;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  const handleNavigation = async () => {
    try {
      const preloadResponse = await event.preloadResponse;
      if (preloadResponse) {
        const cache = await caches.open(RUNTIME_CACHE);
        cache.put(request, preloadResponse.clone());
        return preloadResponse;
      }

      const response = await fetch(request);
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
      return response;
    } catch (err) {
      sendOfflineSignal();
      const cached = await caches.match(request);
      if (cached) return cached;
      return caches.match(OFFLINE_FALLBACK);
    }
  };

  // Handle navigations to keep routes working offline
  if (request.mode === "navigate") {
    event.respondWith(handleNavigation());
    return;
  }

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) return;

  // Next.js built assets
  if (url.pathname.startsWith("/_next/static") || url.pathname.startsWith("/_next/image")) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Static assets from public
  const isStaticAsset =
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "image" ||
    request.destination === "font";
  if (isStaticAsset) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (SHELL_PATHS.has(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
});

