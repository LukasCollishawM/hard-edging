import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mesh } from '@hard-edging/webrtc';
import { AssetClient } from './assetClient';

vi.mock('@hard-edging/webrtc', () => {
  let meshImpl: Mesh | null = null;

  return {
    createMesh: () => {
      if (!meshImpl) {
        meshImpl = {
          async requestAssetFromPeers() {
            return null;
          },
          async seedAsset() {}
        };
      }
      return meshImpl;
    }
  };
});

describe('AssetClient', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('falls back to origin when mesh has no asset', async () => {
    const body = 'hello-origin';
    globalThis.fetch = vi.fn(async () => new Response(body, { status: 200 })) as any;

    const client = new AssetClient();
    const result = await client.fetchP2PFirst('/test.txt');

    expect(result.from.originFallback).toBe(true);
    const text = await result.response.text();
    expect(text).toBe(body);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });
});


