# `core/tokens/playground/gui-post.ts`

Post-processing start values for the Earth Playground —

| | |
|---|---|
| **Source** | `src/core/tokens/playground/gui-post.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `SP_LENS_FLARE_DEFAULTS`

Frozen sp lens flare map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.

### `SP_ANAMORPHIC_DEFAULTS`

Frozen sp anamorphic map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.

### `SP_BLOOM_DEFAULTS`

Frozen sp bloom map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.

### `SP_VIGNETTE_DEFAULTS`

Frozen sp vignette map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.

### `SP_CHROMATIC_DEFAULTS`

Frozen sp chromatic map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.

### `SP_FILM_GRAIN_DEFAULTS`

Frozen sp film grain map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.

### `SP_DEBUG_DEFAULTS`

Frozen sp debug map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.
