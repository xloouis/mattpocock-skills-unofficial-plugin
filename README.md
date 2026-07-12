# mattpocock-skills-unofficial-plugin

An **unofficial community distribution** of [mattpocock/skills](https://github.com/mattpocock/skills) packaged as an [OMP](https://omp.sh)-compatible plugin.

This repo is maintained by [xloouis](https://github.com/xloouis) and is not affiliated with Matt Pocock. The skill content is copied verbatim from upstream; only the npm packaging metadata is added.

Published package: [mattpocock-skills-unofficial-plugin on npm](https://www.npmjs.com/package/mattpocock-skills-unofficial-plugin)

## Install

Install from the OMP marketplace / npm registry:

```bash
omp install mattpocock-skills-unofficial-plugin
```

For a project-scoped install:

```bash
omp install mattpocock-skills-unofficial-plugin --scope=project
```

## Build

```bash
npm run build
```

This produces the publishable package in `pkg/`.

## Publish

```bash
npm run publish-plugin
```

This rebuilds `pkg/` and runs `npm publish pkg/`.

## Upgrading when upstream releases a new version

1. Update the submodule to the new tag:
   ```bash
   cd upstream
   git fetch
   git checkout vX.Y.Z
   cd ..
   ```
2. Rebuild the package:
   ```bash
   npm run build
   ```
3. If the wrapper itself needs a version bump independent of upstream (e.g., a packaging fix), run:
   ```bash
   PLUGIN_VERSION=1.1.0-omp.1 npm run build
   ```
   Otherwise the build script uses the upstream version automatically.
4. Publish:
   ```bash
   npm run publish-plugin
   ```

## License

MIT. See [upstream LICENSE](./upstream/LICENSE).
