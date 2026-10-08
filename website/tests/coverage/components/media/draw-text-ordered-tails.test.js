/**
 * @file draw-text-ordered-tails.test.js
 * @description Coverage tail for the ordered-reveal session in
 * draw-text/trigger.js — the shared clock that lets a document's
 * draw-texts cascade in reading order. Locks down the ordered getter,
 * the effective-offset resolution (fresh anchor, elapsed subtraction,
 * zero clamp), attribute add/remove registration, the clock reset when
 * the last ordered element disconnects, and reset() clearing the
 * resolved offset — regression-prone seams for the legal-page cascade.
 */

import { jest } from '@jest/globals'
import '@website/components/media/DrawText.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { FORM_ATTRS } from '@core/tokens/attrs/form.js'
import { COMMON_ATTRS } from '@core/tokens/attrs/common.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import { TEST_TEXT } from '@tests/fixtures/test-constants.js'

const makeEl = (text = TEST_TEXT.HELLO) => {
  const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
  el.setAttribute(FORM_ATTRS.TEXT, text)
  return el
}

describe('DrawText ordered-reveal session', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    document.documentElement.classList.remove(STATE_CLASSES.REDUCED_MOTION)
    jest.restoreAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('ordered getter reflects the attribute', () => {
    const el = makeEl()
    expect(el.ordered).toBe(false)

    el.setAttribute(COMMON_ATTRS.ORDERED, ATTR_VALUES.EMPTY)
    document.body.appendChild(el)

    expect(el.ordered).toBe(true)
    el.remove()
  })

  test('first ordered trigger anchors the session clock', () => {
    jest.spyOn(performance, 'now').mockReturnValue(1000)

    const el = makeEl()
    el.setAttribute(COMMON_ATTRS.ORDERED, ATTR_VALUES.EMPTY)
    el.setAttribute(COMMON_ATTRS.OFFSET, '0')
    document.body.appendChild(el)

    // offset 0 at t0 → effective 0
    expect(el._effectiveOffset).toBe(0)
    el.remove()
  })

  test('later ordered triggers subtract elapsed session time', () => {
    const now = jest.spyOn(performance, 'now')

    now.mockReturnValue(1000)
    const first = makeEl()
    first.setAttribute(COMMON_ATTRS.ORDERED, ATTR_VALUES.EMPTY)
    first.setAttribute(COMMON_ATTRS.OFFSET, '0')
    document.body.appendChild(first)

    now.mockReturnValue(1600)
    const second = makeEl()
    second.setAttribute(COMMON_ATTRS.ORDERED, ATTR_VALUES.EMPTY)
    second.setAttribute(COMMON_ATTRS.OFFSET, '2000')
    document.body.appendChild(second)

    // 2000ms scheduled − 600ms elapsed → 1400ms remaining
    expect(second._effectiveOffset).toBe(1400)

    first.remove()
    second.remove()
  })

  test('a schedule already past clamps to zero instead of waiting', () => {
    const now = jest.spyOn(performance, 'now')

    now.mockReturnValue(1000)
    const first = makeEl()
    first.setAttribute(COMMON_ATTRS.ORDERED, ATTR_VALUES.EMPTY)
    document.body.appendChild(first)

    now.mockReturnValue(9000)
    const late = makeEl()
    late.setAttribute(COMMON_ATTRS.ORDERED, ATTR_VALUES.EMPTY)
    late.setAttribute(COMMON_ATTRS.OFFSET, '2000')
    document.body.appendChild(late)

    // 2000ms scheduled − 8000ms elapsed → clamped to 0 (start now)
    expect(late._effectiveOffset).toBe(0)

    first.remove()
    late.remove()
  })

  test('unordered elements keep raw offset semantics (no clock)', () => {
    const el = makeEl()
    el.setAttribute(COMMON_ATTRS.OFFSET, '400')
    document.body.appendChild(el)

    // Unordered: offset passes through unchanged — no session subtraction
    expect(el._effectiveOffset).toBe(400)
    el.remove()
  })

  test('the session clock resets when the last ordered element disconnects', () => {
    const now = jest.spyOn(performance, 'now')

    now.mockReturnValue(1000)
    const first = makeEl()
    first.setAttribute(COMMON_ATTRS.ORDERED, ATTR_VALUES.EMPTY)
    document.body.appendChild(first)

    // Emptying the ordered set must reset the clock — the next session
    // starts a fresh t0, so a fresh element keeps its full offset.
    first.remove()

    now.mockReturnValue(500000)
    const next = makeEl()
    next.setAttribute(COMMON_ATTRS.ORDERED, ATTR_VALUES.EMPTY)
    next.setAttribute(COMMON_ATTRS.OFFSET, '300')
    document.body.appendChild(next)

    // New session: t0=500000, elapsed 0 → full 300ms remains
    expect(next._effectiveOffset).toBe(300)
    next.remove()
  })

  test('adding/removing the ordered attribute mid-life re-registers', () => {
    const el = makeEl()
    document.body.appendChild(el)

    expect(el.ordered).toBe(false)

    el.setAttribute(COMMON_ATTRS.ORDERED, ATTR_VALUES.TRUE)
    expect(el.ordered).toBe(true)

    el.removeAttribute(COMMON_ATTRS.ORDERED)
    expect(el.ordered).toBe(false)

    el.remove()
  })

  test('a queued observer entry after teardown skips the disconnect arm', () => {
    const el = makeEl()
    el.setAttribute(COMMON_ATTRS.TRIGGER, COMMON_ATTRS.TRIGGER_VIEWPORT)
    document.body.appendChild(el)

    const observer = el._observer

    expect(observer).toBeTruthy()

    // A pending IntersectionObserver entry can still invoke the callback
    // after teardown already nulled host._observer — the disconnect arm is
    // skipped and the RAF start still fires.
    el._observer = null
    observer.callback([{ isIntersecting: true, intersectionRatio: 1, target: el }], observer)

    expect(el._observer).toBeNull()
    el.remove()
  })

  test('reset() clears the resolved effective offset', () => {
    const el = makeEl()
    el.setAttribute(COMMON_ATTRS.ORDERED, ATTR_VALUES.EMPTY)
    document.body.appendChild(el)

    expect(el._effectiveOffset).not.toBeNull()

    el.reset()
    expect(el._effectiveOffset).toBeNull()

    el.remove()
  })
})
