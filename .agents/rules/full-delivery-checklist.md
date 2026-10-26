# Rule: Never Stop Before Full Delivery — The Complete-Work Contract

An agent must **not stop** — and must not report the work as done —
until every item below is complete **in the current session**:

1. Code comments are in place where the change calls for them.
2. All necessary docs are updated.
3. All Jest test gates pass.
4. All a11y gates pass.
5. All security gates pass.
6. The performance gate passes.
7. All Lighthouse gates pass.
8. The build runs with **zero errors and zero warnings**.
9. The build preview serves cleanly.
10. The changes are committed and pushed when the task calls for it.

## A red gate is a work item

A failing check is never a footnote or a shrug — fix the root cause
and re-run. "It passed earlier", "it looks flaky", or "it's probably
fine" does not count: run it and watch it go green.

## No partial hand-offs

Skipping a gate, leaving tests red, shipping a build with warnings, or
finishing with uncommitted/unpushed changes is unfinished work. Keep
going until the whole list is green — or stop only to surface a
genuine blocker to the user.
