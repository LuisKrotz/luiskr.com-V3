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
import { CMS_ABOUT_IDS, CMS_TAGS } from '@/cms/tokens.js'
import { DATA_ATTRS } from '@/core/tokens/attrs/data.js'
import { FORM_EVENTS, MOUSE_EVENTS } from '@/core/tokens/events/dom.js'
import '@/core/constants.js'

import '@/cms/about/CmsAboutEditor.js'
import '@/cms/portfolio/CmsPortfolioList.js'
import '@/cms/projects/CmsProjectsList.js'
import '@/cms/playground-editor/CmsPlaygroundEditor.js'
import '@/cms/footer/CmsFooterEditor.js'
import '@/cms/deploy-info/CmsDeployInfo.js'
import { CMS_ABOUT_CLASSES } from '@/cms/tokens.js'

globalThis.alert = jest.fn()

const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

const fire = (el, type, value) => {
  if (value !== undefined) el.value = value

  el.dispatchEvent(new window.Event(type))
}

// ─── CMS: about editor event bindings ────────────────────────────────────────

describe('CmsAboutEditor event tails', () => {
  const buildEditor = async () => {
    const el = document.createElement(CMS_TAGS.CMS_ABOUT_EDITOR)

    document.body.appendChild(el)
    await flush()

    el.aboutData = {
      title: 't',
      col1: ['a'],
      col2: ['b'],
      mention_items: [{ name: 'n', description: 'd', url: 'u' }],
      profilePicture: 'p',
    }

    el._updateDom()
    el._bindEvents()

    return el
  }

  test('paragraph + mention controls all dispatch to host methods', async () => {
    const el = await buildEditor()

    const q = (s) => el.shadowRoot.querySelector(s)
    const qa = (s) => [...el.shadowRoot.querySelectorAll(s)]

    const ta = q('.' + CMS_ABOUT_CLASSES.PARA_INPUT)

    fire(ta, FORM_EVENTS.INPUT, 'edited')
    expect(el.aboutData.col1[0]).toBe('edited')

    // false arm: column deleted after binding
    delete el.aboutData.col1
    fire(ta, FORM_EVENTS.INPUT, 'x')

    const spies = {
      removeParagraph: jest.spyOn(el, 'removeParagraph'),
      moveParagraph: jest.spyOn(el, 'moveParagraph'),
      removeMentionItem: jest.spyOn(el, 'removeMentionItem'),
      moveMentionItem: jest.spyOn(el, 'moveMentionItem'),
      addMentionItem: jest.spyOn(el, 'addMentionItem'),
      addParagraph: jest.spyOn(el, 'addParagraph'),
      saveAboutData: jest.spyOn(el, 'saveAboutData'),
      applyPictureToAllLangs: jest.spyOn(el, 'applyPictureToAllLangs'),
      syncNonLocalizedToAllLangs: jest.spyOn(el, 'syncNonLocalizedToAllLangs'),
      generateGravatarUrl: jest.spyOn(el, 'generateGravatarUrl'),
    }

    qa(`.${CMS_ABOUT_CLASSES.PARA_REMOVE_BTN},.${CMS_ABOUT_CLASSES.PARA_UP_BTN},.${CMS_ABOUT_CLASSES.PARA_DOWN_BTN}`).forEach((b) =>
      fire(b, MOUSE_EVENTS.CLICK)
    )
    qa(`.${CMS_ABOUT_CLASSES.MENTION_REMOVE_BTN},.${CMS_ABOUT_CLASSES.MENTION_UP_BTN},.${CMS_ABOUT_CLASSES.MENTION_DOWN_BTN}`).forEach((b) =>
      fire(b, MOUSE_EVENTS.CLICK)
    )
    qa('.' + CMS_ABOUT_CLASSES.COL_ADD_BTN).forEach((b) => fire(b, MOUSE_EVENTS.CLICK))
    fire(q(`#${CMS_ABOUT_IDS.SAVE}`), MOUSE_EVENTS.CLICK)
    fire(q(`#${CMS_ABOUT_IDS.SYNC_PICTURE}`), MOUSE_EVENTS.CLICK)
    fire(q(`#${CMS_ABOUT_IDS.SYNC_ALL}`), MOUSE_EVENTS.CLICK)
    fire(q(`#${CMS_ABOUT_IDS.GEN_GRAVATAR}`), MOUSE_EVENTS.CLICK)
    fire(q(`#${CMS_ABOUT_IDS.ADD_MENTION}`), MOUSE_EVENTS.CLICK)

    expect(spies.removeParagraph).toHaveBeenCalled()
    expect(spies.moveParagraph).toHaveBeenCalled()
    expect(spies.addParagraph).toHaveBeenCalled()
    expect(spies.addMentionItem).toHaveBeenCalled()
    expect(spies.removeMentionItem).toHaveBeenCalled()
    expect(spies.moveMentionItem).toHaveBeenCalled()
    expect(spies.saveAboutData).toHaveBeenCalled()
    expect(spies.applyPictureToAllLangs).toHaveBeenCalled()
    expect(spies.syncNonLocalizedToAllLangs).toHaveBeenCalled()
    expect(spies.generateGravatarUrl).toHaveBeenCalled()

    // mention-field input: present item arm
    el.aboutData.mention_items = [{ name: 'n' }]

    const mf = q('.' + CMS_ABOUT_CLASSES.MENTION_FIELD)

    if (mf) {
      fire(mf, FORM_EVENTS.INPUT, 'newval')
      expect(el.aboutData.mention_items[0][mf.getAttribute(DATA_ATTRS.DATA_FIELD)]).toBe('newval')
    }

    // attr-fallback arms: every bound class with no data-* attributes
    const strayClasses = [
      CMS_ABOUT_CLASSES.MENTION_FIELD,
      CMS_ABOUT_CLASSES.MENTION_REMOVE_BTN,
      CMS_ABOUT_CLASSES.MENTION_UP_BTN,
      CMS_ABOUT_CLASSES.MENTION_DOWN_BTN,
      CMS_ABOUT_CLASSES.PARA_INPUT,
      CMS_ABOUT_CLASSES.PARA_REMOVE_BTN,
      CMS_ABOUT_CLASSES.PARA_UP_BTN,
      CMS_ABOUT_CLASSES.PARA_DOWN_BTN,
      CMS_ABOUT_CLASSES.COL_ADD_BTN,
      CMS_ABOUT_CLASSES.SIZE_PRESET_BTN,
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

    // out-of-range + missing-field arms
    const far = document.createElement('input')

    far.className = CMS_ABOUT_CLASSES.MENTION_FIELD
    far.setAttribute(DATA_ATTRS.DATA_IDX, '99')
    far.setAttribute(DATA_ATTRS.DATA_FIELD, 'name')
    el.shadowRoot.appendChild(far)

    el._bindEvents()
    fire(far, FORM_EVENTS.INPUT, 'x')

    // async data delegates
    el.loadAboutData?.()
    el.saveAboutData?.()
    el.setGravatarSize?.(128)

    // size preset + title/mentions/email/size/pic inputs
    const sizeBtn = q('.' + CMS_ABOUT_CLASSES.SIZE_PRESET_BTN)

    if (sizeBtn) fire(sizeBtn, MOUSE_EVENTS.CLICK)

    const langSel = q(`#${CMS_ABOUT_IDS.SELECT_LANG}`)

    if (langSel) {
      langSel.value = 'es'
      fire(langSel, FORM_EVENTS.CHANGE)
    }

    ;[
      [CMS_ABOUT_IDS.TITLE_INPUT, 'title'],
      [CMS_ABOUT_IDS.MENTIONS_TITLE, 'mentions'],
      [CMS_ABOUT_IDS.EMAIL_INPUT, null],
      [CMS_ABOUT_IDS.SIZE_INPUT, null],
      [CMS_ABOUT_IDS.PIC_INPUT, 'profilePicture'],
    ].forEach(([id, field]) => {
      const inp = q(`#${id}`)

      if (!inp) return

      fire(inp, FORM_EVENTS.INPUT, 'v')

      if (field) expect(el.aboutData[field]).toBe('v')
    })

    el.remove()
  })
})

