// Service worker de Vendix.
//
// Estrategia:
// - Para la página (el HTML): "network-first" — siempre intenta traer
//   la versión más nueva del servidor primero, y solo usa la caché si
//   no hay conexión. Esto evita el problema clásico de quedar "pegado"
//   viendo una versión vieja de la app después de actualizar el código.
// - Para el resto de los archivos (JS, CSS, imágenes): "stale-while-
//   revalidate" — responde rápido desde caché y de paso la actualiza
//   en segundo plano para la próxima vez. Como Vite les cambia el
//   nombre al compilar, no hay riesgo de servir una versión vieja de
//   un archivo con el mismo nombre.

const CACHE_NAME = "vendix-cache-v3";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  // Los datos de la API (productos, ventas, panel...) NUNCA se guardan en caché: deben ser siempre
  // los de ahora y los de la cuenta que tiene la sesión iniciada. Tampoco se toca nada de otros sitios.
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;

  const esNavegacion = request.mode === "navigate" || request.destination === "document";

  if (esNavegacion) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => caches.open(CACHE_NAME).then((cache) => cache.match(request)))
    );
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request);
      const networkFetch = fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            cache.put(request, response.clone());
          }
          return response;
        })
        .catch(() => cached);

      return cached || networkFetch;
    })
  );
});
