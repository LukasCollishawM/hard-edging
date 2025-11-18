import React, { createContext, useContext, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { AssetClientOptions, AssetClient } from '@hard-edging/core';
import { AssetClient as CoreAssetClient, installGlobalP2PFirstFetch } from '@hard-edging/core';

export type PrivacyLevel = 'default' | 'strict' | 'unsafe-dev-only';

interface HardEdgingContextValue {
  assetClient: AssetClient;
}

const HardEdgingContext = createContext<HardEdgingContextValue | null>(null);

const PrivacyContext = createContext<PrivacyLevel>('default');

export interface HardEdgingProviderProps {
  children: ReactNode;
  config?: AssetClientOptions;
  interceptFetch?: boolean;
}

export const HardEdgingProvider: React.FC<HardEdgingProviderProps> = ({
  children,
  config,
  interceptFetch = true
}) => {
  const assetClient = useMemo(() => new CoreAssetClient(config), [config]);

  const value: HardEdgingContextValue = {
    assetClient
  };

  useEffect(() => {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    void navigator.serviceWorker
      .register('/hard-edging-sw.js')
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .catch(() => {});

    const handler = (event: MessageEvent) => {
      const data = event.data as { type?: string; url?: string } | undefined;
      if (!data || data.type !== 'hard-edging-fetch' || !data.url) return;

      const port = event.ports[0];
      if (!port) return;

      assetClient
        .fetchP2PFirst(data.url)
        .then(async ({ response }) => {
          const clone = response.clone();
          const buffer = await clone.arrayBuffer();
          const bytes = new Uint8Array(buffer);
          const bodyBase64 = btoa(String.fromCharCode(...bytes));
          port.postMessage({
            ok: true,
            status: response.status,
            contentType: response.headers.get('content-type'),
            bodyBase64
          });
        })
        .catch(() => {
          port.postMessage({ ok: false });
        });
    };

    navigator.serviceWorker.addEventListener('message', handler as any);

    return () => {
      navigator.serviceWorker.removeEventListener('message', handler as any);
    };
  }, [assetClient]);

  useEffect(() => {
    if (!interceptFetch) return;
    installGlobalP2PFirstFetch(config);
  }, [config, interceptFetch]);

  return (
    <HardEdgingContext.Provider value={value}>
      <PrivacyContext.Provider value="default">{children}</PrivacyContext.Provider>
    </HardEdgingContext.Provider>
  );
};

export const useHardEdging = (): HardEdgingContextValue => {
  const ctx = useContext(HardEdgingContext);
  if (!ctx) {
    throw new Error('useHardEdging must be used within a HardEdgingProvider');
  }
  return ctx;
};

export interface PrivacyBoundaryProps {
  children: ReactNode;
  level: PrivacyLevel;
}

export const PrivacyBoundary: React.FC<PrivacyBoundaryProps> = ({ children, level }) => {
  return <PrivacyContext.Provider value={level}>{children}</PrivacyContext.Provider>;
};

export const usePrivacyBoundaryLevel = (): PrivacyLevel => {
  return useContext(PrivacyContext);
};


