# @hard-edging/react

React bindings for Hard-Edging: providers, hooks, and devtools that let you build peer-first UIs without thinking about WebRTC handshakes on every render.

This package gives you:

- `HardEdgingProvider` to bootstrap the mesh and service worker
- Hooks like `useMesh`, `useAsset`, and `usePrivacyBoundary` to make P2P feel like ordinary React state
- A Mesh Inspector overlay that turns your app into a small observatory for bandwidth karma

State is designed to flow **horizontally** between peers first. The server plays the role of quiet librarian and emergency archivist, not omnipresent storyteller.

