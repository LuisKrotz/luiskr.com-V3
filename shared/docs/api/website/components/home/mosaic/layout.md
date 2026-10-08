# `website/components/home/mosaic/layout.ts`

| | |
|---|---|
| **Source** | `src/website/components/home/mosaic/layout.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `PROVISIONAL_BOTTOM_H`

Details-panel height used while the real measurement is pending.

### `bottomHFor`

Expanded-card bottom height callback shared by both packing passes.

### `scheduleLayout`

Debounced re-layout (resize/data changes).

### `quickLayout`

Synchronous layout pass for urgent repaints. Same packing math as
layout() but skips the WASM round-trip so the DOM never waits on a
worker. See layout() for the packing geometry notes.

### `layout`

Full masonry pass: measures, assigns columns, positions cards via WASM math.

### `applyCardStyles`

Writes computed card positions/sizes into DOM styles.
