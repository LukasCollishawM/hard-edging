/**
 * Transfer Rate Limiter
 * 
 * Implements a fair distribution algorithm for P2P asset transfers to prevent
 * bandwidth saturation and ensure efficient mesh utilization.
 * 
 * ## Core Principle
 * 
 * **One asset, one active transfer at a time per peer.**
 * 
 * This means:
 * - A peer can only send asset X to ONE other peer at a time
 * - The same peer can send asset Y to a different peer concurrently
 * - Multiple different assets can be transferred simultaneously
 * 
 * ## Why This Matters
 * 
 * Without rate limiting, a popular asset (e.g., a large JS bundle) could result in:
 * - One peer receiving 10+ simultaneous requests for the same file
 * - Bandwidth saturation on that peer
 * - Poor performance for all peers
 * - Unfair load distribution
 * 
 * With rate limiting:
 * - Load is distributed across the mesh
 * - Each peer handles one transfer per asset at a time
 * - Other peers can step in to serve the same asset
 * - Better overall mesh performance
 * 
 * ## Algorithm
 * 
 * 1. **Request Arrival**: When a peer requests asset X
 *    - Check if we're already sending asset X to any peer
 *    - If yes: Queue the request or reject (depending on policy)
 *    - If no: Start transfer immediately
 * 
 * 2. **Transfer Completion**: When a transfer finishes
 *    - Mark the asset as available for the next transfer
 *    - Process queued requests (FIFO or priority-based)
 * 
 * 3. **Fair Distribution**: 
 *    - Peers that can't get an asset from one peer will request from others
 *    - The mesh naturally balances load across all peers
 * 
 * ## Configuration
 * 
 * - `maxConcurrentPerAsset`: Maximum concurrent transfers per asset (default: 1)
 * - `queuePolicy`: How to handle queued requests ('fifo' | 'reject' | 'priority')
 * - `maxQueueSize`: Maximum queued requests per asset (default: 10)
 */

export interface QueuedRequest {
  assetId: string;
  peerId: string;
  timestamp: number;
  priority?: number;
}

export interface RateLimiterOptions {
  /**
   * Maximum number of concurrent transfers for the same asset.
   * Default: 1 (one transfer per asset at a time)
   */
  maxConcurrentPerAsset?: number;
  
  /**
   * How to handle requests when an asset is already being transferred.
   * - 'fifo': Queue requests and process in first-in-first-out order
   * - 'reject': Immediately reject with 'busy' status
   * - 'priority': Queue with priority, process highest priority first
   */
  queuePolicy?: 'fifo' | 'reject' | 'priority';
  
  /**
   * Maximum number of queued requests per asset.
   * Default: 10
   */
  maxQueueSize?: number;
}

export class TransferRateLimiter {
  private readonly maxConcurrentPerAsset: number;
  private readonly queuePolicy: 'fifo' | 'reject' | 'priority';
  private readonly maxQueueSize: number;
  
  /**
   * Tracks active transfers: assetId -> Set of peerIds currently receiving this asset
   */
  private readonly activeTransfers = new Map<string, Set<string>>();
  
  /**
   * Queued requests per asset: assetId -> QueuedRequest[]
   */
  private readonly queues = new Map<string, QueuedRequest[]>();
  
  constructor(options: RateLimiterOptions = {}) {
    this.maxConcurrentPerAsset = options.maxConcurrentPerAsset ?? 1;
    this.queuePolicy = options.queuePolicy ?? 'fifo';
    this.maxQueueSize = options.maxQueueSize ?? 10;
  }
  
  /**
   * Attempts to acquire a transfer slot for sending an asset to a peer.
   * 
   * @param assetId - The asset being transferred
   * @param peerId - The peer requesting the asset
   * @returns 'granted' if transfer can proceed, 'busy' if queued/rejected, 'queued' if added to queue
   */
  requestTransfer(assetId: string, peerId: string): 'granted' | 'busy' | 'queued' {
    const active = this.activeTransfers.get(assetId) ?? new Set<string>();
    
    // Check if we're already sending to this peer (duplicate request)
    if (active.has(peerId)) {
      return 'busy';
    }
    
    // Check if we're at the concurrent limit for this asset
    if (active.size >= this.maxConcurrentPerAsset) {
      // Handle based on queue policy
      if (this.queuePolicy === 'reject') {
        return 'busy';
      }
      
      // Queue the request
      const queue = this.queues.get(assetId) ?? [];
      if (queue.length >= this.maxQueueSize) {
        // Queue full, reject
        return 'busy';
      }
      
      queue.push({
        assetId,
        peerId,
        timestamp: Date.now()
      });
      this.queues.set(assetId, queue);
      return 'queued';
    }
    
    // Grant the transfer
    active.add(peerId);
    this.activeTransfers.set(assetId, active);
    return 'granted';
  }
  
  /**
   * Releases a transfer slot when a transfer completes.
   * Processes the next queued request if available.
   * 
   * @param assetId - The asset that finished transferring
   * @param peerId - The peer that received the asset
   * @returns The next queued peer ID if one was processed, null otherwise
   */
  releaseTransfer(assetId: string, peerId: string): string | null {
    const active = this.activeTransfers.get(assetId);
    if (!active) return null;
    
    active.delete(peerId);
    
    // If no more active transfers, clean up
    if (active.size === 0) {
      this.activeTransfers.delete(assetId);
    }
    
    // Process next queued request
    const queue = this.queues.get(assetId);
    if (!queue || queue.length === 0) {
      return null;
    }
    
    // Get next request based on policy
    let next: QueuedRequest | undefined;
    if (this.queuePolicy === 'priority') {
      // Sort by priority (highest first), then by timestamp
      queue.sort((a, b) => {
        const priorityDiff = (b.priority ?? 0) - (a.priority ?? 0);
        if (priorityDiff !== 0) return priorityDiff;
        return a.timestamp - b.timestamp;
      });
      next = queue.shift();
    } else {
      // FIFO: first in, first out
      next = queue.shift();
    }
    
    if (next) {
      this.queues.set(assetId, queue);
      // Grant the transfer
      const activeSet = this.activeTransfers.get(assetId) ?? new Set<string>();
      activeSet.add(next.peerId);
      this.activeTransfers.set(assetId, activeSet);
      return next.peerId;
    }
    
    return null;
  }
  
  /**
   * Cancels a queued request (e.g., if the peer disconnected).
   * 
   * @param assetId - The asset
   * @param peerId - The peer whose request should be cancelled
   */
  cancelQueuedRequest(assetId: string, peerId: string): void {
    const queue = this.queues.get(assetId);
    if (!queue) return;
    
    const index = queue.findIndex((req) => req.peerId === peerId);
    if (index >= 0) {
      queue.splice(index, 1);
      if (queue.length === 0) {
        this.queues.delete(assetId);
      }
    }
  }
  
  /**
   * Cleans up all state for a peer (e.g., when peer disconnects).
   * 
   * @param peerId - The peer that disconnected
   */
  cleanupPeer(peerId: string): void {
    // Remove from active transfers
    for (const [assetId, active] of this.activeTransfers.entries()) {
      if (active.has(peerId)) {
        active.delete(peerId);
        if (active.size === 0) {
          this.activeTransfers.delete(assetId);
        }
      }
    }
    
    // Remove from queues
    for (const [assetId, queue] of this.queues.entries()) {
      const filtered = queue.filter((req) => req.peerId !== peerId);
      if (filtered.length === 0) {
        this.queues.delete(assetId);
      } else {
        this.queues.set(assetId, filtered);
      }
    }
  }
  
  /**
   * Gets statistics about the rate limiter state.
   */
  getStats() {
    let totalActive = 0;
    let totalQueued = 0;
    
    for (const active of this.activeTransfers.values()) {
      totalActive += active.size;
    }
    
    for (const queue of this.queues.values()) {
      totalQueued += queue.length;
    }
    
    return {
      activeTransfers: totalActive,
      queuedRequests: totalQueued,
      assetsWithActiveTransfers: this.activeTransfers.size,
      assetsWithQueuedRequests: this.queues.size
    };
  }
}

