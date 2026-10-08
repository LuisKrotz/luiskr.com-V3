/**
 * @file cms/deploy-info/render.tsx — report-wall JSX for the Deploy
 * Info tab: score chips (Lighthouse thresholds), the five report
 * sections, and the loading/missing gates.
 */

import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { h } from '@core/jsx.js'
import { DEPLOY_INFO_BASE } from './data.js'
import type { CmsDeployInfo } from './CmsDeployInfo.js'
import { CMS_CARD_CLASSES, CMS_DEPLOY_CLASSES, CMS_FORM_CLASSES } from '@cms/tokens.js'

// Lighthouse-style thresholds: ≥0.9 renders green, ≥0.5 amber, below red
// — matches the colors a Lighthouse report shows for the same numbers.
const SCORE_GOOD_THRESHOLD = 0.9
const SCORE_WARN_THRESHOLD = 0.5

/** Lighthouse category keys in display order. */
const LIGHTHOUSE_KEYS = ['performance', 'accessibility', 'best-practices', 'seo']

/** Coverage-summary row keys in display order. */
const COVERAGE_KEYS = ['lines', 'statements', 'functions', 'branches']

/** Maps a 0–1 score to the green/amber/red chip class (Lighthouse conventions). */
export const scoreClass = (value: unknown): string => {
  if (typeof value !== TYPE_STRINGS.NUMBER) return CMS_DEPLOY_CLASSES.CMS_SCORE

  const score = value as number

  if (score >= SCORE_GOOD_THRESHOLD)
    return `${CMS_DEPLOY_CLASSES.CMS_SCORE} ${CMS_DEPLOY_CLASSES.CMS_SCORE_GOOD}`

  if (score >= SCORE_WARN_THRESHOLD)
    return `${CMS_DEPLOY_CLASSES.CMS_SCORE} ${CMS_DEPLOY_CLASSES.CMS_SCORE_WARN}`

  return `${CMS_DEPLOY_CLASSES.CMS_SCORE} ${CMS_DEPLOY_CLASSES.CMS_SCORE_BAD}`
}

/** Formats a 0–1 score as a whole percentage; non-numbers render an em-dash. */
export const pct = (value: unknown): string =>
  typeof value === TYPE_STRINGS.NUMBER
    ? `${Math.round((value as number) * 100)}`
    : CHAR_STRINGS.EM_DASH

/** Renders the score chips for one Lighthouse category set. */
export const renderScores = (scores: Record<string, number> | undefined) => {
  if (!scores) return null

  return LIGHTHOUSE_KEYS.map((key) => (
    <td>
      <span class={scoreClass(scores[key])}>{pct(scores[key])}</span>
    </td>
  ))
}

/** Renders the Lighthouse section (scores + failing audits). */
export const renderLighthouse = (host: CmsDeployInfo) => {
  if (!host.lighthouse?.urls?.length) {
    return (
      <p className={CMS_FORM_CLASSES.CMS_HINT}>No Lighthouse data in the last deploy bundle.</p>
    )
  }

  return (
    <table className={CMS_DEPLOY_CLASSES.CMS_DEPLOY_TABLE}>
      <thead>
        <tr>
          <th>URL</th>
          <th>Perf</th>
          <th>A11y</th>
          <th>Best</th>
          <th>SEO</th>
        </tr>
      </thead>
      <tbody>
        {host.lighthouse.urls.map((entry) => (
          <tr>
            <td className={CMS_DEPLOY_CLASSES.CMS_DEPLOY_URL}>{entry.url}</td>
            {renderScores(entry.scores)}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/** Renders the Jest coverage summary table. */
export const renderCoverage = (host: CmsDeployInfo) => {
  const total = host.coverage?.total

  if (!total) {
    return <p className={CMS_FORM_CLASSES.CMS_HINT}>No coverage data in the last deploy bundle.</p>
  }

  return (
    <table className={CMS_DEPLOY_CLASSES.CMS_DEPLOY_TABLE}>
      <thead>
        <tr>
          <th>Metric</th>
          <th>Covered</th>
          <th>Total</th>
          <th>%</th>
        </tr>
      </thead>
      <tbody>
        {COVERAGE_KEYS.map((key) => (
          <tr>
            <td className={CMS_DEPLOY_CLASSES.CMS_DEPLOY_URL}>{key}</td>
            <td>{total[key]?.covered ?? CHAR_STRINGS.EM_DASH}</td>
            <td>{total[key]?.total ?? CHAR_STRINGS.EM_DASH}</td>
            <td>
              <span class={scoreClass((total[key]?.pct ?? 0) / 100)}>
                {total[key]?.pct ?? CHAR_STRINGS.EM_DASH}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/** Renders the axe-core accessibility scan (violations grouped by surface). */
export const renderAxe = (host: CmsDeployInfo) => {
  if (!host.axe) {
    return (
      <p className={CMS_FORM_CLASSES.CMS_HINT}>No accessibility scan in the last deploy bundle.</p>
    )
  }

  const t: Record<string, number> = host.axe.totals || {}
  const surfaces = host.axe.surfaces || []

  return (
    <div>
      <p className={CMS_CARD_CLASSES.CMS_CARD_SUBTITLE}>
        {host.axe.engine} · {t.violations ?? 0} violations ({t.criticalOrSerious ?? 0}{' '}
        critical/serious) · {t.passes ?? 0} rules passed · {t.incomplete ?? 0} needs-review
      </p>
      {surfaces.some((s) => s.violations?.length) ? (
        <table className={CMS_DEPLOY_CLASSES.CMS_DEPLOY_TABLE}>
          <thead>
            <tr>
              <th>Surface</th>
              <th>Impact</th>
              <th>Rule</th>
              <th>Issue</th>
            </tr>
          </thead>
          <tbody>
            {surfaces.flatMap((s) =>
              (s.violations || []).map((v) => (
                <tr>
                  <td className={CMS_DEPLOY_CLASSES.CMS_DEPLOY_URL}>{s.surface}</td>
                  <td>
                    <span
                      class={scoreClass(
                        v.impact === 'critical' || v.impact === 'serious' ? 0 : 0.6
                      )}
                    >
                      {v.impact}
                    </span>
                  </td>
                  <td>{v.id}</td>
                  <td>{v.help}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      ) : (
        <p className={CMS_FORM_CLASSES.CMS_HINT}>Zero violations on all scanned surfaces.</p>
      )}
    </div>
  )
}

/** Renders the dependency vulnerability scan (Snyk or yarn-audit fallback). */
export const renderSnyk = (host: CmsDeployInfo) => {
  if (!host.snyk) {
    return (
      <p className={CMS_FORM_CLASSES.CMS_HINT}>No dependency scan in the last deploy bundle.</p>
    )
  }

  const t: Record<string, number> = host.snyk.totals || {}
  const vulns = host.snyk.vulnerabilities || []

  return (
    <div>
      <p className={CMS_CARD_CLASSES.CMS_CARD_SUBTITLE}>
        {host.snyk.scanner} · {t.total ?? 0} vulns — critical {t.critical ?? 0}, high {t.high ?? 0},
        moderate {t.moderate ?? 0}, low {t.low ?? 0}
        {host.snyk.ok ? ' · gate passed' : ' · gate FAILED'}
      </p>
      {vulns.length ? (
        <table className={CMS_DEPLOY_CLASSES.CMS_DEPLOY_TABLE}>
          <thead>
            <tr>
              <th>Package</th>
              <th>Severity</th>
              <th>Issue</th>
              <th>Fix</th>
            </tr>
          </thead>
          <tbody>
            {vulns.map((v) => (
              <tr>
                <td className={CMS_DEPLOY_CLASSES.CMS_DEPLOY_URL}>{v.packageName}</td>
                <td>
                  <span
                    class={scoreClass(v.severity === 'high' || v.severity === 'critical' ? 0 : 0.6)}
                  >
                    {v.severity}
                  </span>
                </td>
                <td>
                  {v.title}
                  {v.acceptedRisk ? ' · accepted risk' : CHAR_STRINGS.EMPTY}
                </td>
                <td>{v.fixedIn || 'none'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={CMS_FORM_CLASSES.CMS_HINT}>No known vulnerabilities in dependencies.</p>
      )}
    </div>
  )
}

/** Renders the console.* usage scan (debug-leftover policy). */
export const renderConsoleScan = (host: CmsDeployInfo) => {
  if (!host.consoleScan) {
    return <p className={CMS_FORM_CLASSES.CMS_HINT}>No console scan in the last deploy bundle.</p>
  }

  const t: Record<string, number> = host.consoleScan.totals || {}
  const violations = host.consoleScan.violations || []

  return (
    <div>
      <p className={CMS_CARD_CLASSES.CMS_CARD_SUBTITLE}>
        {t.callsites ?? 0} callsites — {t.warn ?? 0} warn, {t.error ?? 0} error, {t.exempted ?? 0}{' '}
        exempted · {t.violations ?? 0} violations
        {host.consoleScan.ok ? ' · gate passed' : ' · gate FAILED'}
      </p>
      {violations.length ? (
        <table className={CMS_DEPLOY_CLASSES.CMS_DEPLOY_TABLE}>
          <thead>
            <tr>
              <th>File</th>
              <th>Line</th>
              <th>Call</th>
            </tr>
          </thead>
          <tbody>
            {violations.map((v) => (
              <tr>
                <td className={CMS_DEPLOY_CLASSES.CMS_DEPLOY_URL}>{v.file}</td>
                <td>{v.line}</td>
                <td>console.{v.method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={CMS_FORM_CLASSES.CMS_HINT}>No forbidden console.* usage detected.</p>
      )}
    </div>
  )
}

/** JSX template — loading/missing gates then the five-section report wall. */
export const renderDeployInfo = (host: CmsDeployInfo) => {
  if (host._fetchState === 'loading') {
    return (
      <section className={CMS_CARD_CLASSES.CMS_CARD}>
        <h2 className={CMS_CARD_CLASSES.CMS_CARD_TITLE}>Deploy Info</h2>
        <p className={CMS_FORM_CLASSES.CMS_HINT}>Loading last deploy bundle…</p>
      </section>
    )
  }

  if (host._fetchState === 'missing') {
    return (
      <section className={CMS_CARD_CLASSES.CMS_CARD}>
        <h2 className={CMS_CARD_CLASSES.CMS_CARD_TITLE}>Deploy Info</h2>
        <p className={CMS_FORM_CLASSES.CMS_HINT}>
          No deploy-info bundle found at {DEPLOY_INFO_BASE}/ — run yarn test:lighthouse or yarn run
          deploy:info after a build.
        </p>
      </section>
    )
  }

  return (
    <section className={CMS_CARD_CLASSES.CMS_CARD}>
      <h2 className={CMS_CARD_CLASSES.CMS_CARD_TITLE}>Deploy Info</h2>
      <p className={CMS_CARD_CLASSES.CMS_CARD_SUBTITLE}>
        Generated {host.index?.generatedAt}
        {host.index?.commit ? ` · commit ${host.index.commit}` : CHAR_STRINGS.EMPTY}
      </p>

      <h3 className={CMS_FORM_CLASSES.CMS_SUBSECTION_TITLE}>Lighthouse (last run)</h3>
      {renderLighthouse(host)}

      <h3 className={CMS_FORM_CLASSES.CMS_SUBSECTION_TITLE}>Jest Coverage</h3>
      {renderCoverage(host)}

      <h3 className={CMS_FORM_CLASSES.CMS_SUBSECTION_TITLE}>Accessibility Scan (axe-core)</h3>
      {renderAxe(host)}

      <h3 className={CMS_FORM_CLASSES.CMS_SUBSECTION_TITLE}>Dependency Scan</h3>
      {renderSnyk(host)}

      <h3 className={CMS_FORM_CLASSES.CMS_SUBSECTION_TITLE}>Console Usage Scan</h3>
      {renderConsoleScan(host)}
    </section>
  )
}
