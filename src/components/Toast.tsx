import { useEffect } from 'react'

export interface ToastMessage {
  id: number
  text: string
  tone: 'success' | 'error' | 'info'
}

interface ToastProps {
  message: ToastMessage | null
  onDone: () => void
}

/** Aviso breve y claro. Se anuncia a lectores de pantalla y desaparece solo. */
export function Toast({ message, onDone }: ToastProps) {
  useEffect(() => {
    if (!message) return
    const ms = message.tone === 'error' ? 6000 : 4500
    const t = setTimeout(onDone, ms)
    return () => clearTimeout(t)
  }, [message, onDone])

  return (
    <div className="toast-region" role="status" aria-live="polite">
      {message && (
        <div key={message.id} className={`toast toast--${message.tone}`} onClick={onDone}>
          {message.text}
        </div>
      )}
    </div>
  )
}
