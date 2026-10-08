# `shared/src/app/view.ts`

View outlet reconciliation for AppRoot — same-tag routes delegate to onRouteParamChange; new views lazy-import their chunk then cross-fade (instant under reduced motion).

| | |
|---|---|
| **Source** | `src/shared/src/app/view.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `updateAppViewContent`

Route-change reconciliation for the view outlet: when the target view
tag equals the mounted one (and the element is actually defined), the
view is kept alive and told about the new route via onRouteParamChange —
project→project navigation must not tear down GL state. A tag change
delegates to _flipToView for the swap.
- `@param` c The AppRoot element.
- `@param` to Destination descriptor (falls back to router.currentRoute).
- `@param` _from Origin descriptor — unused, kept for listener parity.

### (module scope)

View swap: lazy-imports the target view's chunk (each import is in its
own branch so bundlers keep per-route code-splitting), then either
instant-replaces the outlet (reduced motion / empty outlet) or plays
the two-leg cross-fade — fade-out for PAGE_FADE_HALF, then mount the
incoming view with a fade-in class removed on the next frame.
`_sectionsMeasured` resets so the new view's sections re-measure lazily.
- `@param` c The AppRoot element.
- `@param` outlet The #view-outlet element.
- `@param` _to Destination descriptor — the tag is read from c.currentViewTag.
