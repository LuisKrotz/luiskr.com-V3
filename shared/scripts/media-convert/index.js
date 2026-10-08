/**
 * Localhost-only media converter API — a Vite plugin exposing job-based
 * upload → convert → zip-download endpoints on the dev/preview servers.
 * It is never part of the built bundle, so the feature cannot exist in
 * production even if the CMS front-end is reached.
 *
 * Endpoints (all under /api/media-convert):
 *   POST   /jobs               → { id }                      create temp job dir
 *   PUT    /jobs/:id/files     body=file bytes, x-file-path  save one input file
 *   POST   /jobs/:id/convert   → { status:'running' }        start async pipeline
 *   GET    /jobs/:id           → { status,total,done,current,results }
 *   GET    /jobs/:id/zip       → application/zip             all outputs
 *   DELETE /jobs/:id           → 204                          cleanup temp dir
 */
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import crypto from 'node:crypto'
import { convertFile, isSupported, detectTools } from './pipeline.js'
import { buildZip } from './zip.js'

const PREFIX = '/api/media-convert'
const ROOT = path.join(os.tmpdir(), 'luiskr-media-convert')
const JOB_TTL_MS = 60 * 60 * 1000
const jobs = new Map()

const json = (res, code, obj) => {
  res.statusCode = code
  res.setHeader('content-type', 'application/json')
  res.end(JSON.stringify(obj))
}

const safeJoin = (root, rel) => {
  const p = path.normalize(path.join(root, rel))
  if (!p.startsWith(path.normalize(root + path.sep))) return null
  return p
}

async function pruneStaleJobs() {
  try {
    await fsp.mkdir(ROOT, { recursive: true })
    const now = Date.now()
    for (const entry of await fsp.readdir(ROOT)) {
      const dir = path.join(ROOT, entry)
      try {
        const stat = await fsp.stat(dir)
        if (now - stat.mtimeMs > JOB_TTL_MS) await fsp.rm(dir, { recursive: true, force: true })
      } catch {
        /* ignore individual dir errors */
      }
    }
  } catch {
    /* tmp dir may not exist yet */
  }
}

async function runJob(job) {
  job.status = 'running'
  // Non-media litter (desktop.ini, .DS_Store, Thumbs.db…) dropped inside
  // folders is skipped outright — never counted, converted or reported.
  const files = (await walk(job.inDir)).filter((f) => isSupported(f))
  job.total = files.length
  job.done = 0
  job.results = []

  for (const abs of files) {
    const rel = path.relative(job.inDir, abs)
    job.current = rel
    const relDir = path.join(job.outDir, path.dirname(rel))
    await fsp.mkdir(relDir, { recursive: true })

    try {
      const outs = await convertFile(abs, relDir)
      job.results.push({
        in: rel,
        ok: true,
        outs: outs.map((o) => path.join(path.dirname(rel), o)),
      })
    } catch (err) {
      job.results.push({
        in: rel,
        ok: false,
        error: String(err.message || err).slice(0, 300),
        outs: [],
      })
    }

    job.done++
  }

  job.current = null
  job.status = job.results.some((r) => r.ok) ? 'done' : 'error'
  job.finishedAt = Date.now()
}

async function* walkGen(dir) {
  for (const e of await fsp.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) yield* walkGen(p)
    else if (e.isFile()) yield p
  }
}

async function walk(dir) {
  const out = []
  for await (const p of walkGen(dir)) out.push(p)
  return out
}

async function handle(req, res, next) {
  const url = new URL(req.url, 'http://localhost')
  const sub = url.pathname.replace(PREFIX, '') || '/'
  const seg = sub.split('/').filter(Boolean)

  try {
    // POST /jobs — create job
    if (req.method === 'POST' && sub === '/jobs') {
      const id = crypto.randomBytes(9).toString('base64url')
      const dir = path.join(ROOT, id)
      const inDir = path.join(dir, 'in')
      const outDir = path.join(dir, 'out')
      await fsp.mkdir(inDir, { recursive: true })
      await fsp.mkdir(outDir, { recursive: true })
      const job = {
        id,
        dir,
        inDir,
        outDir,
        status: 'uploading',
        total: 0,
        done: 0,
        current: null,
        results: [],
        createdAt: Date.now(),
      }
      jobs.set(id, job)
      return json(res, 201, { id })
    }

    if (seg[0] !== 'jobs' || !seg[1]) return next()
    const job = jobs.get(seg[1])
    if (!job || !fs.existsSync(job.dir)) return json(res, 404, { error: 'job not found' })

    // PUT /jobs/:id/files — stream one file into the job's input tree
    if (req.method === 'PUT' && seg[2] === 'files') {
      const rel = decodeURIComponent(req.headers['x-file-path'] || '')
      const dest = rel && safeJoin(job.inDir, rel)
      if (!dest) return json(res, 400, { error: 'missing or invalid x-file-path' })
      await fsp.mkdir(path.dirname(dest), { recursive: true })
      await new Promise((resolve, reject) => {
        const ws = fs.createWriteStream(dest)
        req.pipe(ws)
        req.on('error', reject)
        ws.on('error', reject)
        ws.on('finish', resolve)
      })
      return json(res, 200, { ok: true })
    }

    // POST /jobs/:id/convert — start async conversion
    if (req.method === 'POST' && seg[2] === 'convert') {
      if (job.status === 'running') return json(res, 409, { error: 'already running' })
      runJob(job).catch((err) => {
        job.status = 'error'
        job.error = String(err.message || err)
      })
      return json(res, 202, { status: 'running' })
    }

    // GET /jobs/:id — status poll
    if (req.method === 'GET' && seg.length === 2) {
      return json(res, 200, {
        id: job.id,
        status: job.status,
        total: job.total,
        done: job.done,
        current: job.current,
        results: job.results,
        error: job.error || null,
      })
    }

    // GET /jobs/:id/zip — bundle everything in out/
    if (req.method === 'GET' && seg[2] === 'zip') {
      const files = []
      for await (const abs of walkGen(job.outDir)) {
        files.push({ name: path.relative(job.outDir, abs), data: await fsp.readFile(abs) })
      }
      if (!files.length) return json(res, 409, { error: 'nothing to download yet' })
      const zip = buildZip(files)
      res.statusCode = 200
      res.setHeader('content-type', 'application/zip')
      res.setHeader('content-disposition', `attachment; filename="converted-media-${job.id}.zip"`)
      res.setHeader('content-length', zip.length)
      return res.end(zip)
    }

    // DELETE /jobs/:id — cleanup
    if (req.method === 'DELETE' && seg.length === 2) {
      jobs.delete(job.id)
      await fsp.rm(job.dir, { recursive: true, force: true })
      res.statusCode = 204
      return res.end()
    }

    return next()
  } catch (err) {
    return json(res, 500, { error: String(err.message || err) })
  }
}

export function mediaConvertPlugin() {
  const mount = (middlewares) => {
    detectTools()
      .then((t) =>
        console.log(
          `[media-convert] ready — ffmpeg:${t.ffmpeg} convert:${t.convert} cjpeg:${t.cjpeg}`
        )
      )
      .catch((e) => console.warn(`[media-convert] ${e.message}`))
    pruneStaleJobs()
    middlewares.use(PREFIX, handle)
  }
  return {
    name: 'luiskr-media-convert',
    configureServer(server) {
      mount(server.middlewares)
    },
    configurePreviewServer(server) {
      mount(server.middlewares)
    },
  }
}
