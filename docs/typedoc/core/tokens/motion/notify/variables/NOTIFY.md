[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/motion/notify](../README.md) / NOTIFY

```ts
const NOTIFY: Readonly<{
  TOAST_DURATION: 5000
  MAX_VISIBLE: 4
  DEDUPE_MS: 2500
  DEDUPE_CACHE_MAX: 64
}>
```

Defined in: [core/tokens/motion/notify.ts:11](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/tokens/motion/notify.ts#L11)

Notification/toast runtime tuning tokens. Sole declaration site — consumers import members
from this frozen map rather than re-declaring the literals
(zero-hardcoding rule).
