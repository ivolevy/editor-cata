import { HelpIcon, UndoIcon } from './icons'

interface TopBarProps {
  canUndo: boolean
  onUndo: () => void
  onHelp: () => void
}

export function TopBar({ canUndo, onUndo, onHelp }: TopBarProps) {
  return (
    <header className="topbar">
      <button
        id="undo-button"
        data-tour="undo"
        type="button"
        className="chip-button"
        onClick={onUndo}
        disabled={!canUndo}
      >
        <UndoIcon width={22} height={22} />
        <span>Deshacer</span>
      </button>

      <h1 className="topbar__title">Mi imagen</h1>

      <button id="help-button" type="button" className="chip-button chip-button--help" onClick={onHelp}>
        <HelpIcon width={22} height={22} />
        <span>¿Cómo se usa?</span>
      </button>
    </header>
  )
}
