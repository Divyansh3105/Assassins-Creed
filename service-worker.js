// Lives at the site root so its scope covers every page.
// Bump CACHE on each release; old caches are deleted on activate.
const CACHE = "ac-pwa-v4";
const MAX_ENTRIES = 120;
const PRECACHE = [
  "./",
  "index.html",
  "404.html",
  "css/styles.css",
  "js/app.js",
  "data/data.json",
  "assets/vendor/dompurify/purify.min.js",
  "assets/vendor/particles/particles.min.js",
  "assets/vendor/bootstrap-icons/bootstrap-icons.css",
  "assets/vendor/bootstrap-icons/fonts/bootstrap-icons.woff2",
];
const pinned = new Set(PRECACHE.map((p) => new URL(p, self.location).href));

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

// Oldest-first eviction so runtime caching can't grow without bound
async function trim(cache) {
  const keys = await cache.keys();
  const evictable = keys.filter((r) => !pinned.has(r.url));
  for (const req of evictable.slice(0, Math.max(0, keys.length - MAX_ENTRIES))) {
    await cache.delete(req);
  }
}

// Network first so deploys show up immediately; cache is the offline fallback.
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  event.respondWith(
    fetch(req)
      .then((res) => {
        // 200 only (206 audio ranges can't be cached); skip the large music file
        if (res.status === 200 && req.destination !== "audio") {
          const copy = res.clone();
          caches.open(CACHE).then(async (cache) => {
            await cache.put(req, copy);
            await trim(cache);
          });
        }
        return res;
      })
      .catch(async () => {
        const hit = await caches.match(req);
        if (hit) return hit;
        if (req.mode === "navigate") return caches.match("404.html");
        return Response.error();
      }),
  );
});
