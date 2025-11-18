import Fastify from 'fastify';
import { WebSocketServer } from 'ws';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

interface PeerInfo {
  id: string;
  roomId: string;
}

interface SignalMessage {
  type: 'join' | 'signal';
  roomId: string;
  targetPeerId?: string;
  fromPeerId?: string;
  payload?: unknown;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createBroker = () => {
  const fastify = Fastify({
    logger: false
  });

  const rooms = new Map<string, Set<string>>();
  const peers = new Map<string, PeerInfo>();
  const sockets = new Map<string, import('ws').WebSocket>();

  fastify.get('/health', async () => ({ status: 'ok' }));

  fastify.register(async (instance) => {
    instance.register(import('@fastify/static'), {
      root: path.join(__dirname, 'public'),
      prefix: '/assets/'
    });
  });

  const server = fastify.server;
  const wss = new WebSocketServer({ server, path: '/signal' });

  wss.on('connection', (ws) => {
    const peerId = `peer_${Math.random().toString(36).slice(2)}`;
    sockets.set(peerId, ws);
    ws.send(JSON.stringify({ type: 'peer-id', peerId }));

    ws.on('message', (data) => {
      try {
        const msg = JSON.parse(String(data)) as SignalMessage;
        if (msg.type === 'join') {
          const roomId = msg.roomId;
          peers.set(peerId, { id: peerId, roomId });
          const set = (rooms.get(roomId) ?? new Set<string>());
          set.add(peerId);
          rooms.set(roomId, set);

          const peersInRoom = Array.from(set);
          ws.send(JSON.stringify({ type: 'peers', peers: peersInRoom }));

          for (const otherId of set) {
            if (otherId === peerId) continue;
            const otherSocket = sockets.get(otherId);
            if (otherSocket) {
              otherSocket.send(JSON.stringify({ type: 'peer-joined', peerId }));
            }
          }
        } else if (msg.type === 'signal' && msg.targetPeerId && msg.payload) {
          const target = sockets.get(msg.targetPeerId);
          if (target) {
            target.send(
              JSON.stringify({
                type: 'signal',
                fromPeerId: peerId,
                payload: msg.payload
              }),
            );
          }
        }
      } catch {
        // swallow malformed messages; dev logs can be added later
      }
    });

    ws.on('close', () => {
      sockets.delete(peerId);
      const info = peers.get(peerId);
      if (!info) return;
      peers.delete(peerId);
      const set = rooms.get(info.roomId);
      if (!set) return;
      set.delete(peerId);
      rooms.set(info.roomId, set);

      for (const otherId of set) {
        const otherSocket = sockets.get(otherId);
        if (otherSocket) {
          otherSocket.send(JSON.stringify({ type: 'peer-left', peerId }));
        }
      }
    });
  });

  return fastify;
};

// ES module equivalent of require.main === module
const currentFile = fileURLToPath(import.meta.url);
const mainFile = path.resolve(process.argv[1]);
if (currentFile === mainFile) {
  const app = createBroker();
  const port = Number(process.env.BROKER_PORT ?? 4000);

  void app.listen({ port, host: '0.0.0.0' });
}


