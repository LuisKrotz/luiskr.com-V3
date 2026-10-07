/**
 * @file tokens/playground/music.js
 * @description Ambient soundtrack for the Earth Playground — OGG first
 * (smaller), MP3 fallback for browsers without Vorbis; TITLE is what the
 * toggle button's tooltip announces.
 * @type {Readonly<Record<string, string>>}
 */

/**
 * Ambient soundtrack for the Earth Playground. Sole declaration site — consumers import members
 * from this frozen map rather than re-declaring the literals
 * (zero-hardcoding rule).
 */
export const SP_MUSIC = Object.freeze({
  OGG: '/music/Christopher_Tin_feat._Soweto_Gospel_Choir_-_Baba_Yetu.ogg',
  MP3: '/music/Christopher_Tin_feat._Soweto_Gospel_Choir_-_Baba_Yetu.mp3',
  TITLE: 'Baba Yetu — Christopher Tin ft. Soweto Gospel Choir',
})
