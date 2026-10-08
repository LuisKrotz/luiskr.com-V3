/**
 * @file home/awards/render.tsx
 * @description JSX template for <awards-mentions> — the footer band with
 * section title + circular progress arc, the auto-advancing carousel (or
 * skeleton badges while items load), the legal links row routed through
 * the SPA router, and the source credit line.
 */

import { AWARDS_CLASSES } from '@core/tokens/classes/awards.js'
import { AWC_CLASSES } from '@core/tokens/classes/awards-carousel.js'
import { FOOTER_CLASSES } from '@core/tokens/classes/footer.js'
import { SKELETON_CLASSES } from '@core/tokens/classes/skeleton.js'
import { AWARDS_UI_KEYS } from '@core/tokens/data/ui-keys.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { DOM_STRINGS } from '@core/tokens/strings/dom.js'
import { h, Fragment } from '@core/jsx.js'
import router from '@core/router/router.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'
import { DOCS_STRINGS } from '@core/tokens/strings/docs.js'
import { appText, componentText } from '@core/locale/ui-text.js'
import type { AwardsMentions } from '../AwardsMentions.js'
import { SOURCE_COMPONENT_KEYS } from '@core/tokens/data/component-keys.js'
import { SOCIAL_URLS } from '@core/tokens/media/urls.js'

/**
 * Renders awards.
 * @param el — the element
 */
export function renderAwards(el: AwardsMentions) {
  const links = el.legalLinks

  return (
    <footer className={AWARDS_CLASSES.AWARDS_FOOTER}>
      <div className={AWARDS_CLASSES.AWARDS_FOOTER_HEADER}>
        <h2 className={AWARDS_CLASSES.AWARDS_FOOTER_TITLE}>{el.title}</h2>

        <div
          className={AWARDS_CLASSES.AWARDS_FOOTER_PROGRESS}
          role="progressbar"
          aria-label={appText(AWARDS_UI_KEYS.AWARDS_NEXT)}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow="0"
        >
          <div className={AWARDS_CLASSES.AWARDS_FOOTER_PROGRESS_FILL} />
        </div>
      </div>

      {el.items && el.items.length ? (
        <awards-carousel className={AWC_CLASSES.AWC_AWARDS} />
      ) : (
        <div className={AWARDS_CLASSES.AWARDS_FOOTER_SKEL}>
          <span className={SKELETON_CLASSES.SKELETON_BADGE} />
          <span className={SKELETON_CLASSES.SKELETON_BADGE} />
          <span className={SKELETON_CLASSES.SKELETON_BADGE} />
        </div>
      )}

      <nav
        className={AWARDS_CLASSES.AWARDS_FOOTER_LINKS}
        aria-label={appText(AWARDS_UI_KEYS.AWARDS_LEGAL_NAV)}
      >
        {links.map((link, i) => (
          <Fragment key={link.link}>
            <a
              className={AWARDS_CLASSES.AWARDS_FOOTER_ITEM}
              href={link.link}
              onClick={(e: Event) => {
                e.preventDefault()

                router.push(link.link)
              }}
            >
              {link.page}
            </a>
            {i < links.length - 1 && (
              <span className={AWARDS_CLASSES.AWARDS_FOOTER_SEP}>&bull;</span>
            )}
          </Fragment>
        ))}
      </nav>

      {/* Docs-portal entry — English title/route, localized description */}
      <p className={FOOTER_CLASSES.FOOTER_DOCS}>
        <a
          className={FOOTER_CLASSES.FOOTER_DOCS_LINK}
          href={ROUTE_PATHS.DOCS}
          onClick={(e: Event) => {
            e.preventDefault()

            router.push(ROUTE_PATHS.DOCS)
          }}
        >
          {DOCS_STRINGS.TITLE}
        </a>
        {CHAR_STRINGS.SPACE_CHAR}
        <span className={FOOTER_CLASSES.FOOTER_DOCS_DESC}>
          {String(
            componentText(`${DOCS_STRINGS.CMS_COMPONENT}.description`) || DOCS_STRINGS.DESC_FALLBACK
          )}
        </span>
      </p>

      <p className={FOOTER_CLASSES.FOOTER_SOURCE}>
        {componentText(SOURCE_COMPONENT_KEYS.SOURCE_LABEL)}
        {CHAR_STRINGS.SPACE_CHAR}
        <a
          className={FOOTER_CLASSES.FOOTER_SOURCE_LINK}
          href={SOCIAL_URLS.GITHUB_REPO}
          target={DOM_STRINGS.BLANK}
          rel={DOM_STRINGS.NOOPENER}
        >
          {componentText(SOURCE_COMPONENT_KEYS.SOURCE_LINK)}
        </a>
      </p>
    </footer>
  )
}
