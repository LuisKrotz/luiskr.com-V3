# `cms/deploy-info/data.ts`

| | |
|---|---|
| **Source** | `src/cms/deploy-info/data.ts` |
| **UX surface** | Deploy reports viewer — lighthouse, coverage, scans. |

## Members

### `DEPLOY_INFO_BASE`

Scalar token `/deploy-info` — the sole declaration site for this literal.

### (module scope)

Fetches a report JSON; any missing/corrupt file degrades to null (section shows its "no data" hint).

### (module scope)

Fetches the manifest then all five reports in parallel — the index
is the gate (missing bundle → "run yarn deploy:info" hint), each
report degrades independently so a partial bundle still renders.
