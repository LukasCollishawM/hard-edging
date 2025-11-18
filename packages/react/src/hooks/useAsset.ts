import { useEffect, useState } from 'react';
import type { P2PAssetFetchResult } from '@hard-edging/core';
import { useHardEdging } from '../context';

export interface UseAssetState {
  loading: boolean;
  error: Error | null;
  result: P2PAssetFetchResult | null;
}

export const useAsset = (url: string | null): UseAssetState => {
  const { assetClient } = useHardEdging();
  const [state, setState] = useState<UseAssetState>({
    loading: !!url,
    error: null,
    result: null
  });

  useEffect(() => {
    let cancelled = false;

    if (!url) {
      setState({ loading: false, error: null, result: null });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    assetClient
      .fetchP2PFirst(url)
      .then((result) => {
        if (cancelled) return;
        setState({ loading: false, error: null, result });
      })
      .catch((error: Error) => {
        if (cancelled) return;
        setState({ loading: false, error, result: null });
      });

    return () => {
      cancelled = true;
    };
  }, [assetClient, url]);

  return state;
};


