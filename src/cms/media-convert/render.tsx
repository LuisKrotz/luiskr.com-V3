/**
 * @file media-convert/render.tsx — phase-switched JSX templates.
 */

import { CMS_MEDIA_IDS } from '@/cms/tokens.js'
import { FORM_ATTRS } from '@/core/tokens/attrs/form.js'
import { h } from '@/core/jsx.js'
import type { CmsMediaConverter } from './CmsMediaConverter.js'
import { IS_LOCALHOST } from './CmsMediaConverter.js'
import { MIME_HINT, PHASE } from './consts.js'
import { fmtBytes } from './files.js'
import {
  CMS_BUTTON_CLASSES,
  CMS_CARD_CLASSES,
  CMS_FORM_CLASSES,
  CMS_ITEM_CLASSES,
  CMS_MEDIA_CLASSES,
} from '@/cms/tokens.js'

/**
 * Renders idle.
 * @param host — the host component
 */
export function renderIdle(host: CmsMediaConverter) {
  return (
    <div>
      <div class={CMS_ITEM_CLASSES.CMS_DROPZONE}>
        <span class={CMS_MEDIA_CLASSES.CMS_DROPZONE_ICON} aria-hidden="true">
          📂
        </span>
        <p>Drag a folder or files here</p>
        <p class={CMS_FORM_CLASSES.CMS_HINT}>
          Any image or video format — folder structure is preserved in the ZIP
        </p>
        <label class={CMS_BUTTON_CLASSES.CMS_BTN_SECONDARY}>
          Browse…
          <input
            id={CMS_MEDIA_IDS.FILE_INPUT}
            type="file"
            multiple
            accept={MIME_HINT}
            style="display:none"
          />
        </label>
      </div>

      {host.queue.length ? (
        <div>
          <div class={CMS_MEDIA_CLASSES.CMS_LIST_HEAD}>
            <span class={CMS_FORM_CLASSES.CMS_SUBSECTION_TITLE}>
              {host.queue.length} file(s) queued
            </span>
            <button
              id={CMS_MEDIA_IDS.CLEAR_LIST}
              class={CMS_BUTTON_CLASSES.CMS_BTN_SECONDARY}
              type={FORM_ATTRS.BUTTON}
            >
              Clear
            </button>
          </div>
          <div class={CMS_MEDIA_CLASSES.CMS_MEDIA_LIST}>
            {host.queue.map((item, i) => (
              <div class={CMS_MEDIA_CLASSES.CMS_MEDIA_LIST_ROW} key={i}>
                <span class={CMS_MEDIA_CLASSES.CMS_MEDIA_LIST_NAME} title={item.rel}>
                  {item.rel}
                </span>
                <span class={CMS_MEDIA_CLASSES.CMS_MEDIA_LIST_SIZE}>
                  {fmtBytes(item.file.size)}
                </span>
              </div>
            ))}
          </div>
          <button
            id={CMS_MEDIA_IDS.RUN}
            class={CMS_BUTTON_CLASSES.CMS_BTN_PRIMARY}
            type={FORM_ATTRS.BUTTON}
          >
            ⚙️ Convert all
          </button>
        </div>
      ) : null}
    </div>
  )
}

/**
 * Renders the live progress bar for the media conversion batch —
 * label + a percent fill computed from done/total (0 when total is 0).
 * @param {string} label — the phase label shown next to the bar
 * @param {number} done — items completed so far
 * @param {number} total — items in the batch
 */
function renderProgress(label: string, done: number, total: number) {
  const pct = total ? Math.round((done / total) * 100) : 0

  return (
    <div>
      <p class={CMS_FORM_CLASSES.CMS_SUBSECTION_TITLE}>{label}</p>
      <div class={CMS_MEDIA_CLASSES.CMS_PROGRESS}>
        <div class={CMS_ITEM_CLASSES.CMS_PROGRESS_FILL} style={`width:${pct}%`} />
      </div>
    </div>
  )
}

/**
 * Renders converting.
 * @param host — the host component
 */
export function renderConverting(host: CmsMediaConverter) {
  const done = host.status?.done ?? 0
  const total = host.status?.total ?? 0
  return renderProgress('Converting…', done, total)
}

/**
 * Renders done.
 * @param host — the host component
 */
export function renderDone(host: CmsMediaConverter) {
  const results = host.status?.results || []
  const ok = results.filter((r) => r.ok)
  const failed = results.filter((r) => !r.ok)

  return (
    <div>
      <div class={CMS_MEDIA_CLASSES.CMS_LIST_HEAD}>
        <span class={CMS_FORM_CLASSES.CMS_SUBSECTION_TITLE}>✅ {ok.length} file(s) converted</span>
        <div class={CMS_MEDIA_CLASSES.CMS_BTN_ROW}>
          <button
            id={CMS_MEDIA_IDS.DOWNLOAD}
            class={CMS_BUTTON_CLASSES.CMS_BTN_PRIMARY}
            type={FORM_ATTRS.BUTTON}
          >
            ⬇ Download ZIP
          </button>
          <button
            id={CMS_MEDIA_IDS.RESET}
            class={CMS_BUTTON_CLASSES.CMS_BTN_SECONDARY}
            type={FORM_ATTRS.BUTTON}
          >
            Convert more
          </button>
        </div>
      </div>

      <div class={CMS_MEDIA_CLASSES.CMS_MEDIA_LIST}>
        {ok.map((r, i) => (
          <div class={CMS_MEDIA_CLASSES.CMS_MEDIA_LIST_GROUP} key={i}>
            <div class={CMS_MEDIA_CLASSES.CMS_MEDIA_LIST_NAME}>{r.in}</div>
            {(r.outs || []).map((o) => (
              <div class={CMS_MEDIA_CLASSES.CMS_MEDIA_LIST_OUT} key={o}>
                → {o}
              </div>
            ))}
          </div>
        ))}
      </div>

      {failed.length ? (
        <div class={CMS_MEDIA_CLASSES.CMS_MEDIA_LIST_ERRORS}>
          {failed.map((r, i) => (
            <div class={CMS_MEDIA_CLASSES.CMS_MEDIA_LIST_ROW} key={i}>
              <span class={CMS_MEDIA_CLASSES.CMS_MEDIA_LIST_NAME}>{r.in}</span>
              <span class={CMS_MEDIA_CLASSES.CMS_MEDIA_LIST_ERROR}>{r.error}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

/**
 * Renders error.
 * @param host — the host component
 */
export function renderError(host: CmsMediaConverter) {
  return (
    <div>
      <p class={CMS_MEDIA_CLASSES.CMS_ERROR_TEXT}>⚠ {host.error || 'conversion failed'}</p>
      <div class={CMS_MEDIA_CLASSES.CMS_BTN_ROW}>
        {host.status?.results?.some((r) => r.ok) ? (
          <button
            id={CMS_MEDIA_IDS.DOWNLOAD}
            class={CMS_BUTTON_CLASSES.CMS_BTN_PRIMARY}
            type={FORM_ATTRS.BUTTON}
          >
            ⬇ Download ZIP (partial)
          </button>
        ) : null}
        <button
          id={CMS_MEDIA_IDS.RESET}
          class={CMS_BUTTON_CLASSES.CMS_BTN_SECONDARY}
          type={FORM_ATTRS.BUTTON}
        >
          Start over
        </button>
      </div>
    </div>
  )
}

/**
 * Renders media converter.
 * @param host — the host component
 */
export function renderMediaConverter(host: CmsMediaConverter) {
  if (!IS_LOCALHOST) {
    return (
      <section class={CMS_CARD_CLASSES.CMS_CARD}>
        <h3 class={CMS_CARD_CLASSES.CMS_CARD_TITLE}>🎬 Media Converter</h3>
        <p class={CMS_CARD_CLASSES.CMS_CARD_SUBTITLE}>
          This tool runs only on the local dev server — start the site with
          <code> npm run dev </code> or <code>vite preview</code> on localhost to use it.
        </p>
      </section>
    )
  }

  const busy = host.phase === PHASE.UPLOADING || host.phase === PHASE.CONVERTING

  return (
    <section class={CMS_CARD_CLASSES.CMS_CARD}>
      <h3 class={CMS_CARD_CLASSES.CMS_CARD_TITLE}>🎬 Media Converter</h3>
      <p class={CMS_CARD_CLASSES.CMS_CARD_SUBTITLE}>
        Drop a folder of images/videos — outputs follow the CDN naming rules (
        <code>-mozjpg-*.jpg</code>, <code>.mp4-scaledown-2x.mp4</code>, <code>.jpg-thumb.jpg</code>)
        and download as a ZIP. Localhost only.
      </p>

      {host.phase === PHASE.IDLE ? host._renderIdle() : null}
      {host.phase === PHASE.UPLOADING
        ? renderProgress('Uploading…', host.uploaded, host.queue.length)
        : null}
      {host.phase === PHASE.CONVERTING ? host._renderConverting() : null}
      {host.phase === PHASE.DONE ? host._renderDone() : null}
      {host.phase === PHASE.ERROR ? host._renderError() : null}

      {busy ? (
        <div class={CMS_MEDIA_CLASSES.CMS_LOADER_ROW}>
          <span class={CMS_MEDIA_CLASSES.CMS_SPINNER} aria-hidden="true" />
          <span class={CMS_FORM_CLASSES.CMS_HINT}>
            {host.phase === PHASE.UPLOADING
              ? `File ${host.uploaded}/${host.queue.length}`
              : host.status?.current
                ? `Converting ${host.status.current} (${host.status.done}/${host.status.total})`
                : 'Processing…'}
          </span>
        </div>
      ) : null}
    </section>
  )
}
