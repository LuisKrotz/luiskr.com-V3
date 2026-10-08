/**
 * @file shadow-dom-css-vars-carousel-host-scss-redeclares-css-vars-for-nested-media-figu.test.js
 * @description Split from shadow-dom-css-vars.test.js — covers the "carousel-host.scss redeclares CSS vars for nested media-figure" describe.
 */
import fs from 'fs'
import path from 'path'

const ROOT = path.resolve('core/sass/components')
const internals = fs.readFileSync(path.join(ROOT, 'internals/internals.scss'), 'utf8')
const mediaFigure = fs.readFileSync(path.join(ROOT, 'media/media-figure.scss'), 'utf8')
const carouselHost = fs.readFileSync(path.join(ROOT, 'carousel/carousel-host.scss'), 'utf8')

const strip = (s) => s.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '')
const _ic = strip(internals)
const _mfc = strip(mediaFigure)
const chc = strip(carouselHost)

// ─────────────────────────────────────────────────────────────────────────────
// 3. carousel-host.scss — redeclares vars for nested shadow root
// ─────────────────────────────────────────────────────────────────────────────
describe('carousel-host.scss redeclares CSS vars for nested media-figure', () => {
  test('declares --mf-w', () => {
    expect(chc).toMatch(/--mf-w/)
  })
  test('declares --mf-h', () => {
    expect(chc).toMatch(/--mf-h/)
  })
  test('declares --mf-max-w', () => {
    expect(chc).toMatch(/--mf-max-w/)
  })
  test('targets media-figure element', () => {
    expect(chc).toMatch(/media-figure\s*\{/)
  })
  test('default --mf-w is 90vw calc', () => {
    expect(chc).toMatch(/--mf-w:\s*calc\(90vw/)
  })
  test('default --mf-h is 70vh calc', () => {
    expect(chc).toMatch(/--mf-h:\s*calc\(70vh/)
  })
  test('--mf-max-w has no default (landscape-only so var() fallback works)', () => {
    expect(chc).not.toMatch(/--mf-max-w:\s*none/)
  })
  test('768px --mf-w is 90vw calc', () => {
    expect(chc).toMatch(/layout-768[\s\S]*?--mf-w:\s*calc\(90vw/)
  })
  test('768px --mf-h is 70vh calc', () => {
    expect(chc).toMatch(/layout-768[\s\S]*?--mf-h:\s*calc\(70vh/)
  })
  test('1024px --mf-w is $space-6xl', () => {
    expect(chc).toMatch(/layout-1024[\s\S]*?--mf-w:\s*#\{\s*to-rem\(\$space-6xl\)/)
  })
  test('1024px --mf-h is $space-7xl', () => {
    expect(chc).toMatch(/layout-1024[\s\S]*?--mf-h:\s*#\{\s*to-rem\(\$space-7xl\)/)
  })
  test('1440px --mf-w is $space-7xl', () => {
    expect(chc).toMatch(/layout-1440[\s\S]*?--mf-w:\s*#\{\s*to-rem\(\$space-7xl\)/)
  })
  test('1440px --mf-h is $space-8xl', () => {
    expect(chc).toMatch(/layout-1440[\s\S]*?--mf-h:\s*#\{\s*to-rem\(\$space-8xl\)/)
  })
  test('2560px --mf-w is $space-8xl', () => {
    expect(chc).toMatch(/layout-2560[\s\S]*?--mf-w:\s*#\{\s*to-rem\(\$space-8xl\)/)
  })
  test('2560px --mf-h is $space-9xl', () => {
    expect(chc).toMatch(/layout-2560[\s\S]*?--mf-h:\s*#\{\s*to-rem\(\$space-9xl\)/)
  })
  test('landscape variant sets --mf-w vw cap at 1024px', () => {
    expect(chc).toMatch(/landscape[\s\S]*?media-figure[\s\S]*?--mf-w:\s*calc\(100vw/)
  })
  test('landscape variant sets --mf-max-w at 1024px', () => {
    expect(chc).toMatch(/landscape[\s\S]*?media-figure[\s\S]*?--mf-max-w:\s*calc\(100vw/)
  })
  test('landscape variant has 1280px --mf-max-w', () => {
    expect(chc).toMatch(/landscape[\s\S]*?media-figure[\s\S]*?layout-1280[\s\S]*?--mf-max-w/)
  })
  test('landscape variant has 1440px --mf-max-w', () => {
    expect(chc).toMatch(/landscape[\s\S]*?media-figure[\s\S]*?layout-1440[\s\S]*?--mf-max-w/)
  })
  test('landscape variant has 1920px --mf-max-w', () => {
    expect(chc).toMatch(/landscape[\s\S]*?media-figure[\s\S]*?layout-1920[\s\S]*?--mf-max-w/)
  })
  test('small variant --mf-w at 1440px is $space-6xl', () => {
    expect(chc).toMatch(
      /small[\s\S]*?media-figure[\s\S]*?layout-1440[\s\S]*?--mf-w:\s*#\{\s*to-rem\(\$space-6xl\)/
    )
  })
  test('small variant --mf-h at 1440px is $space-8xl', () => {
    expect(chc).toMatch(
      /small[\s\S]*?media-figure[\s\S]*?layout-1440[\s\S]*?--mf-h:\s*#\{\s*to-rem\(\$space-8xl\)/
    )
  })
  test('small variant --mf-w at 2560px is $space-7xl', () => {
    expect(chc).toMatch(
      /small[\s\S]*?media-figure[\s\S]*?layout-2560[\s\S]*?--mf-w:\s*#\{\s*to-rem\(\$space-7xl\)/
    )
  })
  test('small variant --mf-h at 2560px is $space-9xl', () => {
    expect(chc).toMatch(
      /small[\s\S]*?media-figure[\s\S]*?layout-2560[\s\S]*?--mf-h:\s*#\{\s*to-rem\(\$space-9xl\)/
    )
  })
  test(':host has display: block', () => {
    expect(chc).toMatch(/:host\s*\{[^}]*display:\s*block/)
  })
  test(':host has width: 100%', () => {
    expect(chc).toMatch(/:host\s*\{[^}]*width:\s*100%/)
  })
  test('imports _variables', () => {
    expect(carouselHost).toMatch(/@import ['"](?:(?:\.\.\/)+base\/)?_?variables['"]/)
  })
  test('imports _mixins', () => {
    expect(carouselHost).toMatch(/@import ['"](?:(?:\.\.\/)+base\/)?_?mixins['"]/)
  })
})
