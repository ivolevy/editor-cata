/** Un elemento colocado sobre el lienzo. Todas las medidas están en píxeles del lienzo (1080 × 1920). */
export type ElementKind = 'text' | 'emoji'

export interface CanvasElement {
  id: string
  kind: ElementKind
  /** Contenido: el texto escrito o el emoji. Puede tener saltos de línea. */
  content: string
  /** Centro del elemento en coordenadas del lienzo. */
  x: number
  y: number
  /** Multiplicador de tamaño (1 = tamaño inicial). */
  scale: number
  /** Rotación en grados. */
  rotation: number
  /** Color del texto (los emojis lo ignoran). */
  color: string
}

export type ElementPatch = Partial<Omit<CanvasElement, 'id' | 'kind'>>
