import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { HardEdgingProvider, MeshInspector, useMesh } from '@hard-edging/react';

const EdgeStatus: React.FC = () => {
  const { stats } = useMesh();
  const totalBytes = stats.bytesFromOrigin + stats.bytesReceivedP2P;
  const edgeRatio = totalBytes === 0 ? 0 : stats.bytesReceivedP2P / totalBytes;
  const edgePercent = Math.round(edgeRatio * 100);

  return (
    <div style={{ marginTop: '1rem', fontSize: 12 }}>
      <strong>Edge Saturation:</strong> {edgePercent}% of bytes served P2P (approximate)
      <br />
      <span style={{ opacity: 0.7 }}>
        Origin bytes: {stats.bytesFromOrigin}, P2P bytes: {stats.bytesReceivedP2P}
      </span>
    </div>
  );
};

const App: React.FC = () => {
  useEffect(() => {
    // Deterministic demo asset to exercise the P2P pipeline.
    // First browser will fetch from origin and seed it; subsequent browsers should go P2P.
    void fetch('/demo-large.json').catch(() => {
      // ignore in UI; MeshInspector will still show bytes
    });
  }, []);

  return (
    <HardEdgingProvider>
      <h1>Hard-Edging Minimal App</h1>
      <p>
        This app is wired so that, in principle, every asset you see could have come from another
        user&apos;s browser before the origin server ever felt a thing.
      </p>
      <EdgeStatus />
      <MeshInspector />
    </HardEdgingProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />);


