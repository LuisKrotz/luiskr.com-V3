/**
 * DOM utility helpers for traversing and querying across Shadow DOM boundaries
 */

export function deepQuerySelector(selector, root = (typeof document !== 'undefined' ? document : null)) {
  if (!root) return null
  const el = root.querySelector?.(selector)
  if (el) return el

  const elements = root.querySelectorAll ? root.querySelectorAll('*') : []
  for (const child of elements) {
    if (child.shadowRoot) {
      const found = deepQuerySelector(selector, child.shadowRoot)
      if (found) return found
    }
  }
  return null
}

export function deepQuerySelectorAll(
  selector,
  root = (typeof document !== 'undefined' ? document : null),
  results = []
) {
  if (!root) return results
  const els = root.querySelectorAll ? root.querySelectorAll(selector) : []
  results.push(...els)

  const elements = root.querySelectorAll ? root.querySelectorAll('*') : []
  for (const child of elements) {
    if (child.shadowRoot) {
      deepQuerySelectorAll(selector, child.shadowRoot, results)
    }
  }
  return results
}

