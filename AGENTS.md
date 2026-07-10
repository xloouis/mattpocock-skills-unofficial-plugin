# AGENTS.md

## Project purpose

This repo packages the upstream [mattpocock/skills](https://github.com/mattpocock/skills) skill tree as an unofficial, OMP-compatible npm plugin: `mattpocock-skills-unofficial-plugin`.

The skill content is copied verbatim from upstream. Only the npm packaging metadata (package name, README, repository URL) is added.

## Key files and directories

| Path | Purpose |
|------|---------|
| `upstream/` | Git submodule pinned to a specific upstream release tag. This is the single source of truth for skill content. |
| `scripts/build.js` | Builds the publishable `pkg/` directory from `upstream/`. |
| `scripts/verify.js` | Preflight checks for the built package. |
| `pkg/` | Generated npm package. **Not checked in.** |
| `.github/workflows/check-upstream.yml` | Daily GitHub Action that checks for new upstream releases and opens a PR. |
| `.github/workflows/publish.yml` | GitHub Action that publishes `pkg/` to npm after a PR is merged to `main`. |
| `CONTEXT.md` | Domain glossary from the original grilling session. |

## Common commands

```bash
# Build the publishable package
npm run build

# Run preflight checks on the built package
npm run verify

# Build and publish to npm (local fallback)
npm run publish-plugin
```

## Automated release workflow

1. **Daily check** (`check-upstream.yml`):
   - Runs daily at midnight UTC and on manual trigger.
   - Compares the pinned upstream tag to the latest upstream tag.
   - If a newer tag exists, opens a PR that updates the `upstream/` submodule pointer and runs `npm run build` + `npm run verify`.

2. **Human review**:
   - A maintainer reviews the PR.
   - If it looks good, merge it into `main`.

3. **Auto-publish** (`publish.yml`):
   - Triggers on every push to `main`.
   - Runs `npm run build`, `npm run verify`, and checks whether the package version is already on npm.
   - If the version is new, publishes `pkg/` to npm using the `NPM_TOKEN` secret.
   - If the version already exists, it skips publishing.

## Manual release workflow (fallback)

If you need to publish a version manually:

```bash
# Update upstream to a specific release
cd upstream
git fetch
git checkout vX.Y.Z
cd ..

# Build and verify
npm run build
npm run verify

# Publish
npm run publish-plugin
```

## Packaging-only fixes

If the wrapper itself needs a fix independent of an upstream release (e.g., a packaging bug), use a qualifier so the base upstream version stays clear:

```bash
PLUGIN_VERSION=1.1.0-omp.1 npm run build
npm run publish-plugin
```

The qualifier resets on each upstream release. See `CONTEXT.md` for the domain glossary.

## Secrets

- `NPM_TOKEN`: GitHub repository secret. An npm automation/granular token with publish access to `mattpocock-skills-unofficial-plugin`. Stored in the repo's Actions secrets.

## Conventions and gotchas

- Never edit the upstream manifest (`upstream/.claude-plugin/plugin.json`) or skill files. This repo is a distribution, not a transformation.
- `pkg/` is generated and gitignored. Do not commit it.
- The published package version comes from `upstream/package.json`, not the root `package.json`.
- The root `package.json` is a dev wrapper and is not published.
- Publishing requires 2FA via the npm automation token in CI; local publishing requires an interactive OTP.
- Merging a PR created by `check-upstream.yml` will trigger `publish.yml`, because the merge is done by a human account (not the GitHub Actions bot).

## How to test the package from npm without installing

```bash
npm view mattpocock-skills-unofficial-plugin
omp install --dry-run mattpocock-skills-unofficial-plugin
```

## Maintainer

[xloouis](https://github.com/xloouis) — unofficial community distribution, not affiliated with Matt Pocock.
