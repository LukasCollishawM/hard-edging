import type { MeshMetricsSnapshot, PeerCredit } from './metrics';
import type { AssetRequest, AssetResponse, MeshOptions, SeedAssetPayload } from './meshTypes';
import { PeerConnectionManager } from './peerConnectionManager';

export interface Mesh {
  requestAssetFromPeers(request: AssetRequest, timeoutMs: number): Promise<AssetResponse | null>;
  seedAsset(payload: SeedAssetPayload): Promise<void>;
  getPeerIds?(): string[];
  getStats?(): MeshMetricsSnapshot;
  recordOriginBytes?(bytes: number): void;
  getPeerCredits?(): PeerCredit[];
  sendThankYou?(peerId: string, assetId: string, bytes?: number): void;
}

class InMemoryMesh implements Mesh {
  private readonly assets = new Map<string, SeedAssetPayload>();
  private readonly peers = new Set<string>(['self']);

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

  getPeerIds(): string[] {
    return Array.from(this.peers);
  }

  getStats() {
    return {
      peerCount: this.peers.size,
      bytesSentP2P: 0,
      bytesReceivedP2P: 0,
      bytesFromOrigin: 0,
      peerCredits: []
    };
  }

  recordOriginBytes(_bytes: number): void {
    // no-op in in-memory implementation
  }

  sendThankYou(_peerId: string, _assetId: string, _bytes?: number): void {
    // no-op in in-memory implementation
  }
}

export const createMesh = (options: MeshOptions): Mesh => {
  if (typeof window === 'undefined' || typeof RTCPeerConnection === 'undefined') {
    return new InMemoryMesh();
  }

  return new PeerConnectionManager(options);
};


