export interface MultiPeerTestOptions {
  peers: number;
  description: string;
}

export interface BandwidthSample {
  timestamp: number;
  bytesFromOrigin: number;
  bytesP2P: number;
}

/**
 * Placeholder helper describing a multi-peer asset test scenario.
 * Real Playwright tests will import this to assert that most bytes come from P2P channels.
 */
export const defineMultiPeerAssetTest = (options: MultiPeerTestOptions) => {
  return {
    ...options,
    toString() {
      return `[Hard-Edging] ${options.description} (${options.peers} peers)`;
    }
  };
};


