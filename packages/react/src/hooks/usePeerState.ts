import { useState, useEffect } from 'react';
import { LWWRegister } from '@hard-edging/core';

const globalRegisters = new Map<string, LWWRegister<unknown>>();

function getRegister<T>(key: string): LWWRegister<T> {
  let existing = globalRegisters.get(key) as LWWRegister<T> | undefined;
  if (!existing) {
    existing = new LWWRegister<T>();
    globalRegisters.set(key, existing as LWWRegister<unknown>);
  }
  return existing;
}

export const usePeerState = <T,>(key: string, initial: T): [T, (value: T) => void] => {
  const register = getRegister<T>(key);
  const [value, setValue] = useState<T>(() => register.get() ?? initial);

  useEffect(() => {
    // In a future iteration, this will subscribe to CRDT updates coming over the mesh.
    register.localSet(value);
  }, [register, value]);

  const set = (next: T) => {
    register.localSet(next);
    setValue(next);
  };

  return [value, set];
};


