import {
  EMOJI_BASE_SIZE,
  EMOJI_FONT_FAMILY,
  TEXT_BASE_SIZE,
  TEXT_FONT_FAMILY,
  TEXT_WEIGHT,
} from '../constants'
import type { CanvasElement } from '../types'

/**
 * Estilo tipográfico de un elemento. Lo usan TANTO la vista en pantalla como la exportación,
 * para que la imagen guardada sea idéntica a lo que se ve.
 */
export function elementFont(el: Pick<CanvasElement, 'kind' | 'scale'>) {
  const isText = el.kind === 'text'
  const size = (isText ? TEXT_BASE_SIZE : EMOJI_BASE_SIZE) * el.scale
  const family = isText ? TEXT_FONT_FAMILY : EMOJI_FONT_FAMILY
  const weight = isText ? TEXT_WEIGHT : 400
  return { size, family, weight, css: `${weight} ${size}px ${family}` }
}

/** Divide el contenido en líneas respetando los saltos de línea escritos por la persona. */
export const splitLines = (content: string) => content.replace(/\r\n?/g, '\n').split('\n')

/** Espacio extra alrededor de cada elemento para que sea fácil de tocar (en píxeles del lienzo). */
export const HIT_PADDING = 28
