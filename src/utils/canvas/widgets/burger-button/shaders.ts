/**
 * @file burger-button-shaders.ts
 * @description GLSL sources for BurgerButtonWebGL, extracted from
 * burger-button-webgl.ts — shared quad vertex shader plus the
 * hairline-bar fragment shader (three bars with per-bar phase-offset
 * wave + breathing, theme-aware ink/glow mix).
 */

/** Extension prelude enabling pixel-space SDF AA (WebGL1 only). */
export const BURGER_DERIV_PRELUDE =
  '#extension GL_OES_standard_derivatives : enable\n#define HAS_DERIV 1\n'

/** Shared fullscreen-quad vertex shader. */
export const BURGER_VS = 'attribute vec2 a_pos;void main(){gl_Position=vec4(a_pos,0.,1.);}'

/** Hairline menu-icon fragment shader body (prefix with the deriv prelude). */
export const BURGER_FS_BODY = `
      #ifdef GL_FRAGMENT_PRECISION_HIGH
      precision highp float;
      #else
      precision mediump float;
      #endif
      uniform float u_time;
      uniform vec2 u_res;
      uniform float u_dark;

      float sdCapsule(vec2 p, vec2 a, vec2 b, float r) {
        vec2 pa = p - a, ba = b - a;
        float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
        return length(pa - ba * h) - r;
      }

      float sdHBar(vec2 p, float y, float w, float h) {
        float r = h * 0.5;
        float halfL = max(w * 0.5 - r, 0.0);
        return sdCapsule(p, vec2(0.5 - halfL, y), vec2(0.5 + halfL, y), r);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_res;
        float t = u_time;

        // Bar geometry in UV units: 54% width, ~4.5% height, ±0.16 vertical
        // spacing — hairline-weight but with enough mass for the heavy AA
        // stack (supersampled buffer + fwidth edge) to stay silky.
        float barW = 0.54;
        float barH = 0.045;
        float gap = 0.16;

        // Subtle fluid wave: a ripple travels along each bar, out of phase
        // per bar (1.3 rad offsets ≈ 2π/5 — no two bars crest together),
        // while the bars gently breathe in length — organic motion.
        // Period ~9s (t·0.7): on a 34px icon, faster motion makes the
        // hairline edges crawl faster than the eye can track, which reads
        // as temporal aliasing even under the supersampled AA stack.
        // Amplitude stays well under the bar height so edges stay clean.
        float wave1 = sin(uv.x * 5.0 - t * 0.7) * 0.009;
        float wave2 = sin(uv.x * 5.0 - t * 0.7 + 1.3) * 0.009;
        float wave3 = sin(uv.x * 5.0 - t * 0.7 + 2.6) * 0.009;

        float bob1 = sin(t * 0.55) * 0.004;
        float bob2 = sin(t * 0.55 + 1.2) * 0.004;
        float bob3 = sin(t * 0.55 + 2.4) * 0.004;

        // Breathing: outer bars grow ±4% while the middle bar counter-shrinks
        // via (2.0 − grow) — the trio's total visual mass stays constant.
        // ~14s period keeps the length change below perception-as-motion.
        float grow = 1.0 + 0.04 * sin(t * 0.45);

        float d1 = sdHBar(vec2(uv.x, uv.y + wave1), 0.5 - gap + bob1, barW * grow, barH);
        float d2 = sdHBar(vec2(uv.x, uv.y + wave2), 0.5 + bob2, (barW + 0.03) * (2.0 - grow), barH);
        float d3 = sdHBar(vec2(uv.x, uv.y + wave3), 0.5 + gap + bob3, (barW - 0.03) * grow, barH);

        float bar = min(min(d1, d2), d3);

        // Anti-aliased edge: with derivatives, convert the SDF distance to
        // pixel distance so the edge falloff spans ~2.2px — deliberately
        // wider than a standard 1px band; on the ×4-supersampled buffer
        // this yields a very soft, heavily anti-aliased hairline after the
        // CSS downsample adds a second smoothing pass.
        #ifdef HAS_DERIV
        float px = max(fwidth(bar), 1e-4);
        float alpha = 1.0 - smoothstep(-px * 1.1, px * 1.1, bar);
        float glow = (1.0 - smoothstep(0.0, px * 5.5, bar)) * 0.2;
        #else
        float alpha = smoothstep(0.02, 0.0, bar);
        float glow = smoothstep(0.06, 0.0, bar) * 0.2;
        #endif

        // Barely-there breathing: ±2% luminance over ~12s. A stronger pulse
        // reads as brightness flicker — the eye interprets it as the AA
        // edge shimmering, not as intentional motion.
        float pulse = 0.98 + 0.02 * sin(t * 0.5);

        // Color based on theme:
        // Dark theme: crisp bright white/ice
        // Light theme: dark slate/charcoal (never invisible white on light background!)
        vec3 colDark = vec3(0.95, 0.97, 1.0) * pulse;
        vec3 colLight = vec3(0.10, 0.10, 0.14) * pulse;
        vec3 col = mix(colLight, colDark, u_dark);

        // Glow stays in the ink's own hue family — a saturated tinted halo
        // against the bars produces a chromatic fringe that reads as
        // broken anti-aliasing, so both themes use a desaturated ink tint.
        vec3 glowDark = vec3(0.55, 0.58, 0.65);
        vec3 glowLight = vec3(0.15, 0.15, 0.22);
        vec3 glowCol = mix(glowLight, glowDark, u_dark);

        vec3 finalCol = col * alpha + glowCol * glow;
        float finalAlpha = max(alpha, glow * 0.25);

        gl_FragColor = vec4(finalCol, finalAlpha);
      }
    `

/** Full FS source for the current GL capability set. */
export const burgerFsSource = (hasDeriv: boolean): string =>
  (hasDeriv ? BURGER_DERIV_PRELUDE : '') + BURGER_FS_BODY
