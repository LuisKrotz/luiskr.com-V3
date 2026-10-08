/**
 * @file tokens/classes/skeleton.js
 * @description Skeleton/shimmer placeholder class tokens — grouped subset of
 * CLASSES importable without pulling the full registry.
 */

import { _B_SKELETON, _B_SKELETON_ABOUT, _B_SKELETON_ABOUT_P, _B_SKELETON_FOOTER } from '../base.js'

/**
 * Frozen skeleton class-name map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const SKELETON_CLASSES = Object.freeze({
  SKELETON: _B_SKELETON,
  SKELETON_SHIMMER: `${_B_SKELETON}--shimmer`,
  SKELETON_LAYER: `${_B_SKELETON}-layer`,
  SKELETON_LAYER_RESOLVING: `${_B_SKELETON}-layer--resolving`,
  SKELETON_CONTENT_IN: `${_B_SKELETON}-content-in`,
  HAS_SKELETON_LAYER: `has-${_B_SKELETON}-layer`,
  SKELETON_MEDIA: `${_B_SKELETON}--media`,
  SKELETON_ROUND: `${_B_SKELETON}--round`,
  SKELETON_BLOCK: `${_B_SKELETON}--block`,
  SKELETON_TITLE_SM: `${_B_SKELETON}--title-sm`,
  SKELETON_TITLE_MD: `${_B_SKELETON}--title-md`,
  SKELETON_SECTION_TITLE: `${_B_SKELETON}--section-title`,
  SKELETON_PARA_FULL: `${_B_SKELETON}--para-full`,
  SKELETON_PARA_94: `${_B_SKELETON}--para-94`,
  SKELETON_PARA_98: `${_B_SKELETON}--para-98`,
  SKELETON_PARA_65: `${_B_SKELETON}--para-65`,
  SKELETON_BADGE: `${_B_SKELETON}--badge`,
  SKELETON_ABOUT_TITLE: `${_B_SKELETON_ABOUT}-title`,
  SKELETON_ABOUT_P1: `${_B_SKELETON_ABOUT_P}1`,
  SKELETON_ABOUT_P2: `${_B_SKELETON_ABOUT_P}2`,
  SKELETON_ABOUT_P3: `${_B_SKELETON_ABOUT_P}3`,
  SKELETON_ABOUT_P4: `${_B_SKELETON_ABOUT_P}4`,
  SKELETON_ABOUT_P5: `${_B_SKELETON_ABOUT_P}5`,
  SKELETON_FOOTER_LINK: `${_B_SKELETON_FOOTER}-link`,
  SKELETON_FOOTER_NOTE_1: `${_B_SKELETON_FOOTER}-note-1`,
  SKELETON_FOOTER_NOTE_2: `${_B_SKELETON_FOOTER}-note-2`,
})
