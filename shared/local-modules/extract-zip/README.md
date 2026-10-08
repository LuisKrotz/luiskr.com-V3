# @luiskrotz/extract-zip

Dependency-free, security-hardened drop-in replacement for
[`extract-zip`](https://github.com/maxogden/extract-zip) `<=2.0.1`.

## What it fixes and why

| Advisory | Issue | Fix in this package |
|---|---|---|
| GHSA-extract-zip symlink path traversal | A crafted archive can plant a *symlink* entry; later entries are then written through it, escaping the target directory. | Entries whose Unix mode marks them as symlink/hardlink/FIFO/device are **refused outright** — only regular files and directories extract. |
| GHSA-extract-zip arbitrary file write | Absolute paths, `..` segments, backslash drive tricks, and NUL bytes in entry names write outside the destination. | Every entry name is normalized and validated (rejects absolute paths, `..`, `C:\`-style drives, `\0`) before anything touches the filesystem. |
| Dependency-chain advisories | Upstream drags `yauzl` → `fd-slicer` → `pend`, `get-stream`, `debug` — extra attack surface. | **Zero dependencies** — the ZIP central directory is parsed directly with `node:zlib`/`node:fs`. |

Why vendored: upstream is unmaintained and the advisories are still open.
The consuming chain in this superproject is `@puppeteer/browsers` (browser
downloads), wired via `"**/extract-zip": "file:local-modules/extract-zip"`.

## API

Same shape as upstream:

```js
const extract = require('@luiskrotz/extract-zip')

await extract(zipPath, { dir: targetDir })       // resolves on completion
extract(zipPath, { dir }, cb)                     // callback form supported
```

`opts.onEntry(entry, zipfile)` is honored for parity. Unsupported archive
shapes (multi-disk, ZIP64 sizes, encrypted entries, symlinks) reject with a
descriptive `Error`.

## Test

```sh
yarn test   # node --test test/
```

## License

MIT — see [LICENSE](./LICENSE). Clean-room reimplementation Copyright ©
Luis Krötz; upstream extract-zip is BSD-2-Clause (Max Ogden).
