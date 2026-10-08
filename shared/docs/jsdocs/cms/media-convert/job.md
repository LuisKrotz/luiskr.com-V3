# `cms/media-convert/job.ts`

| | |
|---|---|
| **Source** | `src/cms/media-convert/job.ts` |
| **UX surface** | Batch image→WebP conversion pipeline UI. |

## Members

### `stopPolling`

Cancels the pending poll timer — called before every new poll schedule
and on reset so only one timer is ever armed.
- `@param` host The CmsMediaConverter element.

### (module scope)

POSTs an empty job to the dev server and stores the returned id on the
host — every subsequent request hangs off host.jobId.
- `@param` host The CmsMediaConverter element.

### (module scope)

PUTs every queued file sequentially — the dev server is single-purpose
and serial uploads keep progress (`host.uploaded`) truthful. Re-renders
after each file so the progress counter animates live.
- `@param` host The CmsMediaConverter element.

### (module scope)

Kicks off the server-side conversion and starts the poll loop. A 202
counts as success (job accepted, still queueing); any other failure
throws.
- `@param` host The CmsMediaConverter element.

### (module scope)

One poll tick: fetches job status, re-arms the timer while the server
reports running/uploading, and finishes (or errors) on a terminal
state. A failed GET is treated as server loss — the phase flips to
ERROR rather than polling forever.
- `@param` host The CmsMediaConverter element.

### `finish`

Terminal handler — counts per-file results, sets DONE when at least one
converted (ERROR otherwise), notifies via toast AND the OS Notification
API (long jobs may run while the tab is backgrounded), then re-renders.
- `@param` host The CmsMediaConverter element.

### `systemNotify`

Fires an OS-level Notification when permission is already granted —
silent no-op otherwise (the in-app toast always runs too, so this is a
progressive enhancement for backgrounded tabs).
- `@param` title Notification title.
- `@param` body Notification body text.

### (module scope)

Requests Notification permission up front (during run()) so the
completion notification can fire later — no-op unless the permission
is still 'default' (never re-prompts a denied user).

### (module scope)

DELETEs the job on the dev server (cleanup of uploaded tmp files) then
clears host.jobId — a missing job is tolerated (idempotent teardown).
- `@param` host The CmsMediaConverter element.

### (module scope)

Extracts the server's `error` field from a JSON error body; falls back
to the given message — or a dev-server hint on 404 (the API only exists
under the dev middleware, so a 404 there means "not running dev").
- `@param` res The failed Response.
- `@param` fallback Message used when the body has no `error`.
- `@returns` The human-readable error.

### (module scope)

Full pipeline orchestrator: create → upload → convert, flipping
host.phase at each stage and re-rendering. Errors land on the ERROR
phase with the server's message so the UI shows the real failure.
- `@param` host The CmsMediaConverter element.

### `reset`

Returns the component to its initial state — stops polling, deletes
the remote job, clears queue/status/counters, and re-renders IDLE.
- `@param` host The CmsMediaConverter element.
