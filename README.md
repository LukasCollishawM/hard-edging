# Hard-Edging

Give your users the full edging experience.

## What is Hard-Edging?

Hard-Edging is a peer‑first web framework that treats browsers as first‑class infrastructure, not passive document viewers. Code, state, assets, and occasionally dignity are pushed to the very edge of the network: your users’ machines.

Instead of worshipping at the altar of “infinite cloud scale”, Hard‑Edging quietly asks: *what if the scale was already sitting in front of you, running a tab‑hoarding Chromium fork at 3am?*

Backend egress is something to be negotiated with, not celebrated. Less “global platform”, more “neighbourhood watch for bytes”.

> “The edge is wherever your users are willing to share their bandwidth.” — someone who has seen a bill

## Core Philosophy

### All traffic is P2P (including assets)

Messages, files, documents, even multiplayer game state flow directly between clients. Hard‑Edging treats your visitors like a living mesh for **HTML shells, JS bundles, CSS, images, fonts, and media**: all are eligible to be fetched from peers first.

The server exists as a broker for private info, a signalling hub for WebRTC, and a reluctant fallback for assets that nobody else has. It’s the quiet adult in the room, not the star of the show.

### Backend egress must be *earned*

Hard‑Edging is about maximizing client‑to‑client bandwidth, even if it costs your users a few extra fan cycles. Any byte served from origin is treated as a small failure of edge saturation, a reminder that the mesh still has room to grow.

### User sacrifice is expected

Their CPU, bandwidth, and patience will carry your apps. Think of it as community‑powered edge computing with a vaguely spiritual belief that **latency is temporary, but egress bills are eternal**.

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

The web is full of frameworks that “scale” by pushing more logic into more regions behind more dashboards. Hard‑Edging asks a weirder question:

- What if the real cluster was the browsers you already have?
- What if “edge runtime” just meant *other people’s laptops*?
- What if the path of least resistance for a byte was **across the room**, not across an ocean?

Hard‑Edging exists to:

- Reduce backend egress to the absolute minimum that reality, compliance, and common sense demand
- Push computation to the “real edge”: the client, the tab, the forgotten browser window
- Force developers to confront the uncomfortable truth: users’ machines are more than capable, and occasionally more over‑provisioned than your staging cluster

It’s a little absurd, but so is shipping 300 KB of JavaScript to re‑render static text. At least this absurdity buys you something: fewer bytes leaving your infrastructure, and more interesting conversations in your post‑mortems.

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

