/** Tamaño real de la imagen exportada (vertical 9:16). */
export const CANVAS_WIDTH = 1080
export const CANVAS_HEIGHT = 1920

/** Color de fondo del lienzo — blanco. */
export const CANVAS_BACKGROUND = '#ffffff'

/** Tamaño base de la letra en píxeles del lienzo. */
export const TEXT_BASE_SIZE = 96
export const EMOJI_BASE_SIZE = 240
export const LINE_HEIGHT = 1.2
export const TEXT_WEIGHT = 800

export const MIN_SCALE = 0.25
export const MAX_SCALE = 8

/**
 * Tipografías: se usan igual en pantalla y al exportar.
 * Sistema nativo para que coincida con lo que el usuario ve.
 */
export const TEXT_FONT_FAMILY =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", "Segoe UI", Roboto, Arial, sans-serif'
export const EMOJI_FONT_FAMILY =
  '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Segoe UI Symbol", sans-serif'

/**
 * Colores IG-style: vibrantes, pensados para verse sobre fondos oscuros.
 * El primero (blanco) es el predeterminado.
 */
export const TEXT_COLORS: { name: string; value: string }[] = [
  { name: 'Negro',    value: '#1C1C1E' },
  { name: 'Blanco',   value: '#FFFFFF' },
  { name: 'Rosa',     value: '#FF69A0' },
  { name: 'Rojo',     value: '#FF375F' },
  { name: 'Naranja',  value: '#FF9500' },
  { name: 'Amarillo', value: '#FFD60A' },
  { name: 'Lima',     value: '#32D74B' },
  { name: 'Menta',    value: '#00C7BE' },
  { name: 'Celeste',  value: '#64D2FF' },
  { name: 'Azul',     value: '#0A84FF' },
  { name: 'Violeta',  value: '#BF5AF2' },
  { name: 'Magenta',  value: '#FF2D55' },
]

export const DEFAULT_TEXT_COLOR = TEXT_COLORS[0].value  // Blanco

/** Emojis frecuentes. */
export const EMOJIS: string[] = [
  '❤️', '🔥', '✨', '💫', '🌟', '⭐',
  '😀', '😂', '🥰', '😍', '😊', '🤩',
  '😘', '🤗', '😎', '🥳', '😢', '😮',
  '👍', '👏', '🙏', '👋', '💪', '🙌',
  '🎉', '🎂', '🎁', '🎈', '🌹', '💐',
  '🌸', '🌻', '🌺', '🍀', '☀️', '🌈',
  '🐶', '🐱', '🦋', '🌊', '🏔️', '🌙',
  '💙', '💚', '💛', '🧡', '💜', '🤍',
]
