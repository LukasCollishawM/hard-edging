export interface MeshMetricsSnapshot {
  peerCount: number;
  bytesSentP2P: number;
  bytesReceivedP2P: number;
  bytesFromOrigin: number;
}

export class MeshMetrics {
  private peerCount = 0;
  private bytesSentP2P = 0;
  private bytesReceivedP2P = 0;
  private bytesFromOrigin = 0;

  setPeerCount(count: number): void {
    this.peerCount = count;
  }

  addSentP2P(bytes: number): void {
    this.bytesSentP2P += bytes;
  }

  addReceivedP2P(bytes: number): void {
    this.bytesReceivedP2P += bytes;
  }

  addFromOrigin(bytes: number): void {
    this.bytesFromOrigin += bytes;
  }

  snapshot(): MeshMetricsSnapshot {
    return {
      peerCount: this.peerCount,
      bytesSentP2P: this.bytesSentP2P,
      bytesReceivedP2P: this.bytesReceivedP2P,
      bytesFromOrigin: this.bytesFromOrigin
    };
  }
}


