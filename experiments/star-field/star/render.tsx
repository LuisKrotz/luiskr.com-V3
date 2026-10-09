/**
 * @file star/render.tsx
 * @description JSX for StarField's render() — boot loader overlay (same
 * progress contract as the earth playground), the CSS starfield fallback
 * surface, the body navigator drawer (the keyboard/AT access path: one
 * real button per body), the lazy dossier info panel, the hover/selection
 * aria-live HUD, and the screenshot/overview action buttons.
 */
import { ARIA_ATTRS } from '@core/tokens/attrs/aria.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { FORM_ATTRS } from '@core/tokens/attrs/form.js'
import { SF_CLASSES } from '@core/tokens/classes/starfield.js'
import { CMS_KEYS } from '@core/tokens/data/cms-keys.js'
import { LOADER_UI_KEYS, NAV_UI_KEYS } from '@core/tokens/data/ui-keys.js'
import { APP_IDS } from '@core/tokens/ids/app.js'
import { TRANSLATION_KEYS } from '@core/tokens/routes/translation-keys.js'
import { FALLBACK_PAGES } from '@core/locale/fallback.js'
import { DATA_ATTRS } from '@core/tokens/attrs/data.js'
import { h, Fragment } from '@core/jsx.js'
import { appText } from '@core/locale/ui-text.js'
import { SF_GROUP_ORDER, sfCatalogByGroup } from '../engine/catalog.js'
import type { SFDossier } from '../engine/types.js'
import type { StarField } from '../StarField.js'

/** English snapshot for the pages/star-field node — pre-fetch labels. */
const SF_DEFAULTS = FALLBACK_PAGES[TRANSLATION_KEYS.STAR_FIELD] as Record<string, unknown>

/** Stable aria-controls id for the navigator drawer. */
const NAV_PANEL_ID = APP_IDS.SF_NAV_PANEL

/** Renders the dossier facts list — one row per {label,value} pair. A
 *  malformed dossier payload renders the rest of the panel instead of
 *  crashing the whole view. */
function renderFacts(dossier: SFDossier) {
  return (
    <dl className={SF_CLASSES.SF_FACTS}>
      {(dossier.facts ?? []).map((fact) => (
        <div key={fact.label} className={SF_CLASSES.SF_FACT}>
          <dt className={SF_CLASSES.SF_FACT_KEY}>{fact.label}</dt>
          <dd className={SF_CLASSES.SF_FACT_VAL}>{fact.value}</dd>
        </div>
      ))}
    </dl>
  )
}

/**
 * Renders the StarField view.
 * @param host The StarField component.
 */
export function renderStarField(host: StarField) {
  const t: Record<string, unknown> = {
    ...SF_DEFAULTS,
    title: appText(CMS_KEYS.STAR_FIELD),
    ...(host.translations ?? {}),
  }

  const groups = sfCatalogByGroup()

  const dossier = host._dossier

  const kindLabel = dossier ? t[dossier.kind] || dossier.kind : ATTR_VALUES.EMPTY

  return (
    <Fragment>
      {/* CSS starfield fallback when the engine can't boot — never a dead canvas. */}
      {host._sfFailed && <div className={SF_CLASSES.SF_FALLBACK} aria-hidden={ATTR_VALUES.TRUE} />}

      {/* Boot loader — dismissed on the first rendered frame (or on a
          failed boot, when the fallback takes over). */}
      {!host._sfReady && (
        <div className={SF_CLASSES.SF_LOADER}>
          <div className={SF_CLASSES.SF_LOADER_GLOW} />
          <div className={SF_CLASSES.SF_LOADER_CONTENT}>
            <div className={SF_CLASSES.SF_LOADER_SPINNER} />
            <span className={SF_CLASSES.SF_LOADER_PERCENT}>
              <span className={SF_CLASSES.SF_LOADER_VAL}>0</span>
              <span className={SF_CLASSES.SF_LOADER_SYM}>%</span>
            </span>
            <div className={SF_CLASSES.SF_LOADER_TITLE}>{t.systemBoot}</div>
            <div className={SF_CLASSES.SF_LOADER_MSG}>
              {appText(LOADER_UI_KEYS.LOADER_INIT_WEBGPU)}
            </div>
            <div className={SF_CLASSES.SF_LOADER_BAR}>
              <div className={SF_CLASSES.SF_LOADER_BAR_FILL} />
            </div>
          </div>
        </div>
      )}

      {/* HUD — hint + aria-live announcements for hover/selection. */}
      <div className={SF_CLASSES.SF_HUD}>
        <span className={SF_CLASSES.SF_HINT}>{t.hint}</span>
        <span
          className={SF_CLASSES.SF_LIVE}
          role={ARIA_ATTRS.ROLE_STATUS}
          aria-live={ARIA_ATTRS.POLITE}
        >
          {host._liveText}
        </span>
      </div>

      {/* Navigator drawer — every body reachable by keyboard/tab. */}
      <button
        className={SF_CLASSES.SF_NAV_TOGGLE}
        type={FORM_ATTRS.BUTTON}
        aria-expanded={host._navOpen ? ATTR_VALUES.TRUE : ATTR_VALUES.FALSE}
        aria-controls={NAV_PANEL_ID}
        onClick={() => host._toggleNav()}
      >
        {t.explore}
      </button>

      <nav
        className={`${SF_CLASSES.SF_NAV}${host._navOpen ? ` ${SF_CLASSES.SF_NAV_OPEN}` : ATTR_VALUES.EMPTY}`}
        aria-label={t.explore}
        role={ARIA_ATTRS.ROLE_NAVIGATION}
      >
        <div className={SF_CLASSES.SF_NAV_PANEL} id={NAV_PANEL_ID}>
          <h2 className={SF_CLASSES.SF_NAV_HEADING}>{t.explore}</h2>
          {SF_GROUP_ORDER.map((groupKey) => (
            <section key={groupKey} className={SF_CLASSES.SF_NAV_GROUP}>
              <h3 className={SF_CLASSES.SF_NAV_GROUP_TITLE}>{t[groupKey] || groupKey}</h3>
              <ul className={SF_CLASSES.SF_NAV_LIST}>
                {(groups.get(groupKey) ?? []).map((def) => (
                  <li key={def.id}>
                    <button
                      className={`${SF_CLASSES.SF_NAV_ITEM}${host._selectedId === def.id ? ` ${SF_CLASSES.SF_NAV_ITEM_ACTIVE}` : ATTR_VALUES.EMPTY}`}
                      type={FORM_ATTRS.BUTTON}
                      {...{ [DATA_ATTRS.DATA_BODY]: def.id }}
                      onClick={() => host._selectBody(def.id)}
                    >
                      {def.name}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </nav>

      {/* Dossier info panel — opens on selection; content lazily filled. */}
      <aside
        className={`${SF_CLASSES.SF_PANEL}${host._selectedId ? ` ${SF_CLASSES.SF_PANEL_OPEN}` : ATTR_VALUES.EMPTY}`}
        aria-live={ARIA_ATTRS.POLITE}
        inert={!host._selectedId}
      >
        <header className={SF_CLASSES.SF_PANEL_HEAD}>
          <h2 className={SF_CLASSES.SF_PANEL_TITLE}>{dossier?.name ?? ATTR_VALUES.EMPTY}</h2>
          {dossier && <span className={SF_CLASSES.SF_PANEL_TAG}>{kindLabel}</span>}
          <button
            className={SF_CLASSES.SF_PANEL_CLOSE}
            type={FORM_ATTRS.BUTTON}
            aria-label={appText(NAV_UI_KEYS.CLOSE)}
            onClick={() => host._closePanel()}
          >
            ✕
          </button>
        </header>
        <div className={SF_CLASSES.SF_PANEL_BODY}>
          {host._dossierLoading && <p className={SF_CLASSES.SF_PANEL_LOADING}>{t.loading}</p>}
          {dossier && (
            <Fragment>
              <p className={SF_CLASSES.SF_PANEL_TAGLINE}>{dossier.tagline}</p>
              {renderFacts(dossier)}
              <p className={SF_CLASSES.SF_PANEL_HISTORY}>{dossier.history}</p>
              <p className={SF_CLASSES.SF_PANEL_SOURCE}>
                {t.source}: {dossier.source}
              </p>
            </Fragment>
          )}
        </div>
      </aside>

      {/* Actions */}
      <div className={SF_CLASSES.SF_ACTIONS}>
        <button
          className={SF_CLASSES.SF_BTN}
          type={FORM_ATTRS.BUTTON}
          onClick={() => host._takeScreenshot()}
        >
          {t.screenshot}
        </button>
        <button
          className={SF_CLASSES.SF_BTN}
          type={FORM_ATTRS.BUTTON}
          onClick={() => host._flyHome()}
        >
          {t.overview}
        </button>
      </div>
    </Fragment>
  )
}
