# Rule: Zero Istanbul Coverage Suppressions — HARD RULE

Agents must **NEVER** add `istanbul ignore` comments anywhere in the
codebase — no `ignore next`, `ignore if`, `ignore else`, or
`ignore file`. This is a hard rule every agent follows, with no
exceptions and no "unreachable in jsdom" justifications.

## The fix is always a real test

Every uncovered statement, branch, or function gets exercised for
real:

- Event listeners that "never fire in jsdom" — dispatch the synthetic
  event (`el.dispatchEvent(new Event(...))`), including media events
  like `loadeddata`, `error`, `mouseleave`, `focus`.
- Rejection paths — mock the dependency so the promise rejects and
  assert the fallback ran.
- Environment probes (Safari detection, WebGL context loss, wasm
  rejections) — stub the global or the module, then drive the arm.
- Conditional render arms — mount the component in each state (page
  type, open/closed, flag present/absent).

## Grandfathered baseline only shrinks

Suppressions committed before this rule are recorded in
`ISTANBUL_BASELINE` (`shared/tests/fixtures/test-constants.js`) as a
per-file occurrence count. The governance test fails the suite when a
file's `istanbul ignore` count exceeds its baseline — so the baseline
can only shrink, never grow. Removing a grandfathered suppression is
always welcome; adding one is never allowed.

## Enforcement

`shared/tests/governance/style-governance.test.js` — Rule 32 scans all
module sources and compares each file's suppression count against the
baseline.
