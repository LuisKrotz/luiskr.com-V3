/**
 * @file shadow-dom-css-vars.test.js
 * Tests: 200
 * Validates CSS custom property propagation across Shadow DOM boundaries.
 */

import fs from 'fs'
import path from 'path'

const ROOT = path.resolve('src/sass')
const internals = fs.readFileSync(path.join(ROOT, 'internals.scss'), 'utf8')
const mediaFigure = fs.readFileSync(path.join(ROOT, 'media-figure.scss'), 'utf8')
const carouselHost = fs.readFileSync(path.join(ROOT, 'carousel-host.scss'), 'utf8')

const strip = (s) => s.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '')
const ic = strip(internals)
const mfc = strip(mediaFigure)
const chc = strip(carouselHost)

// ─────────────────────────────────────────────────────────────────────────────
// 1. internals.scss — CSS var declarations on media-figure
// ─────────────────────────────────────────────────────────────────────────────
describe('internals.scss CSS var declarations on media-figure', () => {
  test('declares --mf-w', () => { expect(ic).toMatch(/--mf-w/) })
  test('declares --mf-h', () => { expect(ic).toMatch(/--mf-h/) })
  test('declares --mf-max-w', () => { expect(ic).toMatch(/--mf-max-w/) })
  test('targets media-figure element', () => { expect(ic).toMatch(/media-figure\s*\{/) })
  test('default --mf-w is 90vw calc', () => { expect(ic).toMatch(/--mf-w:\s*calc\(90vw/) })
  test('default --mf-h is 70vh calc', () => { expect(ic).toMatch(/--mf-h:\s*calc\(70vh/) })
  test('default --mf-max-w is none', () => { expect(ic).toMatch(/--mf-max-w:\s*none/) })
  test('768px --mf-w is 90vw calc', () => { expect(ic).toMatch(/layout-768[\s\S]*?--mf-w:\s*calc\(90vw/) })
  test('768px --mf-h is 70vh calc', () => { expect(ic).toMatch(/layout-768[\s\S]*?--mf-h:\s*calc\(70vh/) })
  test('1024px --mf-w is $space-6xl', () => { expect(ic).toMatch(/layout-1024[\s\S]*?--mf-w:\s*#\{\s*to-rem\(\$space-6xl\)/) })
  test('1024px --mf-h is $space-7xl', () => { expect(ic).toMatch(/layout-1024[\s\S]*?--mf-h:\s*#\{\s*to-rem\(\$space-7xl\)/) })
  test('1440px --mf-w is $space-7xl', () => { expect(ic).toMatch(/layout-1440[\s\S]*?--mf-w:\s*#\{\s*to-rem\(\$space-7xl\)/) })
  test('1440px --mf-h is $space-8xl', () => { expect(ic).toMatch(/layout-1440[\s\S]*?--mf-h:\s*#\{\s*to-rem\(\$space-8xl\)/) })
  test('2560px --mf-w is $space-8xl', () => { expect(ic).toMatch(/layout-2560[\s\S]*?--mf-w:\s*#\{\s*to-rem\(\$space-8xl\)/) })
  test('2560px --mf-h is $space-9xl', () => { expect(ic).toMatch(/layout-2560[\s\S]*?--mf-h:\s*#\{\s*to-rem\(\$space-9xl\)/) })
  test('landscape variant sets --mf-w auto at 1024px', () => { expect(ic).toMatch(/landscape media-figure[\s\S]*?--mf-w:\s*auto/) })
  test('landscape variant sets --mf-max-w at 1024px', () => { expect(ic).toMatch(/landscape media-figure[\s\S]*?--mf-max-w:\s*calc\(100vw/) })
  test('landscape variant has 1280px --mf-max-w', () => { expect(ic).toMatch(/landscape media-figure[\s\S]*?layout-1280[\s\S]*?--mf-max-w/) })
  test('landscape variant has 1440px --mf-max-w', () => { expect(ic).toMatch(/landscape media-figure[\s\S]*?layout-1440[\s\S]*?--mf-max-w/) })
  test('landscape variant has 1920px --mf-max-w', () => { expect(ic).toMatch(/landscape media-figure[\s\S]*?layout-1920[\s\S]*?--mf-max-w/) })
  test('small variant --mf-w at 1440px is $space-6xl', () => { expect(ic).toMatch(/small media-figure[\s\S]*?layout-1440[\s\S]*?--mf-w:\s*#\{\s*to-rem\(\$space-6xl\)/) })
  test('small variant --mf-h at 1440px is $space-8xl', () => { expect(ic).toMatch(/small media-figure[\s\S]*?layout-1440[\s\S]*?--mf-h:\s*#\{\s*to-rem\(\$space-8xl\)/) })
  test('small variant --mf-w at 2560px is $space-7xl', () => { expect(ic).toMatch(/small media-figure[\s\S]*?layout-2560[\s\S]*?--mf-w:\s*#\{\s*to-rem\(\$space-7xl\)/) })
  test('small variant --mf-h at 2560px is $space-9xl', () => { expect(ic).toMatch(/small media-figure[\s\S]*?layout-2560[\s\S]*?--mf-h:\s*#\{\s*to-rem\(\$space-9xl\)/) })
  test('no .render-placeholder with 90vw in light DOM (shadow cant pierce)', () => {
    expect(ic).not.toMatch(/\.render-placeholder\s*\{[^}]*width:\s*calc\(90vw/)
  })
  test('no .render-media directly targeted in .internal-extra-item', () => {
    expect(ic).not.toMatch(/\.internal-extra-item\s+\.render-media\s*\{/)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 2. media-figure.scss — reads CSS vars inside Shadow Root
// ─────────────────────────────────────────────────────────────────────────────
describe('media-figure.scss reads CSS vars inside Shadow Root', () => {
  test(':host has width: 100%', () => { expect(mfc).toMatch(/:host\s*\{[^}]*width:\s*100%/) })
  test(':host has display: block', () => { expect(mfc).toMatch(/:host\s*\{[^}]*display:\s*block/) })
  test(':host has position: relative', () => { expect(mfc).toMatch(/:host\s*\{[^}]*position:\s*relative/) })
  test(':host has box-sizing: border-box', () => { expect(mfc).toMatch(/:host\s*\{[^}]*box-sizing:\s*border-box/) })
  test(':host-context(.internal-extra-item) overrides width to auto', () => {
    expect(mfc).toMatch(/:host-context\(\.internal-extra-item\)[\s\S]*?width:\s*auto/)
  })
  test(':host-context(.internal-extra-item) .render-placeholder uses --mf-w var', () => {
    expect(mfc).toMatch(/:host-context\(\.internal-extra-item\)\s*\.render-placeholder[\s\S]*?var\(--mf-w/)
  })
  test(':host-context(.internal-extra-item) .render-placeholder uses --mf-h var', () => {
    expect(mfc).toMatch(/:host-context\(\.internal-extra-item\)\s*\.render-placeholder[\s\S]*?var\(--mf-h/)
  })
  test(':host-context(.internal-extra-item) .render-placeholder uses --mf-max-w var', () => {
    expect(mfc).toMatch(/:host-context\(\.internal-extra-item\)\s*\.render-placeholder[\s\S]*?var\(--mf-max-w/)
  })
  test('--mf-w var has 90vw fallback', () => { expect(mfc).toMatch(/var\(--mf-w,\s*calc\(90vw/) })
  test('--mf-h var has 70vh fallback', () => { expect(mfc).toMatch(/var\(--mf-h,\s*calc\(70vh/) })
  test('--mf-max-w var has none fallback', () => { expect(mfc).toMatch(/var\(--mf-max-w,\s*none\)/) })
  test(':host-context figure has display: flex for centering', () => {
    expect(mfc).toMatch(/:host-context\(\.internal-extra-item\)\s*figure[\s\S]*?display:\s*flex/)
  })
  test(':host-context figure has align-items: center', () => {
    expect(mfc).toMatch(/:host-context\(\.internal-extra-item\)\s*figure[\s\S]*?align-items:\s*center/)
  })
  test(':host-context figure has grey-3 background', () => {
    expect(mfc).toMatch(/:host-context\(\.internal-extra-item\)\s*figure[\s\S]*?background-color:\s*var\(--grey-3\)/)
  })
  test(':host-context figure removes background at 1024px', () => {
    expect(mfc).toMatch(/:host-context\(\.internal-extra-item\)\s*figure[\s\S]*?layout-1024[\s\S]*?background:\s*none/)
  })
  test('default .render-placeholder has width: 100%', () => { expect(mfc).toMatch(/\.render-placeholder\s*\{[^}]*width:\s*100%/) })
  test('default .render-placeholder has height: auto', () => { expect(mfc).toMatch(/\.render-placeholder\s*\{[^}]*height:\s*auto/) })
  test('default .render-placeholder has max-width: 100%', () => { expect(mfc).toMatch(/\.render-placeholder\s*\{[^}]*max-width:\s*100%/) })
  test('.render-media is absolutely positioned', () => { expect(mfc).toMatch(/\.render-media\s*\{[^}]*position:\s*absolute/) })
  test('.render-media has width: 100%', () => { expect(mfc).toMatch(/\.render-media\s*\{[^}]*width:\s*100%/) })
  test('.render-media has height: 100%', () => { expect(mfc).toMatch(/\.render-media\s*\{[^}]*height:\s*100%/) })
  test('.render-media uses object-fit: cover', () => { expect(mfc).toMatch(/\.render-media\s*\{[^}]*object-fit:\s*cover/) })
  test('.render-media uses object-position: top center', () => { expect(mfc).toMatch(/\.render-media\s*\{[^}]*object-position:\s*top center/) })
  test('.render-media--thumb has blur(12px)', () => { expect(mfc).toMatch(/--thumb[\s\S]*?filter:\s*blur\(12px\)/) })
  test('.render-media--thumb has z-index: 1', () => { expect(mfc).toMatch(/--thumb[\s\S]*?z-index:\s*1/) })
  test('.render-media--high starts opacity: 0', () => { expect(mfc).toMatch(/--high\s*\{[^}]*opacity:\s*0/) })
  test('.render-media--high has z-index: 2', () => { expect(mfc).toMatch(/--high\s*\{[^}]*z-index:\s*2/) })
  test('.render-media--loaded has opacity: 1', () => { expect(mfc).toMatch(/--loaded\s*\{[^}]*opacity:\s*1/) })
  test('video.render-media is absolutely positioned', () => { expect(mfc).toMatch(/video\.render-media\s*\{[^}]*position:\s*absolute/) })
  test('video.render-media has width: 100%', () => { expect(mfc).toMatch(/video\.render-media\s*\{[^}]*width:\s*100%/) })
  test('video.render-media has height: 100%', () => { expect(mfc).toMatch(/video\.render-media\s*\{[^}]*height:\s*100%/) })
  test('uses :host-context() (correct shadow ancestor selector)', () => { expect(mfc).toMatch(/:host-context/) })
  test('imports _variables', () => { expect(mediaFigure).toMatch(/@import ['"]_variables['"]/) })
  test('imports _mixins', () => { expect(mediaFigure).toMatch(/@import ['"]_mixins['"]/) })
})

// ─────────────────────────────────────────────────────────────────────────────
// 3. carousel-host.scss — redeclares vars for nested shadow root
// ─────────────────────────────────────────────────────────────────────────────
describe('carousel-host.scss redeclares CSS vars for nested media-figure', () => {
  test('declares --mf-w', () => { expect(chc).toMatch(/--mf-w/) })
  test('declares --mf-h', () => { expect(chc).toMatch(/--mf-h/) })
  test('declares --mf-max-w', () => { expect(chc).toMatch(/--mf-max-w/) })
  test('targets media-figure element', () => { expect(chc).toMatch(/media-figure\s*\{/) })
  test('default --mf-w is 90vw calc', () => { expect(chc).toMatch(/--mf-w:\s*calc\(90vw/) })
  test('default --mf-h is 70vh calc', () => { expect(chc).toMatch(/--mf-h:\s*calc\(70vh/) })
  test('default --mf-max-w is none', () => { expect(chc).toMatch(/--mf-max-w:\s*none/) })
  test('768px --mf-w is 90vw calc', () => { expect(chc).toMatch(/layout-768[\s\S]*?--mf-w:\s*calc\(90vw/) })
  test('768px --mf-h is 70vh calc', () => { expect(chc).toMatch(/layout-768[\s\S]*?--mf-h:\s*calc\(70vh/) })
  test('1024px --mf-w is $space-6xl', () => { expect(chc).toMatch(/layout-1024[\s\S]*?--mf-w:\s*#\{\s*to-rem\(\$space-6xl\)/) })
  test('1024px --mf-h is $space-7xl', () => { expect(chc).toMatch(/layout-1024[\s\S]*?--mf-h:\s*#\{\s*to-rem\(\$space-7xl\)/) })
  test('1440px --mf-w is $space-7xl', () => { expect(chc).toMatch(/layout-1440[\s\S]*?--mf-w:\s*#\{\s*to-rem\(\$space-7xl\)/) })
  test('1440px --mf-h is $space-8xl', () => { expect(chc).toMatch(/layout-1440[\s\S]*?--mf-h:\s*#\{\s*to-rem\(\$space-8xl\)/) })
  test('2560px --mf-w is $space-8xl', () => { expect(chc).toMatch(/layout-2560[\s\S]*?--mf-w:\s*#\{\s*to-rem\(\$space-8xl\)/) })
  test('2560px --mf-h is $space-9xl', () => { expect(chc).toMatch(/layout-2560[\s\S]*?--mf-h:\s*#\{\s*to-rem\(\$space-9xl\)/) })
  test('landscape variant sets --mf-w auto at 1024px', () => { expect(chc).toMatch(/landscape[\s\S]*?media-figure[\s\S]*?--mf-w:\s*auto/) })
  test('landscape variant sets --mf-max-w at 1024px', () => { expect(chc).toMatch(/landscape[\s\S]*?media-figure[\s\S]*?--mf-max-w:\s*calc\(100vw/) })
  test('landscape variant has 1280px --mf-max-w', () => { expect(chc).toMatch(/landscape[\s\S]*?media-figure[\s\S]*?layout-1280[\s\S]*?--mf-max-w/) })
  test('landscape variant has 1440px --mf-max-w', () => { expect(chc).toMatch(/landscape[\s\S]*?media-figure[\s\S]*?layout-1440[\s\S]*?--mf-max-w/) })
  test('landscape variant has 1920px --mf-max-w', () => { expect(chc).toMatch(/landscape[\s\S]*?media-figure[\s\S]*?layout-1920[\s\S]*?--mf-max-w/) })
  test('small variant --mf-w at 1440px is $space-6xl', () => { expect(chc).toMatch(/small[\s\S]*?media-figure[\s\S]*?layout-1440[\s\S]*?--mf-w:\s*#\{\s*to-rem\(\$space-6xl\)/) })
  test('small variant --mf-h at 1440px is $space-8xl', () => { expect(chc).toMatch(/small[\s\S]*?media-figure[\s\S]*?layout-1440[\s\S]*?--mf-h:\s*#\{\s*to-rem\(\$space-8xl\)/) })
  test('small variant --mf-w at 2560px is $space-7xl', () => { expect(chc).toMatch(/small[\s\S]*?media-figure[\s\S]*?layout-2560[\s\S]*?--mf-w:\s*#\{\s*to-rem\(\$space-7xl\)/) })
  test('small variant --mf-h at 2560px is $space-9xl', () => { expect(chc).toMatch(/small[\s\S]*?media-figure[\s\S]*?layout-2560[\s\S]*?--mf-h:\s*#\{\s*to-rem\(\$space-9xl\)/) })
  test(':host has display: block', () => { expect(chc).toMatch(/:host\s*\{[^}]*display:\s*block/) })
  test(':host has width: 100%', () => { expect(chc).toMatch(/:host\s*\{[^}]*width:\s*100%/) })
  test('imports _variables', () => { expect(carouselHost).toMatch(/@import ['"]_variables['"]/) })
  test('imports _mixins', () => { expect(carouselHost).toMatch(/@import ['"]_mixins['"]/) })
})

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
    expect(ic).toMatch(/landscape[\s\S]*?media-figure[\s\S]*?--mf-max-w:\s*calc\(100vw\s*-\s*#\{\s*to-rem\(\$space-3xl\)/)
    expect(chc).toMatch(/landscape[\s\S]*?media-figure[\s\S]*?--mf-max-w:\s*calc\(100vw\s*-\s*#\{\s*to-rem\(\$space-3xl\)/)
  })
  test('both use $space-4xl for landscape max-w at 1280px', () => {
    expect(ic).toMatch(/landscape[\s\S]*?media-figure[\s\S]*?layout-1280[\s\S]*?--mf-max-w:\s*calc\(100vw\s*-\s*#\{\s*to-rem\(\$space-4xl\)/)
    expect(chc).toMatch(/landscape[\s\S]*?media-figure[\s\S]*?layout-1280[\s\S]*?--mf-max-w:\s*calc\(100vw\s*-\s*#\{\s*to-rem\(\$space-4xl\)/)
  })
  test('media-figure.scss --mf-w fallback equals internals default formula', () => {
    expect(mfc).toMatch(/var\(--mf-w,\s*calc\(90vw/)
    expect(ic).toMatch(/--mf-w:\s*calc\(90vw/)
  })
  test('media-figure.scss --mf-h fallback equals internals default formula', () => {
    expect(mfc).toMatch(/var\(--mf-h,\s*calc\(70vh/)
    expect(ic).toMatch(/--mf-h:\s*calc\(70vh/)
  })
  test('media-figure.scss --mf-max-w fallback is none, matching internals default', () => {
    expect(mfc).toMatch(/var\(--mf-max-w,\s*none\)/)
    expect(ic).toMatch(/--mf-max-w:\s*none/)
  })
})

// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
describe('CSS variable values for CSS var breakpoint values', () => {
  test('default --mf-w matches Vue (90vw - xl*2)', () => {
    expect(ic).toMatch(/--mf-w:\s*calc\(90vw\s*-\s*#\{\s*to-rem\(\$space-xl\s*\*\s*2\)/)
  })
  test('default --mf-h matches Vue (70vh - xl*2)', () => {
    expect(ic).toMatch(/--mf-h:\s*calc\(70vh\s*-\s*#\{\s*to-rem\(\$space-xl\s*\*\s*2\)/)
  })
  test('768px --mf-w matches Vue (90vw - 2xl*2)', () => {
    expect(ic).toMatch(/layout-768[\s\S]*?--mf-w:\s*calc\(90vw\s*-\s*#\{\s*to-rem\(\$space-2xl\s*\*\s*2\)/)
  })
  test('768px --mf-h matches Vue (70vh - 2xl*2)', () => {
    expect(ic).toMatch(/layout-768[\s\S]*?--mf-h:\s*calc\(70vh\s*-\s*#\{\s*to-rem\(\$space-2xl\s*\*\s*2\)/)
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
    expect(ic).toMatch(/small media-figure[\s\S]*?layout-1440[\s\S]*?--mf-w:\s*#\{\s*to-rem\(\$space-6xl\)/)
  })
  test('small.1440px --mf-h uses $space-8xl', () => {
    expect(ic).toMatch(/small media-figure[\s\S]*?layout-1440[\s\S]*?--mf-h:\s*#\{\s*to-rem\(\$space-8xl\)/)
  })
  test('small.2560px --mf-w uses $space-7xl', () => {
    expect(ic).toMatch(/small media-figure[\s\S]*?layout-2560[\s\S]*?--mf-w:\s*#\{\s*to-rem\(\$space-7xl\)/)
  })
  test('small.2560px --mf-h uses $space-9xl', () => {
    expect(ic).toMatch(/small media-figure[\s\S]*?layout-2560[\s\S]*?--mf-h:\s*#\{\s*to-rem\(\$space-9xl\)/)
  })
  test('landscape.1024px --mf-w is auto (Vue: width: auto)', () => {
    expect(ic).toMatch(/landscape media-figure[\s\S]*?layout-1024[\s\S]*?--mf-w:\s*auto/)
  })
  test('landscape.1024px --mf-max-w uses $space-3xl', () => {
    expect(ic).toMatch(/landscape media-figure[\s\S]*?--mf-max-w:\s*calc\(100vw\s*-\s*#\{\s*to-rem\(\$space-3xl\)/)
  })
  test('landscape.1440px --mf-max-w uses $space-7xl', () => {
    expect(ic).toMatch(/landscape media-figure[\s\S]*?layout-1440[\s\S]*?--mf-max-w:\s*calc\(100vw\s*-\s*#\{\s*to-rem\(\$space-7xl\)/)
  })
  test('landscape.1920px --mf-max-w uses $space-6xl', () => {
    expect(ic).toMatch(/landscape media-figure[\s\S]*?layout-1920[\s\S]*?--mf-max-w:\s*calc\(100vw\s*-\s*#\{\s*to-rem\(\$space-6xl\)/)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 6. No-JS-injection compliance
// ─────────────────────────────────────────────────────────────────────────────
describe('no runtime JS style injection in MediaFigure', () => {
  let mfJS

  beforeAll(() => {
    mfJS = fs.readFileSync(path.resolve('src/components/MediaFigure.js'), 'utf8')
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
    expect(mfJS).not.toMatch(/shadowRoot\.querySelector\('style'\)\.textContent\s*=/)
  })
})
