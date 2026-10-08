[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/utils/wasm/wasm-layout](../README.md) / calcDrawTextOrderedOffset

```ts
function calcDrawTextOrderedOffset(idx, scheduledMs): number;
```

Defined in: [core/utils/wasm/wasm-layout.ts:195](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/wasm/wasm-layout.ts#L195)

Ordered-queue offset for document-wide cascades: `scheduledMs` is the
cumulative reveal duration of every item that precedes this one across
the whole document (a shared clock position, not a character count), so
the draw-text elements animate strictly in reading order even when
several enter the viewport in the same frame. Reuses the
calc_draw_text_offset op with delay=1 — scheduledMs is already in ms —
plus idx·DRAW_INDEX_STEP_MS so equal-length items still stagger.

## Parameters

### idx

`number`

Global index of this item in the document's reveal order.

### scheduledMs

`number`

Sum of all preceding items' durations in ms.

## Returns

`number`

Start offset in ms on the shared clock.
