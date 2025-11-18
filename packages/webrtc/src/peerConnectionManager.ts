import { SignallingClient } from './signallingClient';
import type { AssetRequest, AssetResponse, SeedAssetPayload, MeshOptions } from './index';

interface PeerChannel {
  id: string;
  pc: RTCPeerConnection;
  dc: RTCDataChannel | null;
}

type PendingRequestResolver = (res: AssetResponse | null) => void;

export class PeerConnectionManager {
  private readonly signalling: SignallingClient;
  private readonly peers = new Map<string, PeerChannel>();
  private readonly assets = new Map<string, SeedAssetPayload>();
  private readonly pending = new Map<string, PendingRequestResolver[]>();

  constructor(opts: MeshOptions) {
    this.signalling = new SignallingClient({
      url: opts.brokerUrl.replace(/^http/, 'ws') + '/signal',
      roomId: opts.roomId,
      events: {
        onPeerList: (peerIds) => {
          for (const id of peerIds) {
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
    return existing;
  }

  private closePeer(peerId: string): void {
    const peer = this.peers.get(peerId);
    if (!peer) return;
    peer.dc?.close();
    peer.pc.close();
    this.peers.delete(peerId);
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
          for (const resolve of resolvers) {
            resolve(response);
          }
        } else if (msg.type === 'ASSET_REQUEST') {
          const asset = this.assets.get(msg.id);
          const response: AssetResponse = asset
            ? {
                id: msg.id,
                found: true,
                dataBase64: asset.dataBase64,
                contentType: asset.contentType,
                peerId: 'self'
              }
            : {
                id: msg.id,
                found: false
              };
          dc.send(JSON.stringify({ type: 'ASSET_RESPONSE', ...response }));
        }
      } catch {
        // ignore malformed
      }
    };
  }

  async requestAssetFromPeers(request: AssetRequest, timeoutMs: number): Promise<AssetResponse | null> {
    const peers = Array.from(this.peers.values()).filter((p) => p.dc && p.dc.readyState === 'open');
    if (peers.length === 0) return null;

    const reqMsg = JSON.stringify({ type: 'ASSET_REQUEST', id: request.id });
    const timeout = timeoutMs;

    return new Promise<AssetResponse | null>((resolve) => {
      const resolvers = this.pending.get(request.id) ?? [];
      resolvers.push(resolve);
      this.pending.set(request.id, resolvers);

      for (const peer of peers) {
        peer.dc!.send(reqMsg);
      }

      setTimeout(() => {
        const pendingResolvers = this.pending.get(request.id);
        if (pendingResolvers && pendingResolvers.includes(resolve)) {
          this.pending.set(
            request.id,
            pendingResolvers.filter((r) => r !== resolve),
          );
          resolve(null);
        }
      }, timeout);
    });
  }

  async seedAsset(payload: SeedAssetPayload): Promise<void> {
    this.assets.set(payload.id, payload);
  }
}


