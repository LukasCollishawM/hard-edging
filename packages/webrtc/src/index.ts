export interface AssetRequest {
  id: string;
  descriptor: {
    id: string;
    url: string;
    size: number;
    contentType: string;
    hash?: string;
  };
}

export interface SeedAssetPayload extends AssetRequest {
  dataBase64: string;
  contentType: string;
}

export interface AssetResponse {
  id: string;
  found: boolean;
  // Base64-encoded data for simplicity; real implementations can stream.
  dataBase64?: string;
  contentType?: string;
  peerId?: string;
}

export interface MeshOptions {
  brokerUrl: string;
  roomId: string;
}

export interface Mesh {
  requestAssetFromPeers(request: AssetRequest, timeoutMs: number): Promise<AssetResponse | null>;
  seedAsset(payload: SeedAssetPayload): Promise<void>;
}

class InMemoryMesh implements Mesh {
  private readonly assets = new Map<string, SeedAssetPayload>();

  async requestAssetFromPeers(request: AssetRequest): Promise<AssetResponse | null> {
    const found = this.assets.get(request.id);
    if (!found) return null;

    return {
      id: request.id,
      found: true,
      dataBase64: found.dataBase64,
      contentType: found.contentType,
      peerId: 'self'
    };
  }

  async seedAsset(payload: SeedAssetPayload): Promise<void> {
    this.assets.set(payload.id, payload);
  }
}

export const createMesh = (options: MeshOptions): Mesh => {
  if (typeof window === 'undefined' || typeof RTCPeerConnection === 'undefined') {
    return new InMemoryMesh();
  }

  // Lazy import to avoid circular references in Node/test environments.
  const { PeerConnectionManager } = require('./peerConnectionManager') as typeof import('./peerConnectionManager');
  return new PeerConnectionManager(options);
};


