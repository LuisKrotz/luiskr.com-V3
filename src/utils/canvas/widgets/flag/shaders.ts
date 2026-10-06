/**
 * @file flag-shaders.ts
 * @description GLSL sources for the FlagWebGL flag renderer —
 * flag-warp/drape effects and the two-flag split transition, extracted
 * from flag-webgl.ts. Pure data, compiled by FlagRenderer._initProgram().
 */

/** Fullscreen-quad vertex shader: a_pos in clip space, v_uv 0–1. */
export const FLAG_VS = `
        attribute vec2 a_pos;
        varying vec2 v_uv;
        void main() {
          v_uv = (a_pos + 1.0) * 0.5;
          // Invert y so top-left matches standard image coords
          v_uv.y = 1.0 - v_uv.y;
          gl_Position = vec4(a_pos, 0.0, 1.0);
        }
      `

/** Flag fragment shader: texture warp, shading, split-screen dissolve. */
export const FLAG_FS = `
        #ifdef GL_FRAGMENT_PRECISION_HIGH
        precision highp float;
        #else
        precision mediump float;
        #endif

        varying vec2 v_uv;
        uniform vec2 u_resolution;
        uniform float u_time;
        uniform float u_hover;
        uniform float u_anim_type;
        uniform float u_is_split;
        uniform float u_split_x;
        uniform sampler2D u_tex1;
        uniform sampler2D u_tex2;

        void main() {
          vec2 uv = v_uv;
          float t = u_time;
          float h = u_hover;
          float anim = u_anim_type;

          vec2 uvWarp = uv;
          float specular = 0.0;

          // Universal realistic aerodynamic wind model: Left-to-right
          // Fixed at flagpole (x=0.0) -> free flutter at edge (x=1.0)
          float windPhase = uv.x * 9.5 - t * 3.2;
          float windAmp = (0.20 + 0.80 * uv.x) * (0.016 + 0.010 * h);
          float baseWave = sin(windPhase);

          // Unique secondary cloth flutter & specular personality per flag (all synchronized with wind vector)
          float flutter = 0.0;

          if (anim < 0.5) {
            // 0: EN (US Flag - Stars shimmer)
            flutter = sin(windPhase * 1.5) * 0.005 + cos(uv.y * 7.0 - t * 1.8) * 0.003;
            specular = (0.5 + 0.5 * sin(windPhase)) * 0.28;

          } else if (anim < 1.5) {
            // 1: PT (BR Flag - Rhombus solar glow)
            flutter = sin(windPhase * 1.3) * 0.006 + sin(uv.y * 6.0 - t * 1.5) * 0.003;
            specular = (0.5 + 0.5 * cos(windPhase)) * 0.30;

          } else if (anim < 2.5) {
            // 2: ES (Spain - Flamenco silk)
            flutter = sin(windPhase + uv.y * 4.0) * 0.007;
            specular = (0.5 + 0.5 * sin(windPhase)) * 0.32;

          } else if (anim < 3.5) {
            // 3: DE (CH + DE split - Cross-ribbon)
            flutter = cos(windPhase * 1.2) * 0.005 + sin(uv.y * 5.0 - t * 1.6) * 0.003;
            specular = (0.5 + 0.5 * sin(windPhase)) * 0.25;

          } else if (anim < 4.5) {
            // 4: HRK (DE + BR split - Harmonic wave)
            flutter = sin(windPhase * 1.4) * 0.006;
            specular = (0.5 + 0.5 * sin(windPhase)) * 0.28;

          } else if (anim < 5.5) {
            // 5: CAS (AR + UY split - Sol de Mayo rays)
            flutter = sin(windPhase * 1.2) * 0.005 + cos(uv.y * 6.0 - t * 2.0) * 0.003;
            specular = (0.5 + 0.5 * cos(windPhase)) * 0.35;

          } else if (anim < 6.5) {
            // 6: RIV (UY + BR split - River reflection)
            flutter = sin(windPhase * 1.3) * 0.007;
            specular = (0.5 + 0.5 * sin(windPhase)) * 0.30;

          } else if (anim < 7.5) {
            // 7: GN (Paraguay - Horizontal surge)
            flutter = cos(windPhase * 1.1) * 0.006;
            specular = (0.5 + 0.5 * sin(windPhase)) * 0.28;

          } else if (anim < 8.5) {
            // 8: IT (Italy - Mediterranean silk)
            flutter = sin(windPhase * 1.2) * 0.006 + sin(uv.y * 5.0 - t * 1.5) * 0.003;
            specular = (0.5 + 0.5 * sin(windPhase)) * 0.30;

          } else if (anim < 9.5) {
            // 9: RU (Russia - Aurora shimmer)
            flutter = sin(windPhase * 1.1) * 0.007 + cos(uv.y * 7.0 - t * 1.8) * 0.003;
            specular = (0.5 + 0.5 * cos(windPhase)) * 0.35;

          } else if (anim < 10.5) {
            // 10: FR (France - Satin ripple)
            flutter = sin(windPhase * 1.3) * 0.006;
            specular = (0.5 + 0.5 * sin(windPhase)) * 0.28;

          } else {
            // 11: TLN (IT + BR split - Venetian pulse)
            flutter = sin(windPhase * 1.2) * 0.006 + cos(uv.y * 6.0 - t * 1.9) * 0.003;
            specular = (0.5 + 0.5 * sin(windPhase)) * 0.30;
          }

          uvWarp.y += (baseWave * windAmp) + (flutter * windAmp);
          uvWarp.x += cos(windPhase) * (windAmp * 0.35);

          vec4 col = vec4(0.0);

          if (u_is_split > 0.5) {
            // Split flag: the left part shows the left half of tex1 and the
            // right part the right half of tex2, both at their natural aspect
            // (the canvas itself is sized to the mean of both aspects).
            if (uvWarp.x < u_split_x) {
              vec2 uv1 = vec2(uvWarp.x / u_split_x * 0.5, uvWarp.y);
              uv1 = clamp(uv1, 0.005, 0.995);
              col = texture2D(u_tex1, uv1);
            } else {
              vec2 uv2 = vec2(0.5 + (uvWarp.x - u_split_x) / (1.0 - u_split_x) * 0.5, uvWarp.y);
              uv2 = clamp(uv2, 0.005, 0.995);
              col = texture2D(u_tex2, uv2);
            }

            // Thin dividing line
            float lineDist = abs(uv.x - u_split_x);
            float lineEdge = 1.0 - smoothstep(0.0, 0.015, lineDist);
            col = mix(col, vec4(0.1, 0.1, 0.1, 1.0), lineEdge * 0.4);

          } else {
            vec2 uvSingle = clamp(uvWarp, 0.005, 0.995);
            col = texture2D(u_tex1, uvSingle);
          }

          // Apply gentle specular sheen and hover lighting
          col.rgb += vec3(specular * (0.4 + 0.6 * h));

          // Soft rounded corner masking
          vec2 pixel = v_uv * u_resolution;
          vec2 cornerRadius = vec2(3.0, 3.0);
          vec2 dCorner = max(abs(pixel - u_resolution * 0.5) - (u_resolution * 0.5 - cornerRadius), 0.0);
          float cornerDist = length(dCorner);
          float alpha = 1.0 - smoothstep(cornerRadius.x - 1.0, cornerRadius.x, cornerDist);

          gl_FragColor = vec4(col.rgb * (col.a * alpha), col.a * alpha);
        }
      `
