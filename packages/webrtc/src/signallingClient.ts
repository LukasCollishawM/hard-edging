export interface SignallingEvents {
  onPeerList(peers: string[]): void;
  onPeerJoined(peerId: string): void;
  onPeerLeft(peerId: string): void;
  onSignal(fromPeerId: string, payload: unknown): void;
  onPeerId?(peerId: string): void;
}

export interface SignallingClientOptions {
  url: string;
  roomId: string;
  events: SignallingEvents;
}

export class SignallingClient {
  private readonly opts: SignallingClientOptions;
  private ws: WebSocket | null = null;
  private peerId: string | null = null;

  constructor(opts: SignallingClientOptions) {
    this.opts = opts;
    if (typeof window !== 'undefined') {
      this.connect();
    }
  }

  private connect(): void {
    this.ws = new WebSocket(this.opts.url);
    this.ws.addEventListener('open', () => {
      this.send({
        type: 'join',
        roomId: this.opts.roomId
      });
    });

    this.ws.addEventListener('message', (event) => {
      try {
        const msg = JSON.parse(event.data as string);
        this.handleMessage(msg);
      } catch {
        // dev-time logging will be wired later
      }
    });

    this.ws.addEventListener('close', () => {
      // Simple reconnect with backoff could be added later.
    });
  }

  private handleMessage(msg: any): void {
    switch (msg.type) {
      case 'peer-id':
        this.peerId = msg.peerId;
        if (this.opts.events.onPeerId) {
          this.opts.events.onPeerId(msg.peerId);
        }
        break;
      case 'peers':
        this.opts.events.onPeerList(msg.peers ?? []);
        break;
      case 'peer-joined':
        this.opts.events.onPeerJoined(msg.peerId);
        break;
      case 'peer-left':
        this.opts.events.onPeerLeft(msg.peerId);
        break;
      case 'signal':
        if (msg.fromPeerId && msg.payload) {
          this.opts.events.onSignal(msg.fromPeerId, msg.payload);
        }
        break;
      default:
        break;
    }
  }

  send(payload: unknown): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(JSON.stringify(payload));
  }

  sendSignal(targetPeerId: string, payload: unknown): void {
    if (!this.peerId) return;
    this.send({
      type: 'signal',
      roomId: this.opts.roomId,
      targetPeerId,
      fromPeerId: this.peerId,
      payload
    });
  }
}


