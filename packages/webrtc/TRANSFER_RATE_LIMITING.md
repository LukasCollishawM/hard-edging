# Transfer Rate Limiting Algorithm

## Overview

The Hard-Edging P2P mesh implements a **fair distribution algorithm** to prevent bandwidth saturation and ensure efficient asset distribution across the network. This document explains the algorithm, its rationale, and implementation details.

## Core Principle

**One asset, one active transfer at a time per peer.**

### What This Means

- A peer can only send asset X to **ONE** other peer at a time
- The same peer can send asset Y to a different peer concurrently
- Multiple different assets can be transferred simultaneously

### Example Scenario

Imagine 4 peers (A, B, C, D) and a popular asset `main.js`:

**Without Rate Limiting:**
```
Peer A has main.js
Peer B requests main.js → A sends to B
Peer C requests main.js → A sends to C (concurrent, saturating A's bandwidth)
Peer D requests main.js → A sends to D (even more saturation)
Result: Peer A's bandwidth is overwhelmed, all transfers slow down
```

**With Rate Limiting:**
```
Peer A has main.js
Peer B requests main.js → A sends to B (granted)
Peer C requests main.js → A queues request (busy)
Peer D requests main.js → A queues request (busy)

Meanwhile:
- Peer B receives main.js and now has it
- Peer C's request to A is queued, but C also requests from B
- B can send to C (different transfer slot)
- Load is distributed across A and B

Result: Load is balanced, transfers complete faster overall
```

## Algorithm Details

### 1. Request Arrival

When a peer receives an `ASSET_REQUEST`:

```
1. Check if we have the asset
   ├─ No → Respond with 'not found' immediately
   └─ Yes → Continue to step 2

2. Request transfer slot from rate limiter
   ├─ 'granted' → Send asset immediately
   ├─ 'queued' → Add to queue, will process when slot available
   └─ 'busy' → Reject (queue full or duplicate), peer will try other sources
```

### 2. Transfer Completion

When a transfer finishes:

```
1. Release the transfer slot
2. Check for queued requests
3. Process next queued request (FIFO order)
4. If queued peer still connected, send asset
```

### 3. Fair Distribution

The algorithm naturally distributes load:

- **Rejected requests** cause peers to try other sources
- **Queued requests** are processed in order (FIFO)
- **Multiple peers** with the same asset can serve different requesters
- **Load spreads** across the mesh automatically

## Configuration

The rate limiter is configured with:

```typescript
{
  maxConcurrentPerAsset: 1,    // One transfer per asset at a time
  queuePolicy: 'fifo',         // First-in-first-out queue processing
  maxQueueSize: 10             // Max 10 queued requests per asset
}
```

### Configuration Options

- **`maxConcurrentPerAsset`**: Maximum concurrent transfers for the same asset (default: 1)
  - Set to 2+ to allow multiple concurrent transfers of the same asset
  - Higher values = more bandwidth usage but faster distribution
  
- **`queuePolicy`**: How to handle queued requests
  - `'fifo'`: First-in-first-out (fair, predictable)
  - `'reject'`: Immediately reject when busy (forces peer to try others)
  - `'priority'`: Queue with priority, process highest first (future feature)

- **`maxQueueSize`**: Maximum queued requests per asset (default: 10)
  - Prevents unbounded queue growth
  - When full, new requests are rejected (peer tries other sources)

## Implementation

### TransferRateLimiter Class

Located in `packages/webrtc/src/transferRateLimiter.ts`

**Key Methods:**

- `requestTransfer(assetId, peerId)`: Request a transfer slot
  - Returns: `'granted'` | `'busy'` | `'queued'`
  
- `releaseTransfer(assetId, peerId)`: Release a slot when transfer completes
  - Returns: Next queued peer ID (if any)
  
- `cleanupPeer(peerId)`: Clean up all state for a disconnected peer

### Integration in PeerConnectionManager

The rate limiter is integrated into the asset request handling:

```typescript
private handleAssetRequest(peerId: string, assetId: string, dc: RTCDataChannel): void {
  const asset = this.assets.get(assetId);
  if (!asset) {
    // Don't have it, respond immediately
    return;
  }
  
  const result = this.rateLimiter.requestTransfer(assetId, peerId);
  
  if (result === 'granted') {
    this.sendAssetToPeer(peerId, assetId, asset, dc);
  } else if (result === 'queued') {
    // Will be processed when current transfer completes
  } else {
    // Rejected - peer will try other sources
  }
}
```

## Benefits

1. **Prevents Bandwidth Saturation**: No single peer gets overwhelmed
2. **Fair Distribution**: Load spreads naturally across the mesh
3. **Better Performance**: Overall faster transfers due to load balancing
4. **Scalability**: Works well with many peers requesting the same asset
5. **Resilience**: If one peer is busy, others can step in

## Trade-offs

1. **Slightly Slower Initial Distribution**: First requester gets immediate service, others may wait or try other peers
2. **Queue Management Overhead**: Small memory/CPU cost for tracking queues
3. **Rejected Requests**: Some requests are rejected to force peer discovery, which adds a small delay

## Future Enhancements

1. **Priority Queueing**: Process requests by priority (e.g., critical assets first)
2. **Adaptive Rate Limiting**: Adjust `maxConcurrentPerAsset` based on network conditions
3. **Transfer Streaming**: Track actual transfer progress instead of assuming completion
4. **Bandwidth-Aware Scheduling**: Consider peer bandwidth when scheduling transfers
5. **Predictive Pre-fetching**: Pre-queue popular assets before requests arrive

## Testing

To test the rate limiting:

1. Start multiple browser instances (4+ peers)
2. Load a large asset (e.g., a big JS bundle)
3. Observe console logs:
   - `"Sending asset X to peer Y"` - Active transfers
   - `"Queued asset request X from peer Y"` - Queued requests
   - `"Rejected asset request X from peer Y"` - Rejected requests
4. Verify that:
   - Only one transfer per asset is active at a time
   - Queued requests are processed in order
   - Load is distributed across multiple peers

## References

- Main implementation: `packages/webrtc/src/transferRateLimiter.ts`
- Integration: `packages/webrtc/src/peerConnectionManager.ts`
- Types: `packages/webrtc/src/meshTypes.ts`

