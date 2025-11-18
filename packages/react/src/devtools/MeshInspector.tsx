import React from 'react';
import { useMesh } from '../hooks/useMesh';
import { useHardEdging } from '../context';

export const MeshInspector: React.FC = () => {
  const { stats, peers } = useMesh();
  const { assetClient } = useHardEdging();
  const totalBytes = stats.bytesFromOrigin + stats.bytesReceivedP2P;
  const edgeRatio = totalBytes === 0 ? 0 : stats.bytesReceivedP2P / totalBytes;
  const edgePercent = Math.round(edgeRatio * 100);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: '2rem',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        color: '#e0e0e0',
        fontFamily: 'monospace',
        zIndex: 9999,
        overflow: 'auto',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 255, 0, 0.15)',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 255, 0, 0.25)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 255, 0, 0.15)';
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            color: '#4ade80',
            letterSpacing: '0.1em',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
          }}
        >
          Hard-Edging Mesh Inspector
        </h1>
        <p style={{ fontSize: '1rem', color: '#b0b0b0', marginBottom: '2rem' }}>
          Real-time P2P network monitoring and statistics
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}
        >
          <div
            style={{
              padding: '1.5rem',
              background: 'rgba(0, 255, 0, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(0, 255, 0, 0.2)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 255, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 255, 0, 0.05)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ fontSize: '0.9rem', color: '#b0b0b0', marginBottom: '0.5rem' }}>Connected Peers</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4ade80' }}>
              {peers.length}
            </div>
          </div>

          <div
            style={{
              padding: '1.5rem',
              background: 'rgba(0, 255, 0, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(0, 255, 0, 0.2)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 255, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 255, 0, 0.05)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ fontSize: '0.9rem', color: '#b0b0b0', marginBottom: '0.5rem' }}>Edge Saturation</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4ade80' }}>
              {edgePercent}%
            </div>
          </div>

          <div
            style={{
              padding: '1.5rem',
              background: 'rgba(0, 255, 0, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(0, 255, 0, 0.2)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 255, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 255, 0, 0.05)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ fontSize: '0.9rem', color: '#b0b0b0', marginBottom: '0.5rem' }}>P2P Bytes Received</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4ade80' }}>
              {(stats.bytesReceivedP2P / 1024).toFixed(2)} KB
            </div>
          </div>

          <div
            style={{
              padding: '1.5rem',
              background: 'rgba(0, 255, 0, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(0, 255, 0, 0.2)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 255, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 255, 0, 0.05)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ fontSize: '0.9rem', color: '#b0b0b0', marginBottom: '0.5rem' }}>P2P Bytes Sent</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4ade80' }}>
              {(stats.bytesSentP2P / 1024).toFixed(2)} KB
            </div>
          </div>

          <div
            style={{
              padding: '1.5rem',
              background: 'rgba(255, 165, 0, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 165, 0, 0.2)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 165, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 165, 0, 0.05)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ fontSize: '0.9rem', color: '#b0b0b0', marginBottom: '0.5rem' }}>Origin Bytes (Fallback)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fbbf24' }}>
              {(stats.bytesFromOrigin / 1024).toFixed(2)} KB
            </div>
          </div>
        </div>

        {peers.length > 0 && (
          <div
            style={{
              padding: '1.5rem',
              background: 'rgba(0, 255, 0, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(0, 255, 0, 0.2)',
              marginTop: '2rem'
            }}
          >
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#4ade80' }}>Connected Peer IDs</h2>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}
            >
              {peers.map((peerId, idx) => (
                <div
                  key={peerId}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(0, 255, 0, 0.1)',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    border: '1px solid rgba(0, 255, 0, 0.3)',
                    transition: 'all 0.2s ease',
                    cursor: 'default'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 255, 0, 0.2)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 255, 0, 0.1)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {peerId}
                </div>
              ))}
            </div>
          </div>
        )}

        {stats.peerCredits && stats.peerCredits.length > 0 && (
          <div
            style={{
              padding: '1.5rem',
              background: 'rgba(139, 69, 19, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(139, 69, 19, 0.3)',
              marginTop: '2rem'
            }}
          >
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#d97706' }}>🙏 Peers Who Edged You</h2>
            <p style={{ fontSize: '0.85rem', color: '#b0b0b0', marginBottom: '1rem' }}>
              These peers have served you assets. Any thanks you send are explicit, opt-in acts of mesh etiquette,
              not automated spam. Repeatedly thanking the same peer may or may not be a form of extremely niche
              edge-speed dating.
            </p>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}
            >
              {stats.peerCredits
                .sort((a, b) => b.bytesReceived - a.bytesReceived)
                .map((credit) => (
                  <div
                    key={credit.peerId}
                    style={{
                      padding: '1rem',
                      background: 'rgba(139, 69, 19, 0.15)',
                      borderRadius: '8px',
                      border: '1px solid rgba(139, 69, 19, 0.3)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(139, 69, 19, 0.25)';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(139, 69, 19, 0.15)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <div style={{ fontWeight: 'bold', color: '#d97706', fontSize: '0.9rem' }}>
                        {credit.peerId}
                      </div>
                      {credit.lastThankedAt && (
                        <div style={{ fontSize: '0.75rem', color: '#b0b0b0' }}>
                          Thanked {Math.floor((Date.now() - credit.lastThankedAt) / 1000)}s ago
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        fontSize: '0.85rem',
                        color: '#e0e0e0',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <div>
                          <span style={{ opacity: 0.7 }}>Assets:</span> {credit.assetsReceived}
                        </div>
                        <div>
                          <span style={{ opacity: 0.7 }}>Bytes:</span>{' '}
                          {(credit.bytesReceived / 1024).toFixed(2)} KB
                        </div>
                      </div>
                      <button
                        type="button"
                        style={{
                          padding: '0.4rem 0.75rem',
                          borderRadius: '999px',
                          border: '1px solid rgba(250, 204, 21, 0.7)',
                          background: 'rgba(250, 204, 21, 0.08)',
                          color: '#fde68a',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap'
                        }}
                        onClick={() => {
                          if (
                            typeof window !== 'undefined' &&
                            window.confirm(
                              `You seem to really enjoy assets flowing from ${credit.peerId}. Send them a thank you?`
                            )
                          ) {
                            assetClient.sendThankYou(credit.peerId, 'mesh-inspector-appreciation', credit.bytesReceived);
                          }
                        }}
                      >
                        Send thanks
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div
          style={{
            marginTop: '2rem',
            padding: '1rem',
            background: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '8px',
            fontSize: '0.85rem',
            color: '#b0b0b0'
          }}
        >
          <div style={{ color: '#e0e0e0' }}>Total bytes transferred: {((totalBytes) / 1024).toFixed(2)} KB</div>
          <div style={{ marginTop: '0.5rem', color: '#e0e0e0' }}>
            P2P efficiency: {totalBytes === 0 ? 'N/A' : `${edgePercent}%`} of bytes served peer-to-peer
          </div>
        </div>
      </div>
    </div>
  );
};


