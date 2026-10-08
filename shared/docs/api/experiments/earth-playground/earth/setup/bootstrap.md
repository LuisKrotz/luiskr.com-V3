# `experiments/earth-playground/earth/setup/bootstrap.ts`

Async scene assembly for the Earth engine, extracted from

| | |
|---|---|
| **Source** | `src/experiments/earth-playground/earth/setup/bootstrap.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### (module scope)

Pre-compiles the scene's shader programs so the first visible frame doesn't
hitch on JIT. compileAsync failures (driver hiccups, lost device) are
non-fatal — the renderer recompiles lazily on first draw.

### `bootstrapEarth`

bootstraps earth.
- `@param` s — the source value
- `@returns` Promise<void>
