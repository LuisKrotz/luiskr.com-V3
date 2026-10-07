[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [cms/about/types](../README.md) / emailToGravatarHash

```ts
function emailToGravatarHash(email): Promise<string>
```

Defined in: [src/cms/about/types.ts:48](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/cms/about/types.ts#L48)

Email → Gravatar hash per Gravatar's spec: trim + lowercase, SHA-256,
hex string. crypto.subtle keeps the hash on the browser's crypto
engine — no hashing code or dependency needed.

## Parameters

### email

`string`

## Returns

`Promise`\<`string`\>
