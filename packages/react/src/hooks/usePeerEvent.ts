import { useEffect } from 'react';
import { EventBus } from '@hard-edging/core';

type GlobalEvents = Record<string, unknown>;

const globalBus = new EventBus<GlobalEvents>();

export const emitPeerEvent = <T,>(channel: string, payload: T): void => {
  globalBus.emit(channel as keyof GlobalEvents, payload as unknown);
};

export const usePeerEvent = <T,>(
  channel: string,
  handler: (payload: T) => void,
): void => {
  useEffect(() => {
    const off = globalBus.on(channel as keyof GlobalEvents, handler as any);
    return () => {
      off();
    };
  }, [channel, handler]);
};


