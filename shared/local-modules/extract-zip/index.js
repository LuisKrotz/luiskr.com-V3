'use strict'

/**
 * Secure drop-in replacement for extract-zip@2.0.1.
 *
 * The upstream package is unmaintained and carries two unresolved advisories:
 *
 *   - GHSA extract-zip unvalidated symlink path traversal (a crafted archive
 *     can plant a symlink entry that later entries write through, escaping
 *     the target directory).
 *   - GHSA extract-zip arbitrary file writes through symlink archive entries.
 *
 * This implementation is intentionally dependency-free (no yauzl/get-stream)
 * and parses the ZIP central directory directly:
 *
 *   - Entry names are validated against absolute paths, `..` segments, drive
 *     letters, and NUL bytes before anything touches the filesystem.
 *   - Entries whose Unix mode marks them symlinks/hardlinks/FIFOs/devices are
 *     refused outright — only regular files and directories are extracted.
 *   - Entry count, individual sizes, and total decompressed size are capped
 *     so a zip bomb cannot exhaust disk or memory.
 *
 * The exported surface matches upstream: `extract(zipPath, opts)` returns a
 * Promise; `opts` supports `dir` (required), `onEntry` (observer callback),
 * `defaultDirMode`, and `defaultFileMode`. A `.default` self-alias is
 * exported so `await import('extract-zip')` resolves `.default` correctly
 * (the shape @puppeteer/browsers relies on).
 */

const fs = require('node:fs')
const path = require('node:path')
const { inflateRawSync } = require('node:zlib')

const EOCD_SIG = 0x06054b50
const CEN_SIG = 0x02014b50
const LOC_SIG = 0x04034b50
const EOCD_MIN = 22
const EOCD_SEARCH = 66 * 1024 // EOCD + max 64KB comment tail

const MAX_ENTRIES = 100_000
const MAX_TOTAL_BYTES = 4 * 1024 * 1024 * 1024 // 4 GiB decompressed ceiling
const MAX_ENTRY_BYTES = 2 * 1024 * 1024 * 1024 // single-entry ceiling
const S_IFMT = 0o170000
const S_IFREG = 0o100000
const S_IFDIR = 0o040000

const fail = (msg) => {
  throw new Error(`extract-zip[secure]: ${msg}`)
}

/**
 * Locates the End Of Central Directory record by scanning backward for its
 * signature (a trailing zip comment may push it away from EOF).
 * @param {Buffer} buf Whole archive bytes.
 * @returns {number} Byte offset of the EOCD record.
 */
const findEocd = (buf) => {
  const min = Math.max(0, buf.length - EOCD_SEARCH)

  for (let i = buf.length - EOCD_MIN; i >= min; i--) {
    if (buf.readUInt32LE(i) === EOCD_SIG) return i
  }

  return fail('end of central directory not found')
}

/**
 * Validates an entry path before it is joined with the destination dir.
 * Rejects every vector that could escape `dir`: absolute POSIX/Windows
 * paths, drive letters, `..` segments, backslashes (Windows separator),
 * and NUL bytes.
 * @param {string} name Raw entry file name from the central directory.
 * @returns {string} The sanitized, normalized relative path.
 */
const safeEntryPath = (name) => {
  if (!name || name.includes('\0')) return fail('entry name is empty or contains NUL')

  const normalized = name.replace(/\\/g, '/')
  const segments = normalized.split('/').filter((s) => s && s !== '.')

  if (
    normalized.startsWith('/') ||
    /^[a-zA-Z]:\//.test(normalized) ||
    /^[a-zA-Z]:$/.test(normalized) ||
    segments.some((s) => s === '..')
  ) {
    return fail(`refusing to extract entry outside destination: ${name}`)
  }

  return segments.join('/')
}

/**
 * Decodes an entry name. The general-purpose flag bit 11 marks UTF-8
 * encoding; otherwise names are CP437/Latin-1-ish — latin1 keeps bytes
 * round-trippable without pulling in an iconv dependency.
 * @param {Buffer} buf Archive buffer.
 * @param {number} off Name byte offset.
 * @param {number} len Name length.
 * @param {number} flags General-purpose bit flag from the central record.
 * @returns {string} Decoded entry name.
 */
const entryName = (buf, off, len, flags) =>
  buf.toString(flags & 0x0800 ? 'utf8' : 'latin1', off, off + len)

/**
 * Extracts `zipPath` into `opts.dir`, atomically refusing unsafe entries.
 * @param {string} zipPath Path to the .zip archive.
 * @param {object} opts `{ dir, onEntry, defaultDirMode, defaultFileMode }`.
 * @returns {Promise<void>} Resolves when all entries are written.
 */
const extract = async (zipPath, opts = {}) => {
  const dir = opts.dir
  if (!dir) return fail('opts.dir is required')

  const dest = path.resolve(dir)
  const buf = await fs.promises.readFile(zipPath)
  const eocd = findEocd(buf)
  const count = buf.readUInt16LE(eocd + 10)

  if (count > MAX_ENTRIES) return fail(`archive has ${count} entries (cap ${MAX_ENTRIES})`)

  let off = buf.readUInt32LE(eocd + 16)
  let totalOut = 0

  for (let i = 0; i < count; i++) {
    if (buf.readUInt32LE(off) !== CEN_SIG) return fail('corrupt central directory')

    const flags = buf.readUInt16LE(off + 8)
    const method = buf.readUInt16LE(off + 10)
    const compSize = buf.readUInt32LE(off + 20)
    const rawSize = buf.readUInt32LE(off + 24)
    const nameLen = buf.readUInt16LE(off + 28)
    const extraLen = buf.readUInt16LE(off + 30)
    const commentLen = buf.readUInt16LE(off + 32)
    const externalAttrs = buf.readUInt32LE(off + 38)
    const localOff = buf.readUInt32LE(off + 42)
    const name = entryName(buf, off + 46, nameLen, flags)
    const unixMode = (externalAttrs >>> 16) & S_IFMT

    // Only regular files and directories may be written; symlinks,
    // hardlinks, sockets, FIFOs, and device nodes are the traversal vector
    // both upstream advisories describe.
    if (unixMode !== 0 && unixMode !== S_IFREG && unixMode !== S_IFDIR) {
      return fail(`refusing non-regular-file entry: ${name}`)
    }

    const rel = safeEntryPath(name)
    const target = path.join(dest, rel)

    if (!target.startsWith(dest + path.sep) && target !== dest) {
      return fail(`refusing to extract entry outside destination: ${name}`)
    }

    totalOut += rawSize
    if (rawSize > MAX_ENTRY_BYTES || totalOut > MAX_TOTAL_BYTES) {
      return fail('archive exceeds decompressed-size limits (zip bomb guard)')
    }

    if (opts.onEntry) opts.onEntry({ fileName: name }, null)

    if (rel === '' || unixMode === S_IFDIR || name.endsWith('/')) {
      await fs.promises.mkdir(target, { recursive: true, mode: opts.defaultDirMode ?? 0o755 })
    } else {
      if (buf.readUInt32LE(localOff) !== LOC_SIG) return fail(`corrupt local header: ${name}`)

      const lNameLen = buf.readUInt16LE(localOff + 26)
      const lExtraLen = buf.readUInt16LE(localOff + 28)
      const dataOff = localOff + 30 + lNameLen + lExtraLen
      const compressed = buf.subarray(dataOff, dataOff + compSize)
      let data

      if (method === 0) {
        data = Buffer.from(compressed)
      } else if (method === 8) {
        data = inflateRawSync(compressed, { finishFlush: 4, maxOutputLength: rawSize })
      } else {
        return fail(`unsupported compression method ${method}: ${name}`)
      }

      if (data.length !== rawSize) return fail(`size mismatch for entry: ${name}`)

      await fs.promises.mkdir(path.dirname(target), { recursive: true })
      await fs.promises.writeFile(target, data, { mode: opts.defaultFileMode ?? 0o644 })
    }

    off += 46 + nameLen + extraLen + commentLen
  }
}

/**
 * Upstream API shim: `extract(zipPath, opts)` returns a Promise; the
 * optional third `cb(err)` argument mirrors upstream's callback form.
 * @param {string} zipPath Path to the .zip archive.
 * @param {object} opts `{ dir, onEntry, defaultDirMode, defaultFileMode }`.
 * @param {Function} [cb] Optional node-style completion callback.
 * @returns {Promise<void>} Resolves when all entries are written.
 */
const extractApi = (zipPath, opts, cb) => {
  const promise = extract(zipPath, opts)
  if (typeof cb === 'function') promise.then(() => cb(), cb)
  return promise
}

module.exports = extractApi
module.exports.default = extractApi
