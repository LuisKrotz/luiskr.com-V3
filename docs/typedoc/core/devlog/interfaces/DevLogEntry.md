[**luiskr.com**](../../../README.md)

---

[luiskr.com](../../../README.md) / [core/devlog](../README.md) / DevLogEntry

Defined in: [src/core/devlog.ts:13](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/devlog.ts#L13)

One buffered diagnostic entry.

## Properties

### t

```ts
t: number
```

Defined in: [src/core/devlog.ts:15](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/devlog.ts#L15)

Unix-ms timestamp of the call.

---

### level

```ts
level: string
```

Defined in: [src/core/devlog.ts:17](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/devlog.ts#L17)

'warn' | 'error' | 'info' — from LOG_LEVELS.

---

### parts

```ts
parts: unknown[];
```

Defined in: [src/core/devlog.ts:19](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/devlog.ts#L19)

The original call arguments, unserialized.
