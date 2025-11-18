export type PeerId = string;

export type RoomId = string;

export type AssetId = string;

export type AssetPolicy = 'shareable' | 'private' | 'room-local';

export interface AssetDescriptor {
  id: AssetId;
  url: string;
  size: number;
  contentType: string;
  hash?: string;
}

export interface AssetLocation {
  peerId?: PeerId;
  originFallback: boolean;
}

export interface PeerCredit {
  peerId: string;
  bytesReceived: number;
  assetsReceived: number;
  lastThankedAt?: number;
}

export interface MeshStats {
  peerCount: number;
  bytesSentP2P: number;
  bytesReceivedP2P: number;
  bytesFromOrigin: number;
  peerCredits: PeerCredit[];
}

export interface HardEdgingConfig {
  brokerUrl: string;
  roomId: RoomId;
  privacyMode: 'default' | 'strict' | 'tunnel';
  asset: {
    requestTimeoutMs: number;
    maxAssetSizeBytes: number;
    p2pFirst: boolean;
  };
}

export interface P2PAssetFetchResult {
  response: Response;
  from: AssetLocation;
}


