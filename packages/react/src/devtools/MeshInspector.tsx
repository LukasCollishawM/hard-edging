import React from 'react';
import { useMesh } from '../hooks/useMesh';

export const MeshInspector: React.FC = () => {
  const { stats } = useMesh();

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 8,
        right: 8,
        padding: 8,
        background: 'rgba(0,0,0,0.8)',
        color: '#0f0',
        fontSize: 10,
        fontFamily: 'monospace',
        borderRadius: 4,
        zIndex: 9999
      }}
    >
      <div>Hard-Edging Mesh</div>
      <div>Peers: {stats.peerCount}</div>
      <div>P2P bytes sent: {stats.bytesSentP2P}</div>
      <div>P2P bytes received: {stats.bytesReceivedP2P}</div>
      <div>Origin bytes: {stats.bytesFromOrigin}</div>
    </div>
  );
};


