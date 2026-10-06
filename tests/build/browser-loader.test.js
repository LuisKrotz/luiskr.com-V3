/**
 * @file browser-loader.test.js — behavioral tests for scripts/build/browser-loader.js.
 * The loader is authored in strict ES5 (it must parse on IE-era engines) and
 * reads `window.__LK` — the manifest inlined by build-targets.mjs. Tests
 * execute the real file inside `new Function` against stubbed
 * window/document/navigator globals, so tier picking, polyfill ordering and
 * the browser hints all run the shipping code verbatim.
 */

import fs from 'node:fs'
import path from 'node:path'
import { TEST_UA } from '../fixtures/test-constants.js'
import { BROWSERS } from '@/core/browser/detect.js'

const LOADER = fs.readFileSync(
  path.join(process.cwd(), 'scripts', 'build', 'browser-loader.js'),
  'utf-8'
)

/**
 * Runs the loader IIFE inside a Function sandbox whose `window`/`document`/
 * `navigator` are plain stubs. Returns the stubs so callers can assert on
 * injected nodes, dataset attributes and the __LK_BROWSER hint bag.
 */
const runLoader = (ua, manifest, { canModule = true, appId = 'app', hasBody = true } = {}) => {
  const head = []
  const body = []
  const appEl = { appended: [], appendChild: (c) => appEl.appended.push(c) }
  const docEl = {
    attrs: {},
    setAttribute(k, v) {
      this.attrs[k] = v
    },
  }

  const document = {
    documentElement: docEl,
    head: {
      appendChild: (c) => {
        head.push(c)
        // execute injected polyfill scripts synchronously — the loader chains
        // polyfill→polyfill→bundle through onload callbacks
        if (c.onload) c.onload()
      },
    },
    // Real parses run this loader inside <head> — document.body is null until
    // the <body> tag is reached, which is exactly the state hasBody:false
    // reproduces.
    body: hasBody ? { appendChild: (c) => body.push(c) } : null,
    getElementById: (id) => (id === appId ? appEl : null),
    createElement: (tag) => {
      // 'noModule' in el is the module-support probe — the property must be
      // absent, not false, on engines that predate type=module
      const el = {
        attrs: {},
        setAttribute(k, v) {
          this.attrs[k] = v
        },
        appendChild() {},
      }

      if (tag === 'script' && canModule) el.noModule = true

      return el
    },
  }

  const window = { __LK: manifest }
  const navigator = { userAgent: ua }

  new Function('window', 'document', 'navigator', LOADER)(window, document, navigator)

  return { window, docEl, head, body, appEl }
}

/** A manifest whose probes all pass — mirrors the emitted __LK shape. */
const mkManifest = (over = {}) => ({
  targets: [
    {
      name: 'es2026',
      js: '/v/es2026/app.js',
      css: '/v/es2026/app.css',
      module: true,
      default: true,
      tests: ['typeof Promise === "function"'],
    },
    {
      name: 'es2016',
      js: '/v/es2016/app.js',
      css: '/v/es2016/app.css',
      module: false,
      tests: ['true'],
    },
  ],
  polys: [
    { name: 'fetch', file: '/p/fetch.js', guard: 'typeof fetch === "function"' },
    { name: 'io', file: '/p/io.js', guard: 'false' },
  ],
  order: ['fetch', 'io'],
  browsers: BROWSERS,
  ...over,
})

describe('browser-loader — engine detection', () => {
  test.each([
    ['SAMSUNG', 'samsung', '23'],
    ['FIREFOX', 'firefox', '133'],
    ['FIREFOX_ANDROID', 'firefox', '132'],
    ['EDGE', 'edge', '130'],
    ['OPERA', 'opera', '115'],
    ['CHROME', 'chrome', '130'],
    ['SAFARI', 'safari', '18'],
    ['IE11', 'ie', '11'],
    ['UNKNOWN', 'other', '0'],
  ])('stamps data-browser for %s', (key, name, major) => {
    const { docEl } = runLoader(TEST_UA[key], mkManifest())

    expect(docEl.attrs['data-browser']).toBe(name)
    expect(docEl.attrs['data-browser-major']).toBe(major)
  })

  test('Samsung Internet wins over the nested Chrome/Safari claims', () => {
    expect(TEST_UA.SAMSUNG).toMatch(/Chrome\/115/)

    const { window } = runLoader(TEST_UA.SAMSUNG, mkManifest())

    expect(window.__LK_BROWSER).toMatchObject({
      name: 'samsung',
      major: 23,
      webgpu: false,
      lowGpu: true,
    })
  })

  test('Firefox exposes the no-webgpu quirk; Chrome exposes none', () => {
    const ff = runLoader(TEST_UA.FIREFOX, mkManifest()).window.__LK_BROWSER
    const cr = runLoader(TEST_UA.CHROME, mkManifest()).window.__LK_BROWSER

    expect(ff.webgpu).toBe(false)
    expect('webgpu' in cr).toBe(false)
  })
})

describe('browser-loader — tier + polyfill selection', () => {
  test('picks the newest module tier when modules + import() pass', () => {
    const { head } = runLoader(TEST_UA.CHROME, mkManifest())

    const script = head.find((n) => n.src === '/v/es2026/app.js')

    expect(script.type).toBe('module')
    // default tier → css already in <head>, nothing injected
    expect(head.filter((n) => n.rel === 'stylesheet')).toHaveLength(0)
  })

  test('skips module tiers entirely when type=module is unsupported', () => {
    const { head } = runLoader(TEST_UA.CHROME, mkManifest(), { canModule: false })
    const script = head.find((n) => n.src === '/v/es2016/app.js')

    expect(script.type).toBeUndefined()
  })

  test('failing probes fall through to the next tier; none → fallback notice', () => {
    const manifest = mkManifest()

    manifest.targets[0].tests = ['typeof NeverExistsXYZ === "function"']

    const fallback = runLoader(TEST_UA.CHROME, manifest)

    expect(fallback.head.find((n) => n.src === '/v/es2016/app.js')).toBeTruthy()

    const dead = runLoader(TEST_UA.CHROME, mkManifest({ targets: [] }))
    const dead2 = runLoader(
      TEST_UA.CHROME,
      mkManifest({ targets: [{ name: 'x', tests: ['false'] }] })
    )

    expect(dead.appEl.appended.length + dead2.appEl.appended.length).toBeGreaterThan(0)
  })

  test('polyfills load only when their guard API is missing, in declared order', () => {
    const { head } = runLoader(TEST_UA.CHROME, mkManifest())

    // 'io' guard is hard-coded false → its file is queued; 'fetch' exists → skipped
    const scripts = head.filter((n) => n.src && n.src.startsWith('/p/'))

    expect(scripts.map((s) => s.src)).toEqual(['/p/io.js'])
  })

  test('non-default tier injects its stylesheet before the bundle', () => {
    const manifest = mkManifest()

    manifest.targets = manifest.targets.slice(1) // es2016 (not default)

    const { head } = runLoader(TEST_UA.CHROME, manifest)

    expect(head.find((n) => n.href === '/v/es2016/app.css')).toBeTruthy()
    expect(head.find((n) => n.src === '/v/es2016/app.js')).toBeTruthy()
  })

  test('runs during <head> parsing — document.body is null, nothing must throw', () => {
    const { head, docEl } = runLoader(TEST_UA.CHROME, mkManifest(), { hasBody: false })

    expect(head.find((n) => n.src === '/v/es2026/app.js')).toBeTruthy()
    expect(docEl.attrs['data-browser']).toBe('chrome')
  })

  test('missing manifest → early return, nothing stamped or injected', () => {
    const { docEl, head, body } = runLoader(TEST_UA.CHROME, undefined)

    expect(docEl.attrs['data-browser']).toBeUndefined()
    expect(head).toHaveLength(0)
    expect(body).toHaveLength(0)
  })
})
