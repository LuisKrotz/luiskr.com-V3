/**
 * Media conversion pipeline — mirrors the manual scripts in tasks/:
 *
 *   images (any format) →
 *     {base}-mozjpg-uncompressed.jpg       (q100 — tasks/image/100)
 *     {base}-mozjpg-50.jpg                 (q50  — tasks/image/50)
 *     {base}-mozjpg-75.jpg                 (q75  — tasks/image/75)
 *     {base}-mozjpg3-MSSIM-tuned-kodak.jpg (q25 + blur — tasks/image/25)
 *
 *   videos (any format) →
 *     {base}.mp4                                (h264, tasks/video/transform.sh)
 *     {base}.mp4-scaledown-2x.mp4               (h264, iw/2 — iw/4 for ≥4K)
 *     {base}.mp4.jpg                            (first-frame poster)
 *     {base}.mp4.jpg-thumb.jpg                  (q25 + blur thumb)
 *     {base}.mp4-scaledown-2x.mp4.jpg           (poster of the scaled video)
 *     {base}.mp4-scaledown-2x.mp4.jpg-thumb.jpg
 *
 * Tool preference per the original scripts: ImageMagick `convert` + mozjpeg
 * `cjpeg` when installed, ffmpeg fallback otherwise (always available).
 */
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { IMAGE_EXTS, VIDEO_EXTS, isMediaPath } from '../../../cms/media-convert/exts.ts'

export { IMAGE_EXTS, VIDEO_EXTS }

// ffmpeg -q:v is a 1–31 inverse scale; rough equivalents of cjpeg qualities
const FFMPEG_Q = { q100: 2, q75: 5, q50: 9, q25blur: 13 }
const SCALE_4K_THRESHOLD = 3840

const run = (cmd, args) =>
  new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] })
    let err = ''
    p.stderr.on('data', (d) => {
      err += d
    })
    p.on('error', reject)
    p.on('close', (code) =>
      code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}: ${err.slice(-400)}`))
    )
  })

const probeVideo = async (file) => {
  const p = spawn(
    'ffprobe',
    [
      '-v',
      'error',
      '-select_streams',
      'v:0',
      '-show_entries',
      'stream=codec_name,width,pix_fmt',
      '-of',
      'csv=p=0',
      file,
    ],
    { stdio: ['ignore', 'pipe', 'ignore'] }
  )
  let out = ''
  p.stdout.on('data', (d) => {
    out += d
  })
  await new Promise((res) => p.on('close', res))
  const [codec = '', w = '', pixFmt = ''] = out.trim().split(',')
  return { codec: codec.trim(), width: parseInt(w, 10) || 0, pixFmt: pixFmt.trim() }
}

const which = async (cmd) =>
  new Promise((resolve) => {
    const p = spawn('which', [cmd])
    p.on('close', (code) => resolve(code === 0))
  })

let TOOLS = null

export async function detectTools() {
  if (!TOOLS) {
    const [ffmpeg, ffprobe, convert, cjpeg] = await Promise.all([
      which('ffmpeg'),
      which('ffprobe'),
      which('convert'),
      which('cjpeg'),
    ])
    TOOLS = { ffmpeg, ffprobe, convert, cjpeg }
    if (!ffmpeg)
      throw new Error('ffmpeg is required for media conversion but was not found on PATH')
  }
  return TOOLS
}

/** Single JPEG encode honoring the task scripts' tools when present. */
async function jpeg(src, dest, quality, { blur = false } = {}) {
  const t = await detectTools()

  if (blur && t.convert) {
    // tasks/image/25 + tasks/video/mozjpg-25+blur.sh
    await run('convert', [
      src,
      '-quality',
      String(quality),
      '-gravity',
      'center',
      '-blur',
      '0x10',
      dest,
    ])
    return
  }

  if (t.cjpeg && t.convert) {
    // tasks/image/{50,75,100}: convert src pnm:- | cjpeg -quality N
    const c1 = spawn('convert', [src, 'pnm:-'], { stdio: ['ignore', 'pipe', 'pipe'] })
    const c2 = spawn('cjpeg', ['-quality', String(quality)], { stdio: ['pipe', 'pipe', 'pipe'] })
    c1.stdout.pipe(c2.stdin)
    const fs = await import('node:fs')
    const out = fs.createWriteStream(dest)
    c2.stdout.pipe(out)
    await new Promise((resolve, reject) => {
      let done = 0
      const fin = () => (++done === 2 ? resolve() : null)
      c2.on('close', fin)
      out.on('close', fin)
      c1.on('error', reject)
      c2.on('error', reject)
    })
    return
  }

  // ffmpeg fallback: any format → mjpeg, q mapped from 1–31 scale
  const qv =
    quality >= 100
      ? FFMPEG_Q.q100
      : quality >= 75
        ? FFMPEG_Q.q75
        : quality >= 50
          ? FFMPEG_Q.q50
          : FFMPEG_Q.q25blur
  const args = ['-y', '-i', src]
  if (blur) args.push('-vf', 'gblur=sigma=10')
  args.push('-q:v', String(qv), dest)
  await run('ffmpeg', args)
}

/** tasks/image/* — four mozjpeg variants of any source image. */
export async function convertImage(inFile, outDir, baseName) {
  const out = (suffix) => path.join(outDir, `${baseName}${suffix}`)
  const results = []

  const jobs = [
    [out('-mozjpg-uncompressed.jpg'), 100, {}],
    [out('-mozjpg-75.jpg'), 75, {}],
    [out('-mozjpg-50.jpg'), 50, {}],
    [out('-mozjpg3-MSSIM-tuned-kodak.jpg'), 25, { blur: true }],
  ]

  for (const [dest, quality, opts] of jobs) {
    await jpeg(inFile, dest, quality, opts)
    results.push(path.basename(dest))
  }

  return results
}

/** tasks/video/* — normalize, scale-down, posters and thumbs. */
export async function convertVideo(inFile, outDir, baseName) {
  const results = []
  const mp4 = path.join(outDir, `${baseName}.mp4`)
  const scaled = path.join(outDir, `${baseName}.mp4-scaledown-2x.mp4`)

  // transform.sh — normalize to h264 mp4. Stream-copy is only attempted when
  // the source is already h264/yuv420p in an mp4 container; anything else
  // (and a failed copy — e.g. pcm audio the mp4 muxer rejects) falls back to
  // a full transcode. Every encode forces yuv420p + aac and truncates odd
  // dimensions to even: screen captures arrive as yuv444p/rgb with odd sizes
  // (1513×983), which libx264 rejects with EINVAL and zero packets written.
  const { codec, pixFmt } = await probeVideo(inFile)
  const transcode = () =>
    run('ffmpeg', [
      '-y',
      '-i',
      inFile,
      '-c:v',
      'libx264',
      '-preset:v',
      'ultrafast',
      '-vf',
      'scale=trunc(iw/2)*2:trunc(ih/2)*2',
      '-pix_fmt',
      'yuv420p',
      '-c:a',
      'aac',
      '-movflags',
      '+faststart',
      mp4,
    ])

  if (path.extname(inFile).toLowerCase() === '.mp4' && codec === 'h264' && pixFmt === 'yuv420p') {
    try {
      await run('ffmpeg', ['-y', '-i', inFile, '-c', 'copy', '-movflags', '+faststart', mp4])
    } catch {
      await transcode()
    }
  } else {
    await transcode()
  }
  results.push(path.basename(mp4))

  // reducemp4-2x.sh — /2 normally, /4 when the source is ≥4K wide. The scale
  // is truncated to even dimensions: odd halves (1513px screen recordings →
  // 756.5) make libx264 fail with EINVAL and write zero packets.
  const { width } = await probeVideo(mp4)
  const div = width >= SCALE_4K_THRESHOLD ? 4 : 2
  await run('ffmpeg', [
    '-y',
    '-i',
    mp4,
    '-c:v',
    'libx264',
    '-preset:v',
    'ultrafast',
    '-pix_fmt',
    'yuv420p',
    '-vf',
    `scale=trunc(iw/${div}/2)*2:trunc(ih/${div}/2)*2`,
    '-c:a',
    'copy',
    '-movflags',
    '+faststart',
    scaled,
  ])
  results.push(path.basename(scaled))

  // create-thumb.sh — first-frame posters of both videos
  const poster = `${mp4}.jpg`
  const posterScaled = `${scaled}.jpg`
  await run('ffmpeg', ['-y', '-i', mp4, '-frames:v', '1', poster])
  await run('ffmpeg', ['-y', '-i', scaled, '-frames:v', '1', posterScaled])
  results.push(path.basename(poster), path.basename(posterScaled))

  // mozjpg-25+blur.sh — blurred low-quality thumbs of both posters
  const thumb = `${poster}-thumb.jpg`
  const thumbScaled = `${posterScaled}-thumb.jpg`
  await jpeg(poster, thumb, 25, { blur: true })
  await jpeg(posterScaled, thumbScaled, 25, { blur: true })
  results.push(path.basename(thumb), path.basename(thumbScaled))

  return results
}

export async function convertFile(inFile, outDir) {
  const ext = path.extname(inFile).toLowerCase()
  const baseName = path.basename(inFile, ext)

  if (IMAGE_EXTS.has(ext)) return convertImage(inFile, outDir, baseName)
  if (VIDEO_EXTS.has(ext)) return convertVideo(inFile, outDir, baseName)

  throw new Error(`unsupported file type: ${ext || '(none)'}`)
}

export const isSupported = isMediaPath

export { existsSync }
