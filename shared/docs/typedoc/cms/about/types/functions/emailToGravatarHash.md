[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [cms/about/types](../README.md) / emailToGravatarHash

```ts
function emailToGravatarHash(email): Promise<string>;
```

Defined in: [cms/about/types.ts:49](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/about/types.ts#L49)

Email → Gravatar hash per Gravatar's spec: trim + lowercase, SHA-256,
hex string. crypto.subtle keeps the hash on the browser's crypto
engine — no hashing code or dependency needed. Each byte is hex-encoded
and zero-padded so the digest renders as the canonical 64-char string.

## Parameters

### email

`string`

Raw email input (any casing/whitespace).

## Returns

`Promise`\<`string`\>

The lowercase 64-char hex SHA-256 digest.
