# `core/browser/detect.ts`

Single source of truth for engine identification. The same

| | |
|---|---|
| **Source** | `src/core/browser/detect.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### (module scope)

BrowserQuirks re-export — canonical definition + docs live in ./browsers.js.

### (module scope)

Resolved engine identity — name, marketing major version, quirks.

### `OTHER`

The loader-free identity when nothing is known about the UA.

### `detectBrowser`

Parses a UA string against BROWSERS. Regex `pattern` strings keep their
escaped form so the same table survives JSON serialization into the
inlined `__LK` manifest. The loop walks the ordered table and returns on
first match — order is load-bearing (see browsers.ts header).
- `@param` ua User-Agent string to classify.
- `@returns` Engine identity; `other/0` when no pattern matches.

### `browserInfo`

Runtime reader — returns the loader-stamped `window.__LK_BROWSER` when
present (public site path), otherwise parses `navigator.userAgent`.
Outside a windowed context (SSR/tests without DOM) returns `other`.
Preferring the stamped value keeps the runtime consistent with whichever
build tier the ES5 loader already selected — re-parsing the same UA could
disagree if the tables ever diverged.
- `@returns` Resolved engine identity.

### `canUseWebGPU`

True when the engine may expose a usable WebGPU adapter. The check is
`!== false` (not `=== true`) because undefined means "no data" — absence
of the quirk flag must not disable WebGPU for unlisted engines.
- `@returns` Whether the WebGPU init path should run.
