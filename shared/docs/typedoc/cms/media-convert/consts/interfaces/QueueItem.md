[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [cms/media-convert/consts](../README.md) / QueueItem

Defined in: [cms/media-convert/consts.ts:35](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/media-convert/consts.ts#L35)

One queued upload — the File blob plus its job-relative path.

## Properties

### file

```ts
file: File;
```

Defined in: [cms/media-convert/consts.ts:37](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/media-convert/consts.ts#L37)

The picked File payload (PUT body).

***

### rel

```ts
rel: string;
```

Defined in: [cms/media-convert/consts.ts:39](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/media-convert/consts.ts#L39)

Path relative to the job root — sent as the x-file-path header.
