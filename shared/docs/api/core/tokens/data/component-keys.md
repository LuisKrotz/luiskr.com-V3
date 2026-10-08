# `core/tokens/data/component-keys.ts`

Dotted paths into translations/&lt;locale&gt;/components — grouped

| | |
|---|---|
| **Source** | `src/core/tokens/data/component-keys.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `LANG_COMPONENT_KEYS`

Frozen lang component key map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.

### `MEDIA_COMPONENT_KEYS`

Frozen media component key map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.

### `LEGAL_COMPONENT_KEYS`

Frozen legal component key map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.

### `SOURCE_COMPONENT_KEYS`

Frozen source component key map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.

### `SECTION_COMPONENT_KEYS`

Frozen section component key map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
