import { SaveIcon } from './icons'

interface ToolbarProps {
  saving: boolean
  onSave: () => void
}

/** Barra inferior: botón para guardar la imagen. */
export function Toolbar({ saving, onSave }: ToolbarProps) {
  return (
    <nav className="toolbar" aria-label="Herramientas">
      <div className="toolbar__left" />
      <div className="toolbar__right">
        <button
          id="save-button"
          type="button"
          className="ig-save-btn"
          onClick={onSave}
          disabled={saving}
          aria-busy={saving}
        >
          <SaveIcon width={18} height={18} />
          <span>{saving ? 'Preparando…' : 'Guardar'}</span>
        </button>
      </div>
    </nav>
  )
}
