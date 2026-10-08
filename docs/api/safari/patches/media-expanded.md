# `safari/patches/media-expanded.ts`

MediaExpanded patch: explicit touchend close on every close target

| | |
|---|---|
| **Source** | `core/safari/patches/media-expanded.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `patchMediaExpanded`

Installs the MediaExpanded patch once the element registers: wraps
`onMounted` to (a) bind click + touchend on every close target —
iOS click synthesis on fixed overlays is unreliable, so touchend with
preventDefault drives the close directly — (b) assign the full-res
`src` straight onto the expanded img (no lazy ladder inside the modal),
and (c) force expanded videos muted/playsinline + play() so autoplay
survives Safari's gesture policy.
