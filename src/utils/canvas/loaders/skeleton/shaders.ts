import { SKELETON_GLYPH, SKELETON_RENDER } from '@/core/tokens/motion/skeleton.js'
/**
 * @file skeleton-shaders.ts
 * @description GLSL sources for the skeleton shimmer layer, extracted
 * from skeleton-renderer.ts — a minimal position vertex shader plus the
 * "data decoding" fragment shader that draws rounded-box cells whose
 * glyphs morph between 0/1 shapes at per-cell cadence.
 */
/** Shared fullscreen-quad vertex shader. */
export const SKELETON_VS = 'attribute vec2 a_pos;void main(){gl_Position=vec4(a_pos,0.,1.);}'

/** Shimmer fragment shader — u_rects/u_meta/u_sbase/u_sink are per-rect arrays. */
export const SKELETON_FS = `
      precision mediump float;
      #define MAX_RECTS ${SKELETON_RENDER.MAX_RECTS}
      uniform vec2 u_res;
      uniform float u_time;
      uniform float u_resolve;
      uniform float u_ink_alpha;
      uniform vec4 u_rects[MAX_RECTS];   // x, y, w, h (device px, y down)
      uniform vec4 u_meta[MAX_RECTS];    // radius, cell, row height (0 = media), unused
      uniform vec4 u_sbase[MAX_RECTS];   // per-rect surface rgb (sampled from --skel-bg-1)
      uniform vec4 u_sink[MAX_RECTS];    // per-rect ink rgb (sampled from --skel-ink)
      uniform int u_count;

      float hash21(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      float sdRoundBox(vec2 p, vec2 b, float r) {
        vec2 q = abs(p) - b + r;
        return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
      }

      // '0': rounded ring, '1': vertical bar with a small flag
      float glyphZero(vec2 q, float s) {
        float ring = abs(length(q * vec2(1.25, 1.0)) - s * 0.30) - s * 0.075;
        return ring;
      }

      float glyphOne(vec2 q, float s) {
        float bar = sdRoundBox(q - vec2(s * 0.04, 0.0), vec2(s * 0.075, s * 0.33), s * 0.05);
        float flag = sdRoundBox(q - vec2(-s * 0.07, -s * 0.22), vec2(s * 0.12, s * 0.06), s * 0.03);
        return min(bar, flag);
      }

      void main() {
        vec2 p = vec2(gl_FragCoord.x, u_res.y - gl_FragCoord.y);
        vec4 color = vec4(0.0);

        for (int i = 0; i < MAX_RECTS; i++) {
          if (i >= u_count) break;
          vec4 r = u_rects[i];
          vec2 hs = r.zw * 0.5;
          vec2 c = r.xy + hs;
          float d = sdRoundBox(p - c, hs, min(u_meta[i].x, min(hs.x, hs.y)));
          if (d > 1.0) continue;
          float edge = 1.0 - smoothstep(-1.0, 1.0, d);

          float cell = u_meta[i].y;
          float row = u_meta[i].z;
          vec2 local = p - r.xy;

          // Text rows: one glyph row per line box (centred in the line), ragged right edge
          float rowMask = 1.0;
          vec2 cellId = floor(local / cell);
          vec2 q = (fract(local / cell) - 0.5) * cell;
          float glyphSize = cell;
          if (row > 0.0) {
            float rowIdx = floor(local.y / row);
            cellId.y = rowIdx;
            q.y = mod(local.y, row) - row * 0.5;
            glyphSize = min(cell, row * 0.62);
            float ragged = 0.72 + 0.28 * hash21(vec2(rowIdx, float(i) * 3.1));
            rowMask = 1.0 - smoothstep(ragged * r.z - cell, ragged * r.z, local.x);
          }
          float h = hash21(cellId + float(i) * 17.0);

          // Each cell flips state at its own slow cadence; morph smoothly between shapes
          float cadence = 0.35 + h * 0.5;
          float phase = u_time * cadence + h * 7.0;
          float state = step(0.5, fract(sin(floor(phase) * 12.9898 + h * 78.233) * 43758.5453));
          float morph = smoothstep(0.0, 0.35, fract(phase));
          float prevState = step(0.5, fract(sin((floor(phase) - 1.0) * 12.9898 + h * 78.233) * 43758.5453));
          float shape = mix(prevState, state, morph);

          float g0 = glyphZero(q, glyphSize);
          float g1 = glyphOne(q, glyphSize);
          float g = mix(g0, g1, shape);
          float glyph = 1.0 - smoothstep(0.0, ${SKELETON_GLYPH.EDGE_SOFTNESS}, g);

          // Text rows stay sparse and low-contrast: enough motion to communicate
          // loading without resembling blurred copy. Media cells retain the
          // denser field because their larger surfaces need visible structure.
          float textDensity = ${SKELETON_GLYPH.TEXT_DENSITY_BASE} + ${SKELETON_GLYPH.TEXT_DENSITY_DRIFT} * sin(u_time * 0.35 + float(i));
          float mediaDensity = 0.48 + 0.12 * sin(u_time * 0.35 + float(i));
          float density = row > 0.0 ? textDensity : mediaDensity;
          float textAlpha = row > 0.0 ? ${SKELETON_GLYPH.TEXT_ALPHA} : 1.0;
          glyph *= step(1.0 - density, hash21(cellId * 1.7 + float(i)));
          glyph *= rowMask * textAlpha;

          // Ink tones sit close to the rect's surface, keeping the decoding
          // texture subtle in both themes rather than glowing through text rows.
          vec3 inkA = mix(u_sink[i].rgb, u_sbase[i].rgb, ${SKELETON_GLYPH.INK_SURFACE_MIX_NEAR});
          vec3 inkB = mix(u_sink[i].rgb, u_sbase[i].rgb, ${SKELETON_GLYPH.INK_SURFACE_MIX_FAR});

          // Colour drifts across the rect and over time between the two ink tones
          float drift = 0.5 + 0.5 * sin(u_time * 0.6 + local.x * 0.012 + h * 2.0);
          vec3 ink = mix(inkA, inkB, drift);

          // Resolve: glyphs collapse into the base fill, then the whole layer fades
          float collapse = 1.0 - smoothstep(0.0, 0.6, u_resolve);
          float fade = 1.0 - smoothstep(0.35, 1.0, u_resolve);

          vec3 rgb = mix(u_sbase[i].rgb, ink, glyph * u_ink_alpha * collapse);
          float a = edge * fade;
          color = vec4(rgb * a, a);
        }

        gl_FragColor = color;
      }
    `
