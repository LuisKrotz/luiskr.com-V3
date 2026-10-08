# `core/tests/unit/platform/polyfill-coverage-core-legacy-polyfills-polyfills-js-guarded-installs.test.js`

Split from polyfill-coverage.test.js — covers the "core/legacy-polyfills/polyfills.js guarded installs" describe.

| | |
|---|---|
| **Source** | `src/core/tests/unit/platform/polyfill-coverage-core-legacy-polyfills-polyfills-js-guarded-installs.test.js` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `stash`

Stashed globals, restored after each test. Descriptors are captured
(not values) so accessor properties like HTMLElement.prototype.inert
don't invoke their getter against the prototype itself.
