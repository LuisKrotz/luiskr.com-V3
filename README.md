# luiskr.com V3

Personal portfolio of Luis Krötz — strict TypeScript custom elements with
Shadow DOM, a custom JSX runtime, Firebase Realtime Database as CMS backend,
Three.js WebGPU/WebGL visuals, and a multi-tier ES build (es2016 → esnext).

**Documentation lives in [`shared/docs/`](shared/docs/README.md)** — architecture,
routing, i18n, CMS, playground, styling governance, build and testing guides.

The repo is organized as workspace modules (plain folders, not git
submodules): `shared/` (app shell + tooling), `core/`, `website/`, `cms/`,
`experiments/<name>/`, and `shared/local-modules/` (security-hardened dependency
replacements). Each module has its own configs and `tests/` suite;
`node shared/scripts/scaffold/new-experiment.mjs <name>` scaffolds a new
experiment that self-registers for tests and coverage.

Quick start:

```bash
yarn install && yarn hooks:install
yarn dev        # public site
yarn dev:cms    # CMS with Firebase mock
yarn verify                       # full quality gate, including 100% coverage
yarn build                        # production build (verifies first)
yarn build --verify-lighthouse    # build, then run the post-build Lighthouse audit
```

License: [MPL-2.0](LICENSE)
