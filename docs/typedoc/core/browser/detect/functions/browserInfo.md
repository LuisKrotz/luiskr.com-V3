[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [core/browser/detect](../README.md) / browserInfo

```ts
function browserInfo(): BrowserInfo
```

Defined in: [src/core/browser/detect.ts:58](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/browser/detect.ts#L58)

Runtime reader — returns the loader-stamped `window.__LK_BROWSER` when
present (public site path), otherwise parses `navigator.userAgent`.
Outside a windowed context (SSR/tests without DOM) returns `other`.

## Returns

[`BrowserInfo`](../interfaces/BrowserInfo.md)
