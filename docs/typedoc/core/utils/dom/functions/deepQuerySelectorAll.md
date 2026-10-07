[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [core/utils/dom](../README.md) / deepQuerySelectorAll

```ts
function deepQuerySelectorAll(selector, root?, results?): Element[]
```

Defined in: [src/core/utils/dom.ts:50](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/utils/dom.ts#L50)

Same traversal as deepQuerySelector but collects EVERY match across all
shadow trees — used for sweeps like "pause every video on the page".

## Parameters

### selector

`string`

### root?

`DeepRoot` \| `null`

### results?

`Element`[] = `[]`

## Returns

`Element`[]
