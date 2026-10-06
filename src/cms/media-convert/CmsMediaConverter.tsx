/**
 * @file CmsMediaConverter.js
 * @description <cms-media-converter> — localhost-only batch media
 * converter. Drop a folder (or files) of images/videos in any format →
 * files stream to a temp job dir on the dev server → the tasks/*
 * pipelines run server-side → results download as a single ZIP with the
 * site's exact CDN naming (-mozjpg*, .mp4-scaledown-2x, .jpg-thumb.jpg…).
 * Gated to localhost: the API only exists on the dev/preview server and
 * the component renders a notice anywhere else.
 *
 * Behavior lives in `@cms/media-convert/*` modules (consts, files, job,
 * events, render); this class is the element facade + state holder.
 */

import { CMS_EVENTS, CMS_TAGS } from '@/cms/tokens.js'
import { CHAR_STRINGS } from '@/core/tokens/strings/chars.js'
import { BaseComponent } from '@/core/Component.js'
import cmsStyles from '@/cms/sass/cms.scss?inline'
import { PHASE, type JobStatus, type QueueItem } from './consts.js'
import { bindEvents } from './events.js'
import { collectDrop, collectInput } from './files.js'
import {
  askNotifyPermission,
  createJob,
  deleteJob,
  errText,
  finish,
  poll,
  reset,
  run,
  startConvert,
  stopPolling,
  systemNotify,
  uploadAll,
} from './job.js'
import {
  renderConverting,
  renderDone,
  renderError,
  renderIdle,
  renderMediaConverter,
} from './render.js'

// Dev-server gate: the /api/media-convert routes only exist on vite's
// dev/preview server — on the deployed site the regex fails and the
// component renders its "localhost only" notice instead.
/**
 * Returns whether localhost.
 * @param localhost — the value
 */
export const IS_LOCALHOST = /^(localhost|127\.0\.0\.1|\[?::1\]?)$/.test(window.location.hostname)

/**
 * The CmsMediaConverter component.
 */
export class CmsMediaConverter extends BaseComponent {
  phase: string = PHASE.IDLE
  queue: QueueItem[] = [] // [{ file, rel }]
  jobId: string | null = null
  uploaded = 0
  status: JobStatus | null = null // server job status payload
  dragging = false
  error: string = CHAR_STRINGS.EMPTY
  _pollTimer: ReturnType<typeof setTimeout> | null = null

  constructor() {
    super(cmsStyles)
  }

  /** Lifecycle: binds drop-zone + input events. */

  override onMounted() {
    bindEvents(this)
  }

  /** Lifecycle: stops polling + revokes object URLs. */

  override onDestroy() {
    this._stopPolling()
    if (this.jobId && this.phase !== PHASE.DONE) deleteJob(this)
  }

  /** Clears the job-status poll interval. */

  _stopPolling() {
    stopPolling(this)
  }

  /** Fires a cms-notification toast. */

  _notify(msg: string): void {
    this.dispatchEvent(
      new CustomEvent(CMS_EVENTS.NOTIFY, { bubbles: true, composed: true, detail: msg })
    )
  }

  // ─── Delegates — @cms/media-convert/* ──────────────────────────────────────
  _collectDrop(dataTransfer: DataTransfer) {
    return collectDrop(this, dataTransfer)
  }
  _collectInput(input: HTMLInputElement) {
    return collectInput(this, input)
  }
  _createJob() {
    return createJob(this)
  }
  _uploadAll() {
    return uploadAll(this)
  }
  _startConvert() {
    return startConvert(this)
  }
  _poll() {
    return poll(this)
  }
  _finish() {
    return finish(this)
  }
  _systemNotify(title: string, body: string) {
    systemNotify(title, body)
  }
  _askNotifyPermission() {
    return askNotifyPermission()
  }
  _deleteJob() {
    return deleteJob(this)
  }
  _errText(res: Response, fallback: string) {
    return errText(res, fallback)
  }
  _run() {
    return run(this)
  }
  _reset() {
    return reset(this)
  }
  _bindEvents() {
    bindEvents(this)
  }
  _renderIdle() {
    return renderIdle(this)
  }
  _renderConverting() {
    return renderConverting(this)
  }
  _renderDone() {
    return renderDone(this)
  }
  _renderError() {
    return renderError(this)
  }

  /** JSX template for the current phase (delegate — media-convert/render.tsx). */

  override render() {
    return renderMediaConverter(this)
  }
}

if (!customElements.get(CMS_TAGS.CMS_MEDIA_CONVERTER)) {
  customElements.define(CMS_TAGS.CMS_MEDIA_CONVERTER, CmsMediaConverter)
}
