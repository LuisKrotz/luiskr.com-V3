# Website (website/views + website/components)

The public portfolio: `main.ts` → `App.tsx` (`<app-shell>`) → router-mounted
views → shadow-DOM components.

## Components

Each component is a `BaseComponent` subclass:

```js
export class HomeMosaic extends BaseComponent {
  constructor() { super(homeMosaicStyles) }   // ?inline SCSS → shadow <style>
  render() { return h('section', { class: CLASSES.MOSAIC }, …) }
}
customElements.define('home-mosaic', HomeMosaic)
```

Shadow DOM gives style isolation; every stylesheet still shares the token layer
via CSS custom properties defined on `:root` in `sass/base/_structure.scss`.

| Component                                                    | Purpose                                            | UX notes                                                                                                                                                 |
| ------------------------------------------------------------ | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AppNav`                                                     | Fixed nav: logo, links, lang/prefs buttons, burger | `nav--on-dark` flips ink color over dark sections; burger/menu backdrop are WebGL canvases with CSS fallback                                             |
| `DrawText`                                                   | Splits text into animated char spans               | Spaces inside links emit bare NBSP text nodes (axe `label-content-name-mismatch` fix)                                                                    |
| `HomeMosaic`                                                 | Featured/grid project tiles                        | First 2 tiles eager+high-priority (`EAGER_COUNT`) so LCP isn't lazy-loaded                                                                               |
| `AwardsCarousel`                                             | Horizontal project reel                            | `.aw-c-dot` hit targets are 24px buttons with an 8px `::before` dot                                                                                      |
| `CustomCarousel`                                             | Generic media carousel                             | WebGL arrow controls via `carousel-controls.ts`                                                                                                          |
| `MediaFigure`                                                | Image/video renderer                               | Builds CDN URLs: `src + -mozjpg3-MSSIM-tuned-kodak.jpg` or `.mp4` variants                                                                               |
| `MediaExpanded`                                              | Fullscreen media modal                             | WebGL close button                                                                                                                                       |
| `LangDialog`                                                 | Language switcher                                  | Rewrites path via `routeSlugs(newLang)`                                                                                                                  |
| `PreferencesModal`                                           | Theme/motion/HUD prefs                             | WebGL theme slider + switches                                                                                                                            |
| `StatsHud`                                                   | Perf overlay                                       | All labels from `APP.statsHud` via `appText(UI_KEYS.STATS_*)`                                                                                            |
| `CookieBanner`                                               | Consent bar                                        | Renders sanitized message HTML                                                                                                                           |
| `SiteToast`                                                  | In-page notification stack (notify() fallback)     | Bottom-right column on desktop, full-width safe-area bar on mobile; `role=alert`/`status` per type, reduced-motion safe                                  |
| `Skeleton`                                                   | Placeholder tiles                                  | Theme-aware shimmer; see below                                                                                                                           |
| `portfolio/*`                                                | Related footer, source-code links                  | `Related.tsx` reads `components/related`; the disclaimer note is a justified one-line-clamped `<button>` (`aria-expanded`) that expands on click/Enter   |
| `legal/*`                                                    | Legal doc footer nav                               | reads `components/legal-footer` link list (`page`/`link` fields)                                                                                         |
| `home/*`, `AboutSection`, `ContactSection`, `AwardsMentions` | Home sections                                      | fully DB-driven copy; About's extended bio (`col2`) is an always-visible "side info" column — secondary ink + hairline separator, no collapsible control |

## Skeletons

`BaseComponent` renders skeleton placeholders before data resolves:

```
.skeleton--*  (CSS shimmer, always present)
+ .skeleton-layer canvas  (WebGL "decoding" effect, added when GL available)
```

- Geometry mirrors real layout tokens (`--mf-w`, mosaic grid, carousel items)
  so the swap is layout-stable.
- Colors derive from theme tokens; dark sections get `%SKEL_DARK_SURFACE`
  overrides so tiles lift off the local background.
- `resolve()` crossfades: the layer drops behind the incoming content
  (`--resolving` + host `isolation`) and dissolves while `.skeleton-content-in`
  fades real markup in — no hard cut and no stale boxes over real data.
- The WebGL layer clips measured rects to the host box (no bleed into
  siblings), caches per-placeholder computed styles (cleared on theme flip),
  and re-syncs its ResizeObserver to rebuilt nodes so geometry tracks the
  real layout as data lands — then **destroys its GL context** on resolve.

## Dialogs

`LangDialog` / `PreferencesModal` / `MediaExpanded` layer above the open menu
(menu canvas keeps animating behind a lighter blur) and zoom from their trigger
("genie" transition). Close controls use `close-button.ts` — WebGL X with an
`is-fallback` CSS path when GL fails.

## Dark-mode nav

`AppNav` tracks `onBottom || activeSection === CONTACT` → `nav--on-dark`;
links flip to `--grey-2`, active to white, and the burger canvas re-reads the
class to draw bright strokes over the dark contact/footer sections.

## Debug URL parameters

Boot-time `?debug=` flags (handled by `core/debug/params.ts`):

- `?debug=sendNotificationTest` — fires the `notify()` pipeline once with a
  real toast, so the notification surface is verifiable end-to-end in a live
  build (also exercised by `tests/core/platform/debug-params.test.js`).
- `?debug=webGLMode:active` — explicit WebGL on; documents intent but does not
  bypass failure probing (a broken GL still falls back).
- `?debug=webGLMode:fallback` — forces every `webglContext()` acquisition to
  fail → all canvas widgets take the CSS/2D fallback path. Useful for QA of
  the no-WebGL experience without disabling the GPU in the browser.

All WebGL `getContext` calls funnel through `core/utils/canvas/webgl-mode.ts`,
so the flag is authoritative — code must never call `canvas.getContext('webgl…')`
directly.
