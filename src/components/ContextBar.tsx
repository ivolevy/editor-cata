import type { CanvasElement } from '../types'

interface ContextBarProps {
  selected:    CanvasElement | null
  hasElements: boolean
}

/**
 * Franja contextual flotante (position: absolute en el CSS).
 * Tiene altura fija para que el lienzo no cambie al elegir elementos.
 */
export function ContextBar({ selected, hasElements }: ContextBarProps) {
  if (selected?.kind === 'emoji') {
    return (
      <div className="context-bar" aria-live="polite">
        <span className="context-bar__hint">Dos dedos para girar o agrandar</span>
      </div>
    )
  }

  if (hasElements) {
    return (
      <div className="context-bar" aria-live="polite">
        <span className="context-bar__hint">Tocá para seleccionar</span>
      </div>
    )
  }

  return <div className="context-bar" aria-live="polite" />
}
