[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [core/browser/browsers](../README.md) / BrowserQuirks

Defined in: [src/core/browser/browsers.ts:15](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/browser/browsers.ts#L15)

Quirk hints the loader stamps on `window.__LK_BROWSER`.

## Extended by

- [`BrowserInfo`](../../detect/interfaces/BrowserInfo.md)

## Properties

### webgpu?

```ts
optional webgpu?: boolean;
```

Defined in: [src/core/browser/browsers.ts:17](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/browser/browsers.ts#L17)

navigator.gpu absent/flag-gated — the app skips the WebGPU init path.

---

### lowGpu?

```ts
optional lowGpu?: boolean;
```

Defined in: [src/core/browser/browsers.ts:19](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/browser/browsers.ts#L19)

Mostly mid-range SoCs — renderers may start at reduced resolution scale.
