[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [core/utils/dom](../README.md) / deepQuerySelector

```ts
function deepQuerySelector(selector, root?): Element | null
```

Defined in: [src/core/utils/dom.ts:23](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/utils/dom.ts#L23)

Depth-first search for the FIRST element matching `selector`, descending
through every nested shadow root it passes. Order matches the visual
document order (parents before their shadow children).

## Parameters

### selector

`string`

### root?

`DeepRoot` \| `null`

## Returns

`Element` \| `null`
