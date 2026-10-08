/**
 * @file final-tails.test.js
 * @description Split from coverage-tails-7.test.js — covers the "final tails" describe.
 */
import { jest } from '@jest/globals'
import { CMS_LIST_PREFIXES, CMS_TAGS } from '@cms/tokens.js'
import { DATA_ATTRS } from '@core/tokens/attrs/data.js'
import { FORM_EVENTS, MOUSE_EVENTS } from '@core/tokens/events/dom.js'
import { createMock2D, createMockGL } from '@tests/fixtures/mock-webgl.js'

import '@cms/about/CmsAboutEditor.js'
import '@cms/portfolio/CmsPortfolioList.js'
import '@cms/projects/CmsProjectsList.js'
import '@cms/playground-editor/CmsPlaygroundEditor.js'
import '@cms/footer/CmsFooterEditor.js'
import '@cms/deploy-info/CmsDeployInfo.js'

import '@earth/earth/setup/bootstrap.js'

import '@core/utils/canvas/css-color.js'

import '@core/utils/canvas/widgets/flag/renderer.js'
import '@core/utils/canvas/widgets/flag/texture.js'

import '@core/utils/gpu/gpu-accel.js'
import '@website/components/media/draw-text/render.js'
import '@website/views/project/data.js'

import _router from '@core/router/router.js'
import '@earth/space/panel-render.js'
import { SP_INPUT_TYPES } from '@earth/space/controls.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { CMS_PROJECTS_CLASSES } from '@cms/tokens.js'

globalThis.alert = jest.fn()

const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

const makeCanvas = () => document.createElement(HTML_TAGS.CANVAS)

describe('final tails', () => {
  test('cms render delegates — paragraph/mention/item bodies', async () => {
    await import('@cms/about/CmsAboutEditor.js')
    await import('@cms/portfolio/CmsPortfolioList.js')

    const about = document.createElement(CMS_TAGS.CMS_ABOUT_EDITOR)

    about._renderParagraphList('col1')
    about._renderMentionItems()

    const pf = document.createElement(CMS_TAGS.CMS_PORTFOLIO_LIST)

    pf._renderItem({ title: 'x' }, 0)
  })

  test('footer list out-of-range idx arm via re-bound stray', async () => {
    const el = document.createElement(CMS_TAGS.CMS_FOOTER_EDITOR)

    document.body.appendChild(el)
    await flush()

    const stray = document.createElement('input')

    stray.className = `${CMS_LIST_PREFIXES.LINE1}-label`
    stray.setAttribute(DATA_ATTRS.DATA_IDX, '99')
    el.shadowRoot.appendChild(stray)

    // re-bind so the stray is wired, then dispatch → arr[99] falsy arm
    el._bindEvents()

    stray.dispatchEvent(new window.Event(FORM_EVENTS.INPUT, { bubbles: true }))

    el.remove()
  })

  test('projects events — attr-fallback arms on bound strays', async () => {
    const el = document.createElement(CMS_TAGS.CMS_PROJECTS_LIST)

    document.body.appendChild(el)
    await flush()

    el.currentProject = { id: 'p', sections: [] }

    const strayClasses = [
      CMS_PROJECTS_CLASSES.SEC_UP,
      CMS_PROJECTS_CLASSES.SEC_DOWN,
      CMS_PROJECTS_CLASSES.SEC_DEL,
      CMS_PROJECTS_CLASSES.SEC_ADD_TEXT,
      CMS_PROJECTS_CLASSES.SEC_ADD_MEDIA,
    ]
    const strays = strayClasses.map((cls) => {
      const s = document.createElement('button')

      s.className = cls
      el.shadowRoot.appendChild(s)

      return s
    })

    const mediaStray = document.createElement('input')

    mediaStray.className = CMS_PROJECTS_CLASSES.MEDIA_SRC
    el.shadowRoot.appendChild(mediaStray)

    el._bindEvents()

    strays.forEach((s) =>
      s.dispatchEvent(new window.MouseEvent(MOUSE_EVENTS.CLICK, { bubbles: true }))
    )

    // if(cp) false arm — media input with no current project
    el.currentProject = null
    mediaStray.dispatchEvent(new window.Event(FORM_EVENTS.INPUT, { bubbles: true }))

    el.remove()
  })

  test('AboutSection gravatar getters — empty-profile arms', async () => {
    await import('@website/components/home/AboutSection.js')

    const { COMPONENT_TAGS } = await import('@core/tokens/elements/components.js')
    const el = document.createElement(COMPONENT_TAGS.ABOUT_SECTION)

    el.profilePicture = ''
    expect(el.optimizedProfilePicture).toBeDefined()
    expect(el.profilePictureSrcset).toBeDefined()

    el.profilePicture = 'https://gravatar.com/avatar/x'
    expect(el.optimizedProfilePicture).toBeTruthy()
    expect(el.profilePictureSrcset).toBeTruthy()
  })

  test('AwardsMentions null-items arm', async () => {
    await import('@website/components/home/AwardsMentions.js')

    const { COMPONENT_TAGS } = await import('@core/tokens/elements/components.js')
    const el = document.createElement(COMPONENT_TAGS.AWARDS_MENTIONS)

    document.body.appendChild(el)
    el.items = null

    await flush()
    el.remove()
  })

  test('draw-text tag-token inner arms', async () => {
    const { renderContent } = await import('@website/components/media/draw-text/render.js')

    // space chunk inside a tag → NBSP arm
    expect(renderContent('<em>x y</em>', 5, 0)).toBeTruthy()

    // empty <a> inner → token.inner || EMPTY arm
    expect(renderContent('<a href="/x"></a>', 5, 0)).toBeTruthy()

    // tag carrying an aria-label → includes() false arm
    expect(renderContent('<a href="/x" aria-label="z">t</a>', 5, 0)).toBeTruthy()
  })

  test('earth bootstrap — resize-listener fn + post-compile disposed arm', async () => {
    const { bootstrapEarth: boot } = await import('@earth/earth/setup/bootstrap.js')
    const { createEarthState: mkState } = await import('@earth/earth/runtime/state.js')

    // dispose mid-boot via onProgress → the post-compile s.disposed check hits
    const s = mkState(document.createElement(HTML_TAGS.CANVAS), undefined, () => {
      s.disposed = true
    })

    await boot(s)

    // resize-listener arrow identity
    const s2 = mkState(document.createElement(HTML_TAGS.CANVAS), undefined, undefined)

    await boot(s2)

    if (typeof s2.onResize === 'function') s2.onResize()

    s2.disposed = true
  }, 15000)

  test('buildMoonLod null-loader arm + happy path', async () => {
    const { buildMoonLod } = await import('@earth/earth/scene/meshes.js')
    const THREE = await import('three')

    expect(await buildMoonLod({ THREE, loader: null })).toBeTruthy()
    expect(await buildMoonLod({ THREE, loader: new THREE.TextureLoader() })).toBeTruthy()
  })

  test('space boot — EarthBackground.init rejection → catch arm', async () => {
    const { initSpaceEarth } = await import('@earth/space/boot.js')
    const { EarthBackground } = await import('@earth/earth-background.js')
    const initSpy = jest
      .spyOn(EarthBackground.prototype, 'init')
      .mockRejectedValue(new Error('boot-fail'))
    const c = {
      _earthBg: null,
      _earthReady: false,
      _isInitializingEarth: false,
      _getCanvasEl: () => document.createElement(HTML_TAGS.CANVAS),
      $: () => null,
      _updateLoader: jest.fn(),
      _applyPersistedSettings: jest.fn(),
      _syncPanel: jest.fn(),
      _dismissLoader: jest.fn(),
    }

    initSpaceEarth(c)
    await flush(100)

    expect(c._earthReady).toBe(true)
    expect(c._isInitializingEarth).toBe(false)
    expect(c._dismissLoader).toHaveBeenCalled()

    initSpy.mockRestore()
  })

  test('renderSpControl range — missing min/max ?? arms', async () => {
    const { renderSpControl } = await import('@earth/space/panel-render.js')
    const ctrl = { label: 'lbl', param: 'p', type: SP_INPUT_TYPES.RANGE, step: 0.1, def: 0.5 }

    expect(renderSpControl(ctrl, {}, undefined)).toBeTruthy()
  })

  test('resolveProjectSlug match-null + loadData default-wait arms', async () => {
    const { resolveProjectSlug, loadData } = await import('@website/views/project/data.js')
    const { default: freshRouter } = await import('@core/router/router.js')
    const prev = freshRouter.currentRoute

    freshRouter.currentRoute = { params: {} }
    window.history.pushState({}, '', '/no-match')
    expect(resolveProjectSlug({})).toBe('')

    // loadData default wait=false arm + !projectKey early return
    loadData({ projectSlug: '' })

    freshRouter.currentRoute = prev
  })

  test('parseCssColor 3-char hex expansion arm', async () => {
    const { parseCssColor } = await import('@core/utils/canvas/css-color.js')

    expect(parseCssColor('#f80')).toBeTruthy()
    expect(parseCssColor('#ff8800')).toBeTruthy()
  })

  test('flag loadImages — no-renderer / single-code / animId arms', async () => {
    const { FlagWebGL } = await import('@core/utils/canvas/widgets/flag-webgl.js')
    const { flagRenderer: pool } = await import('@core/utils/canvas/widgets/flag/renderer.js')

    // renderer null → early return
    const f1 = new FlagWebGL(makeCanvas(), { code: 'en', cc: 'us', cc2: null })

    f1.loadImages()

    // single code → imgs[1] falsy arm; animId set → skip _renderStatic arm
    const f2 = new FlagWebGL(makeCanvas(), { code: 'en', cc: 'us', cc2: null })

    f2.renderer = pool

    pool.images.set('us', {
      complete: true,
      naturalWidth: 10,
      naturalHeight: 5,
      addEventListener() {},
    })
    f2.animId = 1
    f2.loadImages()
    expect(f2.isLoaded).toBe(true)

    f2.animId = 0
    f2.isLoaded = false
    f2.loadImages()

    f2.destroy?.()
    f1.destroy?.()
  })

  test('flagTexture — pot-canvas 2d + GL texture-creation path', async () => {
    const { flagTexture } = await import('@core/utils/canvas/widgets/flag/texture.js')
    const origCreate = document.createElement.bind(document)
    const mock2d = { imageSmoothingEnabled: '', imageSmoothingQuality: '', drawImage() {} }

    document.createElement = (t) =>
      t === 'canvas' ? { width: 0, height: 0, getContext: () => mock2d } : origCreate(t)

    const gl = createMockGL()
    const r = { gl, textures: new Map(), images: new Map(), bitmaps: new Map() }

    r.images.set('us', { complete: true, naturalWidth: 10, naturalHeight: 5 })

    const tex = flagTexture(r, 'us')

    document.createElement = origCreate

    expect(tex).toBeTruthy()

    // second call → the real cache-hit arm
    expect(flagTexture(r, 'us')).toBe(tex)

    // ctx null → !ctx arm
    document.createElement = (t) =>
      t === 'canvas' ? { width: 0, height: 0, getContext: () => null } : origCreate(t)
    r.images.set('de', { complete: true, naturalWidth: 8, naturalHeight: 4 })
    expect(flagTexture(r, 'de')).toBeNull()
    document.createElement = origCreate
  })

  test('switch-slider renderCanvas2D — null-canvas ?? arms', async () => {
    const { renderCanvas2D } = await import('@core/utils/canvas/widgets/switch-slider/render.js')
    const host = {
      gl: null,
      canvas: null,
      ctx: createMock2D(),
      targetP: 1,
      currentP: 0,
      knobX: 0,
      contextType: 'stats',
      height: 10,
      startTime: 0,
      _pToKnobX: () => 0,
    }

    renderCanvas2D(host, 0)

    host.canvas = { width: 10, height: 10 }
    renderCanvas2D(host, 16)
  })

  test('gpu-accel — upload path, warn sink, webgl1 fallback arm', async () => {
    const { gpuAccel } = await import('@core/utils/gpu/gpu-accel.js')

    // _uploadTextureAndDraw: guard arm then live arm
    gpuAccel._uploadTextureAndDraw({}, 1, 1)

    gpuAccel.canvas = { width: 0, height: 0 }
    gpuAccel.gl = createMockGL()
    gpuAccel.program = {}
    gpuAccel.texture = {}
    gpuAccel._uploadTextureAndDraw({ width: 1, height: 1 }, 1, 1)

    // warn sink: getContext → gl whose compile fails → warn() runs
    const failGl = new Proxy(
      {},
      {
        get(_t, p) {
          if (p === 'getShaderParameter' || p === 'getProgramParameter') return () => false
          if (p === 'getShaderInfoLog' || p === 'getProgramInfoLog') return () => 'fail'

          return () => {}
        },
      }
    )
    const origCreate = document.createElement.bind(document)

    document.createElement = (t) =>
      t === 'canvas' ? { width: 0, height: 0, getContext: () => failGl } : origCreate(t)
    gpuAccel.initGPU()
    document.createElement = origCreate

    // webgl2 null → webgl1 fallback context arm
    let calls = 0
    const halfGl = createMockGL()

    document.createElement = (t) =>
      t === 'canvas'
        ? { width: 0, height: 0, getContext: () => (calls++ === 0 ? null : halfGl) }
        : origCreate(t)
    gpuAccel.initGPU()
    document.createElement = origCreate

    gpuAccel.canvas = null
    gpuAccel.gl = null
    gpuAccel.program = null
    gpuAccel.texture = null
  })
})
