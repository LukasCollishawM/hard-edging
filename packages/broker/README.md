# @hard-edging/broker

The Hard-Edging broker is a minimal Node.js runtime responsible for signalling, authentication, and room membership. It’s the polite introducer at a party: it gets peers talking to each other and then steps back out of the conversation.

Responsibilities:

- Accept WebSocket connections from browsers
- Manage rooms and peer lists
- Relay WebRTC offers/answers/candidates between peers
- Optionally serve static assets as a last‑resort authoritative source

It’s deliberately small in scope. The philosophy is simple: **coordinate, don’t dominate**. Let the browsers carry the actual content once they’ve met.

