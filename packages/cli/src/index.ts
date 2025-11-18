#!/usr/bin/env node
import { Command } from 'commander';
import path from 'node:path';
import fs from 'node:fs';

const program = new Command();

program
  .name('hard-edging')
  .description(
    'Hard-Edging CLI – scaffold and run web apps where your users act as the primary CDN.',
  )
  .version('0.0.1');

const copyTemplate = (templateName: string, targetDir: string) => {
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
  .description('Run Vite dev server + broker for P2P-first development.')
  .action(() => {
    // For now we just print guidance; integration with Vite will be added later.
    // eslint-disable-next-line no-console
    console.log(
      'Dev mode: start your Vite dev server and the Hard-Edging broker to see assets flow P2P-first.',
    );
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


