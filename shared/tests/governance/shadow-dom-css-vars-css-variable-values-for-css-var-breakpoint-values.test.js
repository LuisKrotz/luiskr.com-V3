/**
 * @file shadow-dom-css-vars-css-variable-values-for-css-var-breakpoint-values.test.js
 * @description Split from shadow-dom-css-vars.test.js — covers the "CSS variable values for CSS var breakpoint values" describe.
 */
import fs from 'fs'
import path from 'path'

const ROOT = path.resolve('core/sass/components')
const internals = fs.readFileSync(path.join(ROOT, 'internals/internals.scss'), 'utf8')
const mediaFigure = fs.readFileSync(path.join(ROOT, 'media/media-figure.scss'), 'utf8')
const carouselHost = fs.readFileSync(path.join(ROOT, 'carousel/carousel-host.scss'), 'utf8')

const strip = (s) => s.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '')
const ic = strip(internals)
const _mfc = strip(mediaFigure)
const _chc = strip(carouselHost)

// ─────────────────────────────────────────────────────────────────────────────
describe('CSS variable values for CSS var breakpoint values', () => {
  test('default --mf-w matches Vue (90vw - xl*2)', () => {
    expect(ic).toMatch(/--mf-w:\s*calc\(90vw\s*-\s*#\{\s*to-rem\(\$space-xl\s*\*\s*2\)/)
  })
  test('default --mf-h matches Vue (70vh - xl*2)', () => {
    expect(ic).toMatch(/--mf-h:\s*calc\(70vh\s*-\s*#\{\s*to-rem\(\$space-xl\s*\*\s*2\)/)
  })
  test('768px --mf-w matches Vue (90vw - 2xl*2)', () => {
    expect(ic).toMatch(
      /layout-768[\s\S]*?--mf-w:\s*calc\(90vw\s*-\s*#\{\s*to-rem\(\$space-2xl\s*\*\s*2\)/
    )
  })
  test('768px --mf-h matches Vue (70vh - 2xl*2)', () => {
    expect(ic).toMatch(
      /layout-768[\s\S]*?--mf-h:\s*calc\(70vh\s*-\s*#\{\s*to-rem\(\$space-2xl\s*\*\s*2\)/
    )
  })
  test('1024px --mf-w uses $space-6xl (Vue: width: to-rem($space-6xl))', () => {
    expect(ic).toMatch(/layout-1024[\s\S]*?--mf-w:\s*#\{\s*to-rem\(\$space-6xl\)/)
  })
  test('1024px --mf-h uses $space-7xl (Vue: height: to-rem($space-7xl))', () => {
    expect(ic).toMatch(/layout-1024[\s\S]*?--mf-h:\s*#\{\s*to-rem\(\$space-7xl\)/)
  })
  test('1440px --mf-w uses $space-7xl', () => {
    expect(ic).toMatch(/layout-1440[\s\S]*?--mf-w:\s*#\{\s*to-rem\(\$space-7xl\)/)
  })
  test('1440px --mf-h uses $space-8xl', () => {
    expect(ic).toMatch(/layout-1440[\s\S]*?--mf-h:\s*#\{\s*to-rem\(\$space-8xl\)/)
  })
  test('2560px --mf-w uses $space-8xl', () => {
    expect(ic).toMatch(/layout-2560[\s\S]*?--mf-w:\s*#\{\s*to-rem\(\$space-8xl\)/)
  })
  test('2560px --mf-h uses $space-9xl', () => {
    expect(ic).toMatch(/layout-2560[\s\S]*?--mf-h:\s*#\{\s*to-rem\(\$space-9xl\)/)
  })
  test('small.1440px --mf-w uses $space-6xl (Vue small variant)', () => {
    expect(ic).toMatch(
      /small media-figure[\s\S]*?layout-1440[\s\S]*?--mf-w:\s*#\{\s*to-rem\(\$space-6xl\)/
    )
  })
  test('small.1440px --mf-h uses $space-8xl', () => {
    expect(ic).toMatch(
      /small media-figure[\s\S]*?layout-1440[\s\S]*?--mf-h:\s*#\{\s*to-rem\(\$space-8xl\)/
    )
  })
  test('small.2560px --mf-w uses $space-7xl', () => {
    expect(ic).toMatch(
      /small media-figure[\s\S]*?layout-2560[\s\S]*?--mf-w:\s*#\{\s*to-rem\(\$space-7xl\)/
    )
  })
  test('small.2560px --mf-h uses $space-9xl', () => {
    expect(ic).toMatch(
      /small media-figure[\s\S]*?layout-2560[\s\S]*?--mf-h:\s*#\{\s*to-rem\(\$space-9xl\)/
    )
  })
  test('landscape.1024px --mf-w is the vw gutter cap', () => {
    expect(ic).toMatch(/landscape media-figure[\s\S]*?layout-1024[\s\S]*?--mf-w:\s*calc\(100vw/)
  })
  test('landscape.1024px --mf-max-w uses $space-3xl', () => {
    expect(ic).toMatch(
      /landscape media-figure[\s\S]*?--mf-max-w:\s*calc\(100vw\s*-\s*#\{\s*to-rem\(\$space-3xl\)/
    )
  })
  test('landscape.1440px --mf-max-w uses $space-7xl', () => {
    expect(ic).toMatch(
      /landscape media-figure[\s\S]*?layout-1440[\s\S]*?--mf-max-w:\s*calc\(100vw\s*-\s*#\{\s*to-rem\(\$space-7xl\)/
    )
  })
  test('landscape.1920px --mf-max-w uses $space-6xl', () => {
    expect(ic).toMatch(
      /landscape media-figure[\s\S]*?layout-1920[\s\S]*?--mf-max-w:\s*calc\(100vw\s*-\s*#\{\s*to-rem\(\$space-6xl\)/
    )
  })
})
