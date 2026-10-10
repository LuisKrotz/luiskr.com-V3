# luiskr.com V3

Personal portfolio of Luis Krötz — strict TypeScript custom elements with
Shadow DOM, a custom JSX runtime, Firebase Realtime Database as CMS backend,
Three.js WebGPU/WebGL visuals, and a multi-tier ES build (es2016 → esnext).

**Documentation lives in [`shared/docs/`](shared/docs/README.md)** — architecture,
routing, i18n, CMS, playground, styling governance, build and testing guides.

The repo is organized as git submodules, each in its own repository with
its own history: `shared/` (app shell + tooling), `core/`, `website/`, `cms/`,
`experiments/docs`, and `experiments/earth-playground`. The superproject
orchestrates them as yarn workspaces — every module also builds, tests, and
runs standalone from its own folder. `shared/local-modules/` holds
security-hardened dependency replacements, and
`node shared/scripts/scaffold/new-experiment.mjs <name>` scaffolds a new
experiment that self-registers for tests and coverage.

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
