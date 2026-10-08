/**
 * @file theme-slider/shaders.ts
 * @description GLSL sources for ThemeSliderWebGL's day/night scene,
 * extracted from theme-slider.ts — pure data, compiled by initWebGL().
 */

/** Fullscreen-quad vertex shader: a_pos in clip space, v_uv 0–1. */
export const THEME_SLIDER_VS = `        attribute vec2 a_pos;
        varying vec2 v_uv;
        void main() {
          v_uv = (a_pos + 1.0) * 0.5;
          gl_Position = vec4(a_pos, 0.0, 1.0);
        }
      `

/** Day/night scene fragment shader (sun, moon, aurora, knob). */
export const THEME_SLIDER_FS = `        #ifdef GL_FRAGMENT_PRECISION_HIGH
        precision highp float;
        #else
        precision mediump float;
        #endif

        varying vec2 v_uv;
        uniform vec2 u_resolution;
        uniform float u_time;
        uniform float u_progress;
        uniform float u_knob_x;
        uniform float u_ripple_time;
        uniform float u_ripple_pos;

        // Normalized capsule distance in aspect space [0.0 .. aspect, 0.0 .. 1.0]
        float distCapsule(vec2 p, vec2 a, vec2 b) {
          vec2 pa = p - a;
          vec2 ba = b - a;
          float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
          return length(pa - ba * h);
        }

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 437.585453);
        }

        void main() {
          float aspect = u_resolution.x / u_resolution.y;
          vec2 p = vec2(v_uv.x * aspect, v_uv.y);

          // Stadium ends centered at (0.5, 0.5) and (aspect - 0.5, 0.5) with radius 0.5
          vec2 cA = vec2(0.5, 0.5);
          vec2 cB = vec2(aspect - 0.5, 0.5);
          float trackDist = distCapsule(p, cA, cB);

          if (trackDist > 0.5) {
            discard;
          }

          float borderAA = 1.0 - smoothstep(0.485, 0.5, trackDist);

          // Sky gradient mapped by height
          float h = p.y;
          vec3 nightSky = mix(vec3(0.38, 0.28, 0.60), vec3(0.46, 0.35, 0.70), h);
          vec3 sysSky   = mix(vec3(0.60, 0.38, 0.52), vec3(0.72, 0.48, 0.62), h);
          vec3 daySky   = mix(vec3(0.92, 0.48, 0.40), vec3(0.98, 0.64, 0.50), h);

          vec3 sky;
          if (u_progress <= 1.0) {
            sky = mix(nightSky, sysSky, u_progress);
          } else {
            sky = mix(sysSky, daySky, u_progress - 1.0);
          }

          vec3 col = sky;

          // Twinkling stars (Night / Twilight)
          float starAlpha = 1.0 - smoothstep(0.2, 1.1, u_progress);
          if (starAlpha > 0.01) {
            vec2 starGrid = floor(p * 20.0);
            float rnd = hash(starGrid);
            if (rnd > 0.72) {
              vec2 sPos = (starGrid + 0.5) / 20.0;
              float dStar = length(p - sPos);
              float twinkle = 0.5 + 0.5 * sin(u_time * 3.5 + rnd * 6.28);
              float sGlow = (1.0 - smoothstep(0.0, 0.022, dStar)) * twinkle * starAlpha;
              col += vec3(1.0, 1.0, 1.0) * sGlow;
            }
          }

          // Rising Sun with Concentric Glowing Rings and Rotating Animated Rays (Left mesa)
          float sunAlpha = smoothstep(0.3, 1.8, u_progress);
          if (sunAlpha > 0.01) {
            vec2 sunPos = vec2(0.80, 0.62);
            float dSun = length(p - sunPos);
            float coronaPulse = 0.012 * sin(u_time * 2.8);
            float core = 1.0 - smoothstep(0.135 + coronaPulse, 0.165 + coronaPulse, dSun);
            float ring1 = (1.0 - smoothstep(0.22, 0.26, dSun)) * 0.45;
            float ring2 = (1.0 - smoothstep(0.30, 0.35, dSun)) * 0.28;
            float ring3 = (1.0 - smoothstep(0.39, 0.45, dSun)) * 0.16;

            // Rotating solar corona rays
            float sunAngle = atan(p.y - sunPos.y, p.x - sunPos.x);
            float sunRays = 0.5 + 0.5 * sin(sunAngle * 10.0 + u_time * 0.85);
            float rayGlow = (1.0 - smoothstep(0.14, 0.44, dSun)) * sunRays * 0.28;

            vec3 sunCream = vec3(0.99, 0.90, 0.75);
            vec3 ringCol = mix(vec3(0.98, 0.76, 0.60), vec3(0.96, 0.64, 0.52), clamp(dSun / 0.45, 0.0, 1.0));
            float totalSun = clamp(core + ring1 + ring2 + ring3 + rayGlow, 0.0, 1.0);
            col = mix(col, mix(ringCol, sunCream, core), totalSun * sunAlpha);
          }

          // System Mode: Shifting Twilight Auroral Waves (Mid Position)
          float sysFactor = 1.0 - min(1.0, abs(u_progress - 1.0) * 1.6);
          if (sysFactor > 0.01) {
            float auroraWave = sin(p.x * 2.6 + sin(p.y * 3.8 + u_time * 1.4) + u_time * 1.6) * 0.5 + 0.5;
            float auroraBand = smoothstep(0.35, 0.75, p.y) * (1.0 - smoothstep(0.70, 0.95, p.y));
            vec3 auroraCol = mix(vec3(0.38, 0.78, 0.92), vec3(0.85, 0.45, 0.80), sin(p.x * 1.8 + u_time * 0.9) * 0.5 + 0.5);
            col += auroraCol * auroraWave * auroraBand * 0.38 * sysFactor;
          }

          // Crescent Moon in Upper Right (Night / Twilight)
          vec2 moonPos = vec2(2.58, 0.60);
          float dMoonOut = length(p - moonPos);
          float dMoonIn = length(p - (moonPos + vec2(-0.052, 0.042)));
          float moonOut = 1.0 - smoothstep(0.16, 0.18, dMoonOut);
          float moonIn = smoothstep(0.138, 0.174, dMoonIn);
          float crescent = moonOut * moonIn;
          float crescentAlpha = 1.0 - smoothstep(0.1, 1.2, u_progress);
          col = mix(col, vec3(1.0, 1.0, 1.0), clamp(crescent, 0.0, 1.0) * crescentAlpha * 0.95);

          // Canyon Mesas & Ridges with Multi-Layer Parallax and Heat Shimmer
          float parallax = (u_progress - 1.0) * 0.12;
          float px = p.x + parallax;
          float dayAlpha = smoothstep(1.0, 1.9, u_progress);
          float heatShimmer = sin(p.x * 14.0 + u_time * 2.8) * 0.005 * dayAlpha;

          float mesa1 = 0.33 + 0.14 * sin(px * 2.6) + 0.09 * cos(px * 5.4);
          float plateau1 = (1.0 - smoothstep(0.0, 0.3, abs(px - 1.72))) * 0.16;
          float plateau2 = (1.0 - smoothstep(0.0, 0.24, abs(px - 2.68))) * 0.18;
          float backHeight = mesa1 + plateau1 + plateau2 + heatShimmer * 0.5;

          vec3 mBackNight = vec3(0.34, 0.16, 0.49);
          vec3 mBackSys   = vec3(0.52, 0.24, 0.45);
          vec3 mBackDay   = vec3(0.76, 0.30, 0.40);
          vec3 mBackCol;
          if (u_progress <= 1.0) {
            mBackCol = mix(mBackNight, mBackSys, u_progress);
          } else {
            mBackCol = mix(mBackSys, mBackDay, u_progress - 1.0);
          }

          float duneBackAA = 1.0 - smoothstep(backHeight - 0.015, backHeight + 0.005, p.y);
          col = mix(col, mBackCol, duneBackAA);

          // Front rolling desert dunes with atmospheric heat shimmer
          float frontHeight = 0.21 + 0.09 * sin((p.x - parallax * 0.5) * 2.4 + 0.8) + 0.05 * cos(p.x * 3.8) + heatShimmer;
          vec3 mFrontNight = vec3(0.42, 0.22, 0.58);
          vec3 mFrontSys   = vec3(0.62, 0.30, 0.50);
          vec3 mFrontDay   = vec3(0.85, 0.40, 0.48);
          vec3 mFrontCol;
          if (u_progress <= 1.0) {
            mFrontCol = mix(mFrontNight, mFrontSys, u_progress);
          } else {
            mFrontCol = mix(mFrontSys, mFrontDay, u_progress - 1.0);
          }

          float duneFrontAA = 1.0 - smoothstep(frontHeight - 0.015, frontHeight + 0.005, p.y);
          col = mix(col, mFrontCol, duneFrontAA);

          // Inset Track Border Bezel
          float bezel = smoothstep(0.46, 0.50, trackDist);
          col = mix(col, col * 0.65, bezel * 0.55);

          // Interactive Energy Ripple
          float rippleElapsed = u_time - u_ripple_time;
          if (rippleElapsed >= 0.0 && rippleElapsed < 0.6) {
            float rX = (u_ripple_pos / u_resolution.x) * aspect;
            float rDist = length(p - vec2(rX, 0.5));
            float rRadius = rippleElapsed * 1.0;
            float rWave = (1.0 - smoothstep(0.0, 0.08, abs(rDist - rRadius))) * (1.0 - rippleElapsed / 0.6);
            col += vec3(0.35, 0.25, 0.45) * rWave * 0.55;
          }

          // 3D Knob (radius ~ 0.38)
          float knobXNorm = (u_knob_x / u_resolution.x) * aspect;
          vec2 knobCenter = vec2(knobXNorm, 0.5);
          float knobDist = length(p - knobCenter);
          float knobRadius = 0.38;

          float knobShadow = (1.0 - smoothstep(knobRadius, knobRadius + 0.07, knobDist)) * 0.38;
          col = mix(col, vec3(0.12, 0.08, 0.20), knobShadow);

          vec3 moonColor = vec3(0.98, 0.98, 1.0);
          vec3 sysColor  = vec3(0.98, 0.94, 0.90);
          vec3 sunColor  = vec3(0.99, 0.89, 0.73);

          vec3 baseKnob;
          if (u_progress <= 1.0) {
            baseKnob = mix(moonColor, sysColor, u_progress);
          } else {
            baseKnob = mix(sysColor, sunColor, u_progress - 1.0);
          }

          // Crater Spots on Lunar Moon (Position 0 / Night)
          float craterFactor = 1.0 - smoothstep(0.1, 0.9, u_progress);
          if (craterFactor > 0.01) {
            vec2 kp = p - knobCenter;
            float c1 = 1.0 - smoothstep(0.075, 0.095, length(kp - vec2(-0.13, 0.12)));
            float c2 = 1.0 - smoothstep(0.053, 0.071, length(kp - vec2(-0.11, -0.11)));
            float c3 = 1.0 - smoothstep(0.041, 0.059, length(kp - vec2(0.12, -0.07)));
            float c4 = 1.0 - smoothstep(0.059, 0.077, length(kp - vec2(0.09, 0.11)));
            float c5 = 1.0 - smoothstep(0.024, 0.042, length(kp - vec2(-0.01, 0.02)));
            float anyCrater = clamp(c1 + c2 + c3 + c4 + c5, 0.0, 1.0);
            vec3 craterColor = vec3(0.88, 0.89, 0.92);
            baseKnob = mix(baseKnob, craterColor, anyCrater * craterFactor * 0.75);
          }

          // Sphere 3D lighting
          float sphere3D = 1.0 - (knobDist / knobRadius) * 0.14;
          vec3 litKnob = baseKnob * sphere3D;

          // Smoothstep knob edge
          float knobAA = 1.0 - smoothstep(knobRadius - 0.02, knobRadius + 0.005, knobDist);
          col = mix(col, litKnob, knobAA);

          // Animated Knob Corona Aura in Light and System positions
          if (dayAlpha > 0.01) {
            float sunKnobHalo = (1.0 - smoothstep(knobRadius, knobRadius + 0.08 + 0.02 * sin(u_time * 3.0), knobDist)) * 0.42 * dayAlpha;
            col += vec3(1.0, 0.82, 0.50) * sunKnobHalo;
          }
          if (sysFactor > 0.01) {
            float sysKnobHalo = (1.0 - smoothstep(knobRadius, knobRadius + 0.07 + 0.015 * sin(u_time * 2.4), knobDist)) * 0.35 * sysFactor;
            col += vec3(0.85, 0.72, 0.98) * sysKnobHalo;
          }

          gl_FragColor = vec4(col * borderAA, borderAA);
        }
      `
