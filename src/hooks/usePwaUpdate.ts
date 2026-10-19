import { useEffect, useRef } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

/** Cada cuánto se consulta si hay una versión nueva publicada. */
const CHECK_INTERVAL_MS = 30 * 60 * 1000
const SAFE_CHECK_MS = 2000

interface Options {
  /** true cuando NO hay nada que se pueda perder ni una acción en curso. */
  isIdle: () => boolean
  /** true cuando el lienzo está vacío. */
  isEmpty: () => boolean
  /** Guarda el trabajo actual para recuperarlo después de recargar. */
  saveWork: () => void
}

/**
 * Actualizaciones automáticas y seguras:
 * 1. Se detecta la versión nueva y se descarga completa en segundo plano (sin mezclar archivos).
 * 2. Se aplica solamente en un momento seguro:
 *    - cuando la app queda en segundo plano (la persona cambió de app), o
 *    - cuando el lienzo está vacío y no hay ninguna acción en curso.
 * 3. Antes de recargar se guarda el trabajo, que se recupera al volver.
 */
export function usePwaUpdate({ isIdle, isEmpty, saveWork }: Options) {
  const optsRef = useRef({ isIdle, isEmpty, saveWork })
  useEffect(() => {
    optsRef.current = { isIdle, isEmpty, saveWork }
  })
  const applying = useRef(false)

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      if (!registration) return
      const check = () => {
        if (navigator.onLine) registration.update().catch(() => {})
      }
      setInterval(check, CHECK_INTERVAL_MS)
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') check()
      })
    },
  })

  useEffect(() => {
    if (!needRefresh) return
    const apply = () => {
      if (applying.current) return
      applying.current = true
      optsRef.current.saveWork()
      void updateServiceWorker(true)
    }
    const onVisibility = () => {
      if (document.visibilityState === 'hidden' && optsRef.current.isIdle()) apply()
    }
    const timer = setInterval(() => {
      const o = optsRef.current
      if (o.isEmpty() && o.isIdle()) apply()
    }, SAFE_CHECK_MS)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [needRefresh, updateServiceWorker])
}
