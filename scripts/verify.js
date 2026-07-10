const fs = require('node:fs');
const path = require('node:path');

const PKG_DIR = path.resolve(__dirname, '..', 'pkg');
const EXPECTED_NAME = 'mattpocock-skills-unofficial-plugin';

const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

function assertExists(filePath, description) {
  assert(fs.existsSync(filePath), `Missing ${description}: ${path.relative(PKG_DIR, filePath)}`);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// package.json checks
const packageJsonPath = path.join(PKG_DIR, 'package.json');
assertExists(packageJsonPath, 'package manifest');

if (fs.existsSync(packageJsonPath)) {
  const pkg = readJson(packageJsonPath);
  assert(pkg.name === EXPECTED_NAME, `Package name must be "${EXPECTED_NAME}", got "${pkg.name}"`);
  assert(typeof pkg.version === 'string' && pkg.version.length > 0, 'Package version must be set');
  assert(pkg.private === undefined, 'Package must not have a "private" flag');
  assert(pkg.publishConfig?.access === 'public', 'Package must have publishConfig.access set to "public"');
}

// plugin manifest checks
const pluginManifestPath = path.join(PKG_DIR, '.claude-plugin', 'plugin.json');
assertExists(pluginManifestPath, 'plugin manifest');

if (fs.existsSync(pluginManifestPath)) {
  const manifest = readJson(pluginManifestPath);
  assert(typeof manifest.name === 'string' && manifest.name.length > 0, 'Plugin manifest must have a name');
  assert(Array.isArray(manifest.skills) && manifest.skills.length > 0, 'Plugin manifest must list skills');
}

// skills tree checks
const skillsDir = path.join(PKG_DIR, 'skills');
assertExists(skillsDir, 'skills directory');

if (fs.existsSync(skillsDir)) {
  const topLevelEntries = fs.readdirSync(skillsDir, { withFileTypes: true });
  assert(topLevelEntries.some(e => e.isDirectory()), 'skills directory must contain at least one category directory');
}

// documentation and license checks
assertExists(path.join(PKG_DIR, 'README.md'), 'README');
assertExists(path.join(PKG_DIR, 'LICENSE'), 'LICENSE');

if (errors.length > 0) {
  console.error('Package verification failed:');
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log('Package verification passed.');
