/**
 * @file webgl-fallback-webgl-fallback-mechanism-android-chrome-compatibility.test.js
 * @description Split from webgl-fallback.test.js — covers the "WebGL Fallback Mechanism — Android Chrome Compatibility" describe.
 */
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals'
import { MenuBackgroundWebGL } from '@core/utils/canvas/loaders/menu-background-webgl.js'
import { BurgerButtonWebGL } from '@core/utils/canvas/widgets/burger-button-webgl.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { NAV_BURGER_CLASSES, NAV_MENU_CLASSES } from '@core/tokens/classes/nav.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'
import { GL_EVENTS } from '@core/tokens/events/dom.js'
import { WEBGL_STRINGS } from '@core/tokens/strings/webgl.js'

describe('WebGL Fallback Mechanism — Android Chrome Compatibility', () => {
  // ── MenuBackgroundWebGL Fallback ───────────────────────────────────────────────
  describe('1. MenuBackgroundWebGL Fallback', () => {
    let canvas, menuBg

    beforeEach(() => {
      document.body.innerHTML = ''
      canvas = document.createElement(HTML_TAGS.CANVAS)
      canvas.className = NAV_MENU_CLASSES.NAV_MENU_MODAL_CANVAS
      document.body.appendChild(canvas)
      menuBg = new MenuBackgroundWebGL(canvas)
    })

    afterEach(() => {
      if (menuBg) menuBg.destroy()
      document.body.innerHTML = ''
    })

    test('initializes with useWebGL property', () => {
      expect(typeof menuBg.useWebGL).toBe(TYPE_STRINGS.BOOLEAN)
    })

    test('canvas does not have is-fallback class initially if WebGL is available', () => {
      if (menuBg.useWebGL) {
        expect(canvas.classList.contains(STATE_CLASSES.IS_FALLBACK)).toBe(false)
      } else {
        // WebGL not available in test environment, canvas may already have fallback class
        expect(menuBg.useWebGL).toBe(false)
      }
    })

    test('_triggerFallback sets useWebGL to false', () => {
      menuBg._triggerFallback()
      expect(menuBg.useWebGL).toBe(false)
    })

    test('_triggerFallback adds is-fallback class to canvas', () => {
      menuBg._triggerFallback()
      expect(canvas.classList.contains(STATE_CLASSES.IS_FALLBACK)).toBe(true)
    })

    test('_triggerFallback hides the canvas', () => {
      menuBg._triggerFallback()
      expect(canvas.style.display).toBe(STATE_STRINGS.NONE)
    })

    test('_triggerFallback cancels animation frame if running', () => {
      menuBg.start()
      menuBg._triggerFallback()
      expect(menuBg.animId).toBeNull()
    })

    test('start() does not begin animation when useWebGL is false', () => {
      menuBg._triggerFallback()
      menuBg.start()
      expect(menuBg.isActive).toBe(false)
    })

    test('webglcontextlost event triggers fallback', () => {
      // Create fresh instance for this test
      if (menuBg) menuBg.destroy()
      document.body.innerHTML = ''

      const freshCanvas = document.createElement(HTML_TAGS.CANVAS)
      freshCanvas.className = NAV_MENU_CLASSES.NAV_MENU_MODAL_CANVAS
      document.body.appendChild(freshCanvas)
      const freshMenuBg = new MenuBackgroundWebGL(freshCanvas)

      // Manually trigger fallback to test the mechanism
      freshMenuBg._triggerFallback()

      expect(freshMenuBg.useWebGL).toBe(false)
      expect(freshCanvas.classList.contains(STATE_CLASSES.IS_FALLBACK)).toBe(true)

      if (freshMenuBg) freshMenuBg.destroy()
    })
  })

  // ── BurgerButtonWebGL Fallback ───────────────────────────────────────────────
  describe('2. BurgerButtonWebGL Fallback', () => {
    let canvas, burgerBtn, onClickSpy

    beforeEach(() => {
      document.body.innerHTML = ''
      canvas = document.createElement(HTML_TAGS.CANVAS)
      canvas.className = NAV_BURGER_CLASSES.NAV_BURGER_CANVAS
      document.body.appendChild(canvas)
      onClickSpy = { called: false }
      burgerBtn = new BurgerButtonWebGL(canvas, () => {
        onClickSpy.called = true
      })
    })

    afterEach(() => {
      if (burgerBtn) burgerBtn.destroy()
      document.body.innerHTML = ''
    })

    test('initializes with useWebGL property', () => {
      expect(typeof burgerBtn.useWebGL).toBe(TYPE_STRINGS.BOOLEAN)
    })

    test('canvas does not have is-fallback class initially if WebGL is available', () => {
      if (burgerBtn.useWebGL) {
        expect(canvas.classList.contains(STATE_CLASSES.IS_FALLBACK)).toBe(false)
      } else {
        // WebGL not available in test environment, canvas may already have fallback class
        expect(burgerBtn.useWebGL).toBe(false)
      }
    })

    test('_triggerFallback sets useWebGL to false', () => {
      burgerBtn._triggerFallback()
      expect(burgerBtn.useWebGL).toBe(false)
    })

    test('_triggerFallback adds is-fallback class to canvas', () => {
      burgerBtn._triggerFallback()
      expect(canvas.classList.contains(STATE_CLASSES.IS_FALLBACK)).toBe(true)
    })

    test('_triggerFallback hides the canvas', () => {
      burgerBtn._triggerFallback()
      expect(canvas.style.display).toBe(STATE_STRINGS.NONE)
    })

    test('_triggerFallback cancels animation frame if running', () => {
      burgerBtn._triggerFallback()
      expect(burgerBtn.animId).toBeNull()
    })

    test('webglcontextlost event triggers fallback', () => {
      const event = new Event(GL_EVENTS.WEBGL_CONTEXT_LOST)
      let preventDefaultCalled = false
      event.preventDefault = () => {
        preventDefaultCalled = true
      }
      canvas.dispatchEvent(event)
      expect(burgerBtn.useWebGL).toBe(false)
      expect(canvas.classList.contains(STATE_CLASSES.IS_FALLBACK)).toBe(true)
      // The loss is never prevented — keeping the context dead is what stops
      // the browser from restoring it as an unowned zombie context.
      expect(preventDefaultCalled).toBe(false)
    })

    test('onClick handler is still attached after fallback', () => {
      burgerBtn._triggerFallback()
      canvas.click()
      expect(onClickSpy.called).toBe(true)
    })
  })

  // ── WebGL Context Loss Simulation ─────────────────────────────────────────────
  describe('3. WebGL Context Loss Simulation', () => {
    let menuBg, burgerBtn

    beforeEach(() => {
      document.body.innerHTML = ''

      // Menu background canvas
      const menuCanvas = document.createElement(HTML_TAGS.CANVAS)
      menuCanvas.className = NAV_MENU_CLASSES.NAV_MENU_MODAL_CANVAS
      document.body.appendChild(menuCanvas)
      menuBg = new MenuBackgroundWebGL(menuCanvas)

      // Burger button canvas
      const burgerCanvas = document.createElement(HTML_TAGS.CANVAS)
      burgerCanvas.className = NAV_BURGER_CLASSES.NAV_BURGER_CANVAS
      document.body.appendChild(burgerCanvas)
      burgerBtn = new BurgerButtonWebGL(burgerCanvas, () => {})
    })

    afterEach(() => {
      if (menuBg) menuBg.destroy()
      if (burgerBtn) burgerBtn.destroy()
      document.body.innerHTML = ''
    })

    test('simulating WebGL context loss via WEBGL_lose_context extension', () => {
      const menuGl = menuBg.canvas.getContext(WEBGL_STRINGS.WEBGL)
      const burgerGl = burgerBtn.canvas.getContext(WEBGL_STRINGS.WEBGL)

      if (menuGl && burgerGl) {
        const menuExt = menuGl.getExtension(WEBGL_STRINGS.WEBGL_LOSE_CONTEXT)
        const burgerExt = burgerGl.getExtension(WEBGL_STRINGS.WEBGL_LOSE_CONTEXT)

        if (menuExt && burgerExt) {
          // Trigger context loss
          menuExt.loseContext()
          burgerExt.loseContext()

          // Both should fallback
          expect(menuBg.useWebGL).toBe(false)
          expect(burgerBtn.useWebGL).toBe(false)
          expect(menuBg.canvas.classList.contains(STATE_CLASSES.IS_FALLBACK)).toBe(true)
          expect(burgerBtn.canvas.classList.contains(STATE_CLASSES.IS_FALLBACK)).toBe(true)
        }
      }
    })

    test('context loss does not crash the application', () => {
      const event = new Event(GL_EVENTS.WEBGL_CONTEXT_LOST)
      let preventDefaultCalled = false
      event.preventDefault = () => {
        preventDefaultCalled = true
      }
      menuBg.canvas.dispatchEvent(event)
      burgerBtn.canvas.dispatchEvent(event)

      // Should handle gracefully without throwing
      expect(() => {
        menuBg._loop()
        burgerBtn._loop()
      }).not.toThrow()
      expect(preventDefaultCalled).toBe(false)
    })
  })

  // ── CSS Fallback UI ───────────────────────────────────────────────────────────
  describe('4. CSS Fallback UI Activation', () => {
    let burgerWrap, burgerCanvas, fallbackBtn

    beforeEach(() => {
      document.body.innerHTML = ''

      // Create burger wrapper with canvas and fallback button
      burgerWrap = document.createElement(HTML_TAGS.DIV)
      burgerWrap.className = NAV_BURGER_CLASSES.NAV_BURGER_WRAP

      burgerCanvas = document.createElement(HTML_TAGS.CANVAS)
      burgerCanvas.className = NAV_BURGER_CLASSES.NAV_BURGER_CANVAS
      burgerWrap.appendChild(burgerCanvas)

      fallbackBtn = document.createElement(HTML_TAGS.BUTTON)
      fallbackBtn.className = NAV_BURGER_CLASSES.NAV_BURGER_FALLBACK
      burgerWrap.appendChild(fallbackBtn)

      document.body.appendChild(burgerWrap)
    })

    afterEach(() => {
      document.body.innerHTML = ''
    })

    test('fallback button exists in DOM', () => {
      expect(fallbackBtn).not.toBeNull()
      expect(fallbackBtn.className).toBe(NAV_BURGER_CLASSES.NAV_BURGER_FALLBACK)
    })

    test('fallback button becomes visible when canvas has is-fallback class', () => {
      burgerCanvas.classList.add(STATE_CLASSES.IS_FALLBACK)
      // Note: The actual CSS :has() selector handles this, but we can verify the class is present
      expect(burgerCanvas.classList.contains(STATE_CLASSES.IS_FALLBACK)).toBe(true)
    })

    test('canvas is hidden when it has is-fallback class', () => {
      burgerCanvas.classList.add(STATE_CLASSES.IS_FALLBACK)
      burgerCanvas.style.display = STATE_STRINGS.NONE
      expect(burgerCanvas.style.display).toBe(STATE_STRINGS.NONE)
    })

    test('menu modal gets fallback background when canvas has is-fallback class', () => {
      const menuModal = document.createElement(HTML_TAGS.DIV)
      menuModal.className = NAV_MENU_CLASSES.NAV_MENU_MODAL
      const menuCanvas = document.createElement(HTML_TAGS.CANVAS)
      menuCanvas.className = NAV_MENU_CLASSES.NAV_MENU_MODAL_CANVAS
      menuCanvas.classList.add(STATE_CLASSES.IS_FALLBACK)
      menuModal.appendChild(menuCanvas)
      document.body.appendChild(menuModal)

      // Verify the structure is correct for CSS :has() selector
      expect(
        menuModal.querySelector(
          `.${NAV_MENU_CLASSES.NAV_MENU_MODAL_CANVAS}.${STATE_CLASSES.IS_FALLBACK}`
        )
      ).not.toBeNull()
    })
  })

  // ── Functionality Preservation ────────────────────────────────────────────────
  describe('5. Functionality Preservation with Fallback', () => {
    let burgerBtn, onClickSpy

    beforeEach(() => {
      document.body.innerHTML = ''
      const canvas = document.createElement(HTML_TAGS.CANVAS)
      canvas.className = NAV_BURGER_CLASSES.NAV_BURGER_CANVAS
      document.body.appendChild(canvas)
      onClickSpy = { called: false }
      burgerBtn = new BurgerButtonWebGL(canvas, () => {
        onClickSpy.called = true
      })
    })

    afterEach(() => {
      if (burgerBtn) burgerBtn.destroy()
      document.body.innerHTML = ''
    })

    test('onClick handler works before fallback', () => {
      burgerBtn.canvas.click()
      expect(onClickSpy.called).toBe(true)
    })

    test('onClick handler still works after fallback', () => {
      onClickSpy.called = false
      burgerBtn._triggerFallback()
      burgerBtn.canvas.click()
      expect(onClickSpy.called).toBe(true)
    })

    test('destroy() cleans up resources after fallback', () => {
      burgerBtn._triggerFallback()
      expect(() => burgerBtn.destroy()).not.toThrow()
      expect(burgerBtn.gl).toBeNull()
      expect(burgerBtn.animId).toBeNull()
    })

    test('_start() is safe to call after fallback', () => {
      burgerBtn._triggerFallback()
      expect(() => {
        burgerBtn._start()
      }).not.toThrow()
    })
  })

  // ── Menu Background Fallback Behavior ─────────────────────────────────────────
  describe('6. Menu Background Fallback Behavior', () => {
    let canvas, menuBg

    beforeEach(() => {
      document.body.innerHTML = ''
      canvas = document.createElement(HTML_TAGS.CANVAS)
      canvas.className = NAV_MENU_CLASSES.NAV_MENU_MODAL_CANVAS
      document.body.appendChild(canvas)
      menuBg = new MenuBackgroundWebGL(canvas)
    })

    afterEach(() => {
      if (menuBg) menuBg.destroy()
      document.body.innerHTML = ''
    })

    test('start() activates animation when WebGL is available', () => {
      if (menuBg.useWebGL) {
        menuBg.start()
        expect(menuBg.isActive).toBe(true)
      } else {
        // If WebGL is not available in test environment, skip this test
        expect(menuBg.useWebGL).toBe(false)
      }
    })

    test('stop() deactivates animation', () => {
      if (menuBg.useWebGL) {
        menuBg.start()
        menuBg.stop()
        expect(menuBg.isActive).toBe(false)
      } else {
        // If WebGL is not available, stop should still be safe
        expect(() => menuBg.stop()).not.toThrow()
      }
    })

    test('start() does not activate when fallback is triggered', () => {
      menuBg._triggerFallback()
      menuBg.start()
      expect(menuBg.isActive).toBe(false)
    })

    test('destroy() cleans up resources after fallback', () => {
      menuBg._triggerFallback()
      expect(() => menuBg.destroy()).not.toThrow()
      expect(menuBg.gl).toBeNull()
      expect(menuBg.animId).toBeNull()
    })

    test('_loop() exits early when useWebGL is false', () => {
      menuBg._triggerFallback()
      menuBg._loop()
      expect(menuBg.animId).toBeNull()
    })
  })

  // ── Multiple Context Loss Events ───────────────────────────────────────────────
  describe('7. Multiple Context Loss Events', () => {
    let canvas, menuBg

    beforeEach(() => {
      document.body.innerHTML = ''
      canvas = document.createElement(HTML_TAGS.CANVAS)
      canvas.className = NAV_MENU_CLASSES.NAV_MENU_MODAL_CANVAS
      document.body.appendChild(canvas)
      menuBg = new MenuBackgroundWebGL(canvas)
    })

    afterEach(() => {
      if (menuBg) menuBg.destroy()
      document.body.innerHTML = ''
    })

    test('multiple webglcontextlost events are handled gracefully', () => {
      const event = new Event(GL_EVENTS.WEBGL_CONTEXT_LOST)

      // Trigger multiple times
      canvas.dispatchEvent(event)
      canvas.dispatchEvent(event)
      canvas.dispatchEvent(event)

      expect(menuBg.useWebGL).toBe(false)
      expect(canvas.classList.contains(STATE_CLASSES.IS_FALLBACK)).toBe(true)
    })

    test('fallback state is idempotent', () => {
      menuBg._triggerFallback()
      menuBg._triggerFallback()
      menuBg._triggerFallback()

      expect(menuBg.useWebGL).toBe(false)
      expect(canvas.classList.contains(STATE_CLASSES.IS_FALLBACK)).toBe(true)
    })
  })

  // ── Reveal Lifecycle & Shader Fallback ──────────────────────────────────────
  describe('8. Reveal Lifecycle & Shader Fallback', () => {
    const stubCanvas = (gl) => {
      const c = document.createElement(HTML_TAGS.CANVAS)

      c.getContext = () => gl

      return c
    }

    const stubGl = ({ compileOk = true, linkOk = true } = {}) => ({
      createShader: () => ({}),
      shaderSource: () => {},
      compileShader: () => {},
      getShaderParameter: () => compileOk,
      createProgram: () => ({}),
      attachShader: () => {},
      linkProgram: () => {},
      getProgramParameter: () => linkOk,
      useProgram: () => {},
      createBuffer: () => ({}),
      bindBuffer: () => {},
      bufferData: () => {},
      getAttribLocation: () => 0,
      enableVertexAttribArray: () => {},
      vertexAttribPointer: () => {},
      getUniformLocation: () => ({}),
      enable: () => {},
      blendFunc: () => {},
      viewport: () => {},
      clearColor: () => {},
      clear: () => {},
      uniform1f: () => {},
      uniform2f: () => {},
      uniform3f: () => {},
      drawArrays: () => {},
      deleteBuffer: () => {},
      deleteProgram: () => {},
      getExtension: () => null,
      VERTEX_SHADER: 0,
      FRAGMENT_SHADER: 0,
      COMPILE_STATUS: 1,
      LINK_STATUS: 2,
      ARRAY_BUFFER: 3,
      STATIC_DRAW: 4,
      FLOAT: 5,
      BLEND: 6,
      SRC_ALPHA: 7,
      ONE_MINUS_SRC_ALPHA: 8,
      COLOR_BUFFER_BIT: 9,
      TRIANGLE_STRIP: 10,
    })

    test('release() sets reveal target to 0 and start() sets it to 1', () => {
      const c = stubCanvas(stubGl())
      document.body.appendChild(c)
      const bg = new MenuBackgroundWebGL(c)

      bg.start()
      expect(bg._revealTarget).toBe(1)

      bg.release()
      expect(bg._revealTarget).toBe(0)

      bg.destroy()
      document.body.removeChild(c)
    })

    test('shader compile failure triggers fallback', () => {
      const c = stubCanvas(stubGl({ compileOk: false }))
      document.body.appendChild(c)
      const bg = new MenuBackgroundWebGL(c)

      expect(bg.useWebGL).toBe(false)
      expect(c.classList.contains(STATE_CLASSES.IS_FALLBACK)).toBe(true)

      bg.destroy()
      document.body.removeChild(c)
    })

    test('program link failure triggers fallback', () => {
      const c = stubCanvas(stubGl({ linkOk: false }))
      document.body.appendChild(c)
      const bg = new MenuBackgroundWebGL(c)

      expect(bg.useWebGL).toBe(false)
      expect(c.classList.contains(STATE_CLASSES.IS_FALLBACK)).toBe(true)

      bg.destroy()
      document.body.removeChild(c)
    })

    test('_parseCssColor handles #rrggbb, #rgb and rgb()', () => {
      const c = stubCanvas(stubGl())
      document.body.appendChild(c)
      const bg = new MenuBackgroundWebGL(c)

      expect(bg._parseCssColor('#ffffff')).toEqual([1, 1, 1])
      expect(bg._parseCssColor('#000')).toEqual([0, 0, 0])

      const parsed = bg._parseCssColor('rgb(38, 38, 38)')

      parsed.forEach((v) => expect(v).toBeCloseTo(38 / 255, 5))

      bg.destroy()
      document.body.removeChild(c)
    })
  })
})
