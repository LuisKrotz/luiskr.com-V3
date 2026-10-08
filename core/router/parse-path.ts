/**
 * @file routes/parse-path.ts — pure URL → route-descriptor resolution.
 * Strips query/hash, extracts the optional locale segment, then matches
 * localized slugs and dynamic segments in priority order:
 *   /[locale]                      → view-home
 *   /[locale]/<localized-about>    → view-home  (scrolls to #about)
 *   /[locale]/<localized-contact>  → view-home  (scrolls to #contact)
 *   /[locale]/portfolio/<projectSlug>[/<slug>] → view-project
 *   /[locale]/privacy|gdpr|terms   → view-legal (localized slugs)
 *   /[locale]/earth-playground     → view-space-playground
 *   anything else                  → view-not-found
 */

import { BASE_TITLE } from '@core/tokens/routes.js'
import { CMS_KEYS } from '@core/tokens/data/cms-keys.js'
import { SECTION_UI_KEYS } from '@core/tokens/data/ui-keys.js'
import { VIEW_TAGS } from '@core/tokens/elements/views.js'
import { SECTION_IDS } from '@core/tokens/ids/sections.js'
import { LOCALES } from '@core/tokens/locales.js'
import { PROJECT_ALIASES } from '@core/tokens/routes/aliases.js'
import { ROUTE_NAMES } from '@core/tokens/routes/names.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'
import { TRANSLATION_KEYS } from '@core/tokens/routes/translation-keys.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { ROUTE_STRINGS } from '@core/tokens/strings/routes.js'
import { VALID_LANGS } from '@core/i18n.js'
import { appText, componentText, routeSlugs } from '@core/locale/ui-text.js'
import type { RouteDescriptor, RouteMeta } from '@core/router/types.js'
import { LEGAL_COMPONENT_KEYS } from '@core/tokens/data/component-keys.js'

/**
 * Maps legacy/alternate project URL slugs to canonical data keys via
 * PROJECT_ALIASES; unknown slugs pass through unchanged.
 */
export function normalizeProjectKey(slug: string): string {
  if (!slug) return CHAR_STRINGS.EMPTY

  return (PROJECT_ALIASES as Record<string, string>)[slug] || slug
}

/** Titled descriptor with the pipe-separated page suffix. */
function titled(
  name: string,
  view: string,
  lang: string,
  path: string,
  suffix: string,
  meta: RouteMeta
): RouteDescriptor {
  return {
    name,
    view,
    lang,
    path,
    meta: { title: `${BASE_TITLE} ${CHAR_STRINGS.PIPE_SEP} ${suffix}`, ...meta },
    params: {},
  }
}

/** Legal-page descriptor — page label comes from the localized legal-links component text. */
function legalRoute(
  name: string,
  lang: string,
  path: string,
  linkIdx: number,
  translation: string
): RouteDescriptor {
  const links = componentText(LEGAL_COMPONENT_KEYS.LEGAL_LINKS) as
    Array<{ page?: string }> | undefined

  return titled(
    name,
    VIEW_TAGS.VIEW_LEGAL,
    lang,
    path,
    links?.[linkIdx]?.page ?? CHAR_STRINGS.EMPTY,
    {
      translation,
      legalRoute: true,
    }
  )
}

/**
 * Pure resolution: pathname → route descriptor { name, view, lang,
 * path, meta, params }. meta.scrollTo triggers a post-nav smooth-scroll
 * to that element id.
 */
export function parsePath(pathname: string): RouteDescriptor {
  const cleanPath =
    pathname.split(CHAR_STRINGS.QUESTION)[0].split(CHAR_STRINGS.HASH)[0] || ROUTE_PATHS.ROOT

  const segments = cleanPath.split(CHAR_STRINGS.SLASH).filter(Boolean)

  let lang: string = LOCALES.EN

  let pathSegments = [...segments]

  if (segments.length > 0 && (VALID_LANGS as readonly string[]).includes(segments[0])) {
    lang = segments[0]

    pathSegments = segments.slice(1)
  }

  const slugs = routeSlugs(lang)

  // Root home
  if (pathSegments.length === 0) {
    return {
      name: ROUTE_NAMES.HOME,
      view: VIEW_TAGS.VIEW_HOME,
      lang,
      path: cleanPath,
      meta: { title: BASE_TITLE, translation: TRANSLATION_KEYS.HOME },
      params: {},
    }
  }

  const first = pathSegments[0]

  // Check localized about slug
  if (first === slugs.about) {
    return titled(
      ROUTE_NAMES.ABOUT,
      VIEW_TAGS.VIEW_HOME,
      lang,
      cleanPath,
      String(appText(SECTION_UI_KEYS.ABOUT_DESCRIPTION)),
      {
        translation: TRANSLATION_KEYS.HOME,
        scrollTo: SECTION_IDS.ABOUT,
      }
    )
  }

  // Check localized contact slug
  if (first === slugs.contact) {
    return titled(
      ROUTE_NAMES.CONTACT,
      VIEW_TAGS.VIEW_HOME,
      lang,
      cleanPath,
      String(appText(CMS_KEYS.CONTACT)),
      {
        translation: TRANSLATION_KEYS.HOME,
        scrollTo: SECTION_IDS.CONTACT,
      }
    )
  }

  // Check dynamic portfolio route: portfolio/:projectSlug/:slug?
  if (first === ROUTE_PATHS.PORTFOLIO_SEGMENT && pathSegments.length >= 2) {
    const rawSlug = pathSegments[1]

    const projectSlug = normalizeProjectKey(rawSlug)

    const slug = pathSegments[2] || undefined

    return {
      name: ROUTE_NAMES.PROJECT,
      view: VIEW_TAGS.VIEW_PROJECT,
      lang,
      path: cleanPath,
      meta: { title: `${BASE_TITLE} ${CHAR_STRINGS.PIPE_SEP} Project`, projectRoute: true },
      params: { projectSlug, rawSlug, slug },
    }
  }

  // Check legal routes
  if (
    first === slugs.privacy ||
    first === ROUTE_STRINGS.PRIVACY ||
    first === ROUTE_STRINGS.PRIVACY_POLICY
  ) {
    return legalRoute(ROUTE_NAMES.PRIVACY, lang, cleanPath, 1, TRANSLATION_KEYS.PRIVACY_POLICY)
  }

  if (first === slugs.gdpr || first === ROUTE_STRINGS.GDPR) {
    return legalRoute(ROUTE_NAMES.GDPR, lang, cleanPath, 2, TRANSLATION_KEYS.GDPR)
  }

  if (
    first === slugs.terms ||
    first === ROUTE_STRINGS.TERMS ||
    first === ROUTE_STRINGS.TERMS_OF_USE
  ) {
    return legalRoute(ROUTE_NAMES.TERMS, lang, cleanPath, 3, TRANSLATION_KEYS.TERMS_OF_USE)
  }

  // Docs portal — English-only; the remaining segments address a node in
  // the build-time manifest tree (docs/ reports/ coverage/ src/).
  if (first === ROUTE_PATHS.DOCS_SEGMENT) {
    return {
      name: ROUTE_NAMES.DOCS,
      view: VIEW_TAGS.VIEW_DOCS,
      lang,
      path: cleanPath,
      meta: {
        title: `${BASE_TITLE} ${CHAR_STRINGS.PIPE_SEP} ${ROUTE_NAMES.DOCS}`,
        translation: TRANSLATION_KEYS.DOCS,
        docsRoute: true,
      },
      params: { docsPath: pathSegments.slice(1).join(CHAR_STRINGS.SLASH) },
    }
  }

  // Earth / Space Playground
  if (
    first === slugs.earthPlayground ||
    first === ROUTE_PATHS.EARTH_PLAYGROUND_SEGMENT ||
    first === ROUTE_PATHS.SPACE_PLAYGROUND_SEGMENT
  ) {
    return {
      name: ROUTE_NAMES.EARTH_PLAYGROUND,
      view: VIEW_TAGS.VIEW_SPACE_PLAYGROUND,
      lang,
      path: cleanPath,
      meta: {
        title: `${String(appText(CMS_KEYS.EARTH_PLAYGROUND))} ${CHAR_STRINGS.PIPE_SEP} ${BASE_TITLE}`,
        translation: TRANSLATION_KEYS.EARTH_PLAYGROUND,
      },
      params: {},
    }
  }

  // 404
  return titled(
    ROUTE_NAMES.NOT_FOUND,
    VIEW_TAGS.VIEW_NOT_FOUND,
    lang,
    cleanPath,
    String(appText(SECTION_UI_KEYS.NOT_FOUND)),
    {
      translation: TRANSLATION_KEYS.NOT_FOUND,
    }
  )
}
