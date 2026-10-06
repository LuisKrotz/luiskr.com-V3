/**
 * @file @core/tokens/styles.js
 * @description BASE_HOST_STYLES — a compiled-in stylesheet injected into
 * EVERY component shadow root (prepended to each component's own ?inline
 * SCSS in BaseComponent._renderInitial). It carries the universal rules
 * that must exist no matter which component mounts first:
 *   - `:host` display/font/color defaults so every element typesets correctly;
 *   - the skeleton shimmer system (all `skeleton-*` selectors + the
 *     `skeleton-shimmer` keyframes and the `skeleton-content-in` fade that
 *     plays when real content replaces a placeholder);
 *   - the `skeleton-layer` positioning the WebGL field overlays on;
 *   - the global reduced-motion kill-switch (`0.001ms` durations) so both
 *     the OS preference and the in-app toggle freeze all animation.
 * Selectors are assembled from `_SKEL`-derived fragments so the class
 * spellings match CLASSES tokens in constants.js by construction.
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

/**
 * The base stylesheet string injected into every component shadow root.
 * UX notes per rule group:
 *  - `:host { display:block; font-family/color }` — every component is a
 *    block-level, correctly-typeset box by default;
 *  - `skeleton-*` — grey placeholder boxes with a diagonal shimmer
 *    (::before gradient sweeping left→right every 1.8s) so loading feels
 *    alive; `color: transparent` hides the reserve-space text;
 *  - `skeleton-layer` — absolutely-positioned WebGL canvas overlaying the
 *    placeholders (has-skeleton-layer pauses the CSS shimmer to save paint);
 *  - `skeleton-content-in` — 0.45s fade when real content lands;
 *  - reduced-motion — collapses all animation/transition durations to
 *    ~0ms so motion-sensitive users see instant state changes.
 */
export const BASE_HOST_STYLES = Object.freeze(
  `:host { display: block; font-family: var(--font-primary); color: var(--text-primary); box-sizing: border-box; }
:host > [data-content] { display: contents; }
@keyframes ${_SKEL}-shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
${_SKEL_SELECTORS} { position: relative; overflow: hidden; background: var(--skel-bg-1); color: transparent; user-select: none; }
${_SKEL_BEFORE_SELECTORS} { content: ""; position: absolute; inset: 0; background: linear-gradient(105deg, transparent 30%, var(--skel-bg-2) 45%, var(--skel-bg-2) 55%, transparent 70%); transform: translateX(-100%); animation: ${_SKEL}-shimmer 1.8s linear infinite; will-change: transform; pointer-events: none; }
${_D_SKEL}--round { border-radius: 50%; }
:host(.has-${_SKEL}-layer) { position: relative; }
${_D_SKEL}-layer { position: absolute; top: 0; left: 0; pointer-events: none; z-index: 1; display: block; transform-origin: 0 0; }
:host(.has-${_SKEL}-layer) ${_SKEL_BEFORE_SELECTORS.split(', ').join(', :host(.has-' + _SKEL + '-layer) ')} { animation: none; opacity: 0; }
${_D_SKEL}--block { display: block; }
@keyframes ${_SKEL}-content-in { from { opacity: 0; } to { opacity: 1; } }
${_D_SKEL}-content-in > * { animation: ${_SKEL}-content-in 0.45s cubic-bezier(0.22, 1, 0.36, 1); }
:host-context(html.reduced-motion) *, :host-context(html.reduced-motion) *::before, :host-context(html.reduced-motion) *::after { animation-duration: 0.001ms; animation-iteration-count: 1; transition-duration: 0.001ms; }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.001ms; animation-iteration-count: 1; transition-duration: 0.001ms; } }`
)
