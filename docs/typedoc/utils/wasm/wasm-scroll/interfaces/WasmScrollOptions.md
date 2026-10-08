[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [utils/wasm/wasm-scroll](../README.md) / WasmScrollOptions

Defined in: [core/utils/wasm/wasm-scroll.ts:20](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/utils/wasm/wasm-scroll.ts#L20)

Options bag for [wasmSmoothScroll](../functions/wasmSmoothScroll.md).

## Properties

### container?

```ts
optional container?: string | Element | Window;
```

Defined in: [core/utils/wasm/wasm-scroll.ts:22](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/utils/wasm/wasm-scroll.ts#L22)

Scroll container — selector (pierces shadow DOM), element, or window.

---

### element?

```ts
optional element?: string | Element;
```

Defined in: [core/utils/wasm/wasm-scroll.ts:24](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/utils/wasm/wasm-scroll.ts#L24)

Target element — selector or element.

---

### scrollTo?

```ts
optional scrollTo?:
  | number
  | {
  y?: number;
  top?: number;
};
```

Defined in: [core/utils/wasm/wasm-scroll.ts:26](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/utils/wasm/wasm-scroll.ts#L26)

Numeric offset or {y}/{top} shape.

---

### offset?

```ts
optional offset?: number;
```

Defined in: [core/utils/wasm/wasm-scroll.ts:28](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/utils/wasm/wasm-scroll.ts#L28)

Extra px offset applied to the target.

---

### duration?

```ts
optional duration?: number;
```

Defined in: [core/utils/wasm/wasm-scroll.ts:30](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/utils/wasm/wasm-scroll.ts#L30)

Animation length in ms (default 600).

---

### updateHistory?

```ts
optional updateHistory?: boolean;
```

Defined in: [core/utils/wasm/wasm-scroll.ts:32](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/utils/wasm/wasm-scroll.ts#L32)

Replace the URL hash on arrival.
