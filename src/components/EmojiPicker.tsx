import { useState } from 'react'
import { EMOJI_CATEGORIES } from '../emojiData'
import { CloseIcon } from './icons'
import { Sheet } from './Sheet'

interface EmojiPickerProps {
  open:    boolean
  onClose: () => void
  onPick:  (emoji: string) => void
}

/** Selector de stickers con todos los emojis del iPhone, organizados por categoría. */
export function EmojiPicker({ open, onClose, onPick }: EmojiPickerProps) {
  const [cat, setCat] = useState(0)
  const category = EMOJI_CATEGORIES[cat]

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

      <div className="emoji-tabs" role="tablist" aria-label="Categorías">
        {EMOJI_CATEGORIES.map((c, i) => (
          <button
            key={c.name}
            type="button"
            role="tab"
            aria-selected={i === cat}
            aria-label={c.name}
            className={`emoji-tabs__tab${i === cat ? ' is-active' : ''}`}
            onClick={() => setCat(i)}
          >
            {c.icon}
          </button>
        ))}
      </div>

      <div className="emoji-grid" role="list" key={category.name}>
        {category.emojis.map((emoji) => (
          <button
            key={emoji}
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
