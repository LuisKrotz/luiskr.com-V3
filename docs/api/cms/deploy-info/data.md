# `cms/deploy-info/data.ts`

| | |
|---|---|
| **Source** | `src/cms/deploy-info/data.ts` |
| **UX surface** | Deploy reports viewer — lighthouse, coverage, scans. |

## Members

### (module scope)

Fetches a report JSON; any missing/corrupt file degrades to null (section shows its "no data" hint).

### (module scope)

Fetches the manifest then all five reports in parallel — the index
is the gate (missing bundle → "run npm run deploy:info" hint), each
report degrades independently so a partial bundle still renders.
