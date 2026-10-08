/**
 * @file shadow-dom-css-vars-internals-scss-css-var-declarations-on-media-figure.test.js
 * @description Split from shadow-dom-css-vars.test.js — covers the "internals.scss CSS var declarations on media-figure" describe.
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
// 1. internals.scss — CSS var declarations on media-figure
// ─────────────────────────────────────────────────────────────────────────────
describe('internals.scss CSS var declarations on media-figure', () => {
  test('declares --mf-w', () => {
    expect(ic).toMatch(/--mf-w/)
  })
  test('declares --mf-h', () => {
    expect(ic).toMatch(/--mf-h/)
  })
  test('declares --mf-max-w', () => {
    expect(ic).toMatch(/--mf-max-w/)
  })
  test('targets media-figure element', () => {
    expect(ic).toMatch(/media-figure\s*\{/)
  })
  test('default --mf-w is 90vw calc', () => {
    expect(ic).toMatch(/--mf-w:\s*calc\(90vw/)
  })
  test('default --mf-h is 70vh calc', () => {
    expect(ic).toMatch(/--mf-h:\s*calc\(70vh/)
  })
  test('--mf-max-w has no default (landscape-only so var() fallback works)', () => {
    // A `--mf-max-w: none` default would resolve `max-width: none` on every
    // item — the placeholder contract needs the var *unset* outside
    // landscape so `var(--mf-max-w, …)` falls back to the gutter cap.
    expect(ic).not.toMatch(/--mf-max-w:\s*none/)
  })
  test('768px --mf-w is 90vw calc', () => {
    expect(ic).toMatch(/layout-768[\s\S]*?--mf-w:\s*calc\(90vw/)
  })
  test('768px --mf-h is 70vh calc', () => {
    expect(ic).toMatch(/layout-768[\s\S]*?--mf-h:\s*calc\(70vh/)
  })
  test('1024px --mf-w is $space-6xl', () => {
    expect(ic).toMatch(/layout-1024[\s\S]*?--mf-w:\s*#\{\s*to-rem\(\$space-6xl\)/)
  })
  test('1024px --mf-h is $space-7xl', () => {
    expect(ic).toMatch(/layout-1024[\s\S]*?--mf-h:\s*#\{\s*to-rem\(\$space-7xl\)/)
  })
  test('1440px --mf-w is $space-7xl', () => {
    expect(ic).toMatch(/layout-1440[\s\S]*?--mf-w:\s*#\{\s*to-rem\(\$space-7xl\)/)
  })
  test('1440px --mf-h is $space-8xl', () => {
    expect(ic).toMatch(/layout-1440[\s\S]*?--mf-h:\s*#\{\s*to-rem\(\$space-8xl\)/)
  })
  test('2560px --mf-w is $space-8xl', () => {
    expect(ic).toMatch(/layout-2560[\s\S]*?--mf-w:\s*#\{\s*to-rem\(\$space-8xl\)/)
  })
  test('2560px --mf-h is $space-9xl', () => {
    expect(ic).toMatch(/layout-2560[\s\S]*?--mf-h:\s*#\{\s*to-rem\(\$space-9xl\)/)
  })
  test('landscape variant sets --mf-w vw cap at 1024px', () => {
    expect(ic).toMatch(/landscape media-figure[\s\S]*?--mf-w:\s*calc\(100vw/)
  })
  test('landscape variant sets --mf-max-w at 1024px', () => {
    expect(ic).toMatch(/landscape media-figure[\s\S]*?--mf-max-w:\s*calc\(100vw/)
  })
  test('landscape variant has 1280px --mf-max-w', () => {
    expect(ic).toMatch(/landscape media-figure[\s\S]*?layout-1280[\s\S]*?--mf-max-w/)
  })
  test('landscape variant has 1440px --mf-max-w', () => {
    expect(ic).toMatch(/landscape media-figure[\s\S]*?layout-1440[\s\S]*?--mf-max-w/)
  })
  test('landscape variant has 1920px --mf-max-w', () => {
    expect(ic).toMatch(/landscape media-figure[\s\S]*?layout-1920[\s\S]*?--mf-max-w/)
  })
  test('small variant --mf-w at 1440px is $space-6xl', () => {
    expect(ic).toMatch(
      /small media-figure[\s\S]*?layout-1440[\s\S]*?--mf-w:\s*#\{\s*to-rem\(\$space-6xl\)/
    )
  })
  test('small variant --mf-h at 1440px is $space-8xl', () => {
    expect(ic).toMatch(
      /small media-figure[\s\S]*?layout-1440[\s\S]*?--mf-h:\s*#\{\s*to-rem\(\$space-8xl\)/
    )
  })
  test('small variant --mf-w at 2560px is $space-7xl', () => {
    expect(ic).toMatch(
      /small media-figure[\s\S]*?layout-2560[\s\S]*?--mf-w:\s*#\{\s*to-rem\(\$space-7xl\)/
    )
  })
  test('small variant --mf-h at 2560px is $space-9xl', () => {
    expect(ic).toMatch(
      /small media-figure[\s\S]*?layout-2560[\s\S]*?--mf-h:\s*#\{\s*to-rem\(\$space-9xl\)/
    )
  })
  test('no .render-placeholder with 90vw in light DOM (shadow cant pierce)', () => {
    expect(ic).not.toMatch(/\.render-placeholder\s*\{[^}]*width:\s*calc\(90vw/)
  })
  test('no .render-media directly targeted in .internal-extra-item', () => {
    expect(ic).not.toMatch(/\.internal-extra-item\s+\.render-media\s*\{/)
  })
})
