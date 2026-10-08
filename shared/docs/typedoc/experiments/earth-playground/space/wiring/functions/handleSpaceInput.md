[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [experiments/earth-playground/space/wiring](../README.md) / handleSpaceInput

```ts
function handleSpaceInput(c, input): void;
```

Defined in: [experiments/earth-playground/space/wiring.ts:269](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/space/wiring.ts#L269)

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
