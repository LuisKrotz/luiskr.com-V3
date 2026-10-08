/**
 * @file shadow-dom-css-vars-cross-file-css-var-value-consistency.test.js
 * @description Split from shadow-dom-css-vars.test.js — covers the "cross-file CSS var value consistency" describe.
 */
import fs from 'fs'
import path from 'path'

const ROOT = path.resolve('core/sass/components')
const internals = fs.readFileSync(path.join(ROOT, 'internals/internals.scss'), 'utf8')
const mediaFigure = fs.readFileSync(path.join(ROOT, 'media/media-figure.scss'), 'utf8')
const carouselHost = fs.readFileSync(path.join(ROOT, 'carousel/carousel-host.scss'), 'utf8')

const strip = (s) => s.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '')
const ic = strip(internals)
const mfc = strip(mediaFigure)
const chc = strip(carouselHost)

// ─────────────────────────────────────────────────────────────────────────────
// 4. Cross-file value consistency
// ─────────────────────────────────────────────────────────────────────────────
describe('cross-file CSS var value consistency', () => {
  test('both agree on default --mf-w 90vw formula', () => {
    expect(ic).toMatch(/--mf-w:\s*calc\(90vw/)
    expect(chc).toMatch(/--mf-w:\s*calc\(90vw/)
  })
  test('both agree on default --mf-h 70vh formula', () => {
    expect(ic).toMatch(/--mf-h:\s*calc\(70vh/)
    expect(chc).toMatch(/--mf-h:\s*calc\(70vh/)
  })
  test('both use $space-6xl at 1024px --mf-w', () => {
    expect(ic).toMatch(/layout-1024[\s\S]*?--mf-w:\s*#\{\s*to-rem\(\$space-6xl\)/)
    expect(chc).toMatch(/layout-1024[\s\S]*?--mf-w:\s*#\{\s*to-rem\(\$space-6xl\)/)
  })
  test('both use $space-7xl at 1024px --mf-h', () => {
    expect(ic).toMatch(/layout-1024[\s\S]*?--mf-h:\s*#\{\s*to-rem\(\$space-7xl\)/)
    expect(chc).toMatch(/layout-1024[\s\S]*?--mf-h:\s*#\{\s*to-rem\(\$space-7xl\)/)
  })
  test('both use $space-7xl at 1440px --mf-w', () => {
    expect(ic).toMatch(/layout-1440[\s\S]*?--mf-w:\s*#\{\s*to-rem\(\$space-7xl\)/)
    expect(chc).toMatch(/layout-1440[\s\S]*?--mf-w:\s*#\{\s*to-rem\(\$space-7xl\)/)
  })
  test('both use $space-8xl at 1440px --mf-h', () => {
    expect(ic).toMatch(/layout-1440[\s\S]*?--mf-h:\s*#\{\s*to-rem\(\$space-8xl\)/)
    expect(chc).toMatch(/layout-1440[\s\S]*?--mf-h:\s*#\{\s*to-rem\(\$space-8xl\)/)
  })
  test('both use $space-8xl at 2560px --mf-w', () => {
    expect(ic).toMatch(/layout-2560[\s\S]*?--mf-w:\s*#\{\s*to-rem\(\$space-8xl\)/)
    expect(chc).toMatch(/layout-2560[\s\S]*?--mf-w:\s*#\{\s*to-rem\(\$space-8xl\)/)
  })
  test('both use $space-9xl at 2560px --mf-h', () => {
    expect(ic).toMatch(/layout-2560[\s\S]*?--mf-h:\s*#\{\s*to-rem\(\$space-9xl\)/)
    expect(chc).toMatch(/layout-2560[\s\S]*?--mf-h:\s*#\{\s*to-rem\(\$space-9xl\)/)
  })
  test('both use $space-3xl for landscape max-w at 1024px', () => {
    expect(ic).toMatch(
      /landscape[\s\S]*?media-figure[\s\S]*?--mf-max-w:\s*calc\(100vw\s*-\s*#\{\s*to-rem\(\$space-3xl\)/
    )
    expect(chc).toMatch(
      /landscape[\s\S]*?media-figure[\s\S]*?--mf-max-w:\s*calc\(100vw\s*-\s*#\{\s*to-rem\(\$space-3xl\)/
    )
  })
  test('both use $space-4xl for landscape max-w at 1280px', () => {
    expect(ic).toMatch(
      /landscape[\s\S]*?media-figure[\s\S]*?layout-1280[\s\S]*?--mf-max-w:\s*calc\(100vw\s*-\s*#\{\s*to-rem\(\$space-4xl\)/
    )
    expect(chc).toMatch(
      /landscape[\s\S]*?media-figure[\s\S]*?layout-1280[\s\S]*?--mf-max-w:\s*calc\(100vw\s*-\s*#\{\s*to-rem\(\$space-4xl\)/
    )
  })
  test('media-figure.scss --mf-w fallback equals internals default formula', () => {
    expect(mfc).toMatch(/var\(--mf-w,\s*calc\(90vw/)
    expect(ic).toMatch(/--mf-w:\s*calc\(90vw/)
  })
  test('media-figure.scss --mf-h fallback equals internals default formula', () => {
    expect(mfc).toMatch(/var\(--mf-h,\s*calc\(70vh/)
    expect(ic).toMatch(/--mf-h:\s*calc\(70vh/)
  })
  test('media-figure.scss --mf-max-w carries a vw-cap fallback for landscape', () => {
    expect(mfc).toMatch(/var\(--mf-max-w,\s*calc\(100vw/)
    expect(ic).toMatch(/--mf-max-w:\s*calc\(100vw/)
  })
})
