/**
 * serviceWorker.js 
 * 
 * This is the dev service worker for vite that passes all requests through
 * without checking the cache. Optionally, it can simulate an offline state
 * without actually going offline (useful for developing with the vite dev server).
 */
const STATIC_CACHE_NAME = "wolfnotes-dev-v5";

const SIMULATE_OFFLINE = false;

const LOG_CACHE_HITS = false;

self.addEventListener('install', event => {
  console.log('install');
  event.waitUntil(initCache());
});

async function initCache() {
  let resourcesResponse = await fetch('/api/online/resources');
  let resources = await resourcesResponse.json();
  let cache = await caches.open(STATIC_CACHE_NAME);
  console.log(`${STATIC_CACHE_NAME} initializing with resources:`)
  console.log(resources);
  await cache.addAll(resources);
  console.log(`${STATIC_CACHE_NAME} initialized`)
}

self.addEventListener('activate', event => {
  console.log('activate', event);
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith('wolfnotes-') && cacheName != STATIC_CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', fetchHandler);

async function fetchHandler(event) {
  var requestURL = new URL(event.request.url);
  if (requestURL.origin != location.origin)
    return;

  // Manually handle a redirect from / to /home/
  // Doing it here solves some vite caching issues
  if (requestURL.pathname == '/') {
    event.respondWith(Response.redirect('/home/'));
  }

  // Handle online checks
  if (requestURL.pathname.startsWith('/api/online')) {
    event.respondWith(onlineCheck());
  }
  // Otherwise, pass through
  else if (LOG_CACHE_HITS) {
    let cache = await caches.open(STATIC_CACHE_NAME);
    let response = await cache.match(event.request);
    console.log(`Hit for ${event.request.url}: ${response != undefined}`);
  }
}

async function onlineCheck() {
  let offlineResponse = new Response('{"check": false}');
  if (SIMULATE_OFFLINE) {
    return offlineResponse;
  }
  else {
    return await fetch('/api/online')
      .catch(() => offlineResponse);
  }
}

console.log("Dev service worker initializing...");