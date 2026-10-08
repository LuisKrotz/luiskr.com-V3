# `core/firebase.ts`

Firebase client bootstrap — split between the site (read-only)

| | |
|---|---|
| **Source** | `src/core/firebase.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `getApiKey`

Resolves the API key from the build env (VITE_FIREBASE_API_KEY) or the
base64-encoded fallback baked at build time. Firebase API keys identify
the project, not a secret — but the fallback still avoids a plaintext
literal for casual scraping.

### `firebaseConfig`

Firebase project configuration. apiKey resolves at runtime; the rest are
public project identifiers (auth domain, RTDB URL, project id, storage
bucket, sender id, app id, analytics measurement id).

### `app`

The shared Firebase App — initialized eagerly from firebaseConfig; auth
and database SDKs attach to it lazily.

### `_authInstance`

Memoized Auth instance — populated on first getAuthInstance() call.

### `_authPromise`

In-flight auth-chunk promise — concurrent callers share one import.

### (module scope)

Lazily imports firebase/auth once and returns the shared Auth instance.
Concurrent callers share _authPromise so the chunk is fetched exactly once.
- `@returns` The Auth instance bound to `app`.

### `_dbInstance`

Memoized RTDB instance — populated on first getDbInstance() call.

### `_dbPromise`

In-flight database-chunk promise — concurrent callers share one import.

### (module scope)

Lazily imports firebase/database once and returns the shared RTDB
instance. Only needed by the CMS write path — public reads use REST.
- `@returns` The Database instance bound to `app`.

### (module scope)

CMS login — Google OAuth popup. `prompt: 'select_account'` forces the
account chooser so a CMS editor isn't silently signed into a wrong Google account.
When the environment can't complete the popup handshake (popup blockers,
COOP window.closed blocking, partitioned web storage, unsupported
contexts — the AUTH_REDIRECT_FALLBACK_CODES set), retries transparently
via signInWithRedirect, which navigates away and never resolves.
- `@returns` The SDK UserCredential, or nothing when the redirect fallback fires.

### (module scope)

Signs the CMS user out via the lazily-loaded auth SDK.

### (module scope)

Subscribes to auth state after lazily loading firebase/auth.
First resolves a pending redirect sign-in (the signInWithGoogle popup
fallback) so the callback fires with the fresh session on return — a
failed redirect logs the error and falls through to the normal listener.
- `@param` callback Invoked with the User (or null on sign-out) on every auth transition.
- `@returns` {Promise<Function>} the SDK's unsubscribe function

### (module scope)

Snapshot-shaped result matching the SDK's DataSnapshot read API.

### (module scope)

Lightweight HTTP REST reader for the Realtime Database: GETs
`<db>/<path>.json` and wraps the payload in a snapshot-shaped
{ exists(), val() } object so callers match the SDK API.

Cache order: in-flight promise map → sessionStorage (survives route
changes within the tab) → network → SDK get() fallback on REST failure.
- `@param` path RTDB path — leading slash stripped for URL safety.
- `@returns` Snapshot-shaped {exists, val} wrapping the JSON payload.

### `clearDbCache`

Drops the in-memory REST cache (sessionStorage entries persist).
