# Domain Context

## Glossary

- **Distribution**: A repackaging of upstream content under a new distribution channel without changing the content itself. The npm package is a distribution of the upstream skills; the skill files, manifest, and license are unchanged.
- **Upstream**: The source repository that owns the skill definitions, plugin manifest, and license.
- **Package**: The npm-publishable artifact produced by the build step. It contains only the files needed for OMP to install the plugin.
- **Version**: The upstream version that the package tracks. The base upstream version is preserved in the package version.
- **Packaging qualifier**: A suffix appended to the upstream version for distribution-only fixes (e.g., `1.1.0-omp.1`). It is reset when upstream releases a new version.
- **Version override**: The full version string can be overridden at build time via the `PLUGIN_VERSION` environment variable, including the packaging qualifier (e.g., `PLUGIN_VERSION=1.1.0-omp.1`).
- **Publisher**: The person or organization packaging and publishing the distribution (e.g., `https://github.com/xloouis`). The publisher is distinct from upstream.
- **Unofficial distribution**: A distribution that is not maintained by upstream. The package and documentation must clearly state this status so users do not confuse it with an official release.
