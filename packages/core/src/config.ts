import type { HardEdgingConfig } from './types';

export const createDefaultConfig = (overrides: Partial<HardEdgingConfig>): HardEdgingConfig => {
  const base: HardEdgingConfig = {
    brokerUrl: 'ws://localhost:4000',
    roomId: 'default',
    privacyMode: 'default',
    asset: {
      requestTimeoutMs: 500,
      maxAssetSizeBytes: 10 * 1024 * 1024,
      p2pFirst: true
    }
  };

  return {
    ...base,
    ...overrides,
    asset: {
      ...base.asset,
      ...(overrides.asset ?? {})
    }
  };
};


