# `cms/deploy-info/types.ts`

| | |
|---|---|
| **Source** | `src/cms/deploy-info/types.ts` |
| **UX surface** | Deploy reports viewer — lighthouse, coverage, scans. |

## Members

### (module scope)

Manifest index of the deploy-info bundle — `files` maps report names
to their JSON paths inside dist/deploy-info/, `generatedAt`/`commit` stamp
which build produced them.

### (module scope)

Shape of the Lighthouse JSON summary — `urls` pairs each audited
URL with its category scores (performance, a11y, best-practices, SEO).

### (module scope)

Shape of the Jest coverage summary consumed by the Deploy Info tab —
`total` holds per-metric {covered,total,pct} aggregates (statements, branches,
functions, lines).

### (module scope)

Shape of the axe-scan report — `engine` names the axe-core version and
`surfaces` lists each mounted DOM surface with its violations (id, impact, help)
so the CMS tab can render them grouped by page area.

### (module scope)

Shape of the security-scan report — `scanner` records whether snyk or
yarn audit produced it, `ok` the gate outcome, `vulnerabilities` the advisory
rows (acceptedRisk marks entries waived via security-exceptions.json).

### (module scope)

Shape of the console-scan gate output — `ok` is the pass/fail,
`violations` lists each `console.*` callsite found under src/ (file, line,
method) since src is a zero-console zone (AGENTS.md rule 12).

### (module scope)

Tri-state of the Deploy Info fetch: still `loading`, the bundle
is `missing` (no deploy-info/ in this build), or the index parsed `ready`.
