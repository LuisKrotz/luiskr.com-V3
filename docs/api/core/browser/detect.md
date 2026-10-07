# `core/browser/detect.ts`

Single source of truth for engine identification. The same

| | |
|---|---|
| **Source** | `src/core/browser/detect.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### (module scope)

Resolved engine identity — name, marketing major version, quirks.

### `OTHER`

The loader-free identity when nothing is known about the UA.

### `detectBrowser`

Parses a UA string against BROWSERS. Regex `pattern` strings keep their
escaped form so the same table survives JSON serialization into the
inlined `__LK` manifest.

### `browserInfo`

Runtime reader — returns the loader-stamped `window.__LK_BROWSER` when
present (public site path), otherwise parses `navigator.userAgent`.
Outside a windowed context (SSR/tests without DOM) returns `other`.

### `canUseWebGPU`

True when the engine may expose a usable WebGPU adapter.
