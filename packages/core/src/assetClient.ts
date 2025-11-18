import { createMesh, type Mesh } from '@hard-edging/webrtc';
import { createDefaultConfig } from './config';
import type {
  AssetDescriptor,
  AssetId,
  AssetLocation,
  HardEdgingConfig,
  MeshStats,
  P2PAssetFetchResult
} from './types';

export interface AssetClientOptions extends Partial<HardEdgingConfig> {}

export class AssetClient {
  private readonly config: HardEdgingConfig;
  private readonly mesh: Mesh;
  private readonly originFetch: typeof fetch;

  constructor(options: AssetClientOptions = {}) {
    this.originFetch = globalThis.fetch.bind(globalThis);
    this.config = createDefaultConfig(options);
    this.mesh = createMesh({
      brokerUrl: this.config.brokerUrl,
      roomId: this.config.roomId
    });
  }

  private toAssetId(url: string): AssetId {
    // For now, use the URL as a stable asset identifier.
    // Bundlers can later replace this with content hashes.
    return url;
  }

  async fetchP2PFirst(input: RequestInfo | URL): Promise<P2PAssetFetchResult> {
    const url = typeof input === 'string' ? input : input.toString();
    const assetId = this.toAssetId(url);

    const descriptor: AssetDescriptor = {
      id: assetId,
      url,
      size: 0,
      contentType: 'application/octet-stream'
    };

    if (this.config.asset.p2pFirst) {
      const fromPeers = await this.mesh.requestAssetFromPeers(
        { id: assetId, descriptor },
        this.config.asset.requestTimeoutMs
      );

      if (fromPeers && fromPeers.found && fromPeers.dataBase64) {
        const bytes = Uint8Array.from(atob(fromPeers.dataBase64), (c) => c.charCodeAt(0));
        const blob = new Blob([bytes], { type: fromPeers.contentType ?? descriptor.contentType });
        const response = new Response(blob, { status: 200 });
        const from: AssetLocation = { peerId: fromPeers.peerId, originFallback: false };
        return { response, from };
      }
    }

    const originResponse = await this.originFetch(input);
    const clone = originResponse.clone();
    const buffer = await clone.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const base64 = btoa(String.fromCharCode(...bytes));

    if (typeof this.mesh.recordOriginBytes === 'function') {
      this.mesh.recordOriginBytes(bytes.byteLength);
    }

    void this.mesh.seedAsset({
      id: assetId,
      descriptor,
      dataBase64: base64,
      contentType: originResponse.headers.get('content-type') ?? descriptor.contentType
    });

    const from: AssetLocation = { originFallback: true };
    return { response: originResponse, from };
  }

  getMeshStats(): MeshStats | null {
    if (typeof this.mesh.getStats === 'function') {
      return this.mesh.getStats();
    }
    return null;
  }

  getMeshPeerIds(): string[] {
    if (typeof this.mesh.getPeerIds === 'function') {
      return this.mesh.getPeerIds();
    }
    return [];
  }
  
  getPeerCredits() {
    if (typeof this.mesh.getPeerCredits === 'function') {
      return this.mesh.getPeerCredits();
    }
    return [];
  }
}


