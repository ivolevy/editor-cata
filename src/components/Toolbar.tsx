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
          className="ig-save-btn ig-save-btn--icon"
          aria-label="Guardar imagen"
          onClick={onSave}
          disabled={saving}
          aria-busy={saving}
        >
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor"
            strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 4v12M6 11l6 6 6-6" />
          </svg>
        </button>
      </div>
    </nav>
  )
}
