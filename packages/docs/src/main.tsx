import React from 'react';
import ReactDOM from 'react-dom/client';

const App: React.FC = () => {
  return (
    <main style={{ fontFamily: 'system-ui', padding: '1.5rem', maxWidth: 800, margin: '0 auto' }}>
      <h1>Hard-Edging</h1>
      <p>
        <strong>Hard, Fast, and Distributed.</strong> A framework where every asset your app needs
        tries to come from another user&apos;s browser before your origin server gets involved.
      </p>

      <h2>Core Idea</h2>
      <p>
        Hard-Edging treats your visitors as a living, breathing CDN mesh. HTML shells, JS bundles,
        CSS, images, fonts, and media are all eligible to be fetched P2P via WebRTC data channels.
        The origin server and any traditional CDN are last-resort fallbacks.
      </p>

      <h2>Architecture at a Glance</h2>
      <pre>
        {`Browser A   <---- WebRTC ---->   Browser B   <---- WebRTC ---->   Browser C
    \\______________________ origin (fallback only) ______________________/`}
      </pre>

      <h2>Browser Constraints</h2>
      <ul>
        <li>Full page navigations still come from the origin shell (SPA routing is mandatory).</li>
        <li>Code from peers is loaded via blobs and checked, not evaled blindly.</li>
        <li>
          Some networks will block P2P; in those cases Hard-Edging behaves like a normal framework
          with extra logging.
        </li>
      </ul>

      <h2>What to Read Next</h2>
      <ul>
        <li>Getting Started – wiring the CLI and dev server</li>
        <li>P2P Asset Pipeline – how the service worker and mesh cooperate</li>
        <li>Privacy &amp; Safety – annotating what may and may not be shared</li>
        <li>Edge Saturation – understanding when your users are doing enough unpaid CDN work</li>
      </ul>
    </main>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />);


