/**
 * @file menu-software-renderer-tails.test.js
 * @description Coverage tail for the software-rasterizer rejection in
 * MenuBackgroundWebGL.initGL — a dedicated file because getGPUInfo()
 * caches its probe per module registry, so every context in this file
 * reports a software renderer (SwiftShader) from the first call.
 */
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals'
import { MenuBackgroundWebGL } from '@core/utils/canvas/loaders/menu-background-webgl.js'
import { TEST_GPU } from '../../../fixtures/test-constants.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { NAV_MENU_CLASSES } from '@core/tokens/classes/nav.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'




let origGetContext

beforeEach(() => {
  const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype

  origGetContext = proto.getContext

  proto.getContext = function patchedGetContext(type) {
    if (/webgl/i.test(String(type))) {
      return {
        getExtension: () => ({ UNMASKED_RENDERER_WEBGL: 1 }),
        getParameter: () => TEST_GPU.SOFTWARE_RENDERER }
    }

    return null
  }
})

afterEach(() => {
  const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype

  proto.getContext = origGetContext

  document.body.innerHTML = ''
})

describe('MenuBackgroundWebGL software-renderer rejection', () => {
  test('a CPU rasterizer never acquires a context — the CSS fallback takes over', () => {
    const canvas = document.createElement(HTML_TAGS.CANVAS)

    canvas.className = NAV_MENU_CLASSES.NAV_MENU_MODAL_CANVAS
    document.body.appendChild(canvas)

    const menu = new MenuBackgroundWebGL(canvas)

    expect(menu.useWebGL).toBe(false)
    expect(menu.gl).toBeNull()
    expect(canvas.classList.contains(STATE_CLASSES.IS_FALLBACK)).toBe(true)
    expect(canvas.style.display).toBe(STATE_STRINGS.NONE)

    // start() must stay inert — no loop is spun up on the doomed path.
    menu.start()

    expect(menu.isActive).toBe(false)
    expect(menu.animId).toBeNull()

    menu.destroy()
  })
})
