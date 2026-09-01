const CACHE_NAME = "aliskanliklarim-cache-v1";

const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/styles.css",
  "./js/app.js",
  "./js/router.js",
  "./js/lib/date.js",
  "./js/lib/util.js",
  "./js/lib/icons.js",
  "./js/lib/store.js",
  "./js/lib/selectors.js",
  "./js/lib/theme.js",
  "./js/data/library.js",
  "./js/components/bottomNav.js",
  "./js/components/sheet.js",
  "./js/components/toast.js",
  "./js/screens/today.js",
  "./js/screens/calendar.js",
  "./js/screens/habits.js",
  "./js/screens/habitDetail.js",
  "./js/screens/addHabit.js",
  "./js/screens/stats.js",
  "./js/screens/profile.js",
  "./js/screens/settings.js",
  "./js/screens/reflection.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/maskable-192.png",
  "./icons/maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png",
  "./icons/favicon-64.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => cached || caches.match("./index.html"));
      return cached || network;
    })
  );
});
