self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("pwa-cache").then(cache => {
      return cache.addAll([
        "/",
        "/index.html",
        "/manifest.json",
        "media/bomb1_192-192.png",
        "media/bomb1_512-512.png",
        "/script.js",
        "/style.css",
        "media/bomb1.svg",
        "/widget.html",
        "/favicon.ico",
        "media/biber_standing_alpha.png",
        "https://bwinf.de/_assets/51da559d81e26dd99a16662ed6f306af/Images/Logo-BWINF-Footer.svg",
        
      ]);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
