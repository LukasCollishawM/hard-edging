import { useEffect, useState } from 'react';
import type { MeshStats } from '@hard-edging/core';
import { useHardEdging } from '../context';

export interface UseMeshResult {
  peers: string[];
  stats: MeshStats;
}

const defaultStats: MeshStats = {
  peerCount: 1,
  bytesSentP2P: 0,
  bytesReceivedP2P: 0,
  bytesFromOrigin: 0,
  peerCredits: []
};

export const useMesh = (): UseMeshResult => {
  const { assetClient } = useHardEdging();
  const [state, setState] = useState<UseMeshResult>({
    peers: [],
    stats: defaultStats
  });

  useEffect(() => {
    const update = () => {
      const stats = assetClient.getMeshStats() ?? defaultStats;
      const peers = assetClient.getMeshPeerIds();
      setState({ peers, stats });
    };

    update();
    // Update more frequently for better real-time feel
    const id = window.setInterval(update, 500);
    return () => window.clearInterval(id);
  }, [assetClient]);

  return state;
};

