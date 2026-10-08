/**
 * @file modules.d.ts
 * @description Ambient module declarations — `?inline`/`?raw`/`?url` resource
 * queries, binary asset extensions, Vite `virtual:*` modules, and the
 * temporary `*.js` migration shim (removed once every importer is on TS).
 * Kept as a global (non-module) .d.ts so `declare module` blocks stay ambient.
 */

declare module '*.scss?inline' {
  const css: string
  export default css
}

declare module '*.css?inline' {
  const css: string
  export default css
}

declare module '*.scss' {
  const css: string
  export default css
}

declare module '*.css' {
  const css: string
  export default css
}

declare module '*?raw' {
  const content: string
  export default content
}

declare module '*?url' {
  const url: string
  export default url
}

declare module '*.png' {
  const src: string
  export default src
}

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.jpeg' {
  const src: string
  export default src
}

declare module '*.webp' {
  const src: string
  export default src
}

declare module '*.avif' {
  const src: string
  export default src
}

declare module '*.svg' {
  const src: string
  export default src
}

declare module '*.mp4' {
  const src: string
  export default src
}

declare module '*.webm' {
  const src: string
  export default src
}

declare module '*.ogg' {
  const src: string
  export default src
}

declare module '*.mp3' {
  const src: string
  export default src
}

declare module '*.wasm' {
  const src: string
  export default src
}

declare module '*?worker' {
  const workerFactory: new () => Worker
  export default workerFactory
}

declare module 'virtual:i18n-fallback' {
  const fallback: Record<string, unknown>
  export default fallback
}

declare module 'virtual:i18n-boot-index' {
  const index: Record<string, unknown>
  export default index
}

declare module 'virtual:docs-manifest' {
  const manifest: {
    generated: string
    roots: Array<{
      root: string
      label: string
      children: Array<{
        type: 'dir' | 'file'
        name: string
        path: string
        children?: unknown[]
        id?: string
        format?: string
        size?: number
        mtime?: string
        embedded?: boolean
      }>
    }>
  }
  export default manifest
}

// NOTE: no `*.js` wildcard shim — a wildcard `declare module` can't express
// arbitrary named exports, and real `.js` files resolve to themselves
// anyway. TS7016 on still-JS imports clears as each domain is migrated.
