import type { CanvasElement } from '../types'
import { PencilIcon } from './icons'

interface ContextBarProps {
  selected: CanvasElement | null
  hasElements: boolean
  onEditText: () => void
}

/**
 * Franja de ayuda contextual entre el lienzo y las herramientas.
 * Tiene altura fija para que el lienzo no cambie de tamaño al elegir elementos.
 */
export function ContextBar({ selected, hasElements, onEditText }: ContextBarProps) {
  let content
  if (selected?.kind === 'text') {
    content = (
      <>
        <span className="context-bar__status">Texto elegido</span>
        <button id="edit-text-button" type="button" className="pill-button" onClick={onEditText}>
          <PencilIcon width={20} height={20} />
          <span>Editar texto</span>
        </button>
      </>
    )
  } else if (selected?.kind === 'emoji') {
    content = <span className="context-bar__hint">Emoji elegido · Usá dos dedos para agrandarlo o girarlo</span>
  } else if (hasElements) {
    content = <span className="context-bar__hint">Tocá un texto o emoji para elegirlo</span>
  } else {
    content = null
  }

  return (
    <div className="context-bar" aria-live="polite">
      {content}
    </div>
  )
}
