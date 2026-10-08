[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [experiments/earth-playground/space/wiring](../README.md) / handleSpaceAction

```ts
function handleSpaceAction(
   c, 
   action, 
   btn
): void;
```

Defined in: [experiments/earth-playground/space/wiring.ts:192](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/space/wiring.ts#L192)

Dispatches a data-action button: panel-open is engine-free; the rest
need a live _earthBg — reset (view + saved settings + inputs back to
defaults), toggle-rotate (flips autoRotate and mirrors aria-pressed),
screenshot, and copy-constants (serializes the GUI settings to the
clipboard for pasting into source).

## Parameters

### c

[`SpacePlayground`](../../../SpacePlayground/classes/SpacePlayground.md)

The SpacePlayground element.

### action

`string` \| `null`

The data-action token, or null.

### btn

`Element`

The clicked button (aria-pressed target for toggles).

## Returns

`void`
