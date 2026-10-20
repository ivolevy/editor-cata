import { memo } from 'react'
import { LINE_HEIGHT } from '../constants'
import { HIT_PADDING, elementFont } from '../lib/elementStyle'
import type { CanvasElement } from '../types'

interface ElementViewProps {
  element: CanvasElement
  selected: boolean
  /** Si se está borrando: desplazamiento hacia el tachito (en px del lienzo). */
  deleting?: { dx: number; dy: number } | null
}

/**
 * Un texto o emoji en el lienzo. Usa exactamente la misma tipografía que la exportación.
 * El contorno de selección es solo de la interfaz: la exportación dibuja desde los datos y nunca lo incluye.
 */
export const ElementView = memo(function ElementView({ element, selected, deleting }: ElementViewProps) {
  const font = elementFont(element)
  return (
    <div
      data-element-id={element.id}
      className={`canvas-el canvas-el--${element.kind}${selected ? ' is-selected' : ''}${deleting ? ' is-deleting' : ''}`}
      role="img"
      aria-label={`${element.kind === 'text' ? 'Texto' : 'Emoji'}: ${element.content}${selected ? ' (elegido)' : ''}`}
      style={{
        left: element.x,
        top: element.y,
        padding: HIT_PADDING,
        transform: `translate(-50%, -50%) rotate(${element.rotation}deg)`,
        font: font.css,
        lineHeight: LINE_HEIGHT,
        color: element.color,
        ...(deleting
          ? ({ '--dx': `${deleting.dx}px`, '--dy': `${deleting.dy}px` } as React.CSSProperties)
          : null),
      }}
    >
      {element.content}
    </div>
  )
})
