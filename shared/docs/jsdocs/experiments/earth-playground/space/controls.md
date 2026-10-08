# `experiments/earth-playground/space/controls.ts`

Control schema + persistence for &lt;view-space-playground&gt;,

| | |
|---|---|
| **Source** | `src/experiments/earth-playground/space/controls.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `SP_DEFAULTS`

Build-time English copy for the earth-playground panel — CMS
translations merge over this node at runtime so the UI never renders
empty labels before locale data resolves.

### `_R`

Input-type aliases — keep the schema rows terse.

### `_C`

Checkbox input-type alias for the schema rows.

### (module scope)

One row in a panel group — a slider or a WebGL checkbox.

### `label`

Translation key for the row's label (and the CMS defaults-map key).

### `param`

SP_PARAMS token — persisted-settings key + data-param attribute.

### `type`

'range' slider | 'checkbox' WebGL twin.

### (module scope)

Slider minimum (range only).

### (module scope)

Slider maximum (range only).

### (module scope)

Slider step granularity (range only).

### (module scope)

Shipped numeric default — CMS defaults and saved values override it.

### (module scope)

Shipped checkbox state — same precedence as `def`.

### (module scope)

A group-level action button (reset view, screenshot, copy settings).

### `label`

Translation key for the button label.

### `action`

SP_ACTIONS token dispatched on click.

### (module scope)

Initial aria-pressed state for toggle-style actions.

### (module scope)

One collapsible panel section.

### `label`

Translation key for the group header.

### `collapsed`

Whether the group starts folded.

### `controls`

The group's input rows.

### (module scope)

Optional buttons rendered under the controls.

### (module scope)

A persistable control value — sliders are numeric, checkboxes boolean.

### (module scope)

Persisted settings blob shape: param → value.

### `SP_INPUT_TYPES`

Input-type discriminator shared with the panel renderer/binder.

### `SLIDER_GROUPS`

Declarative control schema — the panel renders straight from this so a
new engine knob needs no JSX change. Per control:
  label   translation key looked up in the earth-playground node (and
          the key used by the CMS `defaults` map)
  param   SP_PARAMS token — the persisted-settings key + data-param attr
  type    _R range slider | _C WebGL checkbox
  min/max/step/def   range geometry; `def` is the shipped default until
                     the CMS `defaults` map or a saved user value wins
  checked checkbox shipped state — same precedence as `def`
  actions group-level buttons (reset view, screenshot, copy settings)
`collapsed` controls whether the group starts folded in the panel.

### `SP_DEF_BASELINE`

Pristine def/checked snapshot — _applyDbDefaults restores this baseline
before merging so CMS defaults never bleed across locale switches. The
shape mirrors SLIDER_GROUPS (group → controls) so restoration indexes
positionally without re-deriving keys.

### `SP_DB_DEFAULT_SEED`

Label-keyed seed for the CMS-managed `earth-playground/defaults` node —
`{ waterMetalness: 0, bumpScale: 5, … }`. The CMS prefills its defaults
card from this map when the DB node is absent so the editor always
shows the real shipped values instead of claiming none exist.

### `PARAM_HANDLERS`

Param → EarthBackground setter dispatch. Each entry adapts a raw UI
value (slider units / checkbox boolean) into the matching engine update
call — the UI never touches engine internals directly. EARTH_SPEED
divides by 10000 because the slider range 0–50 is human-friendly while
the engine expects radians-per-frame (1 ⇒ 0.0001 rad/frame ≈ slow
cinematic spin).

### `SP_VERSION`

Schema version baked into the stored blob — bump whenever SLIDER_GROUPS'
params or semantics change so stale saves (old ranges, removed controls)
are discarded instead of applying out-of-range values to the engine.

### `loadSpaceSettings`

Reads the persisted panel settings, discarding blobs from another
SP_VERSION or corrupted JSON — both collapse to "no saved state" so a
stale/corrupt blob can never apply out-of-range engine values.
- `@returns` The saved param map, or null.

### `saveSpaceSettings`

Persists the panel settings as a {_v, settings} blob — the version tag
lets loadSpaceSettings reject blobs written by a different schema.
Quota/security failures are swallowed: the panel works fine session-only.
- `@param` settings The full param → value map.
