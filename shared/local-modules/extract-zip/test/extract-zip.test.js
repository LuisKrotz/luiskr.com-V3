'use strict'
/**
 * @file extract-zip.test.js — node:test suite for the secure unzip.
 * Exercises the upstream API surface (promise + callback + onEntry) and the
 * security contract: absolute paths, .. traversal, backslash tricks, and
 * symlink/hardlink entries must be refused.
 */
const { test } = require('node:test')
const assert = require('node:assert')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const zlib = require('node:zlib')
const extract = require('../index.js')

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'ez-test-'))

/**
 * Builds a minimal valid ZIP buffer from [{name, data, mode?}] entries —
 * local headers + central directory + EOCD, deflate compression. A real
 * fixture keeps the test honest about on-disk parsing.
 */
const makeZip = (entries) => {
  const locals = []
  const centrals = []
  let offset = 0

  for (const { name, data = Buffer.alloc(0), mode = 0o100644 } of entries) {
    const nameBuf = Buffer.from(name, 'utf-8')
    const compressed = zlib.deflateRawSync(data)
    const crc = crc32(data)

    const local = Buffer.alloc(30)
    local.writeUInt32LE(0x04034b50, 0)
    local.writeUInt16LE(20, 4)
    local.writeUInt16LE(0x0800, 6)
    local.writeUInt16LE(8, 8)
    local.writeUInt32LE(crc, 14)
    local.writeUInt32LE(compressed.length, 18)
    local.writeUInt32LE(data.length, 22)
    local.writeUInt16LE(nameBuf.length, 26)

    const central = Buffer.alloc(46)
    central.writeUInt32LE(0x02014b50, 0)
    central.writeUInt16LE(20, 6)
    central.writeUInt16LE(0x0800, 8)
    central.writeUInt16LE(8, 10)
    central.writeUInt32LE(crc, 16)
    central.writeUInt32LE(compressed.length, 20)
    central.writeUInt32LE(data.length, 24)
    central.writeUInt16LE(nameBuf.length, 28)
    central.writeUInt32LE(mode * 0x10000, 38)
    central.writeUInt32LE(offset, 42)

    locals.push(local, nameBuf, compressed)
    centrals.push(central, nameBuf)
    offset += 30 + nameBuf.length + compressed.length
  }

  const cd = Buffer.concat(centrals)
  const eocd = Buffer.alloc(22)
  eocd.writeUInt32LE(0x06054b50, 0)
  eocd.writeUInt16LE(entries.length, 8)
  eocd.writeUInt16LE(entries.length, 10)
  eocd.writeUInt32LE(cd.length, 12)
  eocd.writeUInt32LE(offset, 16)

  return Buffer.concat([...locals, cd, eocd])
}

const CRC_TABLE = (() => {
  const t = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[i] = c
  }
  return t
})()

const crc32 = (buf) => {
  let crc = 0xffffffff
  for (const b of buf) crc = CRC_TABLE[(crc ^ b) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

const writeFixture = (entries) => {
  const dir = tmp()
  const file = path.join(dir, 'fixture.zip')
  fs.writeFileSync(file, makeZip(entries))
  return { dir, file }
}

test('extracts regular files preserving content', async () => {
  const { file } = writeFixture([{ name: 'a/hello.txt', data: Buffer.from('hi there') }])
  const out = tmp()

  await extract(file, { dir: out })
  assert.strictEqual(fs.readFileSync(path.join(out, 'a/hello.txt'), 'utf-8'), 'hi there')
})

test('creates directory entries', async () => {
  const { file } = writeFixture([
    { name: 'sub/', mode: 0o40755 },
    { name: 'sub/x.txt', data: Buffer.from('x') },
  ])
  const out = tmp()

  await extract(file, { dir: out })
  assert.ok(fs.statSync(path.join(out, 'sub')).isDirectory())
})

test('callback form resolves on completion', async () => {
  const { file } = writeFixture([{ name: 'f.txt', data: Buffer.from('1') }])
  const out = tmp()

  await new Promise((res, rej) => extract(file, { dir: out }, (e) => (e ? rej(e) : res())))
  assert.strictEqual(fs.readFileSync(path.join(out, 'f.txt'), 'utf-8'), '1')
})

test('rejects .. traversal entries', async () => {
  const { file } = writeFixture([{ name: '../escape.txt', data: Buffer.from('bad') }])
  await assert.rejects(() => extract(file, { dir: tmp() }), /\.\.|traversal|outside/i)
})

test('rejects absolute-path entries', async () => {
  const { file } = writeFixture([{ name: '/abs/evil.txt', data: Buffer.from('bad') }])
  await assert.rejects(() => extract(file, { dir: tmp() }), /absolute|traversal|outside/i)
})

test('rejects backslash traversal entries', async () => {
  const { file } = writeFixture([{ name: '..\\win.txt', data: Buffer.from('bad') }])
  await assert.rejects(() => extract(file, { dir: tmp() }), /traversal|outside|absolute/i)
})

test('rejects symlink entries', async () => {
  const { file } = writeFixture([
    { name: 'link', mode: 0o120777, data: Buffer.from('/etc/passwd') },
  ])
  await assert.rejects(() => extract(file, { dir: tmp() }), /symlink|link/i)
})

test('invokes onEntry for each archive member', async () => {
  const { file } = writeFixture([
    { name: 'one.txt', data: Buffer.from('1') },
    { name: 'two.txt', data: Buffer.from('2') },
  ])
  const seen = []

  await extract(file, { dir: tmp(), onEntry: (e) => seen.push(e.fileName) })
  assert.strictEqual(seen.length, 2)
})
