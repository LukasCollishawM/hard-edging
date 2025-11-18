import React from 'react';
import ReactDOM from 'react-dom/client';
import { HardEdgingProvider, MeshInspector } from '@hard-edging/react';

const App: React.FC = () => {
  return (
    <HardEdgingProvider>
      <h1>Hard-Edging Minimal App</h1>
      <p>
        This app is wired so that, in principle, every asset you see could have come from another
        user&apos;s browser before the origin server ever felt a thing.
      </p>
      <MeshInspector />
    </HardEdgingProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />);


