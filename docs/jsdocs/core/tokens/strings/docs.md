# `core/tokens/strings/docs.ts`

Docs-portal string tokens — English-only UI literals, the

| | |
|---|---|
| **Source** | `src/core/tokens/strings/docs.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `DOCS_STRINGS`

Frozen docs string map — sole declaration site for these tokens;
consumers read members and never re-declare the strings
(zero-hardcoding rules 4–5). Object.freeze makes the token contract
immutable at runtime.

### `TITLE`

Page + footer link title — English-only by product spec.

### `DESC_FALLBACK`

English fallback for the CMS-provided description + toast copy.

### `CMS_COMPONENT`

database.json component node: translations/<locale>/components/<key>.

### `ASSET_BASE`

URL prefix under which rendered file payloads are served/emitted.

### `ASSET_EXT`

JSON suffix appended to every emitted content payload.

### `CRUMB_INPUT_LABEL`

Accessibility labels for the editable breadcrumb + copy feedback.

### `KEY_PRINT_SCREEN`

Keyboard key the print-screen guard reacts to.

### `CRUMB_PLACEHOLDER`

Editable-breadcrumb input fallback when the URL path can't resolve.

### `SRC_ROOT`

Root-bucket folder exempt from index-file auto-open (source tree).

### `INDEX_FILE`

Index filename that auto-opens when its folder is entered.

### `EVENT_COPY_ATTEMPT`

Analytics event name for copy-guard attempts.

### `SCHEMA_DESCRIPTION`

JSON-LD description for the portal root/folder pages.

### `DOCS_UNITS`

Unit tokens used by docs layout/scene math.

### `FOLDER_HASH_MOD`

deterministic folder-art hash modulus

### `TAP_SLOP_PX`

tap-vs-drag pick slop in px — taps move < this many CSS px

### `LABEL_W`

label sprite canvas box (px) and font size (px)

### `LABEL_SCALE_X`

world-space sprite size + lift above the node sphere

### `LABEL_REVEAL_BASE`

zoom reveal: labels fade in when controls distance drops under
 (LABEL_REVEAL_BASE − depth·LABEL_DEPTH_STEP), over LABEL_FADE px

### `SCENE_BASE_RADIUS`

radial-tree geometry shared with the wasm worker op

### `SCENE_ROTATE_SPEED`

slow backdrop motion — autorotate deg/frame-ish + node pulse

### `SCENE_DIR_OPACITY`

node/edge alpha — kept faint so the graph stays a backdrop layer
