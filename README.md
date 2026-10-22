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

## Prerequisites

Everything below is installed or verified by **one command** — `yarn setup` —
which detects the platform (`darwin`/`linux`/`win32`, `x64`/`arm64`) and
picks the right package manager (brew / winget / choco / apt / dnf /
pacman / zypper / apk). Only Node, Yarn, and Git are needed beforehand.

| Tool                                                         | Why                                                                    | Install                                                                                                                                                        |
| ------------------------------------------------------------ | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Git** ≥ 2.34                                               | submodules + versioned hooks                                           | `brew install git` · `winget install -e --id Git.Git` · `apt install git`                                                                                      |
| **Node.js** ≥ 24                                             | runtime + build (`engines.node`)                                       | via **nvm** — see below                                                                                                                                        |
| **Yarn** 1.22.x                                              | the only package manager                                               | `corepack enable && corepack prepare yarn@1.22.22 --activate`                                                                                                  |
| **firebase-tools**                                           | `yarn deploy`, RTDB scripts                                            | `yarn global add firebase-tools` (auto via `yarn setup`)                                                                                                       |
| **Google Cloud SDK** (`gcloud`, `gsutil`)                    | media upload/size scripts                                              | `brew install --cask google-cloud-sdk` · `winget install -e --id Google.CloudSDK` · [linux](https://cloud.google.com/sdk/docs/install) (auto via `yarn setup`) |
| **ffmpeg** + **ffprobe**                                     | CMS media conversion                                                   | `brew install ffmpeg` · `winget install -e --id Gyan.FFmpeg` · `apt install ffmpeg`                                                                            |
| **ImageMagick** (`magick`/`convert`)                         | CMS image conversion (optional)                                        | `brew install imagemagick` · `winget install -e --id ImageMagick.ImageMagick` · `apt install imagemagick`                                                      |
| **mozjpeg** (`cjpeg`)                                        | sharper JPEG re-encode (optional)                                      | `brew install mozjpeg` · `apt install libjpeg-turbo-progs` · Windows: `npm install -g mozjpeg` (no winget/choco package)                                       |
| **C/C++ toolchain**                                          | native deps (`sharp`, `electron`…)                                     | Xcode CLT · `apt install build-essential` · VS Build Tools                                                                                                     |
| **Rust** (`rustup` + `wasm32-unknown-unknown` + `wasm-pack`) | rebuild `rust/*/` crates — **optional**, prebuilt wasm ships in `pkg/` | `curl https://sh.rustup.rs -sSf \| sh` then `rustup target add wasm32-unknown-unknown && cargo install wasm-pack`                                              |

### Install nvm (all platforms)

- **macOS / Linux** (Intel, Apple Silicon, ARM64):
  `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | zsh`,
  then `nvm install` — the repo's `.nvmrc` pins Node 24.
- **Windows** (x64 + ARM64): install **nvm-windows** —
  `winget install -e --id CoreyButler.NVMforWindows` or the
  [GitHub installer](https://github.com/coreybutler/nvm-windows/releases) —
  then `nvm install 24` + `nvm use 24` in PowerShell.

> **Windows note:** run `git config --global core.longpaths true` **before**
> cloning — tracked prerendered paths reach ~240 chars against the 260-char
> `MAX_PATH` limit, so a default checkout fails with `invalid path` /
> `Filename too long`. `yarn setup` also sets it repo-locally afterwards.

## Quick start

```bash
git clone --recurse-submodules git@github.com:LuisKrotz/luiskr.com-V3.git
cd luiskr.com-V3
yarn setup      # ONE command: submodules + deps + hooks + all toolchains
yarn dev        # public site + CMS against real Firebase
```

```bash
yarn dev:cms    # CMS with the explicit Firebase mock (no production data)
yarn verify                       # full quality gate, including 100% coverage
yarn build                        # production build (verifies first)
yarn build --verify-lighthouse    # build, then run the post-build Lighthouse audit
yarn desktop:dev                  # open the built site in an Electron window
yarn desktop:build                # per-OS installers → release/ (dmg/nsis/AppImage)
yarn setup:gui                    # open a setup/run/build GUI in an Electron window
```

`yarn setup` replaces the old `yarn install && yarn hooks:install` pair —
it verifies Node ≥ 24 / yarn / git, initialises submodules, installs
dependencies, copies the versioned hooks via
`shared/scripts/install-hooks.mjs`, then installs firebase-tools
(`yarn global`), the Google Cloud SDK, and the media-convert toolchain
(ffmpeg/ImageMagick/mozjpeg) using the platform's package manager —
brew/winget/choco run unattended; linux `sudo` installs run automatically
when sudo is passwordless, otherwise the exact command is printed.
`yarn setup --check` is report-only. The same probe powers the CMS media
converter's guided setup panel on localhost —
`GET/POST /api/media-convert/tools*`.

License: [MPL-2.0](LICENSE)
