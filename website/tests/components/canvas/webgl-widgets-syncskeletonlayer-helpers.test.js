/**
 * @file webgl-widgets-syncskeletonlayer-helpers.test.js
 * @description Split from webgl-widgets.test.js — covers the "syncSkeletonLayer helpers" describe.
 */
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals'
import {
  syncSkeletonLayer,
  destroySkeletonLayer,
} from '@core/utils/canvas/loaders/skeleton-webgl.js'
import { createMockGL, createMock2D } from '@tests/fixtures/mock-webgl.js'
import store from '@core/store.js'
import { PREF_MUTATIONS } from '@core/tokens/events/mutations.js'
import { WEBGL_STRINGS } from '@core/tokens/strings/webgl.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'
import { SKELETON_CLASSES } from '@core/tokens/classes/skeleton.js'

let mockGL
let mock2D
let origGetContext

beforeEach(() => {
  store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)

  mockGL = createMockGL()
  mock2D = createMock2D()

  const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype

  origGetContext = proto.getContext

  proto.getContext = function patchedGetContext(type) {
    if (String(type) === WEBGL_STRINGS.CONTEXT_2D) return mock2D
    if (/webgl/i.test(String(type))) return mockGL

    return null
  }
})

afterEach(() => {
  const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype

  proto.getContext = origGetContext

  document.documentElement.classList.remove(STATE_CLASSES.DARK_MODE)
})

const _makeCanvas = () => document.createElement(HTML_TAGS.CANVAS)

const _flushFrames = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms))

// ─── syncSkeletonLayer / destroySkeletonLayer helpers ────────────────────────
describe('syncSkeletonLayer helpers', () => {
  const makeComponent = () => {
    const el = document.createElement(HTML_TAGS.DIV)
    const shadow = el.attachShadow({ mode: STATE_STRINGS.OPEN })
    const content = document.createElement(HTML_TAGS.DIV)

    el._contentNode = content
    shadow.appendChild(content)
    document.body.appendChild(el)

    return { el, content }
  }

  test('creates a layer only when skeleton placeholders exist', () => {
    const { el, content } = makeComponent()

    syncSkeletonLayer(el)

    expect(el._skeletonLayer).toBeUndefined()

    const skel = document.createElement(HTML_TAGS.DIV)

    skel.className = SKELETON_CLASSES.SKELETON_BLOCK
    content.appendChild(skel)

    syncSkeletonLayer(el)

    expect(el._skeletonLayer).toBeTruthy()

    destroySkeletonLayer(el)

    expect(el._skeletonLayer).toBeNull()
  })

  test('resolve path when placeholders are removed', () => {
    const { el, content } = makeComponent()
    const skel = document.createElement(HTML_TAGS.DIV)

    skel.className = SKELETON_CLASSES.SKELETON_BLOCK
    content.appendChild(skel)

    syncSkeletonLayer(el)

    const layer = el._skeletonLayer

    content.innerHTML = ''

    syncSkeletonLayer(el)

    expect(el._skeletonLayer).toBeNull()
    expect(layer.resolveStart).toBeGreaterThan(0)
  })

  test('no-ops on components without a content node', () => {
    expect(() => syncSkeletonLayer({})).not.toThrow()
    expect(() => destroySkeletonLayer({})).not.toThrow()
  })
})
