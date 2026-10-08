[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/strings/net](../README.md) / NET\_STRINGS

```ts
const NET_STRINGS: Readonly<{
  SITE_URL: "https://luiskr.com";
  GRAVATAR_BASE: "https://www.gravatar.com/avatar/";
  GRAVATAR_HOSTNAME: "gravatar.com";
  GRAVATAR_HOSTNAME_SUFFIX: ".gravatar.com";
  HTTP_LOCALHOST: "http://localhost";
  BLOB_COLON: "blob:";
  IMAGE_PNG: "image/png";
  METHOD_POST: "POST";
  METHOD_PUT: "PUT";
  METHOD_DELETE: "DELETE";
  HEADER_FILE_PATH: "x-file-path";
  HEADER_CONTENT_TYPE: "content-type";
  MIME_OCTET_STREAM: "application/octet-stream";
  JOB_RUNNING: "running";
  JOB_UPLOADING: "uploading";
}>;
```

Defined in: [core/tokens/strings/net.ts:13](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/strings/net.ts#L13)

Frozen net string map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.
