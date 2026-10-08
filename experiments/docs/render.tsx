/**
 * @file docs/render.tsx
 * @description JSX template for <view-docs> — extracted from Docs.tsx.
 * Pure render: header (title + last-update stamp), the GL strip canvas
 * behind the nav, the recursive treeview, editable breadcrumbs, the
 * folder grid, the file viewer and the legal footer. All interaction
 * delegates to the host component's methods.
 */

import { ARIA_ATTRS } from '@core/tokens/attrs/aria.js'
import { DATA_ATTRS } from '@core/tokens/attrs/data.js'
import { FORM_ATTRS } from '@core/tokens/attrs/form.js'
import { MICRODATA_ATTRS, MICRODATA_VALUES } from '@core/tokens/attrs/microdata.js'
import { DOCS_CLASSES } from '@core/tokens/classes/docs.js'
import { DOCS_IDS } from '@core/tokens/ids/docs.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { DOCS_STRINGS } from '@core/tokens/strings/docs.js'
import { h } from '@core/jsx.js'
import { folderSvg } from './folder-svg.js'
import { crumbsForPath } from './manifest.js'
import type { ViewDocs } from './Docs.js'
import type { DocsNode } from './manifest.js'

/**
 * Recursive tree rows — each node renders a <li> with a button (dirs
 * toggle open AND navigate; files navigate). Children render inside a
 * nested <ul> only while the dir is in the host's open-set — per the
 * self-similar recursion rule the tree walks itself.
 */
const treeNodes = (view: ViewDocs, nodes: DocsNode[]): HTMLElement[] =>
  nodes.map((node) => {
    const open = view.isDirOpen(node.path)

    const active = view.docsPath === node.path

    const isDir = node.type === 'dir'

    return (
      <li key={node.path} role={ARIA_ATTRS.ROLE_NONE}>
        <button
          type={FORM_ATTRS.TYPE_BUTTON}
          role={ARIA_ATTRS.ROLE_TREEITEM}
          className={`${DOCS_CLASSES.DOCS_TREE_ITEM}${open ? ` ${DOCS_CLASSES.DOCS_TREE_OPEN}` : CHAR_STRINGS.EMPTY}`}
          aria-expanded={isDir ? String(open) : undefined}
          aria-current={active ? 'page' : undefined}
          {...{ [DATA_ATTRS.DATA_PATH]: node.path }}
          onClick={(e: Event) => {
            e.preventDefault()

            view.pickTreeNode(node)
          }}
        >
          {node.name}
        </button>
        {isDir && open && node.children?.length ? (
          <ul role={ARIA_ATTRS.ROLE_GROUP}>{treeNodes(view, node.children)}</ul>
        ) : null}
      </li>
    )
  }) as HTMLElement[]

/**
 * Grid cards — dirs and files get the generated folder SVG and navigate
 * into/open the node on click.
 */
const gridCards = (view: ViewDocs, nodes: DocsNode[]): HTMLElement[] =>
  nodes.map((node) => {
    const isDir = node.type === 'dir'

    return (
      <button
        key={node.path}
        type={FORM_ATTRS.TYPE_BUTTON}
        className={DOCS_CLASSES.DOCS_CARD}
        {...{ [DATA_ATTRS.DATA_PATH]: node.path }}
        onClick={() => view.pickNode(node)}
      >
        <span className={DOCS_CLASSES.DOCS_CARD_ART}>{folderSvg(node.name, isDir)}</span>
        <span className={DOCS_CLASSES.DOCS_CARD_LABEL}>{node.name}</span>
      </button>
    )
  }) as HTMLElement[]

/**
 * Editable breadcrumb strip — each crumb is a jump-to link; the trailing
 * input carries the full relative path and commits on Enter (Escape
 * restores the current path).
 */
const crumbBar = (view: ViewDocs) => {
  const crumbs = crumbsForPath(view.docsPath)

  return (
    <nav className={DOCS_CLASSES.DOCS_CRUMBS} aria-label={DOCS_STRINGS.TITLE}>
      <button
        type={FORM_ATTRS.TYPE_BUTTON}
        className={DOCS_CLASSES.DOCS_CRUMB}
        onClick={() => view.navigateDocs(CHAR_STRINGS.EMPTY)}
      >
        {DOCS_STRINGS.TITLE}
      </button>
      {crumbs.map((c) => (
        <button
          key={c.path}
          type={FORM_ATTRS.TYPE_BUTTON}
          className={DOCS_CLASSES.DOCS_CRUMB}
          onClick={() => view.navigateDocs(c.path)}
        >
          {c.label}
        </button>
      ))}
      <input
        className={DOCS_CLASSES.DOCS_CRUMB_EDIT}
        aria-label={DOCS_STRINGS.CRUMB_INPUT_LABEL}
        title={DOCS_STRINGS.CRUMB_INPUT_HINT}
        placeholder={DOCS_STRINGS.CRUMB_PLACEHOLDER}
        value={`${CHAR_STRINGS.SLASH}${view.docsPath}`}
        onKeydown={(e: Event) => view.onCrumbKey(e as KeyboardEvent)}
        onFocus={(e: Event) => (e.target as HTMLInputElement).select()}
      />
    </nav>
  )
}

/** The docs template — assembled for ViewDocs.render(). */
export const renderDocs = (view: ViewDocs) => {
  const node = view.node

  const isRoot = !view.docsPath

  // Portal root lists the four buckets; a dir lists its children.
  const children = isRoot ? view.rootsAsNodes() : node?.type === 'dir' ? node.children || [] : []

  const generated = view.generatedAt()

  // In-DOM microdata mirrors the JSON-LD graph (_applyPath → updateJsonLd):
  // TechArticle while a file is open, CollectionPage otherwise.
  const isFilePage = view.node?.type === 'file'

  return (
    <div
      className={`${DOCS_CLASSES.DOCS}${view.navOpen ? ` ${DOCS_CLASSES.DOCS_NAV_OPEN}` : CHAR_STRINGS.EMPTY}`}
      onKeydown={(e: Event) => view.onViewKey(e as KeyboardEvent)}
      {...{
        [MICRODATA_ATTRS.ITEMSCOPE]: CHAR_STRINGS.EMPTY,
        [MICRODATA_ATTRS.ITEMTYPE]: isFilePage
          ? MICRODATA_VALUES.TYPE_TECH_ARTICLE
          : MICRODATA_VALUES.TYPE_COLLECTION_PAGE,
      }}
    >
      <canvas id={DOCS_IDS.GL} className={DOCS_CLASSES.DOCS_GL} aria-hidden="true" />

      {/* Persistent 3D architecture backdrop — orbit/pinch on the exposed
          areas, tap-to-pick navigates, folder names reveal on zoom. */}
      <canvas
        id={DOCS_IDS.SCENE}
        className={DOCS_CLASSES.DOCS_SCENE}
        aria-label={DOCS_STRINGS.TREE_LABEL}
      />

      <header className={DOCS_CLASSES.DOCS_HEADER}>
        <h1
          className={DOCS_CLASSES.DOCS_TITLE}
          {...{ [MICRODATA_ATTRS.ITEMPROP]: MICRODATA_VALUES.PROP_NAME }}
        >
          {DOCS_STRINGS.TITLE}
        </h1>
        <time
          className={DOCS_CLASSES.DOCS_UPDATED}
          dateTime={generated}
          {...{ [MICRODATA_ATTRS.ITEMPROP]: MICRODATA_VALUES.PROP_DATE_MODIFIED }}
        >
          {generated}
        </time>
      </header>

      <div className={DOCS_CLASSES.DOCS_BODY}>
        <button
          type={FORM_ATTRS.TYPE_BUTTON}
          className={DOCS_CLASSES.DOCS_NAV_TOGGLE}
          aria-expanded={String(view.navOpen)}
          aria-controls={DOCS_IDS.TREE}
          onClick={() => view.toggleNav()}
        >
          {DOCS_STRINGS.NAV_TOGGLE}
        </button>

        <nav
          className={DOCS_CLASSES.DOCS_NAV}
          role={ARIA_ATTRS.ROLE_NAVIGATION}
          aria-label={DOCS_STRINGS.TREE_LABEL}
          onKeydown={(e: Event) => view.onTreeKey(e as KeyboardEvent)}
        >
          <ul
            className={DOCS_CLASSES.DOCS_TREE}
            id={DOCS_IDS.TREE}
            role={ARIA_ATTRS.ROLE_TREE}
            aria-label={DOCS_STRINGS.TREE_LABEL}
          >
            {treeNodes(view, view.rootsAsNodes())}
          </ul>
        </nav>

        <main className={DOCS_CLASSES.DOCS_MAIN}>
          {crumbBar(view)}

          {view.filePayload || view.fileLoading ? (
            <section
              className={`${DOCS_CLASSES.DOCS_VIEWER}${view.isProtectedView() ? ` ${DOCS_CLASSES.DOCS_PROTECTED}` : CHAR_STRINGS.EMPTY}`}
              id={DOCS_IDS.VIEWER}
            >
              <div className={DOCS_CLASSES.DOCS_VIEWER_HEAD}>
                <button
                  type={FORM_ATTRS.TYPE_BUTTON}
                  className={DOCS_CLASSES.DOCS_VIEWER_BACK}
                  onClick={() => view.closeFile()}
                >
                  {DOCS_STRINGS.VIEWER_BACK}
                </button>
                <span
                  className={DOCS_CLASSES.DOCS_VIEWER_PATH}
                  {...{ [MICRODATA_ATTRS.ITEMPROP]: MICRODATA_VALUES.PROP_URL }}
                >
                  {view.docsPath}
                </span>
              </div>
              <div
                className={DOCS_CLASSES.DOCS_CONTENT}
                {...{ [MICRODATA_ATTRS.ITEMPROP]: MICRODATA_VALUES.PROP_ARTICLE_BODY }}
              />
            </section>
          ) : null}

          {children.length ? (
            <div
              className={DOCS_CLASSES.DOCS_GRID}
              id={DOCS_IDS.GRID}
              aria-label={DOCS_STRINGS.GRID_LABEL}
              onKeydown={(e: Event) => view.onGridKey(e as KeyboardEvent)}
            >
              {gridCards(view, children)}
            </div>
          ) : null}

          {!node && !isRoot ? (
            <p className={DOCS_CLASSES.DOCS_UPDATED}>{DOCS_STRINGS.NOT_FOUND_PATH}</p>
          ) : null}
        </main>
      </div>
    </div>
  ) as unknown as HTMLElement
}
