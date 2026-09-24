/**
 * @file @core/tokens/layout.js
 * @description Layout constants, Fibonacci spacing scale, and animation timings.
 */

export const LAYOUT = Object.freeze({
  FEAT_MULT: 0.48,
  COMP_MULTS: Object.freeze([0.56, 0.58, 0.54, 0.57, 0.55]),
  GAP: 16,
})

export const SECTIONS = Object.freeze({
  HOME: 'home',
  ABOUT: 'about',
  CONTACT: 'contact',
})

export const CAROUSEL = Object.freeze({
  AUTOPLAY_DURATION: 5000,
  CIRCUMFERENCE: 2 * Math.PI * 19,
  MOBILE_BREAKPOINT: 768,
  SWIPE_THRESHOLD: 40,
  TELEPORT_DELAY: 420,
})

export const ANIMATION = Object.freeze({
  EASING: 'cubic-bezier(0.22, 1, 0.36, 1)',
  PAGE_EASING: 'cubic-bezier(0.16, 1, 0.3, 1)',
  ROUTE_DURATION: 450,
  MOSAIC_DURATION: 420,
  CAROUSEL_FADE_DURATION: 800,
})

export const SPACE = Object.freeze({
  NONE: 0,
  HAIRLINE: 1,
  PIXEL: 1,
  '2XS': 2,
  XS: 3,
  SM: 5,
  MD: 8,
  LG: 13,
  XL: 21,
  '2XL': 34,
  '3XL': 55,
  '4XL': 89,
  '5XL': 144,
  '6XL': 233,
  '7XL': 377,
  '8XL': 610,
  '9XL': 987,
  '10XL': 1597,
})

export const BREAKPOINTS = Object.freeze({
  '272': 272,
  '320': 320,
  '375': 375,
  '414': 414,
  '540': 540,
  '768': 768,
  '960': 960,
  '1024': 1024,
  '1280': 1280,
  '1360': 1360,
  '1440': 1440,
  '1560': 1560,
  '1680': 1680,
  '1920': 1920,
  '2100': 2100,
  '2560': 2560,
  '3840': 3840,
})

export const GRID_GAP = Object.freeze({
  '272': 13,
  '320': 21,
  '375': 21,
  '414': 21,
  '540': 34,
  '768': 55,
  '960': 55,
  '1024': 89,
  '1280': 89,
  '1440': 89,
  '1680': 144,
  '1920': 144,
  '2560': 233,
  '3840': 377,
})

export const MOSAIC_COLS = Object.freeze({
  '0': 1,
  '540': 2,
  '960': 3,
  '1280': 4,
  '1680': 5,
  '1920': 6,
  '2560': 7,
})
