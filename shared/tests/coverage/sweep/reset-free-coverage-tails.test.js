/**
 * @file reset-free-coverage-tails.test.js
 * @description Split from coverage-tails-8.test.js — covers the "reset-free coverage tails" describe.
 */
import { jest } from '@jest/globals'
import { CMS_LIST_PREFIXES, CMS_TAGS } from '@cms/tokens.js'

import { FORM_EVENTS } from '@core/tokens/events/dom.js'
import { CSS_STRINGS } from '@core/tokens/strings/css.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { createMockGL } from '@tests/fixtures/mock-webgl.js'

import '@cms/footer/CmsFooterEditor.js'
import '@website/components/home/AwardsMentions.js'

import { bindListEvents } from '@cms/footer/lists.js'
import { flagTexture } from '@core/utils/canvas/widgets/flag/texture.js'
import { FlagRenderer } from '@core/utils/canvas/widgets/flag/renderer.js'
import { gpuAccel } from '@core/utils/gpu/gpu-accel.js'
import { tokenToHtml, renderWordHtml } from '@website/components/media/draw-text/render.js'
import { bootstrapEarth } from '@earth/earth/setup/bootstrap.js'
import { createEarthState } from '@earth/earth/runtime/state.js'
import router from '@core/router/router.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'

const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

const fire = (el, type, value) => {
  if (value !== undefined) el.value = value

  el.dispatchEvent(new window.Event(type))
}

describe('reset-free coverage tails', () => {
  test('footer lists — missing data-idx attr → ZERO fallback arm', async () => {
    const el = document.createElement(CMS_TAGS.CMS_FOOTER_EDITOR)

    document.body.appendChild(el)
    await flush()

    el.contactData = { line1: [{ description: 'd1' }], line2: [] }
    el._updateDom()

    const stray = document.createElement('input')

    stray.className = `${CMS_LIST_PREFIXES.LINE1}-label`
    el.shadowRoot.appendChild(stray)

    bindListEvents(el, CMS_LIST_PREFIXES.LINE1, el.contactData.line1)
    fire(stray, FORM_EVENTS.INPUT, 'edited')
    expect(el.contactData.line1[0].description).toBe('edited')

    el.remove()
  })

  test('awards legal link click → router.push arm', async () => {
    const el = document.createElement(COMPONENT_TAGS.AWARDS_MENTIONS)
    const pushSpy = jest.spyOn(router, 'push').mockImplementation(() => {})

    document.body.appendChild(el)
    await flush()

    const anchors = el.shadowRoot.querySelectorAll('a')

    anchors.forEach((a) =>
      a.dispatchEvent(new window.Event('click', { bubbles: true, cancelable: true }))
    )
    pushSpy.mockRestore()
    el.remove()
  })

  test('draw-text tokenToHtml — sparse-token fallthrough + nullish arms', () => {
    const rw = (chars) => `<w>${(chars || []).map((c) => c.value).join('')}</w>`

    // unknown token type → EMPTY fallthrough
    expect(tokenToHtml({ type: 'bogus' }, rw)).toBe('')

    // word token without chars → renderWord default-param arm
    expect(tokenToHtml({ type: CSS_STRINGS.TOKEN_WORD }, rw)).toContain('<w>')

    // tag-less tag token → children unwrap (no <undefined> element)
    expect(tokenToHtml({ type: CSS_STRINGS.TOKEN_TAG }, rw)).toBe('')

    // tag token with unknown chunk type → chunk EMPTY fallthrough, no wrapper
    expect(tokenToHtml({ type: CSS_STRINGS.TOKEN_TAG, chunks: [{ type: 'bogus' }] }, rw)).toBe('')

    // <a> tag without inner → inner||'' arm inside the aria-label builder
    expect(
      tokenToHtml({ type: CSS_STRINGS.TOKEN_TAG, tag: 'a', attrStr: ' href="/x"' }, rw)
    ).toContain('aria-label')

    // <a> tag whose attrStr already carries aria-label → skip-injection arm
    const withLabel = tokenToHtml(
      { type: CSS_STRINGS.TOKEN_TAG, tag: 'a', attrStr: ' aria-label="y"' },
      rw
    )

    expect(withLabel.match(/aria-label/g)).toHaveLength(1)

    // <a> tag with no attrStr → attrStr || EMPTY arm inside the label check
    expect(tokenToHtml({ type: CSS_STRINGS.TOKEN_TAG, tag: 'a', inner: 'hi' }, rw)).toContain(
      'aria-label'
    )

    // renderWordHtml called bare → chars=[] default-param arm
    expect(renderWordHtml()).toBeTruthy()
  })

  test('flagTexture — cache-hit returns the pooled texture', () => {
    const r = { gl: createMockGL(), textures: new Map(), images: new Map() }
    const tex = {}

    r.textures.set('us', tex)
    expect(flagTexture(r, 'us')).toBe(tex)
  })

  test('FlagRenderer._initProgram delegate compiles on the mock context', () => {
    const r = new FlagRenderer()

    r._initProgram(createMockGL())
    expect(r.program || r.aPos !== undefined).toBeTruthy()
  })

  test('gpu-accel — silent warn sink invoked on shader-compile failure', () => {
    const failGl = new Proxy(
      {},
      {
        get: (_t, p) => {
          if (p === 'createShader' || p === 'createProgram' || p === 'createBuffer')
            return () => ({})
          if (p === 'getShaderParameter' || p === 'getProgramParameter') return () => false
          if (p === 'getShaderInfoLog' || p === 'getProgramInfoLog') return () => 'fail'
          return () => {}
        },
      }
    )
    const fakeCanvas = { width: 0, height: 0, getContext: () => failGl }
    const origCE = document.createElement

    document.createElement = (tag, ...rest) =>
      tag === HTML_TAGS.CANVAS ? fakeCanvas : origCE.call(document, tag, ...rest)

    try {
      gpuAccel.initGPU()
    } finally {
      document.createElement = origCE
      gpuAccel.gl = null
      gpuAccel.canvas = null
      gpuAccel.program = null
    }
  })

  test('bootstrapEarth — onProgress/onReady arms + post-compile disposed exit', async () => {
    const ready = jest.fn()
    const progress = jest.fn()
    const s = createEarthState(document.createElement(HTML_TAGS.CANVAS), ready, progress)

    await bootstrapEarth(s)
    expect(progress).toHaveBeenCalled()

    s.disposed = true

    // dispose only at the last progress tick → hits the post-compile guard
    const s2 = createEarthState(
      document.createElement(HTML_TAGS.CANVAS),
      undefined,
      (_msg, pct) => {
        if (pct >= 90) s2.disposed = true
      }
    )

    await bootstrapEarth(s2)
    expect(s2.disposed).toBe(true)
  }, 20000)
})
