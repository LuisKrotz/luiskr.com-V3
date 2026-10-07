[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [safari/patches/view-project](../README.md) / patchViewProject

```ts
function patchViewProject(): void
```

Defined in: [src/safari/patches/view-project.ts:30](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/safari/patches/view-project.ts#L30)

Installs the view-project Safari patch once the element registers:
replaces `_updateModalDOM` with the lifted-dialog variant and wraps
`onDestroy` so a modal lifted into document.body is reaped when the
view unmounts (otherwise it orphans on top of the next page).

## Returns

`void`
