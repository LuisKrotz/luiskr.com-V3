[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [core/browser/detect](../README.md) / detectBrowser

```ts
function detectBrowser(ua): BrowserInfo
```

Defined in: [src/core/browser/detect.ts:41](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/browser/detect.ts#L41)

Parses a UA string against BROWSERS. Regex `pattern` strings keep their
escaped form so the same table survives JSON serialization into the
inlined `__LK` manifest.

## Parameters

### ua

`string`

## Returns

[`BrowserInfo`](../interfaces/BrowserInfo.md)
