# `playground/space/controls.ts`

Control schema + persistence for &lt;view-space-playground&gt;,

| | |
|---|---|
| **Source** | `src/playground/space/controls.ts` |
| **UX surface** | The /earth-playground WebGPU experience. |

## Members

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

### `loadSpaceSettings`

Reads the persisted panel settings, discarding blobs from another
SP_VERSION or corrupted JSON — both collapse to "no saved state".
