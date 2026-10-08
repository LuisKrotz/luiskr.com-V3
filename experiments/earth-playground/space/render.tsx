/**
 * @file space/render.tsx
 * @description JSX for SpacePlayground's render() — boot loader overlay
 * (hidden after first usable frame), the collapsible control panel with
 * slider/checkbox/action groups plus position/target readouts, and the
 * ambient music player.
 */

import { FORM_ATTRS } from '@core/tokens/attrs/form.js'
import { MEDIA_ATTRS } from '@core/tokens/attrs/media.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { SP_CLASSES } from '@core/tokens/classes/playground.js'
import { CMS_KEYS } from '@core/tokens/data/cms-keys.js'
import { LOADER_UI_KEYS, NAV_UI_KEYS } from '@core/tokens/data/ui-keys.js'
import { SP_ACTIONS } from '@core/tokens/playground/actions.js'
import { SP_MUSIC } from '@core/tokens/playground/music.js'
import { h, Fragment } from '@core/jsx.js'
import { appText } from '@core/locale/ui-text.js'
import { SLIDER_GROUPS, SP_DEFAULTS } from './controls.js'
import { renderSpAction, renderSpControl } from './panel-render.js'
import type { SpacePlayground } from '../SpacePlayground.js'

/** Builds a stable relationship id for a group header and its content. */
const groupContentId = (index: number): string => `${SP_CLASSES.SP_GROUP_CONTENT}-${index}`

/**
 * Renders space playground.
 * @param host — the host component
 */
export function renderSpacePlayground(host: SpacePlayground) {
  const t: Record<string, unknown> = {
    ...SP_DEFAULTS,
    title: appText(CMS_KEYS.EARTH_PLAYGROUND),
    ...(host.translations ?? {}),
  }

  const expLabel = t.experienceSettings
  const positionGroupIndex = SLIDER_GROUPS.length
  const targetGroupIndex = positionGroupIndex + 1

  const earthReady = host._earthReady

  return (
    <Fragment>
      {/* Sci-Fi System Boot Loader — only shown during initial load */}
      {!earthReady && (
        <div className={SP_CLASSES.SP_LOADER}>
          <div className={SP_CLASSES.SP_LOADER_GLOW} />
          <div className={SP_CLASSES.SP_LOADER_GRID} />
          <div className={SP_CLASSES.SP_LOADER_CONTENT}>
            <div className={SP_CLASSES.SP_LOADER_SPINNER_OUTER} />
            <div className={SP_CLASSES.SP_LOADER_SPINNER_INNER} />
            <div className={SP_CLASSES.SP_LOADER_COUNTER}>
              <span className={SP_CLASSES.SP_LOADER_PERCENT}>
                <span className={SP_CLASSES.SP_LOADER_VAL}>0</span>
                <span className={SP_CLASSES.SP_LOADER_SYM}>%</span>
              </span>
            </div>
            <div className={SP_CLASSES.SP_LOADER_TITLE}>{t.systemBoot}</div>
            <div className={SP_CLASSES.SP_LOADER_MSG}>
              {appText(LOADER_UI_KEYS.LOADER_INIT_WEBGPU)}
            </div>
            <div className={SP_CLASSES.SP_LOADER_BAR}>
              <div className={SP_CLASSES.SP_LOADER_BAR_FILL} />
            </div>
          </div>
        </div>
      )}

      {/* Controls wrapper aligned with top nav %MAXAREA */}
      <div className={SP_CLASSES.SP_CONTROLS_WRAP}>
        {/* Floating reopen button — styled like click to expand button */}
        <button
          className={SP_CLASSES.SP_REOPEN}
          data-action={SP_ACTIONS.PANEL_OPEN}
          type={FORM_ATTRS.BUTTON}
          style="display:none"
        >
          {expLabel}
        </button>

        <section className={SP_CLASSES.SP_PANEL} aria-label={t.title}>
          <header className={SP_CLASSES.SP_PANEL_HEADER}>
            <h2 className={SP_CLASSES.SP_PANEL_TITLE}>{t.title}</h2>
            <button
              className={SP_CLASSES.SP_PANEL_TOGGLE}
              data-action={SP_ACTIONS.PANEL_TOGGLE}
              type={FORM_ATTRS.BUTTON}
              aria-label={appText(NAV_UI_KEYS.CLOSE)}
            >
              ✕
            </button>
          </header>

          <div className={SP_CLASSES.SP_PANEL_BODY}>
            {SLIDER_GROUPS.map((group, index) => (
              <div
                className={`${SP_CLASSES.SP_GROUP}${group.collapsed ? ` ${SP_CLASSES.SP_GROUP_COLLAPSED}` : ATTR_VALUES.EMPTY}`}
              >
                <button
                  className={SP_CLASSES.SP_GROUP_HEADER}
                  type={FORM_ATTRS.BUTTON}
                  aria-expanded={group.collapsed ? ATTR_VALUES.FALSE : ATTR_VALUES.TRUE}
                  aria-controls={groupContentId(index)}
                >
                  <span className={SP_CLASSES.SP_GROUP_CHEVRON} aria-hidden={ATTR_VALUES.TRUE}>
                    ▶
                  </span>
                  <span className={SP_CLASSES.SP_GROUP_LABEL}>{t[group.label] || group.label}</span>
                </button>

                <div
                  className={SP_CLASSES.SP_GROUP_CONTENT}
                  id={groupContentId(index)}
                  inert={group.collapsed}
                >
                  {group.controls.map((ctrl) =>
                    renderSpControl(ctrl, t, host._savedSettings[ctrl.param])
                  )}

                  {group.actions?.map((act) => renderSpAction(act, t))}
                </div>
              </div>
            ))}

            {/* Position / Target readouts */}
            <div className={SP_CLASSES.SP_GROUP}>
              <button
                className={SP_CLASSES.SP_GROUP_HEADER}
                type={FORM_ATTRS.BUTTON}
                aria-expanded={ATTR_VALUES.TRUE}
                aria-controls={groupContentId(positionGroupIndex)}
              >
                <span className={SP_CLASSES.SP_GROUP_CHEVRON} aria-hidden={ATTR_VALUES.TRUE}>
                  ▶
                </span>
                <span className={SP_CLASSES.SP_GROUP_LABEL}>{t.position}</span>
              </button>
              <div className={SP_CLASSES.SP_GROUP_CONTENT} id={groupContentId(positionGroupIndex)}>
                <div className={`${SP_CLASSES.SP_READOUT} ${SP_CLASSES.SP_POS}`}>
                  X: 0 Y: 0 Z: 0
                </div>
              </div>
            </div>

            <div className={SP_CLASSES.SP_GROUP}>
              <button
                className={SP_CLASSES.SP_GROUP_HEADER}
                type={FORM_ATTRS.BUTTON}
                aria-expanded={ATTR_VALUES.TRUE}
                aria-controls={groupContentId(targetGroupIndex)}
              >
                <span className={SP_CLASSES.SP_GROUP_CHEVRON} aria-hidden={ATTR_VALUES.TRUE}>
                  ▶
                </span>
                <span className={SP_CLASSES.SP_GROUP_LABEL}>{t.target}</span>
              </button>
              <div className={SP_CLASSES.SP_GROUP_CONTENT} id={groupContentId(targetGroupIndex)}>
                <div className={`${SP_CLASSES.SP_READOUT} ${SP_CLASSES.SP_TGT}`}>
                  X: 0 Y: 0 Z: 0
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Native audio player aligned with nav */}
      <div className={SP_CLASSES.SP_MUSIC}>
        <audio
          className={SP_CLASSES.SP_AUDIO}
          controls
          controlsList={MEDIA_ATTRS.NO_DOWNLOAD}
          disablePictureInPicture
          autoplay
          loop
          preload={ATTR_VALUES.AUTO}
        >
          <source src={SP_MUSIC.OGG} type={MEDIA_ATTRS.AUDIO_OGG} />
          <source src={SP_MUSIC.MP3} type={MEDIA_ATTRS.AUDIO_MPEG} />
        </audio>
      </div>
    </Fragment>
  )
}
