# `cms/deploy-info/CmsDeployInfo.tsx`

&lt;cms-deploy-info&gt; — the Deploy Info tab: renders the

| | |
|---|---|
| **Source** | `src/cms/deploy-info/CmsDeployInfo.tsx` |
| **UX surface** | Deploy reports viewer — lighthouse, coverage, scans. |

## Members

### `CmsDeployInfo`

The CmsDeployInfo — deploy info class.

### (module scope)

Fetches the manifest then all five reports in parallel — the index
is the gate (missing bundle → "run yarn deploy:info" hint), each
report degrades independently so a partial bundle still renders.

### `_scoreClass`

Maps a 0–1 score to the green/amber/red chip class (Lighthouse conventions).

### `_pct`

Formats a 0–1 score as a whole percentage; non-numbers render an em-dash.

### `_renderLighthouse`

Renders the Lighthouse section (scores + failing audits).

### `_renderScores`

Renders the Lighthouse category score cells for one URL entry.

### `_renderCoverage`

Renders the Jest coverage summary table.

### `_renderAxe`

Renders the axe-core accessibility scan (violations grouped by surface).

### `_renderSnyk`

Renders the dependency vulnerability scan (Snyk or yarn-audit fallback).

### `_renderConsoleScan`

Renders the console.* usage scan (debug-leftover policy).

### (module scope)

JSX template — loading/missing gates then the report wall.
