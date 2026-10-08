[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [website/views/project/layout](../README.md) / isLandscapeGroup

```ts
function isLandscapeGroup(c, group): boolean;
```

Defined in: [website/views/project/layout.ts:94](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/views/project/layout.ts#L94)

Whether a media group is all-landscape — those can't pair side-by-side
in the two-up layout, so they force the carousel into scroll mode.

## Parameters

### c

[`ViewProject`](../../Project/classes/ViewProject.md)

The ViewProject instance (unused — facade signature).

### group

`unknown`

A media item array (shape-checked, not trusted).

## Returns

`boolean`

true when every item is landscape and the group is non-empty.
