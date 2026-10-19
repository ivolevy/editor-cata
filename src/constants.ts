/** Tamaño real de la imagen exportada (vertical 9:16). */
export const CANVAS_WIDTH = 1080
export const CANVAS_HEIGHT = 1920
export const CANVAS_BACKGROUND = '#FFFFFF'

/** Tamaño base de la letra en píxeles del lienzo. */
export const TEXT_BASE_SIZE = 96
export const EMOJI_BASE_SIZE = 240
export const LINE_HEIGHT = 1.2
export const TEXT_WEIGHT = 700

export const MIN_SCALE = 0.25
export const MAX_SCALE = 8

/** Familias tipográficas. Se usan iguales en pantalla y al exportar. */
export const TEXT_FONT_FAMILY =
  '"Inter Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'
export const EMOJI_FONT_FAMILY =
  '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Segoe UI Symbol", sans-serif'

/** Pocos colores, todos con buen contraste sobre blanco. Cada uno tiene nombre para no depender del color. */
export const TEXT_COLORS: { name: string; value: string }[] = [
  { name: 'Negro', value: '#1C1C1E' },
  { name: 'Azul', value: '#1F4E8C' },
  { name: 'Rojo', value: '#B42318' },
  { name: 'Verde', value: '#1E6B3F' },
  { name: 'Violeta', value: '#5B3E96' },
  { name: 'Marrón', value: '#8A4B12' },
]
export const DEFAULT_TEXT_COLOR = TEXT_COLORS[0].value

/** Emojis frecuentes. Se eligieron emojis antiguos para que se vean bien en teléfonos viejos. */
export const EMOJIS: string[] = [
  '❤️', '😀', '😂', '🥰', '😍', '😊',
  '😘', '🤗', '😎', '🥳', '😢', '😮',
  '👍', '👏', '🙏', '👋', '💪', '🙌',
  '🎉', '🎂', '🎁', '🎈', '🌹', '💐',
  '🌸', '🌻', '🌺', '🍀', '☀️', '🌈',
  '⭐', '✨', '☕', '🍰', '🐶', '🐱',
  '🏠', '⚽', '🎶', '📷', '👵', '👴',
  '💙', '💚', '💛', '🧡', '💜', '🤍',
]
