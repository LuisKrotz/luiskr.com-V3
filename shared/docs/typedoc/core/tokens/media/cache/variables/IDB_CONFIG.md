[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/media/cache](../README.md) / IDB\_CONFIG

```ts
const IDB_CONFIG: Readonly<{
  MEDIA_DB_NAME: "luiskr_media_disk_cache_v1";
  MEDIA_KEY_PREFIX: "luiskr_media_";
  MEDIA_META_PREFIX: "luiskr_media_meta_";
  MEDIA_DB_VERSION: 1;
  MEDIA_STORE: "media_blobs";
  READONLY: "readonly";
  READWRITE: "readwrite";
}>;
```

Defined in: [core/tokens/media/cache.ts:11](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/media/cache.ts#L11)

IndexedDB media disk-cache + network cache-mode tokens. Sole declaration site — consumers import members
from this frozen map rather than re-declaring the literals
(zero-hardcoding rule).
