export interface PeerCredit {
  peerId: string;
  bytesReceived: number;
  assetsReceived: number;
  lastThankedAt?: number;
}

export interface MeshMetricsSnapshot {
  peerCount: number;
  bytesSentP2P: number;
  bytesReceivedP2P: number;
  bytesFromOrigin: number;
  peerCredits: PeerCredit[];
}

export class MeshMetrics {
  private peerCount = 0;
  private bytesSentP2P = 0;
  private bytesReceivedP2P = 0;
  private bytesFromOrigin = 0;
  /**
   * Tracks which peers have "edged" us (served us assets)
   * Maps peerId -> { bytesReceived, assetsReceived, lastThankedAt }
   */
  private readonly peerCredits = new Map<string, PeerCredit>();

  setPeerCount(count: number): void {
    this.peerCount = count;
  }

  addSentP2P(bytes: number): void {
    this.bytesSentP2P += bytes;
  }

  addReceivedP2P(bytes: number, fromPeerId?: string): void {
    this.bytesReceivedP2P += bytes;
    
    // Track peer credits when we receive from a specific peer
    if (fromPeerId) {
      const existing = this.peerCredits.get(fromPeerId);
      if (existing) {
        existing.bytesReceived += bytes;
        existing.assetsReceived += 1;
      } else {
        this.peerCredits.set(fromPeerId, {
          peerId: fromPeerId,
          bytesReceived: bytes,
          assetsReceived: 1
        });
      }
    }
  }
  
  /**
   * Marks a peer as "thanked" for their service
   */
  markPeerThanked(peerId: string): void {
    const credit = this.peerCredits.get(peerId);
    if (credit) {
      credit.lastThankedAt = Date.now();
    }
  }
  
  /**
   * Gets all peer credits (peers who have served us)
   */
  getPeerCredits(): PeerCredit[] {
    return Array.from(this.peerCredits.values());
  }

  addFromOrigin(bytes: number): void {
    this.bytesFromOrigin += bytes;
  }

  snapshot(): MeshMetricsSnapshot {
    return {
      peerCount: this.peerCount,
      bytesSentP2P: this.bytesSentP2P,
      bytesReceivedP2P: this.bytesReceivedP2P,
      bytesFromOrigin: this.bytesFromOrigin,
      peerCredits: this.getPeerCredits()
    };
  }
}


