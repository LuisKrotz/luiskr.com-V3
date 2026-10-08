/**
 * @file docs/Docs.tsx
 * @description <view-docs> — the English-only docs portal route.
 *
 * Renders the docs/reports/coverage/src manifest as a browsable portal:
 * recursive treeview, editable breadcrumbs, generated folder artwork,
 * on-demand file payloads (/docs-content/*.json) rendered as HTML — plus
 * the WebGL nav backdrop, the three.js architecture scene on the portal
 * root, and the copy-protection layer on source-code pages.
 *
 * The manifest comes from `virtual:docs-manifest` (build-time scan); file
 * payloads arrive lazily so thousands of documents never load at once.
 */

import { ARIA_ATTRS } from '@core/tokens/attrs/aria.js'
import { DATA_ATTRS } from '@core/tokens/attrs/data.js'
import { DOCS_CLASSES } from '@core/tokens/classes/docs.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { VIEW_TAGS } from '@core/tokens/elements/views.js'
import { DOCS_IDS } from '@core/tokens/ids/docs.js'
import { KEYS } from '@core/tokens/primitives.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'
import { DOCS_SELECTORS } from '@core/tokens/selectors/docs.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { DOCS_LOADER_PCT, DOCS_STRINGS } from '@core/tokens/strings/docs.js'
import { BaseComponent } from '@core/Component.js'
import store from '@core/store.js'
import { componentText } from '@core/locale/ui-text.js'
import { devWarn } from '@core/devlog.js'
import { generateDocsSchema, updateJsonLd } from '@core/utils/schema.js'
import { BASE_TITLE } from '@core/tokens/routes.js'
import router from '@core/router/router.js'
import type { RouteDescriptor } from '@core/router/router.js'
import {
  getDocsManifest,
  resolveDocsPath,
  fetchDocsFile,
  isSourceRoot,
  fileIdRoot,
  type DocsNode,
  type DocsFilePayload,
} from './manifest.js'
import { GL_EVENTS, MOUSE_EVENTS } from '@core/tokens/events/dom.js'
import { renderDocs } from './render.js'
import { mountDocsGlStrip, type DocsGlHandle } from './gl-strip.js'
import { mountArchScene, type ArchSceneHandle } from './arch-scene.js'
import { attachCopyGuard, type GuardDisposer } from './copy-guard.js'
import { attachCoverageNav } from './coverage-nav.js'
import { renderMermaidBlocks } from './mermaid.js'
import { dismissDocsLoader, updateDocsLoader } from './loader.js'
import docsStyles from './docs.scss?inline'

/**
 * The ViewDocs — docs portal route element.
 */
export class ViewDocs extends BaseComponent {
  /** Current '/docs/<path>' suffix from the route param. */
  docsPath: string = CHAR_STRINGS.EMPTY

  /** Resolved manifest node for docsPath (null at the portal root). */
  node: DocsNode | null = null

  /** Open file payload state. */
  filePayload: DocsFilePayload | null = null

  /** File fetch in flight. */
  fileLoading = false

  /** Dirs the treeview shows expanded. */
  private _openDirs = new Set<string>()

  /** Mobile nav-panel open state (the tree collapses under a toggle <1024). */
  navOpen = false

  /**
   * Path whose tree/grid button regains focus after the next re-render —
   * arrow-key expand/collapse re-creates the DOM, so focus would
   * otherwise drop to the body.
   */
  private _focusPath: string | null = null

  private _guardDispose: GuardDisposer | null = null

  private _glHandle: DocsGlHandle | null = null

  private _glCanvas: HTMLCanvasElement | null = null

  private _sceneHandle: ArchSceneHandle | null = null

  private _sceneCanvas: HTMLCanvasElement | null = null

  /** Document-level istanbul key-nav disposer while a report is open. */
  private _covNavDispose: (() => void) | null = null

  /**
   * Boot-loader lifecycle — the overlay stays up until the portal's first
   * usable state: manifest resolved, the architecture scene mount
   * attempted (success or WebGL fallback), and any in-flight file payload
   * settled. Mirrors the space playground's `_earthReady` contract.
   */
  _docsReady = false

  /** Current boot stage copy + percent rendered inside the loader. */
  _loaderMsg: string = DOCS_STRINGS.LOADER_MSG_INIT
  _loaderPct = 0

  constructor() {
    super(docsStyles)
  }

  /** Manifest roots reshaped as dir-nodes for the treeview. */
  rootsAsNodes(): DocsNode[] {
    return getDocsManifest().roots.map((r) => ({
      type: 'dir',
      name: r.label,
      path: r.root,
      children: r.children,
    }))
  }

  /** ISO generated stamp shown under the title. */
  generatedAt(): string {
    return getDocsManifest().generated
  }

  /** Whether a dir path is expanded in the treeview. */
  isDirOpen(path: string): boolean {
    return this._openDirs.has(path)
  }

  /** Whether the open file sits under a protected source-module root. */
  isProtectedView(): boolean {
    return (
      this.filePayload !== null && isSourceRoot(fileIdRoot(this.node?.id || CHAR_STRINGS.EMPTY))
    )
  }

  /** Localized toast copy for the copy guard — componentText already English-falls-back. */
  private _toastText = (): string =>
    String(componentText(`${DOCS_STRINGS.CMS_COMPONENT}.copyToast`))

  /**
   * Navigates within the portal — a bare path resolves against /docs.
   * @param subPath Manifest-relative path ('' → portal root).
   */
  navigateDocs(subPath: string): void {
    void router.push(
      subPath ? `${ROUTE_PATHS.DOCS}${CHAR_STRINGS.SLASH}${subPath}` : ROUTE_PATHS.DOCS
    )
  }

  /**
   * Grid/tree click — dirs toggle expansion AND navigate so the grid lands
   * on the folder; files navigate straight to their file route.
   */
  pickNode(node: DocsNode): void {
    if (node.type === 'dir') this._openDirs.add(node.path)

    this.navigateDocs(node.path)
  }

  /**
   * Tree-row click — clicking an already-expanded dir collapses it (and,
   * when the viewer sits inside that folder, navigates back to its parent
   * so the page state matches the collapsed tree); a closed dir expands
   * and navigates; files navigate.
   */
  pickTreeNode(node: DocsNode): void {
    if (node.type !== 'dir' || !this._openDirs.has(node.path)) {
      this.pickNode(node)

      return
    }

    this._openDirs.delete(node.path)

    const inside =
      this.docsPath === node.path || this.docsPath.startsWith(`${node.path}${CHAR_STRINGS.SLASH}`)

    if (inside) {
      const parent = node.path.split(CHAR_STRINGS.SLASH).slice(0, -1).join(CHAR_STRINGS.SLASH)

      this.navigateDocs(parent)
    } else {
      this._updateDom()
    }
  }

  /** Back button — navigates to the file's parent folder (or the root). */
  closeFile(): void {
    const parent = this.docsPath.split(CHAR_STRINGS.SLASH).slice(0, -1).join(CHAR_STRINGS.SLASH)

    this.navigateDocs(parent)
  }

  /** Mobile "browse" toggle — shows/hides the tree panel on small screens. */
  toggleNav(): void {
    this.navOpen = !this.navOpen

    this._updateDom()
  }

  /** Expands or collapses a dir in place (keyboard left/right) without navigating. */
  toggleDir(path: string): void {
    if (this._openDirs.has(path)) this._openDirs.delete(path)
    else this._openDirs.add(path)

    this._focusPath = path

    this._updateDom()
  }

  /**
   * Visible tree buttons in DOM order — the arrow-key cursor space for
   * the treeview pattern (only rendered rows exist, so collapsed
   * subtrees are naturally skipped).
   */
  private _treeButtons(): HTMLButtonElement[] {
    return this.$$(DOCS_SELECTORS.TREE_ITEM) as HTMLButtonElement[]
  }

  /**
   * ARIA treeview keys on the nav: ↑/↓ move between visible rows, → opens
   * a closed dir (or descends into an open one), ← closes an open dir (or
   * focuses the parent). Enter/Space stay native button activation.
   */
  onTreeKey(e: KeyboardEvent): void {
    const btn = e.target as HTMLButtonElement

    const items = this._treeButtons()

    const idx = items.indexOf(btn)

    if (idx < 0) return

    // Rendered rows always carry data-path (see render.ts tree builder) —
    // the cast documents that contract instead of a dead `|| ''` fallback.
    const path = btn.getAttribute(DATA_ATTRS.DATA_PATH) as string

    if (e.key === KEYS.ARROW_DOWN) {
      e.preventDefault()

      items[idx + 1]?.focus()
    } else if (e.key === KEYS.ARROW_UP) {
      e.preventDefault()

      items[idx - 1]?.focus()
    } else if (e.key === KEYS.ARROW_RIGHT) {
      e.preventDefault()

      const expanded = btn.getAttribute(ARIA_ATTRS.ARIA_EXPANDED) === 'true'

      if (btn.hasAttribute(ARIA_ATTRS.ARIA_EXPANDED) && !expanded) {
        this.toggleDir(path)
      } else {
        items[idx + 1]?.focus()
      }
    } else if (e.key === KEYS.ARROW_LEFT) {
      e.preventDefault()

      const expanded = btn.getAttribute(ARIA_ATTRS.ARIA_EXPANDED) === 'true'

      if (expanded) {
        this.toggleDir(path)
      } else {
        // Focus the parent dir row — the nearest previous button whose
        // path is the current one's parent segment.
        const parentPath = path.split(CHAR_STRINGS.SLASH).slice(0, -1).join(CHAR_STRINGS.SLASH)

        const parent = items.find(
          (b) => (b.getAttribute(DATA_ATTRS.DATA_PATH) as string) === parentPath
        )

        parent?.focus()
      }
    }
  }

  /**
   * Arrow-key roving on the folder grid — ←/→/↑/↓ step between cards in
   * DOM order (the grid's column count is layout-derived, so linear
   * traversal is the robust choice on every breakpoint).
   */
  onGridKey(e: KeyboardEvent): void {
    const btn = e.target as HTMLButtonElement

    if (!btn.classList.contains(DOCS_CLASSES.DOCS_CARD)) return

    const cards = this.$$(DOCS_SELECTORS.CARD) as HTMLButtonElement[]

    // The event target carries the card class, so it's necessarily inside
    // this shadow root — indexOf can't fail on the same selector set.
    const idx = cards.indexOf(btn)

    const delta =
      e.key === KEYS.ARROW_RIGHT || e.key === KEYS.ARROW_DOWN
        ? 1
        : e.key === KEYS.ARROW_LEFT || e.key === KEYS.ARROW_UP
          ? -1
          : 0

    if (!delta) return

    e.preventDefault()

    cards[idx + delta]?.focus()
  }

  /**
   * Host-level keys — Escape backs out of the open file (or closes the
   * mobile nav panel) without leaving the portal.
   */
  onViewKey(e: KeyboardEvent): void {
    if (e.key !== KEYS.ESCAPE) return

    if (this.filePayload) {
      this.closeFile()
    } else if (this.navOpen) {
      this.navOpen = false

      this._updateDom()
    }
  }

  /**
   * Editable-breadcrumb commit — Enter navigates to the typed path,
   * Escape restores the input to the live path.
   */
  onCrumbKey(e: KeyboardEvent): void {
    const input = e.target as HTMLInputElement

    if (e.key === KEYS.ENTER) {
      this.navigateDocs(input.value.trim().replace(/^\//u, CHAR_STRINGS.EMPTY))

      input.blur()
    } else if (e.key === KEYS.ESCAPE) {
      // Restore the rendered form — the input always shows '/<path>' so
      // the portal root reads as '/' (this level IS the root).
      input.value = `${CHAR_STRINGS.SLASH}${this.docsPath}`

      input.blur()
    }
  }

  /**
   * Same-tag navigation (file → sibling): resolves the new path without
   * tearing down GL/observability state.
   */
  onRouteParamChange(to?: RouteDescriptor): void {
    this._applyPath(to?.params?.docsPath || CHAR_STRINGS.EMPTY)
  }

  /** Lifecycle: store sub + path resolution + guards. */
  override onMounted(): void {
    this.subscribe(store)

    this._updateLoader(DOCS_STRINGS.LOADER_MSG_MANIFEST, DOCS_LOADER_PCT.MANIFEST)

    this._applyPath(router.currentRoute?.params?.docsPath || CHAR_STRINGS.EMPTY)

    this._guardDispose = attachCopyGuard(
      this.shadowRoot as ShadowRoot,
      () => this.isProtectedView(),
      () => this.docsPath,
      this._toastText
    )
  }

  /** Lifecycle: (re)mounts the GL strip, scene and viewer content. */
  override onUpdated(): void {
    const glCanvas = this.$(`#${DOCS_IDS.GL}`) as HTMLCanvasElement | null

    if (glCanvas && glCanvas !== this._glCanvas) {
      this._glHandle?.destroy()

      this._glCanvas = glCanvas
      this._glHandle = mountDocsGlStrip(glCanvas, this)

      if (!this._glHandle) {
        this.classList.add(DOCS_CLASSES.DOCS_GL_FALLBACK)
      }
    }

    const sceneCanvas = this.$(`#${DOCS_IDS.SCENE}`) as HTMLCanvasElement | null

    if (sceneCanvas && sceneCanvas !== this._sceneCanvas) {
      this._mountScene(sceneCanvas)

      // `webglcontextrestored` is the recovery signal — the browser hands
      // the canvas a fresh context, so a full remount rebuilds the graph.
      sceneCanvas.addEventListener(GL_EVENTS.WEBGL_CONTEXT_RESTORED, this._onSceneRestored)

      // The mount attempt just finished either way (live scene or
      // scene-off fallback) — advance the loader to the scene stage.
      if (!this._docsReady) {
        this._updateLoader(DOCS_STRINGS.LOADER_MSG_SCENE, DOCS_LOADER_PCT.SCENE)
      }
    }

    // Arrow-key expand/collapse re-creates the DOM — put focus back on
    // the row that was being driven so ↑/↓ continue from there.
    if (this._focusPath) {
      const focusPath = this._focusPath

      this._focusPath = null

      const target = this._treeButtons().find(
        (b) => (b.getAttribute(DATA_ATTRS.DATA_PATH) as string) === focusPath
      )

      target?.focus()
    }

    this._renderFilePayload()

    this._syncLoader()
  }

  /** Mirrors a boot stage into the loader overlay (delegates to loader.ts). */
  _updateLoader(msg: string, pct: number): void {
    updateDocsLoader(this, msg, pct)
  }

  /** Fades + removes the loader overlay (delegates to loader.ts). */
  _dismissLoader(): void {
    dismissDocsLoader(this)
  }

  /**
   * Advances or dismisses the boot loader based on the just-rendered
   * state: a file fetch in flight reports the file stage and waits;
   * anything else means the portal is usable — mark ready, report the
   * final stage, and fade the overlay out. A failed payload fetch (null)
   * still counts as settled so the loader can never strand the page.
   */
  private _syncLoader(): void {
    if (this._docsReady) return

    if (this.fileLoading) {
      this._updateLoader(DOCS_STRINGS.LOADER_MSG_FILE, DOCS_LOADER_PCT.FILE)

      return
    }

    this._updateLoader(DOCS_STRINGS.LOADER_MSG_READY, DOCS_LOADER_PCT.READY)

    this._docsReady = true

    this._dismissLoader()
  }

  /**
   * Mounts/remounts the 3D scene on the given canvas. `onLost` marks the
   * canvas with the scene-off class and clears the handle so a later
   * `webglcontextrestored` can rebuild it — the portal stays usable the
   * whole time.
   */
  private _mountScene(canvas: HTMLCanvasElement): void {
    this._sceneHandle?.destroy()

    this._sceneCanvas = canvas

    this._sceneHandle = mountArchScene(
      canvas,
      getDocsManifest().roots,
      (path) => this.navigateDocs(path),
      () => {
        canvas.classList.add(DOCS_CLASSES.DOCS_SCENE_OFF)

        this._sceneHandle = null
      }
    )

    // No WebGL2 (or a dead context) → hide the canvas rather than a
    // blank box; the grid/tree/crumb navigation carries the portal.
    canvas.classList.toggle(DOCS_CLASSES.DOCS_SCENE_OFF, !this._sceneHandle)
  }

  /** `webglcontextrestored` handler — rebuilds the scene on the fresh context. */
  private _onSceneRestored = (e: Event): void => {
    // currentTarget is the canvas that owns the listener — the listener is
    // detached in onDestroy, so it can only ever fire on a live canvas.
    const canvas = e.currentTarget as HTMLCanvasElement

    canvas.classList.remove(DOCS_CLASSES.DOCS_SCENE_OFF)

    this._mountScene(canvas)
  }

  /** Lifecycle: disposes guard + GL surfaces. */
  override onDestroy(): void {
    this._guardDispose?.()

    this._guardDispose = null

    this._covNavDispose?.()

    this._covNavDispose = null

    this._sceneCanvas?.removeEventListener(GL_EVENTS.WEBGL_CONTEXT_RESTORED, this._onSceneRestored)

    this._glHandle?.destroy()

    this._glHandle = null
    this._glCanvas = null

    this._sceneHandle?.destroy()

    this._sceneHandle = null
    this._sceneCanvas = null

    // The docs JSON-LD graph is page-scoped — drop it so a TechArticle
    // never lingers on the route navigated to next.
    updateJsonLd(null)
  }

  /**
   * Applies a docsPath: resolves the manifest node, auto-expands the
   * ancestor dirs in the treeview, syncs the page title + JSON-LD graph
   * (BreadcrumbList + TechArticle/CollectionPage) so every /docs/* route
   * is crawlable, and kicks the lazy file fetch.
   */
  private _applyPath(docsPath: string): void {
    this.docsPath = docsPath
    this.node = resolveDocsPath(docsPath)

    const pageName = this.node?.name || DOCS_STRINGS.TITLE

    document.title = `${BASE_TITLE} ${CHAR_STRINGS.PIPE_SEP} ${pageName}`

    updateJsonLd(generateDocsSchema(docsPath, this.node))

    // Auto-expand ancestor dirs so the tree lands open on the current path.
    const segments = docsPath.split(CHAR_STRINGS.SLASH).filter(Boolean)

    segments.slice(0, -1).forEach((_seg, i) => {
      this._openDirs.add(segments.slice(0, i + 1).join(CHAR_STRINGS.SLASH))
    })

    // Folders carrying an index.html auto-open it (e.g. the sassdoc
    // report) — except under source-module roots, which stay browsable
    // source trees. A dir node only resolves from a non-empty docsPath,
    // so segments[0] is necessarily set here — the cast documents that
    // invariant instead of a dead `|| ''` fallback.
    if (this.node?.type === 'dir' && !isSourceRoot(segments[0] as string)) {
      // scan.mjs only emits dirs with children — the cast documents that
      // manifest invariant (an empty dir would never reach this branch).
      const index = (this.node.children as DocsNode[]).find(
        (c) => c.type === 'file' && c.name === DOCS_STRINGS.INDEX_FILE
      )

      if (index) {
        this.navigateDocs(`${docsPath}${CHAR_STRINGS.SLASH}${index.name}`)

        return
      }
    }

    if (this.node?.type === 'file' && this.node.id) {
      this._loadFile(this.node.id)
    } else {
      this.filePayload = null
      this.fileLoading = false
    }

    this._updateDom()
  }

  /** Lazy file payload fetch → state → innerHTML paint in onUpdated. */
  private _loadFile(id: string): void {
    this.fileLoading = true
    this.filePayload = null

    this._updateDom()

    // fetchDocsFile resolves null on failure — the payload state is the
    // only outcome, so there is no rejection path to handle here.
    void fetchDocsFile(id).then((payload) => {
      this.fileLoading = false
      this.filePayload = payload

      if (!payload) devWarn('docs payload fetch failed for', id)

      this._updateDom()
    })
  }

  /**
   * Paints the open payload — media data-URL for images, rendered HTML
   * for everything else (markdown, JSON trees, sanitized html reports,
   * code blocks). innerHTML (not the JSX sanitizer) because payloads are
   * build-time generated markup that needs <pre>/<table>/<style> intact.
   */
  private _renderFilePayload(): void {
    const box = this.$(DOCS_SELECTORS.CONTENT)

    if (!box || !this.filePayload) return

    const payload = this.filePayload

    if (payload.format === 'media') {
      // Oversized binaries carry media:null — show the GitHub pointer.
      const img = document.createElement(HTML_TAGS.IMG)

      if (payload.media) {
        img.src = payload.media
        img.alt = payload.name

        box.replaceChildren(img)
      } else {
        box.textContent = DOCS_STRINGS.MEDIA_UNAVAILABLE
      }

      return
    }

    if (payload.html !== null && payload.html !== undefined) {
      box.innerHTML = payload.html

      // Lazy diagram + report-keyboard wiring — mermaid blocks render
      // into themed SVGs; istanbul reports get their n/j/b/p/k uncovered
      // -block navigation back (the sanitizer strips their helper script).
      void renderMermaidBlocks(box as HTMLElement)

      this._covNavDispose?.()

      this._covNavDispose = attachCoverageNav(box as HTMLElement)

      // The content box is recreated by every _updateDom (replaceChildren),
      // so no re-wire guard is needed — the listener always lands fresh.
      box.addEventListener(MOUSE_EVENTS.CLICK, this._onContentLink)
    }
  }

  /**
   * Intercepts anchor clicks inside painted payload HTML — relative links
   * inside reports (istanbul `../index.html`, sibling file pages) resolve
   * against the current /docs route and stay inside the SPA; hash and
   * external links pass through untouched.
   */
  private _onContentLink = (e: Event): void => {
    const anchor = (e.target as HTMLElement).closest?.(DOCS_SELECTORS.CONTENT_LINK)

    if (!anchor) return

    // CONTENT_LINK selects `a[href]` only — the matched anchor always
    // carries the attribute, so the cast documents the selector contract.
    const href = anchor.getAttribute('href') as string

    if (!href || href.startsWith(CHAR_STRINGS.HASH)) return

    const url = new URL(href, window.location.href)

    const docsPrefix = `${ROUTE_PATHS.DOCS}${CHAR_STRINGS.SLASH}`

    if (!url.pathname.startsWith(docsPrefix)) return

    e.preventDefault()

    this.navigateDocs(decodeURIComponent(url.pathname.slice(docsPrefix.length)))
  }

  /** JSX template — lives in render.tsx. */
  override render() {
    return renderDocs(this)
  }
}

if (!customElements.get(VIEW_TAGS.VIEW_DOCS)) {
  customElements.define(VIEW_TAGS.VIEW_DOCS, ViewDocs)
}
