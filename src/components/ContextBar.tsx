import type { CanvasElement } from '../types'
import { PencilIcon } from './icons'

interface ContextBarProps {
  selected:    CanvasElement | null
  hasElements: boolean
  onEditText:  () => void
}

/**
 * Franja contextual flotante (position: absolute en el CSS).
 * Tiene altura fija para que el lienzo no cambie al elegir elementos.
 */
export function ContextBar({ selected, hasElements, onEditText }: ContextBarProps) {
  if (selected?.kind === 'text') {
    return (
      <div className="context-bar" aria-live="polite">
        <span className="context-bar__status">Texto</span>
        <button
          id="edit-text-button"
          type="button"
          className="ig-edit-text-btn"
          onClick={onEditText}
        >
          <PencilIcon width={14} height={14} />
          Editar
        </button>
      </div>
    )
  }

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
