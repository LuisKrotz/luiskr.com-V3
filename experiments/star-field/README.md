# luiskr.com V3 — star-field

Three.js star-field exploration experiment — the Solar System plus notable
Milky Way and Local-Group objects (Alpha/Proxima Centauri, Sirius, Vega,
Betelgeuse, TRAPPIST-1, Sagittarius A*, Orion/Eagle/Crab/Helix nebulae, the
Milky Way, Andromeda, Triangulum), each backed by a lazily-loaded JSON
dossier of facts and deep-history notes from NASA/JPL, ESA, ESO and the IAU.

Route: `/star-field-experiment` (canonical) with per-locale slugs for all
16 supported locales; reachable from the hamburger menu.

Submodule of [luiskr.com-V3](https://github.com/LuisKrotz/luiskr.com-V3).
Install deps from the superproject (`yarn install` at the root), then run
`yarn dev` / `yarn test` / `yarn build` in this folder — see `package.json`
scripts.

## Layout

| Path                  | Role                                                                |
| --------------------- | ------------------------------------------------------------------- |
| `StarField.tsx`       | Custom element facade — loader, drawer, dossier panel, keydown      |
| `starfield-engine.ts` | `StarFieldEngine` — state bag + public API (init/select/screenshot) |
| `star/`               | Component layer: `boot`, `render`, `i18n`, `dossier`                |
| `engine/`             | three.js layer: `bootstrap`, `renderer-setup`, `scene`,             |
|                       | `bodies-scene`, `frame`, `fly`, `picking`, `screenshot`, `state`,   |
|                       | `catalog`, `types`                                                  |
| `public/textures/`    | Planet/skybox textures (Solar System Scope CC-BY set)               |
| `public/data/*.json`  | Per-body dossiers — fetched on approach/selection, cached           |
| `tests/`              | Jest suites + `tests/coverage/starfield/**` tails — 100% gate       |

## Data model

`engine/catalog.ts` is the sole body catalog (positions, radii, orbits,
material recipes, groups). `public/data/<id>.json` ships the display
dossier (`name`, `kind`, `tagline`, `facts[]`, `history`, `source`) — one
file per body so the viewer only downloads facts when the camera
approaches or a body is selected. `star/dossier.ts` dedupes in-flight and
resolved fetches in one shared cache.

## Accessibility

One real `<button>` per body in the navigator drawer (full keyboard
coverage), Escape dismisses the dossier panel first then the drawer,
hover/selection announce through an `aria-live` region, and
`prefers-reduced-motion` pauses the render loop. Pointer events unify
mouse/touch/pen.

## Assets

- Planet/moon/sun maps + Saturn ring: Solar System Scope texture set,
  [CC-BY 4.0](https://www.solarsystemscope.com/textures/).
- Milky Way skybox: 8k equirect star panorama (same set).
- Dossier facts/history paraphrased from NASA/JPL Solar System
  Exploration, ESA, ESO and IAU publications — each JSON names its source.

License: [MPL-2.0](https://github.com/LuisKrotz/luiskr.com-V3/blob/development/LICENSE)
