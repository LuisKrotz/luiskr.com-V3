# `experiments/earth-playground/earth/settings.ts`

Settings snapshot builder for the WebGPU Earth engine,

| | |
|---|---|
| **Source** | `src/experiments/earth-playground/earth/settings.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### (module scope)

Rounded camera pose used to persist/restore the view.

### (module scope)

The mutable engine state the snapshot reads — mirrors the private
 fields on EarthBackground; everything nullable covers pre-bootstrap.

### `buildSettingsSnapshot`

Snapshot of every tunable, shaped exactly like DEFAULT_SP_GUI so the
playground control panel can render sliders without knowing which
values are live uniforms vs build-time constants. `??` fallbacks cover
the pre-bootstrap window where the private state is still null.
- `@returns` {object} settings tree keyed like DEFAULT_SP_GUI
