[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [cms/media-convert/consts](../README.md) / JobStatus

Defined in: [cms/media-convert/consts.ts:55](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/media-convert/consts.ts#L55)

Job-status payload polled from GET /jobs/:id.

## Properties

### status?

```ts
optional status?: string;
```

Defined in: [cms/media-convert/consts.ts:57](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/media-convert/consts.ts#L57)

Server phase string ('running'|'uploading'|terminal).

***

### error?

```ts
optional error?: string;
```

Defined in: [cms/media-convert/consts.ts:59](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/media-convert/consts.ts#L59)

Server-side error message when failed.

***

### current?

```ts
optional current?: string;
```

Defined in: [cms/media-convert/consts.ts:61](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/media-convert/consts.ts#L61)

Currently-processing file path (progress display).

***

### done?

```ts
optional done?: number;
```

Defined in: [cms/media-convert/consts.ts:63](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/media-convert/consts.ts#L63)

Files completed so far.

***

### total?

```ts
optional total?: number;
```

Defined in: [cms/media-convert/consts.ts:65](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/media-convert/consts.ts#L65)

Total files in the job.

***

### results?

```ts
optional results?: JobResult[];
```

Defined in: [cms/media-convert/consts.ts:67](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/media-convert/consts.ts#L67)

Per-file results once the job settles.
