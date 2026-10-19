import { SaveIcon, SmileIcon, TextIcon, TrashIcon } from './icons'

interface ToolbarProps {
  hasSelection: boolean
  saving: boolean
  onText: () => void
  onEmoji: () => void
  onDelete: () => void
  onSave: () => void
}

/** Barra inferior. «Eliminar» aparece solo con un elemento elegido, siempre en el mismo lugar. */
export function Toolbar({ hasSelection, saving, onText, onEmoji, onDelete, onSave }: ToolbarProps) {
  return (
    <nav className="toolbar" aria-label="Herramientas">
      <button id="text-button" data-tour="text" type="button" className="tool-button" onClick={onText}>
        <TextIcon />
        <span>Texto</span>
      </button>

      <button id="emoji-button" data-tour="emoji" type="button" className="tool-button" onClick={onEmoji}>
        <SmileIcon />
        <span>Emoji</span>
      </button>

      <div className="toolbar__slot">
        {hasSelection && (
          <button id="delete-button" type="button" className="tool-button tool-button--danger" onClick={onDelete}>
            <TrashIcon />
            <span>Eliminar</span>
          </button>
        )}
      </div>

      <button
        id="save-button"
        data-tour="save"
        type="button"
        className="tool-button tool-button--primary"
        onClick={onSave}
        disabled={saving}
        aria-busy={saving}
      >
        <SaveIcon />
        <span>{saving ? 'Preparando…' : 'Guardar imagen'}</span>
      </button>
    </nav>
  )
}
