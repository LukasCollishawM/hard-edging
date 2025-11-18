#!/usr/bin/env node
import { Command } from 'commander';
import path from 'node:path';
import fs from 'node:fs';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const program = new Command();

program
  .name('hard-edging')
  .description(
    'Hard-Edging CLI – scaffold and run web apps where your users act as the primary CDN.',
  )
  .version('0.0.1');

const copyTemplate = (templateName: string, targetDir: string) => {
  // Get the directory of the current file (ESM-compatible)
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const templateRoot = path.join(__dirname, '..', 'templates', templateName);
  if (!fs.existsSync(templateRoot)) {
    throw new Error(`Template "${templateName}" not found at ${templateRoot}`);
  }

  fs.mkdirSync(targetDir, { recursive: true });

  for (const entry of fs.readdirSync(templateRoot)) {
    const src = path.join(templateRoot, entry);
    const dest = path.join(targetDir, entry);
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
      copyTemplate(path.join(templateName, entry), dest);
    } else {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(src, dest);
    }
  }
};

program
  .command('init')
  .argument('<name>', 'project name')
  .option(
    '-t, --template <template>',
    'template to use (minimal, chat-room, whiteboard, canvas-live, file-share, cloudless-feed)',
    'minimal',
  )
  .description('Create a new Hard-Edging project wired for P2P-first asset delivery.')
  .action((name, options) => {
    const targetDir = path.resolve(process.cwd(), name);
    const template = options.template ?? 'minimal';
    copyTemplate(template, targetDir);
    // eslint-disable-next-line no-console
    console.log(`\nCreated ${name} with Hard-Edging template "${template}".`);
    // eslint-disable-next-line no-console
    console.log(
      'Run `npm install` then `npx hard-edging dev` to start a dev server where peers serve assets first.',
    );
  });

program
  .command('dev')
  .option('--broker-port <port>', 'Port for the broker server', '4000')
  .option('--vite-port <port>', 'Port for the Vite dev server', '5173')
  .description('Run Vite dev server + broker for P2P-first development.')
  .action(async (options) => {
    const brokerPort = Number(options.brokerPort ?? 4000);
    const vitePort = Number(options.vitePort ?? 5173);
    const cwd = process.cwd();

    // Check if we're in a Hard-Edging app (has vite.config.ts/js)
    const viteConfigPath = [path.join(cwd, 'vite.config.ts'), path.join(cwd, 'vite.config.js')].find(
      (p) => fs.existsSync(p),
    );
    if (!viteConfigPath) {
      console.error('Error: No vite.config.ts or vite.config.js found. Are you in a Hard-Edging app directory?');
      process.exit(1);
    }

    // Find broker path (could be in monorepo or installed)
    let brokerPath: string | null = null;
    // Try multiple possible locations relative to the app
    const possiblePaths = [
      path.join(cwd, '..', 'packages', 'broker', 'dist', 'server.js'), // App at root level
      path.join(cwd, '..', '..', 'packages', 'broker', 'dist', 'server.js'), // App in subdirectory
      path.join(cwd, 'node_modules', '@hard-edging', 'broker', 'dist', 'server.js'), // Installed package
    ];
    
    for (const possiblePath of possiblePaths) {
      if (fs.existsSync(possiblePath)) {
        brokerPath = possiblePath;
        break;
      }
    }
    
    if (!brokerPath) {
      console.error('Error: Could not find broker server. Make sure @hard-edging/broker is built.');
      console.error('  Try: cd packages/broker && npm run build');
      console.error(`  Searched in: ${possiblePaths.join(', ')}`);
      process.exit(1);
    }

    console.log('🚀 Starting Hard-Edging dev environment...\n');
    console.log(`📡 Broker: http://localhost:${brokerPort}`);
    console.log(`🌐 Vite: http://localhost:${vitePort}\n`);

    // Spawn broker
    const broker = spawn('node', [brokerPath], {
      env: { ...process.env, BROKER_PORT: String(brokerPort) },
      stdio: 'inherit',
    });

    // Spawn vite directly with port flag
    const vite = spawn('npx', ['vite', '--port', String(vitePort)], {
      cwd,
      stdio: 'inherit',
      shell: true,
    });

    // Cleanup on exit
    const cleanup = () => {
      broker.kill();
      vite.kill();
      process.exit(0);
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);

    broker.on('error', (err) => {
      console.error('Broker error:', err);
      cleanup();
    });

    vite.on('error', (err) => {
      console.error('Vite error:', err);
      cleanup();
    });
  });

program
  .command('build')
  .description('Build the Hard-Edging app for production deployment.')
  .action(() => {
    // eslint-disable-next-line no-console
    console.log(
      'Build: run your bundler (e.g., Vite) and ensure asset manifests are wired to Hard-Edging runtime.',
    );
  });

program
  .command('mesh-inspect')
  .description('Inspect the current mesh: peers, asset distribution, and edge saturation.')
  .action(() => {
    // eslint-disable-next-line no-console
    console.log(
      'Mesh Inspector: open the in-app MeshInspector overlay to see which users are behaving like CDNs.',
    );
  });

program
  .command('upgrade-edge')
  .description('Run framework upgrade routines to keep your edge nice and sharp.')
  .action(() => {
    // eslint-disable-next-line no-console
    console.log('Upgrade Edge: not implemented yet, but your users are already doing the hard work.');
  });

program.parse(process.argv);


