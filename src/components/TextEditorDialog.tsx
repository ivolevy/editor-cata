import { useRef, useState } from 'react'
import type { RefObject } from 'react'
import { TEXT_COLORS } from '../constants'
import { CheckIcon } from './icons'

interface TextEditorDialogProps {
  open:         boolean
  mode:         'new' | 'edit'
  initialText:  string
  initialColor: string
  onCancel:     () => void
  onConfirm:    (text: string, color: string) => void
}

/**
 * Editor de texto estilo IG Stories: overlay a pantalla completa,
 * área de texto grande y centrada, selector de color horizontal en la parte superior.
 */
export function TextEditorDialog(props: TextEditorDialogProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  if (!props.open) return null
  // Se monta de nuevo en cada apertura, así el contenido inicial es siempre correcto.
  return <TextEditorForm {...props} textareaRef={textareaRef} />
}

function TextEditorForm({
  mode,
  initialText,
  initialColor,
  onCancel,
  onConfirm,
  textareaRef,
}: TextEditorDialogProps & { textareaRef: RefObject<HTMLTextAreaElement | null> }) {
  const [text,  setText]  = useState(initialText)
  const [color, setColor] = useState(initialColor)
  const isEmpty = text.trim().length === 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isEmpty) onConfirm(text.replace(/\s+$/, ''), color)
  }

  return (
    <div
      className="text-editor-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={mode === 'new' ? 'Agregar texto' : 'Editar texto'}
    >
      <form
        style={{ display: 'contents' }}
        onSubmit={handleSubmit}
      >
        {/* ── Top bar: Cancelar · Listo ─────────────────────────────── */}
        <div className="text-editor-topbar">
          <button
            id="text-cancel"
            type="button"
            className="text-editor-cancel"
            onClick={onCancel}
          >
            Cancelar
          </button>

          <button
            id="text-confirm"
            type="submit"
            className="text-editor-done"
            disabled={isEmpty}
          >
            Listo
          </button>
        </div>

        {/* ── Color picker: puntos horizontales desplazables ─────────── */}
        <div
          className="text-editor-colors"
          role="radiogroup"
          aria-label="Color del texto"
        >
          {TEXT_COLORS.map((c) => {
            const selected = c.value === color
            return (
              <button
                key={c.value}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={c.name}
                className={`color-dot${selected ? ' is-selected' : ''}${c.value === '#FFFFFF' ? ' color-dot--white' : ''}`}
                style={{ background: c.value }}
                onClick={() => setColor(c.value)}
              >
                {selected && (
                  <CheckIcon
                    width={14}
                    height={14}
                    style={{ color: c.value === '#FFFFFF' ? '#000' : '#fff' }}
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* ── Texto central ─────────────────────────────────────────── */}
        <div className="text-editor-body">
          <textarea
            ref={textareaRef}
            id="text-input"
            className="text-editor__input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="Escribí tu texto…"
            aria-label="Texto"
            enterKeyHint="done"
            autoCapitalize="sentences"
            autoFocus
            style={{ color }}
          />
        </div>
      </form>
    </div>
  )
}
