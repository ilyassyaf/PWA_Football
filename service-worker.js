const CACHE_NAME = "football-pwa-v1";
var urlsToCache = [
  "./",
  "./nav.html",
  "./index.html",
  "./pages/home.html",
  "./pages/fav-team.html",
  "./pages/teams.html",
  "./css/materialize.min.css",
  "./js/materialize.min.js",
  "./js/nav.js",
  "./js/api.js",
  "./js/idb.js",
  "./icon.png"
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function(event) {
  var base_url = "https://api.football-data.org/v2/";

  if (event.request.url.indexOf(base_url) > 1) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return fetch(event.request).then(function(response) {
          cache.put(event.request.url, response.clone());
          return response;
        });
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  }
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheName) {
      return Promise.all(
        cacheName.map(function(cacheName) {
          if (cacheName != CACHE_NAME) {
            console.log("Service Worker: cache " + cacheName + " deleted");
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("push", function(event) {
  var body;

  if (event.data) {
    body = event.data.text();
  } else {
    body = "Push message no payload";
  }

  var options = {
    body: body,
    icon: "./img/icon.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification("Push Notification", options)
  );
});
