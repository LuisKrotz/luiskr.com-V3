# `components/home/mosaic/layout.ts`

| | |
|---|---|
| **Source** | `src/components/home/mosaic/layout.ts` |
| **UX surface** | Shadow-DOM widgets — the visible UI of the public site. |

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
