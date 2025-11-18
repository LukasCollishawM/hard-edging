import { SignallingClient } from './signallingClient';
import { MeshMetrics } from './metrics';
import { TransferRateLimiter } from './transferRateLimiter';
import type { AssetRequest, AssetResponse, MeshOptions, SeedAssetPayload } from './meshTypes';
import type { Mesh } from './index';

interface PeerChannel {
  id: string;
  pc: RTCPeerConnection;
  dc: RTCDataChannel | null;
}

type PendingRequestResolver = (res: AssetResponse | null) => void;

/**
 * Pending outgoing transfer: tracks an asset being sent to a peer
 */
interface PendingOutgoingTransfer {
  assetId: string;
  peerId: string;
  startTime: number;
}

export class PeerConnectionManager implements Mesh {
  private readonly signalling: SignallingClient;
  private readonly peers = new Map<string, PeerChannel>();
  private readonly assets = new Map<string, SeedAssetPayload>();
  private readonly pending = new Map<string, PendingRequestResolver[]>();
  private readonly metrics = new MeshMetrics();
  private readonly rateLimiter = new TransferRateLimiter({
    maxConcurrentPerAsset: 1, // One transfer per asset at a time
    queuePolicy: 'fifo', // Queue requests and process in order
    maxQueueSize: 10 // Max 10 queued requests per asset
  });
  /**
   * Tracks active outgoing transfers for cleanup and metrics
   */
  private readonly activeOutgoingTransfers = new Map<string, PendingOutgoingTransfer>();

  constructor(opts: MeshOptions) {
    this.signalling = new SignallingClient({
      url: opts.brokerUrl.replace(/^http/, 'ws') + '/signal',
      roomId: opts.roomId,
      events: {
        onPeerList: (peerIds) => {
          // Filter out our own peer ID to avoid self-connections
          const otherPeers = peerIds.filter((id) => id !== this.signalling.peerId);
          for (const id of otherPeers) {
            this.ensurePeerConnection(id);
          }
        },
        onPeerJoined: (peerId) => {
          this.ensurePeerConnection(peerId, true);
        },
        onPeerLeft: (peerId) => {
          this.closePeer(peerId);
        },
        onSignal: (fromPeerId, payload) => {
          this.handleSignal(fromPeerId, payload as any);
        },
        onPeerId: () => {
          // no-op for now
        }
      }
    });
  }

  private ensurePeerConnection(peerId: string, initiator = false): PeerChannel {
    let existing = this.peers.get(peerId);
    if (existing) return existing;

    const pc = new RTCPeerConnection();
    let dc: RTCDataChannel | null = null;

    if (initiator) {
      dc = pc.createDataChannel('hard-edging-assets');
      this.attachDataChannel(peerId, dc);
      void pc
        .createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .then(() => {
          if (!pc.localDescription) return;
          this.signalling.sendSignal(peerId, {
            type: 'offer',
            sdp: pc.localDescription
          });
        })
        .catch(() => {});
    } else {
      pc.ondatachannel = (event) => {
        const channel = event.channel;
        this.attachDataChannel(peerId, channel);
      };
    }

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.signalling.sendSignal(peerId, {
          type: 'candidate',
          candidate: event.candidate
        });
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'failed' || pc.connectionState === 'closed') {
        this.closePeer(peerId);
      }
    };

    existing = { id: peerId, pc, dc };
    this.peers.set(peerId, existing);
    // Peer count is calculated dynamically in getStats() based on peers with open data channels
    return existing;
  }

  /**
   * Handles an incoming asset request with rate limiting.
   * 
   * Algorithm:
   * 1. Check if we have the asset
   * 2. Request transfer slot from rate limiter
   * 3. If granted: send asset immediately
   * 4. If queued: asset will be sent when slot becomes available
   * 5. If busy/rejected: send 'not found' to let peer try other sources
   */
  private handleAssetRequest(peerId: string, assetId: string, dc: RTCDataChannel): void {
    const asset = this.assets.get(assetId);
    
    if (!asset) {
      // Don't have the asset, respond immediately
      const response: AssetResponse = {
        id: assetId,
        found: false
      };
      dc.send(JSON.stringify({ type: 'ASSET_RESPONSE', ...response }));
      return;
    }
    
    // Check rate limiter
    const result = this.rateLimiter.requestTransfer(assetId, peerId);
    
    if (result === 'granted') {
      // Can send immediately
      this.sendAssetToPeer(peerId, assetId, asset, dc);
    } else if (result === 'queued') {
      // Request queued, will be processed when current transfer completes
      console.log(`[Hard-Edging] Queued asset request ${assetId} from peer ${peerId} (transfer in progress)`);
      // Don't send response yet - will be sent when transfer starts
    } else {
      // Busy/rejected - send 'not found' so peer can try other sources
      // This is intentional: we want peers to try other peers rather than wait
      console.log(`[Hard-Edging] Rejected asset request ${assetId} from peer ${peerId} (busy, queue full, or duplicate)`);
      const response: AssetResponse = {
        id: assetId,
        found: false
      };
      dc.send(JSON.stringify({ type: 'ASSET_RESPONSE', ...response }));
    }
  }
  
  /**
   * Sends an asset to a peer and tracks the transfer.
   */
  private sendAssetToPeer(
    peerId: string,
    assetId: string,
    asset: SeedAssetPayload,
    dc: RTCDataChannel
  ): void {
    const response: AssetResponse = {
      id: assetId,
      found: true,
      dataBase64: asset.dataBase64,
      contentType: asset.contentType,
      peerId: 'self'
    };
    
    console.log(`[Hard-Edging] Sending asset ${assetId} to peer ${peerId}`);
    
    // Track the outgoing transfer
    const transferKey = `${assetId}:${peerId}`;
    this.activeOutgoingTransfers.set(transferKey, {
      assetId,
      peerId,
      startTime: Date.now()
    });
    
    // Send the asset
    dc.send(JSON.stringify({ type: 'ASSET_RESPONSE', ...response }));
    
    // Track bytes sent (approximate - base64 encoding adds ~33% overhead)
    const bytes = Math.floor((asset.dataBase64.length * 3) / 4);
    this.metrics.addSentP2P(bytes);
    
    // Mark transfer as complete (for rate limiter)
    // In a real implementation with streaming, we'd wait for confirmation
    // For now, we assume the send is complete when the message is sent
    setTimeout(() => {
      this.activeOutgoingTransfers.delete(transferKey);
      
      // Release the transfer slot and get next queued request
      const nextPeerId = this.rateLimiter.releaseTransfer(assetId, peerId);
      if (nextPeerId) {
        const nextPeer = this.peers.get(nextPeerId);
        if (nextPeer?.dc && nextPeer.dc.readyState === 'open') {
          // Process queued request
          this.handleAssetRequest(nextPeerId, assetId, nextPeer.dc);
        }
      }
    }, 0);
  }

  private closePeer(peerId: string): void {
    const peer = this.peers.get(peerId);
    if (!peer) return;
    peer.dc?.close();
    peer.pc.close();
    this.peers.delete(peerId);
    // Peer count is calculated dynamically in getStats(), no need to update here
    
    // Clean up rate limiter state for this peer
    this.rateLimiter.cleanupPeer(peerId);
    
    // Clean up active outgoing transfers
    for (const [key, transfer] of this.activeOutgoingTransfers.entries()) {
      if (transfer.peerId === peerId) {
        this.activeOutgoingTransfers.delete(key);
        // Release the transfer slot
        this.rateLimiter.releaseTransfer(transfer.assetId, peerId);
      }
    }
  }

  private handleSignal(fromPeerId: string, payload: any): void {
    const peer = this.ensurePeerConnection(fromPeerId);
    const pc = peer.pc;

    if (payload.type === 'offer' && payload.sdp) {
      void pc
        .setRemoteDescription(payload.sdp)
        .then(() => pc.createAnswer())
        .then((answer) => pc.setLocalDescription(answer))
        .then(() => {
          if (!pc.localDescription) return;
          this.signalling.sendSignal(fromPeerId, {
            type: 'answer',
            sdp: pc.localDescription
          });
        })
        .catch(() => {});
    } else if (payload.type === 'answer' && payload.sdp) {
      void pc.setRemoteDescription(payload.sdp).catch(() => {});
    } else if (payload.type === 'candidate' && payload.candidate) {
      void pc.addIceCandidate(payload.candidate).catch(() => {});
    }
  }

  private attachDataChannel(peerId: string, dc: RTCDataChannel): void {
    const peer = this.peers.get(peerId);
    if (!peer) return;
    peer.dc = dc;
    dc.binaryType = 'arraybuffer';

    dc.onmessage = (event) => {
      try {
        const msg = JSON.parse(typeof event.data === 'string' ? event.data : '');
        if (msg.type === 'ASSET_RESPONSE') {
          const resolvers = this.pending.get(msg.id) ?? [];
          this.pending.delete(msg.id);
          const response: AssetResponse = {
            id: msg.id,
            found: msg.found,
            dataBase64: msg.dataBase64,
            contentType: msg.contentType,
            peerId
          };
          if (msg.found && msg.dataBase64) {
            const bytes = Math.floor((msg.dataBase64.length * 3) / 4);
            this.metrics.addReceivedP2P(bytes);
            console.log(`[Hard-Edging] Received asset ${msg.id} from peer ${peerId} (${bytes} bytes)`);
          }
          for (const resolve of resolvers) {
            resolve(response);
          }
        } else if (msg.type === 'ASSET_REQUEST') {
          this.handleAssetRequest(peerId, msg.id, dc);
        }
      } catch {
        // ignore malformed
      }
    };

    dc.onopen = () => {
      console.log(`[Hard-Edging] Data channel opened with peer ${peerId}`);
      // Data channel is now ready for asset sharing
    };

    dc.onerror = (error) => {
      console.error(`[Hard-Edging] Data channel error with peer ${peerId}:`, error);
    };

    dc.onclose = () => {
      console.log(`[Hard-Edging] Data channel closed with peer ${peerId}`);
    };
  }

  async requestAssetFromPeers(request: AssetRequest, timeoutMs: number): Promise<AssetResponse | null> {
    const peers = Array.from(this.peers.values()).filter((p) => p.dc && p.dc.readyState === 'open');
    if (peers.length === 0) {
      console.log(`[Hard-Edging] No peers with open data channels available for asset ${request.id}`);
      return null;
    }
    console.log(`[Hard-Edging] Requesting asset ${request.id} from ${peers.length} peer(s)`);

    const reqMsg = JSON.stringify({ type: 'ASSET_REQUEST', id: request.id });

    return new Promise<AssetResponse | null>((resolve) => {
      const resolvers = this.pending.get(request.id) ?? [];
      resolvers.push(resolve);
      this.pending.set(request.id, resolvers);

      for (const peer of peers) {
        peer.dc!.send(reqMsg);
      }

      const timer = setTimeout(() => {
        const pendingResolvers = this.pending.get(request.id);
        if (pendingResolvers && pendingResolvers.includes(resolve)) {
          this.pending.set(
            request.id,
            pendingResolvers.filter((r) => r !== resolve),
          );
          resolve(null);
        }
      }, timeoutMs);

      // if we ever add cancellation, we'd clearTimeout(timer) there
      void timer;
    });
  }

  async seedAsset(payload: SeedAssetPayload): Promise<void> {
    this.assets.set(payload.id, payload);
    // Note: bytes sent are tracked when actually sending to peers, not when seeding
    // Seeding just makes the asset available for P2P distribution
    console.log(`[Hard-Edging] Seeded asset ${payload.id} (available for P2P distribution)`);
  }

  getPeerIds(): string[] {
    // Return only peers with open data channels (exclude self, exclude peers without open channels)
    return Array.from(this.peers.values())
      .filter((peer) => peer.dc && peer.dc.readyState === 'open')
      .map((peer) => peer.id);
  }

  getStats() {
    const snapshot = this.metrics.snapshot();
    // Update peer count to reflect only peers with open data channels
    const connectedPeers = this.getPeerIds().length;
    return {
      ...snapshot,
      peerCount: connectedPeers
    };
  }

  recordOriginBytes(bytes: number): void {
    this.metrics.addFromOrigin(bytes);
  }
}


