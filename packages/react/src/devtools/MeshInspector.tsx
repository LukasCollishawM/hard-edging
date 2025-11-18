import React from 'react';
import { useMesh } from '../hooks/useMesh';

export const MeshInspector: React.FC = () => {
  const { stats, peers } = useMesh();
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


