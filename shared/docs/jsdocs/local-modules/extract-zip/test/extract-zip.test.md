# `local-modules/extract-zip/test/extract-zip.test.js`

| | |
|---|---|
| **Source** | `src/local-modules/extract-zip/test/extract-zip.test.js` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `makeZip`

Builds a minimal valid ZIP buffer from [{name, data, mode?}] entries —
local headers + central directory + EOCD, deflate compression. A real
fixture keeps the test honest about on-disk parsing.
