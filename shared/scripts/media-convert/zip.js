/**
 * Minimal ZIP archive writer (DEFLATE via node:zlib) — no external deps.
 * Produces a standard .zip readable by the OS, Chrome and archive tools.
 */
import zlib from 'node:zlib'
import { Buffer } from 'node:buffer'

const CRC_TABLE = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c >>> 0
  }
  return t
})()

function crc32(buf) {
  let crc = 0xffffffff
  for (let i = 0; i < buf.length; i++) crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

function dosDateTime(d = new Date()) {
  const time =
    ((d.getHours() & 0x1f) << 11) | ((d.getMinutes() & 0x3f) << 5) | ((d.getSeconds() >> 1) & 0x1f)
  const date =
    (((d.getFullYear() - 1980) & 0x7f) << 9) |
    (((d.getMonth() + 1) & 0xf) << 5) |
    (d.getDate() & 0x1f)
  return { time, date }
}

/**
 * @param {Array<{name: string, data: Buffer}>} files
 * @returns {Buffer} zip archive
 */
export function buildZip(files) {
  const chunks = []
  const central = []
  let offset = 0

  const { time, date } = dosDateTime()

  for (const file of files) {
    const nameBuf = Buffer.from(file.name.replace(/\\/g, '/'), 'utf8')
    const data = file.data
    const compressed = zlib.deflateRawSync(data, { level: 9 })
    const crc = crc32(data)

    const local = Buffer.alloc(30)
    local.writeUInt32LE(0x04034b50, 0) // local file header sig
    local.writeUInt16LE(20, 4) // version needed (2.0)
    local.writeUInt16LE(0x0800, 6) // UTF-8 flag
    local.writeUInt16LE(8, 8) // method: deflate
    local.writeUInt16LE(time, 10)
    local.writeUInt16LE(date, 12)
    local.writeUInt32LE(crc, 14)
    local.writeUInt32LE(compressed.length, 18)
    local.writeUInt32LE(data.length, 22)
    local.writeUInt16LE(nameBuf.length, 26)
    local.writeUInt16LE(0, 28) // extra len

    chunks.push(local, nameBuf, compressed)

    const cent = Buffer.alloc(46)
    cent.writeUInt32LE(0x02014b50, 0) // central dir sig
    cent.writeUInt16LE(20, 4) // version made by
    cent.writeUInt16LE(20, 6) // version needed
    cent.writeUInt16LE(0x0800, 8)
    cent.writeUInt16LE(8, 10)
    cent.writeUInt16LE(time, 12)
    cent.writeUInt16LE(date, 14)
    cent.writeUInt32LE(crc, 16)
    cent.writeUInt32LE(compressed.length, 20)
    cent.writeUInt32LE(data.length, 24)
    cent.writeUInt16LE(nameBuf.length, 28)
    // extra(30) comment(32) disk(34) intAttr(36) extAttr(38) offset(42)
    cent.writeUInt32LE(offset, 42)
    central.push(Buffer.concat([cent, nameBuf]))

    offset += local.length + nameBuf.length + compressed.length
  }

  const centralBuf = Buffer.concat(central)

  const eocd = Buffer.alloc(22)
  eocd.writeUInt32LE(0x06054b50, 0)
  eocd.writeUInt16LE(files.length, 8)
  eocd.writeUInt16LE(files.length, 10)
  eocd.writeUInt32LE(centralBuf.length, 12)
  eocd.writeUInt32LE(offset, 16)

  return Buffer.concat([...chunks, centralBuf, eocd])
}
