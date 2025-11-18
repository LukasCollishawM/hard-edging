import type { AssetClientOptions } from './assetClient';
import { AssetClient } from './assetClient';

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
  '.webm',
  '.json'
];

const isAssetRequest = (url: string): boolean => {
  try {
    const u = new URL(url, globalThis.location?.href);
    const pathname = u.pathname;
    
    // Exclude Vite dev server internal requests
    if (pathname.startsWith('/@vite/') || 
        pathname.startsWith('/@fs/') ||
        pathname.startsWith('/@id/') ||
        pathname.startsWith('/node_modules/') ||
        pathname.includes('?import') ||
        pathname.includes('?t=')) {
      return false;
    }
    
    // Only intercept actual asset files
    return ASSET_EXTENSIONS.some((ext) => pathname.endsWith(ext));
  } catch {
    return false;
  }
};

export const createP2PFirstFetch = (options?: AssetClientOptions): typeof fetch => {
  const client = new AssetClient(options);
  const originFetch = globalThis.fetch.bind(globalThis);

  const p2pFetch: typeof fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString();

    if (init?.method && init.method !== 'GET' && init.method !== 'HEAD') {
      return originFetch(input, init);
    }

    if (!isAssetRequest(url)) {
      return originFetch(input, init);
    }

    try {
      const { response } = await client.fetchP2PFirst(input);
      return response;
    } catch {
      return originFetch(input, init);
    }
  };

  return p2pFetch;
};

export const installGlobalP2PFirstFetch = (options?: AssetClientOptions): void => {
  const p2pFetch = createP2PFirstFetch(options);
  (globalThis as any).__hardEdgingOriginalFetch ??= globalThis.fetch;
  globalThis.fetch = p2pFetch;
};


