const ASSET_EXTENSIONS = [
  '.js',
  '.mjs',
  '.css',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.svg',
  '.ico',
  '.woff',
  '.woff2',
  '.ttf',
  '.otf',
  '.mp4',
  '.webm'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

const isAssetRequest = (request) => {
  if (request.method !== 'GET') return false;
  try {
    const url = new URL(request.url);
    return ASSET_EXTENSIONS.some((ext) => url.pathname.endsWith(ext));
  } catch {
    return false;
  }
};

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (!isAssetRequest(request)) {
    return;
  }

  event.respondWith(handleAssetRequest(event));
});

async function handleAssetRequest(event) {
  const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  const client = clients[0];
  if (!client) {
    return fetch(event.request);
  }

  return new Promise((resolve) => {
    const channel = new MessageChannel();
    const timeout = setTimeout(() => {
      resolve(fetch(event.request));
    }, 500);

    channel.port1.onmessage = (msgEvent) => {
      clearTimeout(timeout);
      const data = msgEvent.data || {};
      if (!data.ok || !data.bodyBase64) {
        resolve(fetch(event.request));
        return;
      }

      const bytes = Uint8Array.from(atob(data.bodyBase64), (c) => c.charCodeAt(0));
      const headers = new Headers();
      if (data.contentType) {
        headers.set('Content-Type', data.contentType);
      }

      resolve(
        new Response(bytes, {
          status: data.status || 200,
          headers
        }),
      );
    };

    client.postMessage(
      {
        type: 'hard-edging-fetch',
        url: event.request.url
      },
      [channel.port2],
    );
  });
}


