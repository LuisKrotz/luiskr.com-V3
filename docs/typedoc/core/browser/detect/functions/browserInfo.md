[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [core/browser/detect](../README.md) / browserInfo

```ts
function browserInfo(): BrowserInfo
```

Defined in: [src/core/browser/detect.ts:68](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/browser/detect.ts#L68)

Runtime reader — returns the loader-stamped `window.__LK_BROWSER` when
present (public site path), otherwise parses `navigator.userAgent`.
Outside a windowed context (SSR/tests without DOM) returns `other`.
Preferring the stamped value keeps the runtime consistent with whichever
build tier the ES5 loader already selected — re-parsing the same UA could
disagree if the tables ever diverged.

## Returns

[`BrowserInfo`](../interfaces/BrowserInfo.md)

Resolved engine identity.
