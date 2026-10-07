[**luiskr.com**](../../../README.md)

---

[luiskr.com](../../../README.md) / [core/devlog](../README.md) / DevLogEntry

Defined in: [src/core/devlog.ts:13](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/devlog.ts#L13)

One buffered diagnostic entry.

## Properties

### t

```ts
t: number
```

Defined in: [src/core/devlog.ts:15](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/devlog.ts#L15)

Unix-ms timestamp of the call.

---

### level

```ts
level: string
```

Defined in: [src/core/devlog.ts:17](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/devlog.ts#L17)

'warn' | 'error' | 'info' — from LOG_LEVELS.

---

### parts

```ts
parts: unknown[];
```

Defined in: [src/core/devlog.ts:19](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/devlog.ts#L19)

The original call arguments, unserialized.
