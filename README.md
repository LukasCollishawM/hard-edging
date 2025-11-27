### _NOTE: THIS IS A SATIRICLE FRAMEWORK, ALTHOUGH, IT IS FULLY FUNCTIONAL AND READY FOR INSPIRATION FOR ACTUALLY USEFUL USECASES - READ AT YOUR OWN MENTAL SANITY'S RISK_

# Hard-Edging

Edge your users so you can pay your bills.*

*_afford your cloud egress bills_

> The REAL edge were the friends we edged along the way

Hard-Edging is a peer‑first web framework where **every front‑end asset tries to come from another user before it comes from you**:

- HTML shells
- JS bundles and chunks
- CSS
- images, fonts, emoji sheets
- videos, JSON blobs

Your server is still there, somewhere, behaving itself as:

- a signalling point for WebRTC
- a reluctant source of “truth” when the mesh fails
- a place to put secrets

But the real work happens in the browsers, staring at each other across the network, trading assets and state.

---

## Why this exists

If you have worked on the web long enough, you have had this conversation:

> “We can reduce costs by introducing a new edge layer in front of the other edge layer that fronts the origin layer which proxies the real origin.”

At some point you realise the “edge” is less about physics and more about billing. The packets are going where they always went; you are simply paying different people to care.

Hard-Edging suggests a different thought experiment:

- What if the **cluster** was the user agents you already have?
- What if “edge runtime” just meant *other people’s laptops*?
- What if the shortest path for a byte was **across the room**, not across an ocean?

It is an attempt at:

- **egress‑driven development (EDD)\*** – start with the bill, then draw the architecture
- **bandwidth asceticism\*** – origin only when the mesh genuinely cannot help
- **meshocratic deployment\*** – whoever already has the asset “wins”

---

## Core ideas (philosophy hiding inside jokes)

### 1. The browser is infrastructure

Browsers are no longer “clients” in any meaningful sense. They are:

- multi‑core, multi‑gigabyte execution environments
- distributed storage nodes with surprisingly loyal local caches
- more geographically diverse than any region list in a cloud console

Hard-Edging treats them that way. Each browser:

- joins a **room** via a tiny broker
- forms WebRTC data channels with peers
- requests and serves assets over those channels
- falls back to origin only when the mesh is asleep, shy, or firewalled

The CDN is, in a sense, whatever group of strangers currently has your tab open.

### 2. Backend egress must be earned

Every byte from origin is a small confession: *the mesh was not ready yet*.

Hard-Edging tries very hard to:

- seed assets into peers once they are fetched
- route subsequent requests through those peers
- measure how often it succeeded, and how much you “cheated” by going back to origin

You can still build normal apps with it. You just have to live with the knowledge that, every time you hit the origin, some imaginary accountant somewhere sighs.

### 3. User sacrifice is assumed (but consensual)

Your users’ machines are absurdly overprovisioned for the average marketing site:

- many cores
- many gigabytes
- many, many idle tabs

Hard-Edging politely volunteers them for light CDN duty:

- **CPU**: doing some extra crypto and compression
- **bandwidth**: serving assets to nearby peers
- **attention**: occasionally being asked whether they would like to thank a particularly generous peer

If this feels exploitative, remember: the same machines are already rendering three separate client‑side routers and a partridge in a component tree.

### 4. Gratitude is opt‑in, awkward, and human

When a peer serves you an asset (when they “edge” you), Hard-Edging **does not** automatically send thank‑you messages. There is no invisible stream of fake gratitude packets rushing around the mesh.

Instead:

- the Mesh Inspector shows you which peers have been feeding you assets
- you can choose to send a thank‑you to a specific peer
- the peer receives a small notification: a gentle “someone noticed you”

You can trigger thank prompts however you like:

- after hovering over a particular asset for longer than is strictly professional
- when you realise you keep requesting the same file from the same peer
- when your internal narrative explains this as “debugging the mesh” and not “finding an excuse to click their peer id again”

The system provides the mechanism; you provide the meaning. Any resemblance to dating apps is, of course, purely coincidental and definitely not a design goal.

---

## What do you actually get?

### From 10,000 meters (or several network hops)

- **P2P‑first asset delivery** for all front‑end assets (HTML shell + JS + CSS + static assets + JSON)
- A **minimal broker** (Node + WebSocket) for signalling and last‑resort fallback
- A **mesh runtime** (WebRTC data channels) that knows how to:
  - ask peers for an asset
  - serve assets it already has
  - track who is quietly doing all the work
- A **React binding** that makes this feel like normal state and hooks instead of a DIY signalling project
- A **Mesh Inspector** devtool that shows:
  - connected peers
  - bytes from origin vs bytes from peers
  - which peers have “edged” you the most
  - buttons for sending thanks when the spirit moves you

### From a terminal

```bash
# Install (locally is fine)
npm install

# From the monorepo root, create a sample app
cd packages/cli
node dist/index.js init my-mesh-app

cd ../../my-mesh-app
npm install

# Start broker + Vite dev server together
npm run dev
```

Then open the app in a few browsers (incognito works well), watch the Mesh Inspector, and see how quickly you start rooting for some random `peer_m7k3x...` as if they were your own tiny edge node.

---

## Features (in plain-ish language)

- **Peer‑to‑peer asset sharing**  
  Assets are requested from other browsers first, with origin as a fallback. Yes, even for “boring” things like CSS and JSON.

- **Minimal but real backend**  
  A small Node broker handles rooms, peer lists, and WebRTC signalling. It can also serve assets directly when the mesh is blocked or empty.

- **React integration**  
  A `HardEdgingProvider`, hooks like `useMesh` and `useAsset`, and a `MeshInspector` overlay that lets you stare directly into the heart of your offloaded egress.

- **Privacy annotations**  
  Tools to mark data as `shareable`, `private`, or `room-local`, and runtime checks that grumble when you try to leak the wrong thing.

- **Gratitude system**  
  Mesh Inspector shows which peers have served you assets and gives you a button to send explicit, opt‑in thanks. The protocol is technical; the gesture is not.

- **Dev‑time observability**  
  Live stats for:
  - bytes from peers vs origin
  - connected peers
  - who is doing the serving vs who is sipping through the straw

---

## A more honest pitch

If you want:

- a battle‑tested, enterprise‑ready framework with strong vendor backing and a polished story for every acronym

you probably already know what to install.

Hard-Edging is for when you want to:

- see how far you can push “users as infra” before someone tells you to stop
- feel a tiny jolt of joy when a new tab appears in the peer list and immediately starts handing out assets
- explore what “edge” might mean if you trusted your users more than your dashboards

It is satire, but it is **functional** satire: the packets are real; the bandwidth graphs move; the fans spin up at 3am somewhere that is not your data center.

---

## Packages (for when curiosity wins)

Under the hood, the monorepo is split into a few small packages. You do not have to think about them if you do not want to, but they are there when you get curious.

### `@hard-edging/core`

The core runtime: types, configuration, and the client that decides whether to ask peers or go back to origin. It is the bit that turns:

```ts
const client = new AssetClient();
const { response } = await client.fetchP2PFirst('/demo-large.json');
```

into a polite sequence of “anyone have this?” followed by “fine, I will get it myself” when necessary.

### `@hard-edging/webrtc`

The mesh brain:

- connects peers via WebRTC
- routes asset requests over data channels
- tracks bytes sent/received and which peer helped whom

It does not try to be a video platform or SFU; it just wants your script bundle to make some friends.

### `@hard-edging/react`

React bindings and devtools:

- `HardEdgingProvider` – bootstraps the client + service worker
- `useMesh` – live view of peers and stats
- `MeshInspector` – full‑screen overlay that turns your app into a small observatory for network karma

### `@hard-edging/cli`

The CLI that does the boring wiring:

- scaffolds a minimal mesh‑ready app
- starts the broker and Vite dev server together

So you spend your time staring at the mesh instead of your own `child_process.spawn` calls.

### `@hard-edging/broker`

The broker server:

- WebSocket signalling for peers
- room membership and peer lists
- optional static asset serving as an authoritative fallback

It is intentionally small and slightly bored. Its job is to introduce browsers and then get out of the way.

### `@hard-edging/privacy`

The voice in your head that says “maybe do not send that”.

- lets you annotate data as `shareable`, `private`, or `room-local`
- enforces those annotations at runtime before anything leaves the tab

Where the rest of Hard-Edging is about letting bytes move freely, this part is about admitting that some bytes deserve a quieter life.

---

## Frequently asked questions

- Is this serious?
- Will this reduce my cloud bill?
- Will this increase my users' bill?
- Is this basically running a tiny CDN cult in my users' browsers?
- Will legal be mad?
- Will security be mad?
- Do I need to tell anyone I am doing this?
- What happens if a peer disappears mid‑transfer?
- Can I use this for production?
- Should I use this for production?
- Is this compatible with corporate “zero trust” networking policies?
- What does my compliance team need to sign off on?
- Is this secretly an experiment in mesh‑based social features with plausible deniability?

The answers are left as an exercise to the reader.

---

## Disclaimer

Yes, I know this is not the most cost‑effective framework in some abstract sense.

Yes, your users' bandwidth and CPU may silently resent you.

Yes, the README might make you question whether this is serious.

But it works. It even works in more browsers than some apocryphal* “modern” stacks, which is both comforting and mildly concerning.

---

## Footnotes

- *egress‑driven development (EDD)*: the bold practice of designing systems by staring at the egress line item first and the architecture diagram second.
- *bandwidth asceticism*: the monastic art of refusing to send bytes from origin unless absolutely necessary.
- *browser‑cooperative edge quorum*: completely made‑up phrase for “browsers talk to each other until enough of them agree who has the file”.
- *meshocratic deployment*: governance model in which your deployment strategy is “whoever has the asset wins”.
- *tab‑sourced CDN cosplay*: when your users’ tabs pretend to be a global content distribution network, with none of the legal paperwork.
- *apocryphal*: polite term for “I could not find the original spec, but everyone says it existed”.


