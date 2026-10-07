[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [core/browser/detect](../README.md) / BrowserInfo

Defined in: [src/core/browser/detect.ts:28](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/browser/detect.ts#L28)

Resolved engine identity — name, marketing major version, quirks.

## Extends

- [`BrowserQuirks`](../../browsers/interfaces/BrowserQuirks.md)

## Properties

### webgpu?

```ts
optional webgpu?: boolean;
```

Defined in: [src/core/browser/browsers.ts:17](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/browser/browsers.ts#L17)

navigator.gpu absent/flag-gated — the app skips the WebGPU init path.

#### Inherited from

[`BrowserQuirks`](../../browsers/interfaces/BrowserQuirks.md).[`webgpu`](../../browsers/interfaces/BrowserQuirks.md#webgpu)

---

### lowGpu?

```ts
optional lowGpu?: boolean;
```

Defined in: [src/core/browser/browsers.ts:19](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/browser/browsers.ts#L19)

Mostly mid-range SoCs — renderers may start at reduced resolution scale.

#### Inherited from

[`BrowserQuirks`](../../browsers/interfaces/BrowserQuirks.md).[`lowGpu`](../../browsers/interfaces/BrowserQuirks.md#lowgpu)

---

### name

```ts
name: string
```

Defined in: [src/core/browser/detect.ts:29](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/browser/detect.ts#L29)

---

### major

```ts
major: number
```

Defined in: [src/core/browser/detect.ts:30](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/browser/detect.ts#L30)
