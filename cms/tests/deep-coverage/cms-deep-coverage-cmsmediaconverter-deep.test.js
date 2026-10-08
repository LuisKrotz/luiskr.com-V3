/**
 * @file cms-deep-coverage-cmsmediaconverter-deep.test.js
 * @description Split from cms-deep-coverage.test.js — covers the "CmsMediaConverter deep" describe.
 */
import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import { CMS_TAGS } from '@cms/tokens.js'
import { TEST_TEXT } from '@tests/fixtures/test-constants.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { WINDOW_EVENTS } from '@core/tokens/events/dom.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'

const authCallbacks = []
const setCalls = []
const removeCalls = []

// Path-keyed snapshot routing: each test registers matchers against the
// Firebase path fragment so one `get` mock can serve different nodes.
const snapRoutes = []
const defaultVal = { title: TEST_TEXT.HEADING }

const snapOf = (val, exists = true) => ({ exists: () => exists, val: () => val })

jest.unstable_mockModule('@core/firebase.js', () => ({
  onAuthChange: jest.fn(async (cb) => {
    authCallbacks.push(cb)

    return () => {}
  }),
  signInWithGoogle: jest.fn(async () => ({ user: { uid: 'u1' } })),
  logoutUser: jest.fn(async () => {}),
  getDbInstance: jest.fn(async () => ({ db: true })),
}))

jest.unstable_mockModule('firebase/database', () => ({
  ref: jest.fn((db, p) => ({ db, p })),
  child: jest.fn((r, p) => ({ r, p })),
  get: jest.fn(async (arg) => {
    const p = String(arg?.p ?? arg?.r?.p ?? CHAR_STRINGS.EMPTY)
    const hit = snapRoutes.find((route) => p.includes(route.match))

    return hit ? hit.snap() : snapOf(defaultVal)
  }),
  set: jest.fn(async (r, v) => {
    if (snapRoutes.failSet === 'str') throw 'set exploded'
    if (snapRoutes.failSet) throw new Error('set exploded')

    setCalls.push({ path: r?.p, value: v })
  }),
  remove: jest.fn(async (r) => {
    removeCalls.push(r?.p)
  }),
}))

await import('@cms/about/CmsAboutEditor.js')
await import('@cms/footer/CmsFooterEditor.js')
await import('@cms/portfolio/CmsPortfolioList.js')
await import('@cms/media-convert/CmsMediaConverter.js')
await import('@cms/projects/CmsProjectsList.js')
await import('@cms/lang/CmsLangEditor.js')
await import('@cms/playground-editor/CmsPlaygroundEditor.js')
await import('@cms/deploy-info/CmsDeployInfo.js')
await import('@cms/routes/CmsDashboard.js')
await import('@cms/routes/AdminLogin.js')

const mount = (tag) => {
  const el = document.createElement(tag)

  document.body.appendChild(el)

  return el
}

const flush = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms))

const alerts = []
const confirms = []

beforeEach(() => {
  snapRoutes.length = 0
  snapRoutes.failSet = false
  setCalls.length = 0
  removeCalls.length = 0
  authCallbacks.length = 0
  alerts.length = 0
  confirms.length = 0
  document.body.innerHTML = CHAR_STRINGS.EMPTY

  globalThis.alert = (m) => alerts.push(String(m))
  globalThis.confirm = () => confirms.length === 0 || confirms.shift()
  globalThis.prompt = () => null
})

const _fire = (el, sel, eventType, value) => {
  const node = el.shadowRoot.querySelector(sel)

  if (!node) return null

  if (value !== undefined) node.value = value

  node.dispatchEvent(new window.Event(eventType, { bubbles: true }))

  return node
}

// ─── CmsMediaConverter ───────────────────────────────────────────────────────
describe('CmsMediaConverter deep', () => {
  test('_collectDrop walks file and directory entries recursively', async () => {
    const el = mount(CMS_TAGS.CMS_MEDIA_CONVERTER)
    const fileEntry = {
      isFile: true,
      name: 'a.webp',
      file: (res) => res({ name: 'a.webp' }),
    }
    let reads = 0
    const dirEntry = {
      isDirectory: true,
      name: 'dir',
      createReader: () => ({
        readEntries: (res) => res(reads++ === 0 ? [fileEntry] : []),
      }),
    }

    await el._collectDrop({
      items: [{ webkitGetAsEntry: () => fileEntry }, { webkitGetAsEntry: () => dirEntry }],
    })

    expect(el.queue).toHaveLength(2)
    expect(el.queue[1].rel).toContain('dir/')

    el.remove()
  })

  test('_collectDrop falls back to dataTransfer.files without entries', async () => {
    const el = mount(CMS_TAGS.CMS_MEDIA_CONVERTER)

    await el._collectDrop({
      items: [{}],
      files: [{ name: 'x.webp', webkitRelativePath: '' }],
    })

    expect(el.queue).toHaveLength(1)
    expect(el.queue[0].rel).toBe('x.webp')

    el.remove()
  })

  test('non-media files are ignored on drop and input', async () => {
    const el = mount(CMS_TAGS.CMS_MEDIA_CONVERTER)
    const iniEntry = {
      isFile: true,
      file: (res) => res(new File(['x'], 'desktop.ini')),
    }
    const jpgEntry = {
      isFile: true,
      file: (res) => res(new File(['x'], 'shot.JPG')),
    }

    // entry-traversal path: OS litter inside a dropped folder is skipped
    await el._collectDrop({
      items: [{ webkitGetAsEntry: () => iniEntry }, { webkitGetAsEntry: () => jpgEntry }],
    })

    expect(el.queue).toHaveLength(1)
    expect(el.queue[0].rel).toBe('shot.JPG')

    // dataTransfer.files fallback path
    await el._collectDrop({
      items: [{}],
      files: [
        { name: 'Thumbs.db', webkitRelativePath: 'dir/Thumbs.db' },
        { name: 'clip.webm', webkitRelativePath: '' },
      ],
    })

    expect(el.queue).toHaveLength(2)

    // <input type=file> path
    el._collectInput({
      files: [new File(['x'], 'notes.txt'), new File(['x'], 'pic.png')],
    })

    expect(el.queue).toHaveLength(3)
    expect(el.queue[2].rel).toBe('pic.png')

    el.remove()
  })

  test('_run early-returns on an empty queue', async () => {
    const el = mount(CMS_TAGS.CMS_MEDIA_CONVERTER)
    const fetchSpy = jest.fn()

    globalThis.fetch = fetchSpy

    await el._run()

    expect(fetchSpy).not.toHaveBeenCalled()

    el.remove()
  })

  test('_run surfaces server errors in the error phase', async () => {
    const el = mount(CMS_TAGS.CMS_MEDIA_CONVERTER)

    el.queue = [{ file: new Blob(['x']), rel: 'a.webp' }]

    globalThis.fetch = jest.fn(async () => ({
      ok: false,
      status: 500,
      json: async () => ({ error: 'boom' }),
      text: async () => 'boom',
    }))

    await el._run()

    expect(el.phase).toBe(WINDOW_EVENTS.ERROR)
    expect(el.error).toContain('boom')

    el.remove()
  })

  test('_poll schedules the next tick while running and finishes on done', async () => {
    const el = mount(CMS_TAGS.CMS_MEDIA_CONVERTER)

    el.jobId = 'j1'

    let calls = 0

    globalThis.fetch = jest.fn(async () => ({
      ok: true,
      json: async () =>
        calls++ === 0
          ? { status: 'running' }
          : { status: 'done', results: [{ ok: true }, { ok: false }] },
    }))

    await el._poll()

    expect(el._pollTimer).toBeTruthy()

    await new Promise((resolve) => setTimeout(resolve, 900))

    expect(el.phase).toBe('done')
    expect(el.status.results).toHaveLength(2)

    el.remove()
  })

  test('_poll flips to error when the server stops answering', async () => {
    const el = mount(CMS_TAGS.CMS_MEDIA_CONVERTER)

    el.jobId = 'j2'

    globalThis.fetch = jest.fn(async () => ({ ok: false }))

    await el._poll()

    expect(el.phase).toBe(WINDOW_EVENTS.ERROR)
    expect(el.error).toContain('lost contact')

    el.remove()
  })

  test('_finish reports zero conversions as an error', async () => {
    const el = mount(CMS_TAGS.CMS_MEDIA_CONVERTER)

    el.status = { status: 'done', results: [{ ok: false }], error: 'all failed' }
    el._finish()

    expect(el.phase).toBe(WINDOW_EVENTS.ERROR)
    expect(el.error).toBe('all failed')

    el.remove()
  })

  test('_systemNotify and _askNotifyPermission respect the Notification API', async () => {
    const el = mount(CMS_TAGS.CMS_MEDIA_CONVERTER)

    globalThis.Notification = class {
      static permission = STATE_STRINGS.DEFAULT
      static requestPermission = jest.fn(async () => STATE_STRINGS.GRANTED)
    }

    await el._askNotifyPermission()

    expect(globalThis.Notification.requestPermission).toHaveBeenCalled()

    globalThis.Notification.permission = STATE_STRINGS.GRANTED
    el._systemNotify('t', 'b')

    delete globalThis.Notification

    el._systemNotify('t', 'b')

    el.remove()
  })

  test('onDestroy deletes an unfinished job', async () => {
    const el = mount(CMS_TAGS.CMS_MEDIA_CONVERTER)
    const deleted = []

    globalThis.fetch = jest.fn(async (url, opts = {}) => {
      if (opts.method === 'DELETE') deleted.push(String(url))

      return { ok: true, json: async () => ({}) }
    })

    el.jobId = 'j3'
    el.phase = 'converting'

    el.remove()
    el.onDestroy()

    await flush(20)

    expect(deleted.length).toBeGreaterThan(0)
  })
})
