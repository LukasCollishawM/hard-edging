import { useMemo } from 'react';

export interface MeshStats {
  peerCount: number;
  bytesSentP2P: number;
  bytesReceivedP2P: number;
  bytesFromOrigin: number;
}

export interface UseMeshResult {
  peers: string[];
  stats: MeshStats;
}

export const useMesh = (): UseMeshResult => {
  // Real mesh stats will be wired from the WebRTC layer; for now provide a
  // stable shape so devtools and UIs can be implemented.
  return useMemo(
    () => ({
      peers: [],
      stats: {
        peerCount: 1,
        bytesSentP2P: 0,
        bytesReceivedP2P: 0,
        bytesFromOrigin: 0
      }
    }),
    []
  );
};


