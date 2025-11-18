# Hard-Edging

Give your users the full edging experience, with a faintly antediluvian* respect for the browser.

## What is Hard-Edging?

Hard-Edging is a peer‑first web framework that treats browsers as first‑class infrastructure, not passive document viewers. Code, state, assets, and occasionally dignity are pushed to the very edge of the network: your users’ machines.

Instead of worshipping at the altar of “infinite cloud scale”, Hard‑Edging quietly asks: *what if the scale was already sitting in front of you, running a tab‑hoarding Chromium fork at 3am?*

Backend egress is something to be negotiated with, not celebrated. Less “global platform”, more “neighbourhood watch for bytes”.

> “The edge is wherever your users are willing to share their bandwidth.” - someone who has seen a bill

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

### Gratitude is conspicuous and opt-in

When a peer serves you an asset - when they "edge" you - Hard-Edging does not silently fire off automated thank-you packets. Instead, it gives you the tools to surface prompts and buttons so that any gratitude is an explicit, conscious act of acknowledgment, not background noise. The Mesh Inspector tracks peer credits: who served you what, how many bytes, and when, and you decide when to click "Send thanks".

You can wire this into whatever attention heuristic you like: hovering over a particular asset for a suspiciously long time, opening the same mesh-heavy page five times in a row, or just feeling the ineffable stirrings of edge-based chemistry. Either way, the protocol is clear: **THIS IS NOT AN AUTOMATED PROCESS, THIS IS ACTIVE ACKNOWLEDGEMENT**.

## Features

- Automatic peer discovery and mesh formation
- Real-time P2P messaging and data syncing
- CRDT-based local-first storage for collaborative apps
- Minimal backend: only signaling, auth, and optional private data
- Hot-reload dev server with P2P debugging tools
- Developer-friendly API: server code optional, mesh-first default
- **Peer acknowledgment system**: Peers who serve you assets are automatically thanked, with credits tracked and displayed in the Mesh Inspector

## Motivation

The web is full of frameworks that "scale" by pushing more logic into more regions behind more dashboards. Hard‑Edging asks a weirder question:

- What if the real cluster was the browsers you already have?
- What if "edge runtime" just meant *other people's laptops*?
- What if the path of least resistance for a byte was **across the room**, not across an ocean?

And then it keeps going:

- Why is every conversation about "cost" quietly a conversation about **your** egress bill and **their** margins?
- How did we end up paying rent on our own bytes, every month, forever?
- At what point did “edge” stop meaning *near the user* and start meaning “near a shareholder presentation”?

In more grandiloquent* terms, Hard‑Edging is an experiment in egress-driven development (EDD)* and bandwidth asceticism*. It assumes at least one person in your organisation is sufficiently perspicacious* to notice where the money is actually leaking.

Hard‑Edging exists to:

- Reduce backend egress to the absolute minimum that reality, compliance, and common sense demand
- Push computation to the “real edge”: the client, the tab, the forgotten browser window
- Treat your users’ browsers as a cooperatively over‑provisioned cluster, not as consumers of a “content delivery experience”
- Give you a framework that is simultaneously **useful**, **ridiculous**, and **uncomfortably honest** about where the bandwidth is really coming from
- Provide just enough browser‑cooperative edge consensus* that you can say “distributed system” in meetings without blushing

For the historically inclined, the precise sequence of commits that led here has been tastefully blurred into meshocratic deployment* and squashed historiography*. This is for your protection and ours.

It is a little absurd, but so is shipping 300 KB of JavaScript to re‑render static text. At least this absurdity buys you something: fewer bytes leaving your infrastructure, more visible peer‑to‑peer flows, and more interesting conversations in your post‑mortems and procurement meetings.

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

### Example: React + Mesh Inspector

```tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { HardEdgingProvider, MeshInspector, useMesh } from '@hard-edging/react';

function EdgeStatus() {
  const { peers, stats } = useMesh();
  const total = stats.bytesSentP2P + stats.bytesReceivedP2P + stats.bytesFromOrigin;
  const edgePercent =
    total === 0 ? 0 : Math.round(((stats.bytesSentP2P + stats.bytesReceivedP2P) / total) * 100);

  return (
    <section>
      <h2>Edge Saturation</h2>
      <p>{edgePercent}% of bytes served P2P (approximate).</p>
      <p>Connected peers: {peers.length}</p>
    </section>
  );
}

function App() {
  return (
    <HardEdgingProvider>
      <main>
        <h1>Hard-Edging Minimal App</h1>
        <p>Your tabs are now a distributed system. Please use responsibly.</p>
        <EdgeStatus />
      </main>
      <MeshInspector />
    </HardEdgingProvider>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
```

## Example Apps

- Collaborative editors
- Multiplayer turn-based games
- Real-time chat apps
- Anything else you want to offload to your users' devices, from dashboards to deeply quotidian* CRUD

## Frequently asked (answers left as an exercise to the reader)

- **Is this serious?**
- **Will this reduce my cloud bill?**
- **Will this increase my users' bill?**
- **Is this basically running a tiny CDN cult in my users' browsers?**
- **Will legal be mad?**
- **Will security be mad?**
- **Do I need to tell anyone I am doing this?**
- **What happens if a peer disappears mid-transfer?**
- **Can I use this for production?**
- **Should I use this for production?**
- **Is this compatible with corporate “zero trust” networking policies?**
- **What does my compliance team need to sign off on?**
- **Is this tab-sourced CDN cosplay*?**

The answers are left as an exercise to the reader.

## Packages

Hard-Edging is organized as a monorepo of focused packages, each responsible for a specific layer of the mesh. Think of it as meshocratic deployment* for people who still like `package.json`.

### @hard-edging/core

Hard-Edging core runtime: shared types, CRDT-backed documents, and the basic wiring needed to let your users' browsers do the hard work while your servers stay suspiciously idle.

Think of this package as the **grammar of the mesh**: IDs, configs, asset descriptors, and the logic that decides whether a byte should take the long way (origin) or the short way (some other tab that already suffered for it).

Instead of assuming "there will be a CDN", `@hard-edging/core` assumes there will be **other people**: other peers, other event loops, other machines willing to cache and forward your assets because they happened to be there first.

### @hard-edging/webrtc

WebRTC mesh management and signalling helpers for Hard-Edging. This package is responsible for wiring browsers directly together so that "the network" stops being an abstract cloud and starts being the other tabs you forgot you had open.

`@hard-edging/webrtc` handles:

- Signalling via the broker
- Peer connection lifecycle (`RTCPeerConnection` and data channels)
- Asset request/response routing over reliable data channels
- Simple metrics, so you can see who's doing the sharing and who's freeloading

It doesn't try to be a video stack or a full SFU. It just wants to make sure that when one browser has already paid the cost for an asset, the others can politely ask for a copy.

### @hard-edging/react

React bindings for Hard-Edging: providers, hooks, and devtools that let you build peer-first UIs without thinking about WebRTC handshakes on every render.

This package gives you:

- `HardEdgingProvider` to bootstrap the mesh and service worker
- Hooks like `useMesh`, `useAsset`, and `usePrivacyBoundary` to make P2P feel like ordinary React state
- A Mesh Inspector overlay that turns your app into a small observatory for bandwidth karma

State is designed to flow **horizontally** between peers first. The server plays the role of quiet librarian and emergency archivist, not omnipresent storyteller.

### @hard-edging/cli

The `hard-edging` CLI scaffolds and runs Hard-Edging applications. It wires together Vite, the broker, and your mesh so you can focus on writing components instead of hand‑stitching dev servers and signalling layers every weekend.

Use it to:

- `init` new projects with a mesh‑ready template
- `dev` to start the broker + Vite in one go
- `build` to produce production bundles
- `mesh-inspect` (future) to introspect what your peers are actually doing

In a sense, the CLI is the ritual that turns a normal app into a peer‑to‑peer organism. One command, and suddenly your local tabs are negotiating amongst themselves.

### @hard-edging/broker

The Hard-Edging broker is a minimal Node.js runtime responsible for signalling, authentication, and room membership. It's the polite introducer at a party: it gets peers talking to each other and then steps back out of the conversation.

Responsibilities:

- Accept WebSocket connections from browsers
- Manage rooms and peer lists
- Relay WebRTC offers/answers/candidates between peers
- Optionally serve static assets as a last‑resort authoritative source

It's deliberately small in scope. The philosophy is simple: **coordinate, don't dominate**. Let the browsers carry the actual content once they've met.

### @hard-edging/privacy

Privacy annotations, schemas, and leak detection for Hard-Edging. It exists to make sure that when you say "share this", you really mean it - and when you do not, the mesh respects that boundary.

This package gives you tools to describe **what data is allowed to escape the current browser**, and in which direction:

- Mark data as `shareable`, `private`, or `room-local`
- Enforce those policies at runtime before anything leaves the tab
- Log suspicious flows so you can debug "why did this ever leave my machine?"

Where the rest of Hard‑Edging is about moving bytes freely, `@hard-edging/privacy` is about deciding which bytes deserve a quieter life.

## Disclaimer

Yes, we know this probably is not the most cost-effective framework in reality.

Yes, your users' bandwidth and CPU may silently resent you.

Yes, the README might make you question whether this is serious.

But it works. It even works in more browsers than some apocryphal* “modern” stacks, which is both comforting and mildly concerning.

## Footnotes

- * antediluvian: needlessly old-fashioned way of saying “a bit old-school”; used here because computer scientists cannot resist sounding like time-traveling librarians.
- * grandiloquent: an extravagant way of saying “dramatic”; employed purely for stylistic flourish, not semantic necessity.
- * egress-driven development (EDD): the bold practice of designing systems by staring at the egress line item first and the architecture diagram second.
- * bandwidth asceticism: the monastic art of refusing to send bytes from origin unless absolutely necessary.
- * perspicacious: fancy word for “pays attention”, included so someone can nod solemnly in a design review.
- * browser-cooperative edge consensus: completely made-up phrase for “browsers talk to each other until they agree who has the file”.
- * meshocratic deployment: governance model in which your deployment strategy is “whoever has the asset wins”.
- * quotidian: another way of saying “everyday” or “boring”, chosen to make routine CRUD sound more important.
- * tab-sourced CDN cosplay: when your users’ tabs pretend to be a global content distribution network, with none of the legal paperwork.
- * apocryphal: polite term for “we could not find the original spec, but everyone says it existed”.
- * historiography: the study of how history is written; used here to imply that your commit history has been curated more than it has been preserved.

---

**Hard-Edging: Give your users the full edge experience.**

The real edge is not in the cloud, it is in the browser, pumping your users full of data, CPU, and mild regret.

*** End of File

