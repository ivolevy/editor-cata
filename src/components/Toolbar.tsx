import { SaveIcon, TrashIcon } from './icons'

interface ToolbarProps {
  hasSelection: boolean
  saving:       boolean
  onDelete:     () => void
  onSave:       () => void
}

/**
 * Barra inferior IG Stories: flota con gradiente ascendente.
 * Izquierda → Eliminar (solo con elemento seleccionado)
 * Derecha   → Guardar imagen (pill blanco con flecha)
 */
export function Toolbar({ hasSelection, saving, onDelete, onSave }: ToolbarProps) {
  return (
    <nav className="toolbar" aria-label="Herramientas">

      {/* Izquierda: eliminar (solo visible con selección) */}
      <div className="toolbar__left">
        {hasSelection && (
          <button
            id="delete-button"
            type="button"
            className="ig-delete-btn"
            onClick={onDelete}
            aria-label="Eliminar elemento"
          >
            <TrashIcon width={20} height={20} />
          </button>
        )}
      </div>

      {/* Derecha: guardar */}
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
