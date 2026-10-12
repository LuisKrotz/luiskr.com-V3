# luiskr.com V3

Personal portfolio of Luis Krötz — strict TypeScript custom elements with
Shadow DOM, a custom JSX runtime, Firebase Realtime Database as CMS backend,
Three.js WebGPU/WebGL visuals, and a multi-tier ES build (es2016 → esnext).

**Documentation lives in [`shared/docs/`](shared/docs/README.md)** — architecture,
routing, i18n, CMS, playground, styling governance, build and testing guides.
A detailed per-platform setup guide (Debian, RHEL, macOS/Apple Silicon,
Windows/ARM64) is in [`shared/docs/guides/setup.md`](shared/docs/guides/setup.md).

The repo is organized as git submodules, each in its own repository with
its own history. The superproject orchestrates them as yarn workspaces —
every module also builds, tests, and runs standalone from its own folder.
`shared/local-modules/` holds security-hardened dependency replacements,
and `node shared/scripts/scaffold/new-experiment.mjs <name>` scaffolds a
new experiment that self-registers for tests and coverage.

## The modules

| Module                         | What it is                                                                                                                                    | Read                                                                               |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `shared/`                      | **The operation** — app shell (`<app-root>`), workspace orchestrator, build matrix (es2016→esnext), verify/test/docs pipelines, vendored deps | [`shared/README.md`](shared/README.md)                                             |
| `core/`                        | **The platform** — JSX runtime, component base, store, router, tokens, i18n, WebGL widgets, WASM pool                                         | [`core/README.md`](core/README.md)                                                 |
| `website/`                     | **The public site** — home/project/legal/404 views + every component (nav, dialogs, mosaic, media, carousels, effects)                        | [`website/README.md`](website/README.md)                                           |
| `cms/`                         | **The admin** — Firebase-backed editors for every content node, localhost media converter, deploy-info viewer                                 | [`cms/README.md`](cms/README.md)                                                   |
| `experiments/docs`             | **The docs portal** — `<view-docs>`: browsable docs/reports/coverage/source through a lazy manifest                                           | [`experiments/docs/README.md`](experiments/docs/README.md)                         |
| `experiments/earth-playground` | **Earth Playground** — WebGPU Earth with atmosphere, moon, post chain, live control panel                                                     | [`experiments/earth-playground/README.md`](experiments/earth-playground/README.md) |
| `experiments/star-field`       | **Star Field** — the voyage from the Solar System to the observable universe: 134 bodies + 139k-record catalog                                | [`experiments/star-field/README.md`](experiments/star-field/README.md)             |
| `desktop/`                     | Electron shell — opens the built site in a desktop window; per-OS installers                                                                  | [`desktop/README.md`](desktop/README.md)                                           |

Curated architecture, routing, i18n, CMS, styling, build and testing guides
live in [`shared/docs/`](shared/docs/README.md); generated per-file API
documentation is produced by `shared/scripts/docs/gen-docs.mjs` into
`shared/docs/api/` and browsed through the docs portal.

Quick start:

```bash
git clone --recurse-submodules git@github.com:LuisKrotz/luiskr.com-V3.git
# or, in an existing clone: git submodule update --init
yarn setup      # guided installer: deps + git hooks + toolchain check (cross-platform)
yarn dev        # public site + CMS against real Firebase
yarn dev:cms    # CMS with the explicit Firebase mock (no production data)
yarn verify                       # full quality gate, including 100% coverage
yarn build                        # production build (verifies first)
yarn build --verify-lighthouse    # build, then run the post-build Lighthouse audit
yarn desktop:dev                  # open the built site in an Electron window
yarn desktop:build                # per-OS installers → release/ (dmg/nsis/AppImage)
yarn setup:gui                    # open a setup/run/build GUI in an Electron window
```

`yarn setup` replaces the old `yarn install && yarn hooks:install` pair —
it verifies Node ≥ 24 / yarn / git, installs dependencies, copies the
versioned hooks via `shared/scripts/install-hooks.mjs` (Node — runs on
Windows too, unlike the old zsh script), then probes the media-convert
toolchain (ffmpeg/ImageMagick/mozjpeg) and prints the exact install
command for your platform. `yarn setup --check` is report-only. The same
probe powers the CMS media converter's guided setup panel on localhost —
`GET/POST /api/media-convert/tools*` detects the package manager and can
run the install (or show the sudo command to paste).

License: [MPL-2.0](LICENSE)
