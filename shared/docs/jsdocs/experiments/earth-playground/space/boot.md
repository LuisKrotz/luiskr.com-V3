# `experiments/earth-playground/space/boot.ts`

Earth engine bootstrap for SpacePlayground — creates the

| | |
|---|---|
| **Source** | `src/experiments/earth-playground/space/boot.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `updateSpaceLoader`

Mirrors an engine progress event into the loader overlay — message,
rounded percent text, and the bar's width style. All three nodes are
optional-chained so a partial loader render can't throw mid-boot.
- `@param` c The SpacePlayground element.
- `@param` msg Stage message from the engine ('loading textures', …).
- `@param` pct Progress 0–100.

### `initSpaceEarth`

Constructs the EarthBackground engine on the persistent canvas and
wires its lifecycle: progress → loader overlay, ready → apply persisted
settings + reduced-motion flag + dismiss. The `_isInitializingEarth`
latch prevents double-init while init() is still awaiting. A failed
init still marks `_earthReady` and dismisses the loader so the page
isn't stuck behind a broken overlay.
- `@param` c The SpacePlayground element.

### `dismissSpaceLoader`

Fades the loader overlay to transparent, then removes it after the CSS
transition completes — removing earlier would clip the fade, removing
never would leave an invisible overlay intercepting pointer events.
- `@param` c The SpacePlayground element.

### `applyPersistedSettings`

Replays the persisted settings object onto the live engine and panel:
each saved param runs through PARAM_HANDLERS (the same dispatch live
edits use), then the matching DOM input's value/checked + slider
track-fill + row label are synced so the panel reflects restored state.
- `@param` c The SpacePlayground element.
