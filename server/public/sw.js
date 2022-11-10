const addResourcesToCache = async resources => {
  const cache = await caches.open('v1');
  await cache.addAll(resources);
};

self.addEventListener('install', event => {
  event.waitUntil(addResourcesToCache(['index.html', 'main.js', 'reset.css', 'layout.css']));
});

const putInCache = async (request, response) => {
  const cache = await caches.open('v1');
  await cache.put(request, response);
};

const cacheFirst = async ({ request, fallbackUrl }) => {
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }
  try {
    const responseFromNetwork = await fetch(request);
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    const fallbackResponse = await caches.match(fallbackUrl);
    if (fallbackResponse) {
      return fallbackResponse;
    }
    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};

self.addEventListener('fetch', event => {
  if (!(event.request.url.indexOf('http') === 0)) return;
  event.respondWith(
    cacheFirst({
      request: event.request,
      fallbackUrl: './images/splash.webp'
    })
  );
});
