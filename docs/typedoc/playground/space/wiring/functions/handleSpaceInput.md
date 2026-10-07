[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [playground/space/wiring](../README.md) / handleSpaceInput

```ts
function handleSpaceInput(c, input): void
```

Defined in: [src/playground/space/wiring.ts:269](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/playground/space/wiring.ts#L269)

Routes one param input to the engine: reads checked (checkbox) or
Number(value) (slider), repaints the slider's track-fill % + row label,
syncs the WebGL checkbox twin, dispatches the PARAM_HANDLERS setter,
then persists the param so a reload restores it.

## Parameters

### c

[`SpacePlayground`](../../../SpacePlayground/classes/SpacePlayground.md)

The SpacePlayground element.

### input

`HTMLInputElement`

The changed input carrying a data-param attribute.

## Returns

`void`
