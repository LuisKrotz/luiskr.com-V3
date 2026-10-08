# `core/safari/types.ts`

Shared structural types for the Safari runtime patches —

| | |
|---|---|
| **Source** | `src/core/safari/types.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### (module scope)

Structural surface the Safari patches rely on (BaseComponent subclasses).

### (module scope)

The slice of a component prototype the patches may re-bind — every
member is optional because a patch only touches the methods Safari
actually breaks (e.g. media-figure's high-res load path).

### (module scope)

A custom-element constructor whose prototype exposes the patchable methods.
