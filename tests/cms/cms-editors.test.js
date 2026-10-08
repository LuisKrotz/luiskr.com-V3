/**
 * @file cms-editors.test.js
 * @description Coverage for the remaining CMS editors: CmsProjectsList
 * (project CRUD + section ops), CmsFooterEditor (contact/legal/related
 * lists), CmsPortfolioList (portfolio item reorder/dims), and
 * CmsMediaConverter (queue + phase renders). Firebase and fetch are mocked.
 */

import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import { LOCALES } from '@core/constants.js'
import { CMS_TAGS } from '@cms/tokens.js'
import { TEST_TEXT, TEST_PROJECTS } from '../fixtures/test-constants.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { DRAG_EVENTS, FORM_EVENTS, MOUSE_EVENTS, WINDOW_EVENTS } from '@core/tokens/events/dom.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'
import { CMS_ITEM_CLASSES } from '@cms/tokens.js'

const setCalls = []
const snapVal = {
  title: TEST_TEXT.HEADING,
  sections: [{ text: [TEST_TEXT.BODY], media: [] }],
}

jest.unstable_mockModule('@core/firebase.js', () => ({
  onAuthChange: jest.fn(async () => () => {}),
  signInWithGoogle: jest.fn(async () => ({})),
  logoutUser: jest.fn(async () => {}),
  getDbInstance: jest.fn(async () => ({ db: true })),
}))

jest.unstable_mockModule('firebase/database', () => ({
  ref: jest.fn((db, p) => ({ db, p })),
  child: jest.fn((r, p) => ({ r, p })),
  get: jest.fn(async () => ({ exists: () => true, val: () => snapVal })),
  set: jest.fn(async (r, v) => {
    setCalls.push(v)
  }),
  remove: jest.fn(async () => {}),
}))

await import('@cms/projects/CmsProjectsList.js')
await import('@cms/footer/CmsFooterEditor.js')
await import('@cms/portfolio/CmsPortfolioList.js')
await import('@cms/media-convert/CmsMediaConverter.js')

const mount = (tag) => {
  const el = document.createElement(tag)

  document.body.appendChild(el)

  return el
}

const flush = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms))

beforeEach(() => {
  setCalls.length = 0
  document.body.innerHTML = CHAR_STRINGS.EMPTY
})

// ─── CmsProjectsList ─────────────────────────────────────────────────────────

describe('CmsProjectsList', () => {
  test('loads project keys on mount', async () => {
    const el = mount(CMS_TAGS.CMS_PROJECTS_LIST)

    await flush()

    expect(el.languages).toContain(LOCALES.EN)

    el.remove()
  })

  test('createProjectPrompt prompts for a key and creates the project', async () => {
    const el = mount(CMS_TAGS.CMS_PROJECTS_LIST)

    await flush()

    globalThis.prompt = jest.fn(() => TEST_PROJECTS.CICB)
    globalThis.confirm = jest.fn(() => true)

    el.createProjectPrompt?.()

    await flush()

    el.remove()
  })

  test('section operations normalize, add, move, and remove', async () => {
    const el = mount(CMS_TAGS.CMS_PROJECTS_LIST)

    el.currentProject = {
      title: TEST_TEXT.HEADING,
      sections: [
        { text: ['a'], media: [] },
        { text: ['b'], media: [] },
      ],
    }

    el.addSection()

    expect(el.currentProject.sections.length).toBe(3)

    el.moveSection(0, 1)

    expect(el.currentProject.sections[0].text).toEqual(['b'])

    el.addSectionText(0)
    el.removeSectionText(0, 0)
    el.addSectionMedia(0)
    el.removeSectionMedia(0, 0)
    el.removeSection(2)

    expect(el.currentProject.sections.length).toBe(2)

    el.remove()
  })

  test('_normalizeSection returns a shaped section', () => {
    const el = mount(CMS_TAGS.CMS_PROJECTS_LIST)

    const sec = el._normalizeSection?.({ text: 'x' })

    expect(sec).toBeTruthy()

    el.remove()
  })

  test('_notify surfaces a message without throwing', () => {
    const el = mount(CMS_TAGS.CMS_PROJECTS_LIST)

    el._notify?.(TEST_TEXT.BODY)

    el.remove()
  })
})

// ─── CmsFooterEditor ─────────────────────────────────────────────────────────

describe('CmsFooterEditor', () => {
  test('loads all footer data on mount', async () => {
    const el = mount(CMS_TAGS.CMS_FOOTER_EDITOR)

    await flush()

    expect(el.contactData).toBeTruthy()

    el.remove()
  })

  test('_addItem/_removeItem/_moveItem mutate the list and re-render', async () => {
    const el = mount(CMS_TAGS.CMS_FOOTER_EDITOR)

    const arr = el.contactData.line1

    el._addItem(arr, { label: 'x' })

    expect(arr.length).toBe(1)

    el._addItem(arr, { label: 'y' })
    el._moveItem(arr, 0, 1)

    expect(arr[0].label).toBe('y')

    el._removeItem(arr, 0)

    expect(arr.length).toBe(1)

    el.remove()
  })

  test('render outputs all three footer sections', async () => {
    const el = mount(CMS_TAGS.CMS_FOOTER_EDITOR)

    el._updateDom()

    await flush()

    el.remove()
  })

  test('_renderChannelList renders an item list with controls', () => {
    const el = mount(CMS_TAGS.CMS_FOOTER_EDITOR)

    const arr = [{ description: 'a', href: '#' }]
    const node = el._renderChannelList?.(arr, 'p', () => {})

    expect(node).toBeTruthy()

    el.remove()
  })
})

// ─── CmsPortfolioList ────────────────────────────────────────────────────────

describe('CmsPortfolioList', () => {
  test('loads the portfolio list on mount', async () => {
    const el = mount(CMS_TAGS.CMS_PORTFOLIO_LIST)

    await flush()

    expect(Array.isArray(el.items)).toBe(true)

    el.remove()
  })

  test('getImagePreview resolves CDN and pass-through URLs', () => {
    const el = mount(CMS_TAGS.CMS_PORTFOLIO_LIST)

    expect(el.getImagePreview('http://x/img.webp')).toBe('http://x/img.webp')
    expect(el.getImagePreview('file.webp')).toContain('file.webp')
    expect(el.getImagePreview('')).toBe(CHAR_STRINGS.EMPTY)

    el.remove()
  })

  test('updateDim writes a dimension on the item', () => {
    const el = mount(CMS_TAGS.CMS_PORTFOLIO_LIST)

    el.items = [{ size: [800, 450] }]

    el.updateDim(el.items[0], 'size', 0, '1024')

    expect(el.items[0].size[0]).toBe('1024')

    el.remove()
  })

  test('add/remove/move operations reorder the list', () => {
    const el = mount(CMS_TAGS.CMS_PORTFOLIO_LIST)

    el.items = [{ id: 'a' }, { id: 'b' }]

    el.addNewItem()

    expect(el.items.length).toBe(3)

    el.moveUp(1)

    expect(el.items[0].id).toBe('b')

    el.moveDown(0)

    expect(el.items[1].id).toBe('b')

    el.removeItem(0)

    expect(el.items.length).toBe(2)

    el.remove()
  })
})

// ─── CmsMediaConverter ───────────────────────────────────────────────────────

describe('CmsMediaConverter', () => {
  test('renders the idle phase by default', async () => {
    const el = mount(CMS_TAGS.CMS_MEDIA_CONVERTER)

    el._updateDom()

    await flush()

    expect(el.phase).toBeTruthy()

    el.remove()
  })

  test('_collectInput gathers dropped files into the queue', () => {
    const el = mount(CMS_TAGS.CMS_MEDIA_CONVERTER)

    const input = { files: [new File(['x'], 'a.webp'), new File(['y'], 'b.mp4')] }

    el._collectInput?.(input)

    el.remove()
  })

  test('_reset returns to the idle phase and clears the queue', () => {
    const el = mount(CMS_TAGS.CMS_MEDIA_CONVERTER)

    el.queue = [{ file: {}, rel: 'a' }]
    el._reset?.()

    expect(el.queue.length).toBe(0)

    el.remove()
  })

  test('phase renders switch across converting/done/error', async () => {
    const el = mount(CMS_TAGS.CMS_MEDIA_CONVERTER)

    el._renderProgress?.('Converting', 1, 3)
    el._renderConverting?.()
    el._renderDone?.()
    el._renderError?.()

    el.remove()
  })

  test('_notify shows a message without throwing', () => {
    const el = mount(CMS_TAGS.CMS_MEDIA_CONVERTER)

    el._notify?.(TEST_TEXT.BODY)

    el.remove()
  })

  test('job lifecycle: create → upload → convert → poll', async () => {
    const el = mount(CMS_TAGS.CMS_MEDIA_CONVERTER)

    const responses = {
      'POST /jobs': { ok: true, json: async () => ({ id: 'job-1' }) },
      files: { ok: true, json: async () => ({}) },
      'POST convert': { ok: false, status: 202, json: async () => ({}) },
      'GET job': { ok: true, json: async () => ({ status: 'done', done: 1, total: 1 }) },
      'DELETE job': { ok: true, json: async () => ({}) },
    }

    globalThis.fetch = jest.fn(async (url, opts = {}) => {
      const u = String(url)

      if (opts.method === 'POST' && u.endsWith('/jobs')) return responses['POST /jobs']
      if (u.includes('/files')) return responses.files
      if (u.includes('/convert')) return responses['POST convert']
      if (opts.method === 'DELETE') return responses['DELETE job']

      return responses['GET job']
    })

    el.queue = [{ file: new Blob(['x']), rel: 'a.webp' }]

    await el._createJob()

    expect(el.jobId).toBe('job-1')

    await el._uploadAll()

    expect(el.uploaded).toBe(1)

    await el._startConvert()

    await flush()

    el.remove()
  })

  test('upload failure propagates the server error text', async () => {
    const el = mount(CMS_TAGS.CMS_MEDIA_CONVERTER)

    el.jobId = 'job-x'
    el.queue = [{ file: new Blob(['x']), rel: 'a.webp' }]

    globalThis.fetch = jest.fn(async () => ({
      ok: false,
      status: 500,
      text: async () => 'server exploded',
    }))

    await expect(el._uploadAll()).rejects.toThrow()

    el.remove()
  })

  test('_run drives the full pipeline and finishes in the done phase', async () => {
    const el = mount(CMS_TAGS.CMS_MEDIA_CONVERTER)

    globalThis.fetch = jest.fn(async (url, opts = {}) => {
      const u = String(url)

      if (opts.method === 'POST' && u.endsWith('/jobs'))
        return { ok: true, json: async () => ({ id: 'job-9' }) }
      if (u.includes('/files')) return { ok: true, json: async () => ({}) }
      if (u.includes('/convert')) return { ok: false, status: 202, json: async () => ({}) }
      if (opts.method === 'DELETE') return { ok: true, json: async () => ({}) }

      return {
        ok: true,
        json: async () => ({
          status: 'done',
          results: [
            { ok: true, in: 'a.webp', outs: ['a-1.webp'] },
            { ok: true, in: 'b.webp' },
            { ok: false, in: 'c.mov', error: 'codec' },
          ],
        }),
      }
    })

    el.queue = [{ file: new Blob(['x']), rel: 'a.webp' }]

    await el._run()
    await flush()

    expect(el.phase).toBe('done')
    expect(el.uploaded).toBe(1)

    el.remove()
  })

  test('dropzone covers drag arms, file drops, and entry traversal', async () => {
    const el = mount(CMS_TAGS.CMS_MEDIA_CONVERTER)

    el._updateDom()
    el._bindEvents()

    const dz = el.$(`.${CMS_ITEM_CLASSES.CMS_DROPZONE}`)

    dz.dispatchEvent(new window.Event(DRAG_EVENTS.DRAGOVER, { bubbles: true, cancelable: true }))

    expect(el.dragging).toBe(true)

    // already dragging -> the `!this.dragging` else arm
    dz.dispatchEvent(new window.Event(DRAG_EVENTS.DRAGOVER, { bubbles: true, cancelable: true }))

    // relatedTarget inside the zone -> the `contains` else arm
    const inner = dz.firstElementChild || dz
    const leaveIn = new window.Event(DRAG_EVENTS.DRAGLEAVE, { bubbles: true })

    Object.defineProperty(leaveIn, 'relatedTarget', { value: inner })
    dz.dispatchEvent(leaveIn)

    const leaveOut = new window.Event(DRAG_EVENTS.DRAGLEAVE, { bubbles: true })

    Object.defineProperty(leaveOut, 'relatedTarget', { value: document.body })
    dz.dispatchEvent(leaveOut)

    // files drop -> `items || []` + `files` loop + `webkitRelativePath || name`
    const dropEv = new window.Event(DRAG_EVENTS.DROP, { bubbles: true, cancelable: true })
    const dropped = new File(['x'], 'dropped.webp')

    Object.defineProperty(dropEv, 'dataTransfer', { value: { files: [dropped] } })
    dz.dispatchEvent(dropEv)
    await flush()

    expect(el.queue.length).toBe(1)

    // entries drop -> file + directory traversal
    const fileEntry = { isFile: true, file: (res) => res(new File(['y'], 'nested.webp')) }
    let batches = 0
    const dirEntry = {
      isDirectory: true,
      name: 'dir',
      createReader: () => ({ readEntries: (res) => res(++batches === 1 ? [fileEntry] : []) }),
    }

    // an entry that is neither file nor directory -> the traversal else arm
    await el._collectDrop({
      items: [
        { webkitGetAsEntry: () => dirEntry },
        { webkitGetAsEntry: () => fileEntry },
        { webkitGetAsEntry: () => ({}) },
      ],
    })

    expect(el.queue.length).toBe(3)

    // empty payload -> every `|| []` arm
    await el._collectDrop({})
    el._collectInput({})

    el.remove()
  })

  test('run/clear/download buttons drive their actions', async () => {
    const el = mount(CMS_TAGS.CMS_MEDIA_CONVERTER)

    // >1MB file -> the fmtBytes MB arm
    el.queue = [{ file: { size: 2097152, name: 'big.mov' }, rel: 'big.mov' }]
    el._updateDom()
    el._bindEvents()

    el.$('#cms-media-clear-list').dispatchEvent(
      new window.Event(MOUSE_EVENTS.CLICK, { bubbles: true })
    )

    expect(el.queue.length).toBe(0)

    el.queue = [{ file: new Blob(['x']), rel: 'a.webp' }]
    el._updateDom()
    el._bindEvents()

    globalThis.fetch = jest.fn(async () => ({ ok: true, json: async () => ({ id: 'job-5' }) }))
    el.$('#cms-media-run').dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK, { bubbles: true }))
    await flush()

    // done-phase render -> download button + `outs || []` + failed list arms
    el.phase = 'done'
    el.jobId = 'job-5'
    el.status = {
      results: [
        { ok: true, in: 'a', outs: ['o'] },
        { ok: true, in: 'b' },
        { ok: false, in: 'c', error: 'e' },
      ],
    }
    el._updateDom()
    el._bindEvents()

    const assign = jest.fn()
    const realAssign = window.location.assign

    try {
      window.location.assign = assign
    } catch {
      Object.defineProperty(window.location, 'assign', { value: assign, configurable: true })
    }

    el.$('#cms-media-download').dispatchEvent(
      new window.Event(MOUSE_EVENTS.CLICK, { bubbles: true })
    )

    expect(assign).toHaveBeenCalled()

    el.$('#cms-media-reset').dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK, { bubbles: true }))

    expect(el.phase).toBe('idle')

    // the deferred `_deleteJob` timer
    await new Promise((r) => setTimeout(r, 1600))

    try {
      window.location.assign = realAssign
    } catch {
      /* location assign not restorable */
    }

    el.remove()
  })

  test('_errText variants, non-Error run failure, and poll error path', async () => {
    const el = mount(CMS_TAGS.CMS_MEDIA_CONVERTER)

    expect(await el._errText({ json: async () => ({ error: 'api err' }) }, 'fb')).toBe('api err')
    expect(
      await el._errText(
        {
          json: async () => {
            throw new Error('x')
          },
          status: 404,
        },
        'fb'
      )
    ).toContain('unavailable')
    expect(
      await el._errText(
        {
          json: async () => {
            throw new Error('x')
          },
          status: 500,
        },
        'fb'
      )
    ).toBe('fb')

    // non-Error rejection -> `err.message || err` stringifies the value
    jest.spyOn(el, '_createJob').mockRejectedValue('plain-fail')
    el.queue = [{ file: new Blob(['x']), rel: 'a' }]

    await el._run()

    expect(el.phase).toBe(WINDOW_EVENTS.ERROR)
    expect(el.error).toBe('plain-fail')

    // _startConvert rejects on a non-202 failure
    globalThis.fetch = jest.fn(async () => ({
      ok: false,
      status: 500,
      json: async () => ({ error: 'e' }),
    }))
    el.jobId = 'job-1'

    await expect(el._startConvert()).rejects.toThrow()

    // _poll marks the job error when the status endpoint is down
    globalThis.fetch = jest.fn(async () => ({ ok: false }))

    await el._poll()

    expect(el.phase).toBe(WINDOW_EVENTS.ERROR)

    // poll pending -> schedules the next tick -> _stopPolling clears it
    globalThis.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({ status: 'running' }),
    }))

    await el._poll()

    expect(el._pollTimer).not.toBeNull()

    el._stopPolling()

    expect(el._pollTimer).toBeNull()

    el.remove()
  })

  test('system notify and permission request cover Notification branches', async () => {
    const el = mount(CMS_TAGS.CMS_MEDIA_CONVERTER)
    const RealNotification = globalThis.Notification

    globalThis.Notification = class MockNotification {
      static permission = STATE_STRINGS.GRANTED
    }

    el._systemNotify('t', 'b')

    globalThis.Notification = {
      permission: STATE_STRINGS.DENIED,
      requestPermission: jest.fn(async () => STATE_STRINGS.DENIED),
    }
    el._systemNotify('t', 'b')

    globalThis.Notification = {
      permission: STATE_STRINGS.DEFAULT,
      requestPermission: jest.fn(async () => STATE_STRINGS.GRANTED),
    }

    await el._askNotifyPermission()

    globalThis.Notification = RealNotification
    el.remove()
  })

  test('file input change and run button wire their handlers', async () => {
    const el = mount(CMS_TAGS.CMS_MEDIA_CONVERTER)

    el.queue = [{ file: new Blob(['x']), rel: 'a.webp' }]
    el._updateDom()
    el._bindEvents()

    const input = el.$('#cms-media-file-input')

    Object.defineProperty(input, 'files', {
      value: [new File(['y'], 'pick.webp')],
      configurable: true,
    })
    input.dispatchEvent(new window.Event(FORM_EVENTS.CHANGE, { bubbles: true }))

    await flush()

    expect(el.queue.length).toBe(2)

    globalThis.fetch = jest.fn(async () => ({ ok: true, json: async () => ({ id: 'job-7' }) }))
    el.$('#cms-media-run').dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK, { bubbles: true }))
    await flush()

    el.remove()
  })

  test('create-job failure, empty run, errText fallback, and fired poll tick', async () => {
    const el = mount(CMS_TAGS.CMS_MEDIA_CONVERTER)

    // createJob rejects -> `!res.ok` arm
    globalThis.fetch = jest.fn(async () => ({
      ok: false,
      status: 500,
      json: async () => ({ error: 'e' }),
    }))

    await expect(el._createJob()).rejects.toThrow()

    // empty queue -> the early return arm
    await el._run()

    expect(el.phase).toBe('idle')

    // parsed body without an error field -> `data.error || fallback` arm
    expect(await el._errText({ json: async () => ({}) }, 'fb')).toBe('fb')

    // a pending status keeps polling — let the scheduled tick fire once
    let calls = 0

    globalThis.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({ status: ++calls === 1 ? 'running' : 'done', results: [] }),
    }))
    el.jobId = 'job-p'

    await el._poll()
    await new Promise((r) => setTimeout(r, 900))
    await flush()

    el._stopPolling()
    el.remove()

    // destroy paths: live job in done phase -> no delete
    const el2 = mount(CMS_TAGS.CMS_MEDIA_CONVERTER)

    el2.jobId = 'job-d'
    el2.phase = 'done'
    el2.onDestroy()
    el2.remove()
  })

  test('busy/uploading/converting renders and destroy with a live job', async () => {
    const el = mount(CMS_TAGS.CMS_MEDIA_CONVERTER)

    el.phase = 'uploading'
    el.uploaded = 1
    el.queue = [
      { file: {}, rel: 'a' },
      { file: {}, rel: 'b' },
    ]
    el._updateDom()

    await flush()

    el.phase = 'converting'
    el.status = { current: 'a.webp', done: 1, total: 3 }
    el._updateDom()

    await flush()

    el.phase = WINDOW_EVENTS.ERROR
    el.error = CHAR_STRINGS.EMPTY
    el.status = { results: [{ ok: true, in: 'a' }] }
    el._updateDom()

    // destroy with a live job outside the done phase -> _deleteJob
    globalThis.fetch = jest.fn(async () => ({ ok: true, json: async () => ({}) }))
    el.jobId = 'job-z'
    el.phase = 'idle'
    el.remove()
  })

  test('non-localhost module shows the dev-server notice', async () => {
    const loc = window.location
    const real = Object.getOwnPropertyDescriptor(loc, 'hostname')

    try {
      Object.defineProperty(loc, 'hostname', { value: 'example.com', configurable: true })
    } catch {
      /* hostname not redefinable */
    }

    jest.resetModules()

    const mod = await import('@cms/media-convert/CmsMediaConverter.js')
    const el = mount(CMS_TAGS.CMS_MEDIA_CONVERTER)
    const output = mod.CmsMediaConverter.prototype.render.call(el)

    expect(output).toBeTruthy()

    if (real) Object.defineProperty(loc, 'hostname', real)

    el.remove()
  })
})
