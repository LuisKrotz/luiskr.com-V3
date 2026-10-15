---
name: perf-network-delivery
description: Network-layer performance — critical-path depth, lazy/deferred code delivery, per-route chunking, preconnect hints, cache TTLs, and squeezing maximum throughput out of Firebase Hosting + Google Cloud Storage.
---

# Network & Delivery Performance

The site is a Firebase Hosting SPA behind a CDN with prerendered locale HTML and 12 browser targets (esnext → es2016). All optimization must work inside that topology — Firebase + Google Cloud Storage only, no third-party edge logic.

## Critical path discipline

- Keep the **maximum critical path latency** down by flattening request chains: HTML → CSS → entry JS → route chunk → data. Anything after 3 hops is lazy.
- Route chunks load on demand; **route warming** (`core/utils/motion/route-warmer.ts`) and the **predictive loader** (`core/predictive-loader.ts`) prefetch _ahead_ of navigation but must never compete with the current gesture — schedule on `requestIdleCallback`, never on timers during load.
- Code is already split per-route and per-component. Keep modules small and cohesive — a chunk should map to a view or a feature, not a grab-bag. When adding a feature, extend an existing lazy chunk or create a new one; never inflate the entry bundle.

## Lazy & deferred loading

- Non-critical work defers to idle: translations beyond the active page, secondary carousels, dialog code (`LangDialog`, `PreferencesModal`), stats HUD, legal/project internals.
- Media: progressive loading via `media-figure`; images decode off the critical path (`wasm-image-decoder`). Decorative/backdrop imagery must stay lazy (`loading="lazy"`, IO-gated mounts) — dozens of hidden backdrops are decode surface, not free.
- Below-fold components mount on `IntersectionObserver` (polyfill: `core/legacy-polyfills/io.ts`), never on scroll handlers or timers.

## Origin hints & caching

- `<link rel="preconnect">` is reserved for origins that serve render-path resources: `storage.googleapis.com` (media), `luiskr-com.firebaseio.com` (translations), `fonts.gstatic.com`. Max ~4 — each costs a socket. `dns-prefetch` for anything weaker. Never preconnect origins only used post-interaction.
- Hashed assets under `/v/**` and `/assets/**` get `immutable, max-age=31536000` in `firebase.json` — content-hashed filenames make year-long caching safe. Unversioned URLs (`/`, `robots.txt`, meta files) use short `max-age` (3600).
- Static content must never ship under a changing URL and vice versa — audit `firebase.json` headers when adding a file class.

## Google Cloud Storage (media origin)

- Media lives on `storage.googleapis.com/luiskr.com/public/_v3/`. Large cover images dominate transfer (Lighthouse flagged ~1.7 MB on home). Prefer modern formats (AVIF/WebP), sized derivatives (`size=` params already used for avatars), and `loading="lazy"` + `decoding="async"`.
- GCS object cache TTLs are bucket/object metadata — audit `Cache-Control` on upload tooling; 1h TTLs on multi-hundred-KiB covers waste repeat-visit bandwidth.

## Render-blocking

- CSS: one critical stylesheet in `<head>`; everything else stays non-blocking. JS: module scripts are deferred by nature — never add a synchronous `<script>` or render-blocking resource to `index.html`.
- Fonts: `display=swap` is mandatory; font CSS may render-block only if it gates first paint text.

## HTTP/3 & transport

- Firebase Hosting serves HTTP/2 + HTTP/3 (QUIC) automatically — small parallel chunks multiplex efficiently; there is no HTTP/1.1-style "concatenate everything" pressure here. Favor many small lazy chunks over few large ones _when they load at different times_ — but never chunk for its own sake on the critical path.
- Compression: dist ships `.br`/`.gz` siblings; keep them in sync when hand-editing generated files.
