[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/safari/patches/view-project](../README.md) / patchViewProject

```ts
function patchViewProject(): void;
```

Defined in: [core/safari/patches/view-project.ts:30](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/safari/patches/view-project.ts#L30)

Installs the view-project Safari patch once the element registers:
replaces `_updateModalDOM` with the lifted-dialog variant and wraps
`onDestroy` so a modal lifted into document.body is reaped when the
view unmounts (otherwise it orphans on top of the next page).

## Returns

`void`
