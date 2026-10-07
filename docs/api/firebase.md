# `firebase.ts`

Firebase client bootstrap — split between the site (read-only)

| | |
|---|---|
| **Source** | `src/firebase.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `getApiKey`

Resolves the API key from the build env (VITE_FIREBASE_API_KEY) or the
base64-encoded fallback baked at build time. Firebase API keys identify
the project, not a secret — but the fallback still avoids a plaintext
literal for casual scraping.

### `app`

The app constant.
- `@param` firebaseConfig — the value

### (module scope)

Lazily imports firebase/auth once and returns the shared Auth instance.
Concurrent callers share _authPromise so the chunk is fetched exactly once.

### (module scope)

Lazily imports firebase/database once and returns the shared RTDB
instance. Only needed by the CMS write path — public reads use REST.

### (module scope)

CMS login — Google OAuth popup (forces the account chooser).

### (module scope)

Signs the CMS user out.

### (module scope)

Subscribes to auth state after lazily loading firebase/auth.
- `@returns` {Promise<Function>} the SDK's unsubscribe function

### (module scope)

Snapshot-shaped result matching the SDK's DataSnapshot read API.

### (module scope)

Lightweight HTTP REST reader for the Realtime Database: GETs
`<db>/<path>.json` and wraps the payload in a snapshot-shaped
{ exists(), val() } object so callers match the SDK API.

Cache order: in-flight promise map → sessionStorage (survives route
changes within the tab) → network → SDK get() fallback on REST failure.

### `clearDbCache`

Drops the in-memory REST cache (sessionStorage entries persist).
