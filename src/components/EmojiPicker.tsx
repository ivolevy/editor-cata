import { EMOJIS } from '../constants'
import { CloseIcon } from './icons'
import { Sheet } from './Sheet'

interface EmojiPickerProps {
  open:    boolean
  onClose: () => void
  onPick:  (emoji: string) => void
}

/** Selector de stickers: bottom sheet oscuro, grid desplazable. */
export function EmojiPicker({ open, onClose, onPick }: EmojiPickerProps) {
  return (
    <Sheet open={open} onClose={onClose} placement="bottom" labelledBy="emoji-title">
      <div className="sheet__header">
        <h2 id="emoji-title" className="sheet__title">
          Stickers
        </h2>
        <button
          id="emoji-close"
          type="button"
          className="ig-circle-btn"
          style={{ width: 36, height: 36 }}
          onClick={onClose}
          aria-label="Cerrar"
        >
          <CloseIcon width={17} height={17} />
        </button>
      </div>

      <div className="emoji-grid" role="list">
        {EMOJIS.map((emoji, i) => (
          <button
            key={emoji}
            id={`emoji-option-${i}`}
            type="button"
            role="listitem"
            className="emoji-grid__item"
            onClick={() => onPick(emoji)}
            aria-label={`Agregar ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </Sheet>
  )
}
