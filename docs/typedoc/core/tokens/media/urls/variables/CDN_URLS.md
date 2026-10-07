[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/media/urls](../README.md) / CDN\_URLS

```ts
const CDN_URLS: Readonly<{
  CDN_BASE: 'https://storage.googleapis.com/luiskr.com/public/_v3/'
  FLAG_CDN: 'https://flagcdn.com/'
  FIREBASE_DB: 'https://luiskr-com.firebaseio.com'
}>
```

Defined in: [src/core/tokens/media/urls.ts:14](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/tokens/media/urls.ts#L14)

Frozen cdn URL map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.
