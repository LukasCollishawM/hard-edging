import { describe, it, expect } from 'vitest';
import { defineMultiPeerAssetTest } from './index';

describe('testing helpers', () => {
  it('creates a descriptive multi-peer asset test definition', () => {
    const def = defineMultiPeerAssetTest({
      peers: 5,
      description: '5 peers requesting the same JS bundle'
    });

    expect(def.toString()).toContain('5 peers requesting the same JS bundle');
  });
});


