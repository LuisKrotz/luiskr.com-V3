---
name: deploy
description: Wrap-up then deploy — runs the full /wrap-up pipeline first; only when every gate is green does it run `yarn deploy` (firebase deploy → hosting + database rules). User-invoked only — each invocation approves exactly one deploy.
triggers:
  - user
allowed-tools:
  - read
  - edit
  - write
  - grep
  - glob
  - exec
---

# Deploy — Wrap-Up → Firebase Deploy

Invoking `/deploy` is the user's explicit, in-conversation approval for ONE deploy of the current state. It is not standing approval — never re-deploy afterwards without a fresh invocation.

## Step 1 — Wrap-up (blocking)

Invoke the `/wrap-up` skill and run its ENTIRE pipeline. Deploy proceeds only when wrap-up finishes fully green:

- all Jest tests + 100% per-file coverage gate
- all a11y gates (axe governance + `yarn a11y` + `yarn media:a11y` when media changed)
- all security gates (`yarn test:security` — zero high/critical)
- performance gate (`yarn test:fps` + chunk budgets)
- all Lighthouse gates (`yarn lighthouse`)
- clean `yarn build` + clean `yarn preview`
- all changes committed and pushed (root + every submodule, gitlinks bumped)

If ANY phase or gate fails: STOP. Do not deploy. Report the failing gate, what was fixed, and what remains. Do not work around failures by skipping gates or using `--no-verify`.

## Step 2 — Preflight

- `git status` must be clean at root and inside every submodule (`core`, `shared`, `website`, `cms`, `experiments/*`) — the deploy ships `dist/` built from HEAD.
- Confirm `dist/` is the fresh output of the gate run. Do not rebuild after committing without re-running the gates.
- Sanity-check `firebase.json` targets: hosting (`public: dist`) + database rules — a full `firebase deploy` ships both.

## Step 3 — Deploy

Run `yarn deploy` (= `firebase deploy`). The firebase.json hooks run automatically:

- `predeploy` (`shared/scripts/build/predeploy.mjs`): stamp-content-signal → `lhci autorun` (the deploy FAILS if Lighthouse assertions miss: perf ≥ 0.80, a11y / best-practices / seo = 1.0, image-delivery warn-only) → deploy-info repackages reports into `dist/deploy-info/`
- `postdeploy`: `stamp-content-signal.mjs --revert` + `submit-indexnow.mjs` (IndexNow URL submission)

If `firebase deploy` fails, read which stage failed (predeploy vs hosting upload vs rules), fix the root cause, re-run the affected gate, and retry once. If it still fails, stop and report — do not force partial deploys.

## Step 4 — Verify & report

- Capture the firebase deploy summary (hosting URL, release version, files uploaded, rules status).
- Re-display the wrap-up gate table with a final `Deploy` row appended (`firebase deploy` → PASS/FAIL + hosting URL).
- Report anything postdeploy changed in the working tree (stamp revert should leave it clean — verify with `git status`).

## Never

- Never deploy when any gate is red, when the working tree is dirty, or "just to check."
- Never run deploy targets individually (`--only hosting`, `--only database`) unless the user explicitly asked for a partial deploy.
- Never deploy from a branch other than the one the user invoked this on without asking.
