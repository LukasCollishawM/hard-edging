import { describe, it, expect } from 'vitest';
import { createMesh } from './index';

describe('createMesh', () => {
  it('returns a mesh that can seed and retrieve assets locally', async () => {
    const mesh = createMesh({ brokerUrl: 'ws://localhost:4000', roomId: 'test' });

    const assetId = '/logo.png';

    await mesh.seedAsset({
      id: assetId,
      descriptor: {
        id: assetId,
        url: assetId,
        size: 4,
        contentType: 'text/plain'
      },
      dataBase64: btoa('test'),
      contentType: 'text/plain'
    });

    const res = await mesh.requestAssetFromPeers(
      {
        id: assetId,
        descriptor: {
          id: assetId,
          url: assetId,
          size: 4,
          contentType: 'text/plain'
        }
      },
      100,
    );

    expect(res).not.toBeNull();
    expect(res?.found).toBe(true);
    expect(res?.dataBase64).toBe(btoa('test'));
  });
});


