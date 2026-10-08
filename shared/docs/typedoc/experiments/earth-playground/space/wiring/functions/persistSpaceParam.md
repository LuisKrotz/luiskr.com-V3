[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [experiments/earth-playground/space/wiring](../README.md) / persistSpaceParam

```ts
function persistSpaceParam(
   c, 
   param, 
   val
): void;
```

Defined in: [experiments/earth-playground/space/wiring.ts:316](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/space/wiring.ts#L316)

Writes one param into the saved-settings map and persists the whole map
to localStorage — the single write point for panel state.

## Parameters

### c

[`SpacePlayground`](../../../SpacePlayground/classes/SpacePlayground.md)

The SpacePlayground element.

### param

`string`

Engine param name (key into PARAM_HANDLERS).

### val

[`SpParamValue`](../../controls/type-aliases/SpParamValue.md)

New value (number or boolean).

## Returns

`void`
