/**
 * @file shadow-dom-css-vars-media-figure-scss-reads-css-vars-inside-shadow-root.test.js
 * @description Split from shadow-dom-css-vars.test.js — covers the "media-figure.scss reads CSS vars inside Shadow Root" describe.
 */
import fs from 'fs'
import path from 'path'

const ROOT = path.resolve('core/sass/components')
const internals = fs.readFileSync(path.join(ROOT, 'internals/internals.scss'), 'utf8')
const mediaFigure = fs.readFileSync(path.join(ROOT, 'media/media-figure.scss'), 'utf8')
const carouselHost = fs.readFileSync(path.join(ROOT, 'carousel/carousel-host.scss'), 'utf8')

const strip = (s) => s.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '')
const _ic = strip(internals)
const mfc = strip(mediaFigure)
const _chc = strip(carouselHost)

// ─────────────────────────────────────────────────────────────────────────────
// 2. media-figure.scss — reads CSS vars inside Shadow Root
// ─────────────────────────────────────────────────────────────────────────────
describe('media-figure.scss reads CSS vars inside Shadow Root', () => {
  test(':host has width: 100%', () => {
    expect(mfc).toMatch(/:host\s*\{[^}]*width:\s*100%/)
  })
  test(':host has display: block', () => {
    expect(mfc).toMatch(/:host\s*\{[^}]*display:\s*block/)
  })
  test(':host has position: relative', () => {
    expect(mfc).toMatch(/:host\s*\{[^}]*position:\s*relative/)
  })
  test(':host has box-sizing: border-box', () => {
    expect(mfc).toMatch(/:host\s*\{[^}]*box-sizing:\s*border-box/)
  })
  test(':host-context(.internal-extra-item) overrides width to auto', () => {
    expect(mfc).toMatch(/:host-context\(\.internal-extra-item\)[\s\S]*?width:\s*auto/)
  })
  test(':host-context(.internal-extra-item) .render-placeholder uses --mf-w var', () => {
    expect(mfc).toMatch(
      /:host-context\(\.internal-extra-item\)\s*\.render-placeholder[\s\S]*?var\(--mf-w/
    )
  })
  test(':host-context(.internal-extra-item) .render-placeholder uses --mf-h var', () => {
    expect(mfc).toMatch(
      /:host-context\(\.internal-extra-item\)\s*\.render-placeholder[\s\S]*?var\(--mf-h/
    )
  })
  test(':host-context(.internal-extra-item) .render-placeholder uses --mf-max-w var', () => {
    expect(mfc).toMatch(
      /:host-context\(\.internal-extra-item\)\s*\.render-placeholder[\s\S]*?var\(--mf-max-w/
    )
  })
  test('--mf-w var has 90vw fallback', () => {
    expect(mfc).toMatch(/var\(--mf-w,\s*calc\(90vw/)
  })
  test('--mf-h var has 70vh fallback', () => {
    expect(mfc).toMatch(/var\(--mf-h,\s*calc\(70vh/)
  })
  test('--mf-w is consumed as a max-width cap (never a forced width)', () => {
    // Intrinsic-size contract: the placeholder keeps its natural box and the
    // mf vars only clamp it — a fixed `width: var(--mf-w)` would force every
    // slide to the same width and upscale images past their source size.
    expect(mfc).toMatch(/max-width:\s*var\(--mf-w,/)
    // `(?:^|[;{]\s*)width:` — the property must be `width`, not `max-width`.
    expect(mfc).not.toMatch(/\.render-placeholder\s*\{[^}]*[;{]\s*width:\s*var\(--mf-w/)
  })
  test(':host-context figure has display: flex for centering', () => {
    expect(mfc).toMatch(/:host-context\(\.internal-extra-item\)\s*figure[\s\S]*?display:\s*flex/)
  })
  test(':host-context figure has align-items: center', () => {
    expect(mfc).toMatch(
      /:host-context\(\.internal-extra-item\)\s*figure[\s\S]*?align-items:\s*center/
    )
  })
  test(':host-context figure has grey-3 background', () => {
    expect(mfc).toMatch(
      /:host-context\(\.internal-extra-item\)\s*figure[\s\S]*?background-color:\s*var\(--grey-3\)/
    )
  })
  test(':host-context figure removes background at 1024px', () => {
    expect(mfc).toMatch(
      /:host-context\(\.internal-extra-item\)\s*figure[\s\S]*?layout-1024[\s\S]*?background:\s*none/
    )
  })
  test('default .render-placeholder has width: 100%', () => {
    expect(mfc).toMatch(/\.render-placeholder\s*\{[^}]*width:\s*100%/)
  })
  test('default .render-placeholder has height: auto', () => {
    expect(mfc).toMatch(/\.render-placeholder\s*\{[^}]*height:\s*auto/)
  })
  test('default .render-placeholder has max-width: 100%', () => {
    expect(mfc).toMatch(/\.render-placeholder\s*\{[^}]*max-width:\s*100%/)
  })
  test('.render-media is absolutely positioned', () => {
    expect(mfc).toMatch(/\.render-media\s*\{[^}]*position:\s*absolute/)
  })
  test('.render-media has width: 100%', () => {
    expect(mfc).toMatch(/\.render-media\s*\{[^}]*width:\s*100%/)
  })
  test('.render-media has height: 100%', () => {
    expect(mfc).toMatch(/\.render-media\s*\{[^}]*height:\s*100%/)
  })
  test('.render-media uses object-fit: cover', () => {
    expect(mfc).toMatch(/\.render-media\s*\{[^}]*object-fit:\s*cover/)
  })
  test('.render-media uses object-position: top center', () => {
    expect(mfc).toMatch(/\.render-media\s*\{[^}]*object-position:\s*top center/)
  })
  test('.render-media--thumb has blur(12px)', () => {
    expect(mfc).toMatch(/--thumb[\s\S]*?filter:\s*blur\(12px\)/)
  })
  test('.render-media--thumb has z-index: 1', () => {
    expect(mfc).toMatch(/--thumb[\s\S]*?z-index:\s*1/)
  })
  test('.render-media--high starts opacity: 0', () => {
    expect(mfc).toMatch(/--high\s*\{[^}]*opacity:\s*0/)
  })
  test('.render-media--high has z-index: 2', () => {
    expect(mfc).toMatch(/--high\s*\{[^}]*z-index:\s*2/)
  })
  test('.render-media--loaded has opacity: 1', () => {
    expect(mfc).toMatch(/--loaded\s*\{[^}]*opacity:\s*1/)
  })
  test('video.render-media is absolutely positioned', () => {
    expect(mfc).toMatch(/video\.render-media\s*\{[^}]*position:\s*absolute/)
  })
  test('video.render-media has width: 100%', () => {
    expect(mfc).toMatch(/video\.render-media\s*\{[^}]*width:\s*100%/)
  })
  test('video.render-media has height: 100%', () => {
    expect(mfc).toMatch(/video\.render-media\s*\{[^}]*height:\s*100%/)
  })
  test('uses :host-context() (correct shadow ancestor selector)', () => {
    expect(mfc).toMatch(/:host-context/)
  })
  test('imports _variables', () => {
    expect(mediaFigure).toMatch(/@import ['"](?:(?:\.\.\/)+base\/)?_?variables['"]/)
  })
  test('imports _mixins', () => {
    expect(mediaFigure).toMatch(/@import ['"](?:(?:\.\.\/)+base\/)?_?mixins['"]/)
  })
})
