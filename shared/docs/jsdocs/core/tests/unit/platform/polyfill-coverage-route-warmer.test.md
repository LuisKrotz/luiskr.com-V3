# `core/tests/unit/platform/polyfill-coverage-route-warmer.test.js`

Split from polyfill-coverage.test.js — covers the "route-warmer" describe.

| | |
|---|---|
| **Source** | `src/core/tests/unit/platform/polyfill-coverage-route-warmer.test.js` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `stash`

Stashed globals, restored after each test. Descriptors are captured
(not values) so accessor properties like HTMLElement.prototype.inert
don't invoke their getter against the prototype itself.
