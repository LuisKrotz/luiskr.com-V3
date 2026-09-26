/**
 * @file @core/tokens/styles.js
 * @description Centralized base host styling rules for encapsulated Shadow DOM components.
 */

const _SKEL = 'skeleton'
const _FOOTER = 'footer'
const _NOTE = 'note'
const _TITLE = 'title'
const _MEDIA = 'media'
const _PARA = 'para'

const _D_SKEL = `.${_SKEL}`

const _SKEL_SELECTORS = [
  _D_SKEL,
  `${_D_SKEL}--shimmer`,
  `${_D_SKEL}-cover`,
  `${_D_SKEL}-placeholder`,
  `${_D_SKEL}--${_MEDIA}`,
  `${_D_SKEL}-${_MEDIA}`,
  `${_D_SKEL}--${_TITLE}`,
  `${_D_SKEL}-${_TITLE}-sm`,
  `${_D_SKEL}-${_TITLE}-md`,
  `${_D_SKEL}-${_TITLE}-lg`,
  `${_D_SKEL}--hero`,
  `${_D_SKEL}--text-line`,
  `${_D_SKEL}-${_PARA}-full`,
  `${_D_SKEL}-${_PARA}-94`,
  `${_D_SKEL}-${_PARA}-98`,
  `${_D_SKEL}-${_PARA}-65`,
  `${_D_SKEL}-section-${_TITLE}`,
  `${_D_SKEL}-badge`,
  `${_D_SKEL}-${_FOOTER}-link`,
  `${_D_SKEL}-${_FOOTER}-${_NOTE}-1`,
  `${_D_SKEL}-${_FOOTER}-${_NOTE}-2`,
].join(', ')

const _SKEL_BEFORE_SELECTORS = _SKEL_SELECTORS
  .split(', ')
  .map((s) => `${s}::before`)
  .join(', ')

export const BASE_HOST_STYLES = Object.freeze(
  `:host { display: block; font-family: var(--font-primary); color: var(--text-primary); box-sizing: border-box; }
:host > [data-content] { display: contents; }
@keyframes ${_SKEL}-shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
${_SKEL_SELECTORS} { position: relative; overflow: hidden; background: var(--skel-bg-1); color: transparent; user-select: none; }
${_SKEL_BEFORE_SELECTORS} { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, transparent 0%, var(--skel-bg-2) 50%, transparent 100%); transform: translateX(-100%); animation: ${_SKEL}-shimmer 2.4s ease-in-out infinite; will-change: transform; pointer-events: none; }
${_D_SKEL}--round { border-radius: 50%; }
${_D_SKEL}--block { display: block; }
:host-context(html.reduced-motion) *, :host-context(html.reduced-motion) *::before, :host-context(html.reduced-motion) *::after { animation-duration: 0.001ms; animation-iteration-count: 1; transition-duration: 0.001ms; }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.001ms; animation-iteration-count: 1; transition-duration: 0.001ms; } }`
)
