[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [cms/media-convert/consts](../README.md) / JobResult

Defined in: [cms/media-convert/consts.ts:43](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/media-convert/consts.ts#L43)

Per-file outcome reported by the conversion server.

## Properties

### ok

```ts
ok: boolean;
```

Defined in: [cms/media-convert/consts.ts:45](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/media-convert/consts.ts#L45)

Whether this file converted successfully.

***

### in

```ts
in: string;
```

Defined in: [cms/media-convert/consts.ts:47](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/media-convert/consts.ts#L47)

The input path the result corresponds to.

***

### outs?

```ts
optional outs?: string[];
```

Defined in: [cms/media-convert/consts.ts:49](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/media-convert/consts.ts#L49)

Output artifact paths when ok.

***

### error?

```ts
optional error?: string;
```

Defined in: [cms/media-convert/consts.ts:51](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/media-convert/consts.ts#L51)

Error message when !ok.
