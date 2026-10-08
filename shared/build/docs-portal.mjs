/**
 * @file docs-portal.mjs
 * @description Docs portal pipeline plugin — `virtual:docs-manifest` carries
 * the scanned docs/reports/coverage/src tree; each publishable file is also
 * emitted as a `docs-content/<root>/<path>.json` payload (rendered HTML +
 * meta) fetched lazily by the view. The dev server answers the same URLs
 * through middleware, so `experiments/docs` runs standalone with the same
 * contract the root build emits.
 */
import fs from 'node:fs'
import path from 'node:path'
import { scanManifest, resolveFileId, MEDIA_INLINE_LIMIT } from './docs/scan.mjs'
import { renderFile } from './docs/render.mjs'
import { redactSource } from './docs/redact.mjs'

/**
 * Builds the docs-portal vite plugin.
 * @param {object} opts Options.
 * @param {string} opts.root Repo root the manifest scan resolves against.
 * @param {boolean} [opts.emitAssets] Emit `docs-content/*.json` payloads into
 *   the bundle (root build passes its default-tier flag; module lib builds
 *   pass false so library output stays JS-only).
 * @returns {import('vite').Plugin} The plugin instance.
 */
export const docsPortalPlugin = ({ root, emitAssets = true }) => {
  const manifestId = 'virtual:docs-manifest'
  const assetBase = 'docs-content/'

  const payloadFor = (fileId) => {
    // URLs carry the id as '<root>/<relpath>'; the manifest's canonical
    // form is '<root>:<relpath>' — normalize before resolving.
    const slashIdx = fileId.indexOf('/')

    const normalized = fileId.includes(':')
      ? fileId
      : slashIdx > 0
        ? `${fileId.slice(0, slashIdx)}:${fileId.slice(slashIdx + 1)}`
        : fileId

    const abs = resolveFileId(root, normalized)

    if (!abs) return null

    const ext = abs.split('.').pop().toLowerCase()
    const rel = fileId.slice(fileId.indexOf(':') + 1)
    const stat = fs.statSync(abs)

    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'mp4', 'webm'].includes(ext)) {
      if (stat.size > MEDIA_INLINE_LIMIT) {
        return {
          name: path.basename(abs),
          path: rel,
          format: 'media',
          media: null,
          mtime: stat.mtime.toISOString(),
        }
      }

      const mime = ext === 'svg' ? 'image/svg+xml' : `image/${ext === 'jpg' ? 'jpeg' : ext}`

      return {
        name: path.basename(abs),
        path: rel,
        format: 'media',
        media: `data:${mime};base64,${fs.readFileSync(abs).toString('base64')}`,
        mtime: stat.mtime.toISOString(),
      }
    }

    const raw = fs.readFileSync(abs, 'utf8')

    const content = ext === 'json' || 'html md markdown htm'.includes(ext) ? raw : redactSource(raw)

    const fmt =
      ext === 'md' || ext === 'markdown'
        ? 'markdown'
        : ext === 'html' || ext === 'htm'
          ? 'html'
          : ext === 'json'
            ? 'json'
            : ext === 'txt'
              ? 'text'
              : 'code'

    // Local stylesheet links inside reports (istanbul's base.css /
    // prettify.css) resolve against the file's own directory and get
    // inlined — anything outside the project tree stays stripped.
    const linkResolver = (href) => {
      try {
        const target = path.resolve(path.dirname(abs), href)

        if (!target.startsWith(root) || !fs.statSync(target).isFile()) return null

        return fs.readFileSync(target, 'utf8')
      } catch {
        return null
      }
    }

    return {
      name: path.basename(abs),
      path: rel,
      format: fmt,
      html: renderFile(fmt, content, ext, { linkResolver }),
      mtime: stat.mtime.toISOString(),
    }
  }

  return {
    name: 'vite-plugin-docs-portal',
    resolveId(id) {
      return id === manifestId ? '\0' + manifestId : null
    },
    load(id) {
      if (id !== '\0' + manifestId) return null

      return `export default ${JSON.stringify(scanManifest(root))}`
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url || '').split('?')[0]

        if (!url.startsWith('/' + assetBase) || !url.endsWith('.json')) return next()

        const fileId = decodeURIComponent(url.slice(('/' + assetBase).length, -'.json'.length))

        const payload = payloadFor(fileId)

        if (!payload) {
          res.statusCode = 404

          return res.end('{}')
        }

        res.setHeader('Content-Type', 'application/json')

        return res.end(JSON.stringify(payload))
      })
    },
    generateBundle() {
      // Emit payloads only when asked — the root build passes its
      // default-tier flag so every tier shares one dist/docs-content/.
      if (!emitAssets) return

      const walk = (nodes) => {
        for (const node of nodes) {
          if (node.type === 'dir') {
            walk(node.children)
          } else {
            const payload = payloadFor(node.id)

            if (payload) {
              this.emitFile({
                type: 'asset',
                fileName: `${assetBase}${node.id.replace(':', '/')}.json`,
                source: JSON.stringify(payload),
              })
            }
          }
        }
      }

      for (const r of scanManifest(root).roots) walk(r.children)
    },
  }
}
