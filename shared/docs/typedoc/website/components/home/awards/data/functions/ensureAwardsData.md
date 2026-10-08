[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [website/components/home/awards/data](../README.md) / ensureAwardsData

```ts
function ensureAwardsData(_el): void;
```

Defined in: [website/components/home/awards/data.ts:73](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/home/awards/data.ts#L73)

Loads the components dictionary node for the current locale when missing
(stale-while-revalidate) — commits SET_COMPONENT_LANG so the footer
links/mentions re-render once the snapshot lands.

## Parameters

### \_el

[`AwardsMentions`](../../../AwardsMentions/classes/AwardsMentions.md)

The AwardsMentions element (unused — data flows via the store).

## Returns

`void`
