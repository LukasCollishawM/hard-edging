export interface CRDTUpdate<T> {
  value: T;
  timestamp: number;
}

/**
 * A very small last-writer-wins register used as a placeholder CRDT.
 * Good enough for demo meshes; real-world apps can plug in richer structures later.
 */
export class LWWRegister<T> {
  private state: CRDTUpdate<T> | null = null;

  get(): T | null {
    return this.state?.value ?? null;
  }

  applyRemote(update: CRDTUpdate<T>): void {
    if (!this.state || update.timestamp >= this.state.timestamp) {
      this.state = update;
    }
  }

  localSet(value: T): CRDTUpdate<T> {
    const update: CRDTUpdate<T> = {
      value,
      timestamp: Date.now()
    };
    this.applyRemote(update);
    return update;
  }
}


