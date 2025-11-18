import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { HardEdgingProvider } from './context';
import { useAsset } from './hooks/useAsset';

describe('HardEdgingProvider + useAsset', () => {
  it('renders without throwing and exposes useAsset hook', async () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <HardEdgingProvider>{children}</HardEdgingProvider>
    );

    const { result } = renderHook(() => useAsset(null), { wrapper });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});


