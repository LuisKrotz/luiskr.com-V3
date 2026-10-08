[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [cms/media-convert/job](../README.md) / errText

```ts
function errText(res, fallback): Promise<string>;
```

Defined in: [cms/media-convert/job.ts:200](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/media-convert/job.ts#L200)

Extracts the server's `error` field from a JSON error body; falls back
to the given message — or a dev-server hint on 404 (the API only exists
under the dev middleware, so a 404 there means "not running dev").

## Parameters

### res

`Response`

The failed Response.

### fallback

`string`

Message used when the body has no `error`.

## Returns

`Promise`\<`string`\>

The human-readable error.
