[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/strings/debug](../README.md) / DEBUG\_PARAMS

```ts
const DEBUG_PARAMS: Readonly<{
  KEY: 'debug'
  NOTIFICATION_TEST: 'sendNotificationTest'
  WEBGL_MODE: 'webGLMode'
}>
```

Defined in: [src/core/tokens/strings/debug.ts:8](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/tokens/strings/debug.ts#L8)

## File

tokens/strings/debug.ts

## Description

URL `debug` parameter vocabulary. `?debug=<value>` may appear
multiple times on a URL; every value listed here is parsed by
src/core/debug/params.ts at boot.
