[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [experiments/docs/coverage-nav](../README.md) / attachCoverageNav

```ts
function attachCoverageNav(box): (() => void) | null;
```

Defined in: [experiments/docs/coverage-nav.ts:182](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/docs/coverage-nav.ts#L182)

Wires the istanbul report contract when `box` holds a coverage report.

## Parameters

### box

`HTMLElement`

The `.docs-content` element whose innerHTML was just painted.

## Returns

(() => `void`) \| `null`

Disposer removing all listeners, or null when the payload
         contains no istanbul surface (no summary table and no
         uncovered-block markers to navigate).
