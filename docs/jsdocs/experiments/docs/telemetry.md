# `experiments/docs/telemetry.ts`

Copy-attempt telemetry for the docs source viewer.

| | |
|---|---|
| **Source** | `src/experiments/docs/telemetry.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### (module scope)

Guard surfaces that generate telemetry — each maps to one event type.

### `systemInfo`

Client-side system profile — best-effort, all fields optional because
every API is feature-detected (happy-dom exposes none of the hardware
hints).

### `trackCopyAttempt`

Posts one copy-attempt record. Fire-and-forget: the guard never blocks
the UI on the POST (beacon for unload safety, fetch keepalive fallback).
- `@param` kind Which guard surface fired.
- `@param` path The docs path being viewed (manifest-relative).
