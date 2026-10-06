/**
 * @file theme-slider-events.ts
 * @description Pointer/click/keyboard wiring for ThemeSliderWebGL,
 * extracted from theme-slider.ts — drag with pointer capture, tap-to-snap
 * thirds, and arrow-key stepping all resolve through the slider's
 * _xToContinuousP/_pToTheme helpers and fire onThemeChange on snap change.
 */

import { KEYS } from '@/core/tokens/primitives.js'
import { KEYBOARD_EVENTS, MOUSE_EVENTS, POINTER_EVENTS } from '@/core/tokens/events/dom.js'
import type { ThemeSliderWebGL } from '../theme-slider.js'

/** Wires pointer/click/keyboard handlers onto the slider's canvas. */
export function bindThemeSliderEvents(s: ThemeSliderWebGL): void {
  s.onPointerDown = (e: PointerEvent) => {
    s.isDragging = true

    try {
      s.canvas.setPointerCapture?.(e.pointerId)
    } catch {
      // optional pointer capture
    }

    const rect = s.canvas.getBoundingClientRect()

    const clientX = e.clientX || (e as unknown as TouchEvent).touches?.[0]?.clientX || 0

    const x = clientX - rect.left

    s.targetP = s._xToContinuousP(x, rect.width)

    s.rippleTime = (performance.now() - s.startTime) * 0.001

    s.ripplePos = s._pToKnobX(s.targetP)
  }

  s.onPointerMove = (e: PointerEvent) => {
    if (!s.isDragging) return

    const rect = s.canvas.getBoundingClientRect()

    const clientX = e.clientX || (e as unknown as TouchEvent).touches?.[0]?.clientX || 0

    const x = clientX - rect.left

    s.targetP = s._xToContinuousP(x, rect.width)
  }

  s.onPointerUp = (e: PointerEvent) => {
    if (!s.isDragging) return

    s.isDragging = false

    try {
      s.canvas.releasePointerCapture?.(e.pointerId)
    } catch {
      // optional pointer capture
    }

    const snapP = Math.round(Math.max(0, Math.min(2, s.targetP)))

    s.targetP = snapP

    const newTheme = s._pToTheme(snapP)

    if (newTheme !== s.currentTheme) {
      s.currentTheme = newTheme

      s.onThemeChange?.(newTheme)
    }
  }

  s.onClick = (e: MouseEvent) => {
    const rect = s.canvas.getBoundingClientRect()

    const clientX = e.clientX || 0

    const x = clientX - rect.left

    const normX = x / (rect.width || s.width)

    let snapP = 1.0

    if (normX < 0.35) snapP = 0.0
    else if (normX > 0.65) snapP = 2.0

    s.targetP = snapP

    s.rippleTime = (performance.now() - s.startTime) * 0.001

    s.ripplePos = s._pToKnobX(snapP)

    const newTheme = s._pToTheme(snapP)

    if (newTheme !== s.currentTheme) {
      s.currentTheme = newTheme

      s.onThemeChange?.(newTheme)
    }
  }

  s.onKeyDown = (e: KeyboardEvent) => {
    if (e.key === KEYS.ARROW_LEFT || e.key === KEYS.ARROW_DOWN) {
      e.preventDefault()

      const snapP = Math.max(0, Math.round(s.targetP) - 1)

      s.targetP = snapP

      const newTheme = s._pToTheme(snapP)

      if (newTheme !== s.currentTheme) {
        s.currentTheme = newTheme

        s.onThemeChange?.(newTheme)
      }
    } else if (e.key === KEYS.ARROW_RIGHT || e.key === KEYS.ARROW_UP) {
      e.preventDefault()

      const snapP = Math.min(2, Math.round(s.targetP) + 1)

      s.targetP = snapP

      const newTheme = s._pToTheme(snapP)

      if (newTheme !== s.currentTheme) {
        s.currentTheme = newTheme

        s.onThemeChange?.(newTheme)
      }
    }
  }

  s.canvas.addEventListener(POINTER_EVENTS.POINTERDOWN, s.onPointerDown)

  window.addEventListener(POINTER_EVENTS.POINTERMOVE, s.onPointerMove)

  window.addEventListener(POINTER_EVENTS.POINTERUP, s.onPointerUp)

  s.canvas.addEventListener(MOUSE_EVENTS.CLICK, s.onClick)

  s.canvas.addEventListener(KEYBOARD_EVENTS.KEYDOWN, s.onKeyDown)
}
