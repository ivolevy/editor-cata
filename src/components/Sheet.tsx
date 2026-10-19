import { useEffect, useLayoutEffect, useRef } from 'react'
import type { ReactNode, RefObject } from 'react'

interface SheetProps {
  open: boolean
  onClose: () => void
  /** Ubicación del panel: arriba (para escribir, así el teclado no lo tapa), abajo o centrado. */
  placement: 'top' | 'bottom' | 'center'
  labelledBy: string
  className?: string
  /** Elemento que recibe el foco al abrir (por ejemplo, el cuadro de texto). */
  initialFocus?: RefObject<HTMLElement | null>
  children: ReactNode
}

/**
 * Panel superpuesto basado en <dialog> nativo: bloquea el fondo, maneja el foco,
 * se cierra con «Escape» o tocando afuera. Nunca reemplaza al editor.
 */
export function Sheet({
  open,
  onClose,
  placement,
  labelledBy,
  className = '',
  initialFocus,
  children,
}: SheetProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  // useLayoutEffect: se abre en el mismo toque, así iOS permite mostrar el teclado.
  useLayoutEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      initialFocus?.current?.focus()
    }
    if (!open && dialog.open) dialog.close()
  }, [open, initialFocus])

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    const onCancel = (e: Event) => {
      e.preventDefault()
      onCloseRef.current()
    }
    dialog.addEventListener('cancel', onCancel)
    return () => dialog.removeEventListener('cancel', onCancel)
  }, [])

  return (
    <dialog
      ref={ref}
      className={`sheet sheet--${placement} ${className}`}
      aria-labelledby={labelledBy}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {open && <div className="sheet__body">{children}</div>}
    </dialog>
  )
}
