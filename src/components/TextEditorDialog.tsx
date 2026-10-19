import { useRef, useState } from 'react'
import type { RefObject } from 'react'
import { TEXT_COLORS } from '../constants'
import { CheckIcon } from './icons'
import { Sheet } from './Sheet'

interface TextEditorDialogProps {
  open: boolean
  mode: 'new' | 'edit'
  initialText: string
  initialColor: string
  onCancel: () => void
  onConfirm: (text: string, color: string) => void
}

/** Panel para escribir o corregir un texto. Va arriba de la pantalla para que el teclado no lo tape. */
export function TextEditorDialog(props: TextEditorDialogProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  return (
    <Sheet
      open={props.open}
      onClose={props.onCancel}
      placement="top"
      labelledBy="text-editor-title"
      initialFocus={textareaRef}
    >
      {/* Se monta de nuevo en cada apertura, así el contenido inicial siempre es el correcto. */}
      <TextEditorForm {...props} textareaRef={textareaRef} />
    </Sheet>
  )
}

function TextEditorForm({
  mode,
  initialText,
  initialColor,
  onCancel,
  onConfirm,
  textareaRef,
}: TextEditorDialogProps & { textareaRef: RefObject<HTMLTextAreaElement | null> }) {
  const [text, setText] = useState(initialText)
  const [color, setColor] = useState(initialColor)
  const isEmpty = text.trim().length === 0

  return (
    <form
      className="text-editor"
      onSubmit={(e) => {
        e.preventDefault()
        if (!isEmpty) onConfirm(text.replace(/\s+$/, ''), color)
      }}
    >
      <h2 id="text-editor-title" className="sheet__title">
        {mode === 'new' ? 'Escribí tu texto' : 'Editar texto'}
      </h2>

      <textarea
        ref={textareaRef}
        id="text-input"
        className="text-editor__input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder="Escribí acá…"
        aria-label="Texto"
        enterKeyHint="enter"
        autoCapitalize="sentences"
        style={{ color }}
      />

      <fieldset className="color-picker">
        <legend>Color de la letra</legend>
        <div className="color-picker__options">
          {TEXT_COLORS.map((c) => {
            const checked = c.value === color
            return (
              <label key={c.value} className={`color-option${checked ? ' is-checked' : ''}`}>
                <input
                  type="radio"
                  name="text-color"
                  value={c.value}
                  checked={checked}
                  onChange={() => setColor(c.value)}
                />
                <span className="color-option__swatch" style={{ background: c.value }}>
                  {checked && <CheckIcon width={18} height={18} strokeWidth={3} />}
                </span>
                <span className="color-option__name">{c.name}</span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <div className="sheet__actions">
        <button id="text-cancel" type="button" className="big-button big-button--secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button id="text-confirm" type="submit" className="big-button big-button--primary" disabled={isEmpty}>
          <CheckIcon width={22} height={22} />
          {mode === 'new' ? 'Agregar' : 'Listo'}
        </button>
      </div>
    </form>
  )
}
