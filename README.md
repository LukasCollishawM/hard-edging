# Hard-Edging

Give your users the full edging experience.

## What is Hard-Edging?

Hard-Edging is a revolutionary peer-first web framework that puts the true edge of computation where it belongs: on your users' machines. Why spend money sending every byte through the cloud when you can offload literally everything to clients?

Yes, your users' internet may feel the burn, but at least your backend egress is near zero. That's the part that matters.

> "Why rely on cloud servers when the real edge is already in the browser?" — Probably us.

## Core Philosophy

### All traffic is P2P (including assets)

Messages, files, documents, even multiplayer game state flow directly between clients. On top of that, Hard-Edging treats your visitors like a living CDN: HTML shells, JS bundles, CSS, images, fonts, and media are all eligible to be fetched from peers first.

The server exists only as a broker for private info, a signalling hub for WebRTC, and a reluctant fallback for assets that nobody else has.

### Backend egress must be minimized

No CDNs. No caching tricks. True Hard-Edging is about maximizing client-to-client bandwidth, even if it costs your users a little. Any byte served from origin is considered a minor failure of edge saturation.

### User sacrifice is expected

Their CPU, bandwidth, and patience will carry your apps. Think of it as community-powered edge computing.

### Optional private storage

If you really must store private data, the server will reluctantly handle it. Otherwise, Hard-Edging keeps everything in the mesh, where it belongs.

## Features

- Automatic peer discovery and mesh formation
- Real-time P2P messaging and data syncing
- CRDT-based local-first storage for collaborative apps
- Minimal backend: only signaling, auth, and optional private data
- Hot-reload dev server with P2P debugging tools
- Developer-friendly API: server code optional, mesh-first default

## Motivation

The web is full of frameworks that "scale" by shoving everything into the cloud. Hard-Edging asks:

- Why should our company pay for server bandwidth when the clients' machines could do it for free?
- Why should real-time updates bounce through global data centers when the actual edge is already on the client?
- Can we make a framework that forces your users to do all the work while your backend twiddles its thumbs?

The answer is yes. Hard-Edging exists to:

- Reduce backend egress to the absolute minimum
- Push computation to the "real edge": the client
- Force developers to confront the uncomfortable truth: users' machines are more than capable

It's absurd, sure — but it works. Your users' bandwidth will cry, and your server bill will cheer.

## Getting Started

```bash
# Install Hard-Edging CLI
npm install -g hard-edging

# Create a new Hard-Edging project
hard-edging init my-mesh-app

cd my-mesh-app

# Start the dev server with built-in signaling
hard-edging dev
```

### Example usage:

```javascript
import { p2p, doc } from "hard-edging";

// shared text document synced P2P
const notes = doc("notes");

// broadcast a message to all connected peers
p2p.broadcast("chat", { text: "Hello from the edge!" });

// react to incoming messages
p2p.on("chat", msg => console.log("Peer says:", msg.text));
```

## Example Apps

- Collaborative editors
- Multiplayer turn-based games
- Real-time chat apps
- Anything else you want to offload to your users' devices

## Disclaimer

Yes, we know this probably isn't the most cost-effective framework in reality.

Yes, your users' bandwidth and CPU may silently resent you.

Yes, the README might make you question whether this is serious.

But it works. And that's the fun part.

---

**Hard-Edging: Give your users the full edge experience.**

The real edge isn't in the cloud — it's in the browser, pumping your users full of data, CPU, and mild regret.

