# `local-modules/extract-zip/index.js`

| | |
|---|---|
| **Source** | `src/local-modules/extract-zip/index.js` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `fs`

Secure drop-in replacement for extract-zip@2.0.1.

The upstream package is unmaintained and carries two unresolved advisories:

  - GHSA extract-zip unvalidated symlink path traversal (a crafted archive
    can plant a symlink entry that later entries write through, escaping
    the target directory).
  - GHSA extract-zip arbitrary file writes through symlink archive entries.

This implementation is intentionally dependency-free (no yauzl/get-stream)
and parses the ZIP central directory directly:

  - Entry names are validated against absolute paths, `..` segments, drive
    letters, and NUL bytes before anything touches the filesystem.
  - Entries whose Unix mode marks them symlinks/hardlinks/FIFOs/devices are
    refused outright — only regular files and directories are extracted.
  - Entry count, individual sizes, and total decompressed size are capped
    so a zip bomb cannot exhaust disk or memory.

The exported surface matches upstream: `extract(zipPath, opts)` returns a
Promise; `opts` supports `dir` (required), `onEntry` (observer callback),
`defaultDirMode`, and `defaultFileMode`. A `.default` self-alias is
exported so `await import('extract-zip')` resolves `.default` correctly
(the shape @puppeteer/browsers relies on).

### `findEocd`

Locates the End Of Central Directory record by scanning backward for its
signature (a trailing zip comment may push it away from EOF).
- `@param` {Buffer} buf Whole archive bytes.
- `@returns` {number} Byte offset of the EOCD record.

### `safeEntryPath`

Validates an entry path before it is joined with the destination dir.
Rejects every vector that could escape `dir`: absolute POSIX/Windows
paths, drive letters, `..` segments, backslashes (Windows separator),
and NUL bytes.
- `@param` {string} name Raw entry file name from the central directory.
- `@returns` {string} The sanitized, normalized relative path.

### `entryName`

Decodes an entry name. The general-purpose flag bit 11 marks UTF-8
encoding; otherwise names are CP437/Latin-1-ish — latin1 keeps bytes
round-trippable without pulling in an iconv dependency.
- `@param` {Buffer} buf Archive buffer.
- `@param` {number} off Name byte offset.
- `@param` {number} len Name length.
- `@param` {number} flags General-purpose bit flag from the central record.
- `@returns` {string} Decoded entry name.

### `extract`

Extracts `zipPath` into `opts.dir`, atomically refusing unsafe entries.
- `@param` {string} zipPath Path to the .zip archive.
- `@param` {object} opts `{ dir, onEntry, defaultDirMode, defaultFileMode }`.
- `@returns` {Promise<void>} Resolves when all entries are written.

### `extractApi`

Upstream API shim: `extract(zipPath, opts)` returns a Promise; the
optional third `cb(err)` argument mirrors upstream's callback form.
- `@param` {string} zipPath Path to the .zip archive.
- `@param` {object} opts `{ dir, onEntry, defaultDirMode, defaultFileMode }`.
- `@param` {Function} [cb] Optional node-style completion callback.
- `@returns` {Promise<void>} Resolves when all entries are written.
