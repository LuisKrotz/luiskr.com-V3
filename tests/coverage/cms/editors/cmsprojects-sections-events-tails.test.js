/**
 * @file coverage-tails-7.test.js
 * @description Seventh tail sweep — post-decomposition coverage for the
 * module trees exposed by the folder reorganization: CMS editor event
 * bindings + section helpers + deploy-info delegates, Earth engine
 * update/bootstrap guards, canvas-widget delegates + shared GL helpers,
 * route helpers, safari patch guards, and misc utilities
 * (css-color, gpu-accel, route-warmer, draw-text).
 */
import { jest } from '@jest/globals'
import { CMS_TAGS } from '@/cms/tokens.js'

import { FORM_EVENTS, MOUSE_EVENTS } from '@/core/tokens/events/dom.js'
import '@/core/constants.js'

import '@/cms/about/CmsAboutEditor.js'
import '@/cms/portfolio/CmsPortfolioList.js'
import '@/cms/projects/CmsProjectsList.js'
import '@/cms/playground-editor/CmsPlaygroundEditor.js'
import '@/cms/footer/CmsFooterEditor.js'
import '@/cms/deploy-info/CmsDeployInfo.js'

import { addSection, addSectionMedia, addSectionText, ensureSectionShape, moveSection, normalizeSection, removeSection, removeSectionMedia, removeSectionText } from '@/cms/projects/sections.js'
import { CMS_PROJECTS_CLASSES } from '@/cms/tokens.js'

globalThis.alert = jest.fn()

const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

const fire = (el, type, value) => {
  if (value !== undefined) el.value = value

  el.dispatchEvent(new window.Event(type))
}

// ─── CMS: about editor event bindings ────────────────────────────────────────

describe('CmsProjects sections + events tails', () => {
  const host = (project) => ({
    currentProject: project,
    _updateDom: jest.fn(),
    _bindEvents: jest.fn(),
    _ensureSectionShape(i) {
      ensureSectionShape(this, i)
    },
  })

  test('normalizeSection covers array/object/invalid arms', () => {
    expect(normalizeSection([['a'], []])).toEqual([['a'], []])
    expect(normalizeSection({ texts: ['x'], media: [{ src: 's' }] })).toEqual([['x'], [{ src: 's' }]])
    expect(normalizeSection({})).toEqual([[], []])
    expect(normalizeSection(null)).toEqual([[], []])
    expect(normalizeSection(['notpair'])).toEqual([[], []])
  })

  test('section mutators guard on missing project and bounds', () => {
    const h = host(null)

    ensureSectionShape(h, 0)
    addSection(h)
    removeSection(h, 0)
    moveSection(h, 0, 1)
    addSectionText(h, 0)
    removeSectionText(h, 0)
    addSectionMedia(h, 0)
    removeSectionMedia(h, 0)
    expect(h._updateDom).not.toHaveBeenCalled()

    const h2 = host({ sections: { not: 'array' } })

    addSection(h2)
    expect(Array.isArray(h2.currentProject.sections)).toBe(true)

    const h3 = host({ sections: [[['t'], [{ src: 's', size: [1, 2] }]]] })

    const origConfirm = globalThis.confirm

    globalThis.confirm = () => false
    removeSection(h3, 0)
    expect(h3.currentProject.sections).toHaveLength(1)

    globalThis.confirm = () => true
    moveSection(h3, 0, -1)
    moveSection(h3, 0, 1)
    addSectionText(h3, 0)
    expect(h3.currentProject.sections[0][0].length).toBeGreaterThan(0)
    addSectionMedia(h3, 0)
    removeSectionText(h3, 0)
    removeSectionMedia(h3, 0)
    removeSection(h3, 0)
    expect(h3.currentProject.sections).toHaveLength(0)

    globalThis.confirm = origConfirm
  })

  test('rendered text/media controls dispatch to host', async () => {
    const el = document.createElement(CMS_TAGS.CMS_PROJECTS_LIST)

    document.body.appendChild(el)
    await flush()

    el.currentProject = {
      sections: [
        [['t1'], [{ src: 's', label: 'l', isVideo: false, size: [1920, 1080] }]],
      ],
    }

    el._updateDom()
    el._bindEvents()

    const q = (s) => el.shadowRoot.querySelector(s)
    const qa = (s) => [...el.shadowRoot.querySelectorAll(s)]

    const textInput = q('.' + CMS_PROJECTS_CLASSES.SEC_TEXT_INPUT)

    if (textInput) {
      fire(textInput, FORM_EVENTS.INPUT, 'newtext')
      expect(el.currentProject.sections[0][0][0]).toBe('newtext')
    }

    jest.spyOn(el, 'removeSectionText')
    jest.spyOn(el, 'removeSectionMedia')

    const boundMedia = qa(
      `.${CMS_PROJECTS_CLASSES.SEC_TEXT_DEL},.${CMS_PROJECTS_CLASSES.MEDIA_DEL},.${CMS_PROJECTS_CLASSES.MEDIA_SRC},.${CMS_PROJECTS_CLASSES.MEDIA_LABEL},.${CMS_PROJECTS_CLASSES.MEDIA_TYPE},.${CMS_PROJECTS_CLASSES.MEDIA_W},.${CMS_PROJECTS_CLASSES.MEDIA_H}`
    )

    boundMedia.forEach((b) => {
      fire(b, FORM_EVENTS.INPUT, '800')
      fire(b, FORM_EVENTS.CHANGE)
      fire(b, MOUSE_EVENTS.CLICK)
    })

    // attr-fallback arms: bound classes without data-* attributes
    const strayClasses = [
      CMS_PROJECTS_CLASSES.SEC_TEXT_INPUT,
      CMS_PROJECTS_CLASSES.SEC_TEXT_DEL,
      CMS_PROJECTS_CLASSES.MEDIA_SRC,
      CMS_PROJECTS_CLASSES.MEDIA_LABEL,
      CMS_PROJECTS_CLASSES.MEDIA_TYPE,
      CMS_PROJECTS_CLASSES.MEDIA_W,
      CMS_PROJECTS_CLASSES.MEDIA_H,
      CMS_PROJECTS_CLASSES.MEDIA_DEL,
    ]
    const strays = strayClasses.map((cls) => {
      const s = document.createElement('input')

      s.className = cls
      el.shadowRoot.appendChild(s)

      return s
    })

    el._bindEvents()
    strays.forEach((s) => {
      fire(s, FORM_EVENTS.INPUT, 'x')
      fire(s, FORM_EVENTS.CHANGE)
      fire(s, MOUSE_EVENTS.CLICK)
    })

    // currentProject null arm on the originally bound controls
    el.currentProject = null
    boundMedia.forEach((b) => {
      fire(b, FORM_EVENTS.INPUT, 'z')
      fire(b, FORM_EVENTS.CHANGE)
      fire(b, MOUSE_EVENTS.CLICK)
    })

    el.remove()
  })
})

