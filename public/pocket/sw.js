const CACHE = "pocket-shell-v1";
const files = [
  "./index.html",
  "./pocket.css",
  "./app.mjs",
  "./model.mjs",
  "./store.mjs",
  "./icon.svg",
  "./icon-192.png",
  "./icon-512.png",
  "./manifest.webmanifest",
];
self.addEventListener("install", (event) =>
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(files))),
);
self.addEventListener("activate", (event) =>
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith("pocket-shell-") && k !== CACHE)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  ),
);
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (
    event.request.method !== "GET" ||
    url.origin !== self.location.origin ||
    !url.pathname.startsWith(new URL("./", self.location).pathname)
  )
    return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (
          response.ok &&
          files.some((f) => new URL(f, self.location).pathname === url.pathname)
        ) {
          const copy = response.clone();
          event.waitUntil(
            caches.open(CACHE).then((cache) => cache.put(event.request, copy)),
          );
        }
        return response;
      })
      .catch(() =>
        caches
          .match(event.request)
          .then(
            (r) =>
              r ||
              new Response(
                "Pocket is not cached yet. Open it once while online.",
                { status: 503 },
              ),
          ),
      ),
  );
});
