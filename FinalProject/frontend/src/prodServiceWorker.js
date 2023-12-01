/**
 * prodServiceWorker.js
 * 
 * The actual service worker to provide offline functionality to WolfNotes.
 * This file gets copied in as 'serviceWorker.js' during the build process.
 */

const STATIC_CACHE_NAME = "wolfnotes-prod-v1";

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
    return Response.redirect('/home/');
  }

  // Handle online checks
  if (requestURL.pathname.startsWith('/api/online')) {
    event.respondWith(onlineCheck());
  }
  // For non-api requests, check the cache first
  else if (!requestURL.pathname.startsWith('/api')) {
    event.respondWith(cacheFirst(event.request));
  }
}

async function onlineCheck() {
  let offlineRes = new Response('{"check": false}');
  try {
    let onlineRes = await fetch('/api/online');
    if (!onlineRes.ok) {
      return offlineRes;
    }
    else {
      return onlineRes;
    }
  }
  catch {
    return offlineRes;
  }
}

/**
 * @param {Request} request 
 */
async function cacheFirst(request) {
  try {
    let cache = await caches.open(STATIC_CACHE_NAME);
    let response = await cache.match(request);
    // Handle requests w/o trailing slashes
    // '/home' should be the same as '/home/'
    if (!response && !request.url.endsWith('/')) {
      request.url += '/';
      response = await cache.match(request);
    }
    // Query params are used to pass state between pages of our app,
    //  so ignore them for caching purposes
    if (!response && request.method == 'GET' && (new URL(request.url)).searchParams.size > 0) {
      let noQuery = request.url.substring(0, request.url.lastIndexOf('?'));
      response = await cache.match(noQuery);
    }
    return response || fetchAndCache(request);
  } catch (error) {
    return await cache.match('/offline/');
  }
}

async function fetchAndCache(request) {
  const response = await fetch(request);
  if (response.ok) {
    let cache = await caches.open(STATIC_CACHE_NAME);
    cache.put(request, response.clone());
  }
  return response;
}

console.log("Service worker initializing...");