# luiskr.com V3

Personal portfolio of Luis Krötz — strict TypeScript custom elements with
Shadow DOM, a custom JSX runtime, Firebase Realtime Database as CMS backend,
Three.js WebGPU/WebGL visuals, and a multi-tier ES build (es2016 → esnext).

**Documentation lives in [`docs/`](docs/README.md)** — architecture, routing,
i18n, CMS, playground, styling governance, build and testing guides.

Quick start:

```bash
yarn install && yarn hooks:install
yarn dev        # public site
yarn dev:cms    # CMS with Firebase mock
yarn verify     # full quality gate
yarn build      # production build (verifies first)
```

License: [MPL-2.0](docs/LICENSE)
