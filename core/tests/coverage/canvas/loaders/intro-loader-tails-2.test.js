/**
 * @file intro-loader-tails-2.test.js
 * @description Split from coverage-tails-4.test.js — covers the "intro-loader tails 2" describe.
 */
import { jest } from '@jest/globals'

import { IntroLoader } from '@core/utils/canvas/loaders/intro-loader.js'

import '@website/components/feedback/CookieBanner.js'
import '@website/components/home/ContactSection.js'
import '@website/views/not-found/NotFound.js'

describe('intro-loader tails 2', () => {
  test('constructor defaults and terminal lines', () => {
    sessionStorage.setItem('lk_intro_shown', '1')

    const loader = new IntroLoader(document.body, jest.fn())

    expect(loader.progress).toBe(0)

    sessionStorage.removeItem('lk_intro_shown')
  })
})
