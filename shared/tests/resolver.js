/**
 * @file resolver.js
 * Custom Jest resolver: a `.js` import specifier may point at a `.ts`/`.tsx`
 * source (TypeScript convention — specifiers keep their emitted spelling).
 * Falls back extension `.js` → `.ts` → `.tsx` when the literal file is absent.
 */

const TS_EXT_FALLBACKS = ['.ts', '.tsx']

export default function resolver(request, options) {
  try {
    return options.defaultResolver(request, options)
  } catch (err) {
    if (!request.endsWith('.js')) throw err

    const base = request.slice(0, -3)

    for (const ext of TS_EXT_FALLBACKS) {
      try {
        return options.defaultResolver(`${base}${ext}`, options)
      } catch {
        /* try next extension */
      }
    }

    throw err
  }
}
