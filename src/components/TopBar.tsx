import { DotsIcon, UndoIcon } from './icons'

interface TopBarProps {
  canUndo: boolean
  onUndo:  () => void
  onHelp:  () => void
  onText:  () => void
  onEmoji: () => void
}

/**
 * Barra superior en estilo IG Stories: flota sobre el lienzo con un
 * gradiente descendente.
 * Izquierda → Deshacer   Centro → Aa + 😊   Derecha → ⋯ (ayuda)
 */
export function TopBar({ canUndo, onUndo, onHelp, onText, onEmoji }: TopBarProps) {
  return (
    <header className="topbar">

      {/* Izquierda: deshacer */}
      <div className="topbar__left">
        <button
          id="undo-button"
          data-tour="undo"
          type="button"
          className="ig-circle-btn"
          onClick={onUndo}
          disabled={!canUndo}
          aria-label="Deshacer"
        >
          <UndoIcon width={19} height={19} />
        </button>
      </div>

      {/* Centro: herramientas de texto y stickers */}
      <div className="topbar__center">
        <button
          id="text-button"
          data-tour="text"
          type="button"
          className="ig-aa-btn"
          onClick={onText}
          aria-label="Agregar texto"
        >
          Aa
        </button>

        <button
          id="emoji-button"
          data-tour="emoji"
          type="button"
          className="ig-sticker-btn"
          onClick={onEmoji}
          aria-label="Agregar sticker"
        >
          {/* Cara con guiño estilo sticker */}
          😊
        </button>
      </div>

      {/* Derecha: más opciones / ayuda */}
      <div className="topbar__right">
        <button
          id="help-button"
          type="button"
          className="ig-circle-btn"
          onClick={onHelp}
          aria-label="Ayuda"
        >
          <DotsIcon width={20} height={20} />
        </button>
      </div>

    </header>
  )
}
