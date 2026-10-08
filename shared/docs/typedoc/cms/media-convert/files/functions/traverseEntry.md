[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [cms/media-convert/files](../README.md) / traverseEntry

```ts
function traverseEntry(entry, prefix?): AsyncGenerator<{
  file: File;
  rel: string;
}>;
```

Defined in: [cms/media-convert/files.ts:17](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/media-convert/files.ts#L17)

Recursive async generator over a dropped FileSystemEntry — a folder
drop yields one {file, rel} per descendant, preserving the relative
path so the server rebuilds the same tree inside the ZIP. Directory
readers return entries in batches of ≤100, so the do/while drains
until an empty batch signals the end.

## Parameters

### entry

`FileSystemEntry`

### prefix?

`string` = `CHAR_STRINGS.EMPTY`

## Returns

`AsyncGenerator`\<\{
  `file`: `File`;
  `rel`: `string`;
\}\>
