# `core/tokens/playground/gui-scene.ts`

Scene-subsystem start values for the Earth Playground —

| | |
|---|---|
| **Source** | `src/core/tokens/playground/gui-scene.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `SP_ATMOSPHERE_DEFAULTS`

Frozen sp atmosphere map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.

### `SP_CLOUD_SHADOW_DEFAULTS`

Frozen sp cloud shadow map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.

### `SP_OCEAN_DEFAULTS`

Frozen sp ocean map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.

### `SP_EARTH_DEFAULTS`

Frozen sp earth map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.

### `SP_CAMERA_DEFAULTS`

Frozen sp camera map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.

### `SP_ENVIRONMENT_DEFAULTS`

Frozen sp environment map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.

### `SP_SUN_DEFAULTS`

Frozen sp sun map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.
