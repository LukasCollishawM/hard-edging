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


