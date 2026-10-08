[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/strings/debug](../README.md) / DEBUG\_PARAMS

```ts
const DEBUG_PARAMS: Readonly<{
  KEY: "debug";
  NOTIFICATION_TEST: "sendNotificationTest";
  WEBGL_MODE: "webGLMode";
}>;
```

Defined in: [core/tokens/strings/debug.ts:13](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/strings/debug.ts#L13)

URL `debug` parameter vocabulary. `?debug=<value>` may appear multiple times on a URL; every value listed here is parsed by core/debug/params.ts at boot. Sole declaration site — consumers import members
from this frozen map rather than re-declaring the literals
(zero-hardcoding rule).
