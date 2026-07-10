const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const UPSTREAM = path.join(ROOT, 'upstream');
const PKG = path.join(ROOT, 'pkg');

const upstreamPkg = JSON.parse(fs.readFileSync(path.join(UPSTREAM, 'package.json'), 'utf8'));
const PLUGIN_VERSION = process.env.PLUGIN_VERSION || upstreamPkg.version;

// Clean and recreate the publish directory
fs.rmSync(PKG, { recursive: true, force: true });
fs.mkdirSync(PKG, { recursive: true });

// Copy the Claude plugin manifest OMP reads
fs.mkdirSync(path.join(PKG, '.claude-plugin'), { recursive: true });
fs.copyFileSync(
  path.join(UPSTREAM, '.claude-plugin', 'plugin.json'),
  path.join(PKG, '.claude-plugin', 'plugin.json')
);

// Copy the entire skills tree; the manifest lists which paths are active
fs.mkdirSync(path.join(PKG, 'skills'), { recursive: true });
for (const entry of fs.readdirSync(path.join(UPSTREAM, 'skills'), { withFileTypes: true })) {
  copyDir(path.join(UPSTREAM, 'skills', entry.name), path.join(PKG, 'skills', entry.name));
}

// Copy the MIT license exactly as required by the license terms
fs.copyFileSync(path.join(UPSTREAM, 'LICENSE'), path.join(PKG, 'LICENSE'));

// Write a short README that points to upstream and explains install
fs.writeFileSync(
  path.join(PKG, 'README.md'),
  `# Matt Pocock Skills — Unofficial OMP Plugin

This npm package is an **unofficial community distribution** of the [mattpocock/skills](https://github.com/mattpocock/skills) skill tree, packaged as an [OMP](https://omp.sh)-compatible plugin. It is maintained by [xloouis](https://github.com/xloouis) and is not affiliated with Matt Pocock.

## Install

\`\`\`bash
omp install mattpocock-skills-unofficial-plugin
\`\`\`

For a project-scoped install:

\`\`\`bash
omp install -l mattpocock-skills-unofficial-plugin
\`\`\`

## License

MIT. See [LICENSE](./LICENSE). Original work Copyright (c) 2026 Matt Pocock.
`
);

// Write the npm package manifest that will be published
fs.writeFileSync(
  path.join(PKG, 'package.json'),
  JSON.stringify(
    {
      name: 'mattpocock-skills-unofficial-plugin',
      version: PLUGIN_VERSION,
      description: "Unofficial community distribution of Matt Pocock's agent skills as an OMP plugin",
      license: 'MIT',
      repository: {
        type: 'git',
        url: 'git+https://github.com/xloouis/mattpocock-skills-unofficial-plugin.git'
      },
      files: ['.claude-plugin', 'skills', 'README.md', 'LICENSE'],
      keywords: ['omp', 'oh-my-pi', 'plugin', 'skills', 'claude', 'unofficial', 'mattpocock'],
      publishConfig: { access: 'public' }
    },
    null,
    2
  ) + '\n'
);

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
