/**
 * @file shadow-dom-css-vars-no-runtime-js-style-injection-in-mediafigure.test.js
 * @description Split from shadow-dom-css-vars.test.js — covers the "no runtime JS style injection in MediaFigure" describe.
 */
import fs from 'fs'
import path from 'path'
import { HTML_TAGS } from '@core/tokens/elements/html.js'

const ROOT = path.resolve('core/sass/components')
const internals = fs.readFileSync(path.join(ROOT, 'internals/internals.scss'), 'utf8')
const mediaFigure = fs.readFileSync(path.join(ROOT, 'media/media-figure.scss'), 'utf8')
const carouselHost = fs.readFileSync(path.join(ROOT, 'carousel/carousel-host.scss'), 'utf8')

const strip = (s) => s.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '')
const _ic = strip(internals)
const _mfc = strip(mediaFigure)
const _chc = strip(carouselHost)

// ─────────────────────────────────────────────────────────────────────────────
// 6. No-JS-injection compliance
// ─────────────────────────────────────────────────────────────────────────────
describe('no runtime JS style injection in MediaFigure', () => {
  let mfJS

  beforeAll(() => {
    mfJS = fs.readFileSync(path.resolve('website/components/media/MediaFigure.tsx'), 'utf8')
  })

  test('imports media-figure.scss?inline', () => {
    expect(mfJS).toMatch(/import mediaFigureStyles from ['"].*media-figure\.scss\?inline['"]/)
  })
  test('passes mediaFigureStyles to super()', () => {
    expect(mfJS).toMatch(/super\(`.*mediaFigureStyles/)
  })
  test('does not inject width pixel strings', () => {
    expect(mfJS).not.toMatch(/\.style\.width\s*=\s*['"][0-9]+px['"]/)
  })
  test('does not inject height pixel strings', () => {
    expect(mfJS).not.toMatch(/\.style\.height\s*=\s*['"][0-9]+px['"]/)
  })
  test('does not override style.textContent on shadow root', () => {
    expect(mfJS).not.toMatch(
      new RegExp(`shadowRoot\\.querySelector\\('${HTML_TAGS.STYLE}'\\)\\.textContent\\s*=`)
    )
  })
})
