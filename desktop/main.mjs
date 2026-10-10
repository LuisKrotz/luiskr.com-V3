#!/usr/bin/env node
/**
 * Electron main process — wraps the built site+CMS as an installable
 * desktop app. The app serves dist/ over an ephemeral 127.0.0.1 port
 * rather than file:// so service workers, module preloads, and Firebase
 * OAuth keep working on a real http origin.
 *
 * The media-convert API is not proxied — it exists only under `yarn
 * dev`'s vite middleware, so the converter panel behaves exactly like a
 * non-dev browser: the localhost gate hides it unless the dev server
 * runs alongside.
 *
 *   yarn desktop:dev    — serve dist/ in an Electron window (build first)
 *   yarn desktop:build  — per-OS installers via electron-builder (release/)
 */
import { app, BrowserWindow } from 'electron'
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

const here = path.dirname(url.fileURLToPath(import.meta.url))

// Packaged builds bundle dist/ as an extraResource; dev runs read the
// sibling build output. Missing dist → the window shows build guidance.
const DIST = app.isPackaged
  ? path.join(process.resourcesPath, 'dist')
  : path.join(here, '..', 'dist')

/** Extension → Content-Type for every asset class dist/ emits. */
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.wasm': 'application/wasm',
  '.webmanifest': 'application/manifest+json',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf',
}

/** Resolves a request path inside dist/ — null when it escapes the root. */
const safeJoin = (p) => {
  const abs = path.normalize(path.join(DIST, p))
  return abs.startsWith(path.normalize(DIST + path.sep)) ? abs : null
}

/** Picks the fallback document: /cms/* → cms/index.html, else index.html. */
const fallbackFor = (p) =>
  p === '/cms' || p.startsWith('/cms/')
    ? path.join(DIST, 'cms', 'index.html')
    : path.join(DIST, 'index.html')

const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname)
  const direct = safeJoin(pathname)
  const file =
    direct && fs.existsSync(direct) && fs.statSync(direct).isFile() ? direct : fallbackFor(pathname)

  if (!fs.existsSync(file)) {
    res.statusCode = 404
    return res.end('not found')
  }

  res.setHeader(
    'content-type',
    MIME[path.extname(file).toLowerCase()] || 'application/octet-stream'
  )
  fs.createReadStream(file).pipe(res)
})

const gotLock = app.requestSingleInstanceLock()
if (!gotLock) app.quit()

app.on('second-instance', () => {
  const [win] = BrowserWindow.getAllWindows()
  if (win) {
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

/** Opens the single app window on the internal server's URL. */
const createWindow = (port) => {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 360,
    minHeight: 480,
    autoHideMenuBar: true,
    webPreferences: {
      // No node integration in the page — it is the plain web build.
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  win.loadURL(`http://127.0.0.1:${port}/`)
}

app.whenReady().then(() => {
  // Port 0 → the OS assigns a free one; collisions can't happen.
  server.listen(0, '127.0.0.1', () => {
    const { port } = server.address()
    createWindow(port)

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow(port)
    })
  })
})

app.on('window-all-closed', () => {
  server.close()
  if (process.platform !== 'darwin') app.quit()
})
