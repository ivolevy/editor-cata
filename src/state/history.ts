import type { CanvasElement } from '../types'

/**
 * Historial para «Deshacer».
 *
 * - `commit`: cambio inmediato que se registra (agregar, editar texto, eliminar...).
 * - `preview`: cambio en vivo durante un gesto; NO se registra en cada movimiento del dedo.
 * - `endGesture`: al levantar los dedos, el gesto completo se registra como UNA sola acción.
 */
export interface HistoryState {
  past: CanvasElement[][]
  present: CanvasElement[]
  /** Estado previo al gesto en curso (o null si no hay gesto). */
  gestureStart: CanvasElement[] | null
}

export type HistoryAction =
  | { type: 'commit'; next: CanvasElement[] }
  | { type: 'preview'; next: CanvasElement[] }
  | { type: 'endGesture' }
  | { type: 'undo' }
  | { type: 'replace'; next: CanvasElement[] }

export const HISTORY_LIMIT = 60

export const initialHistory = (present: CanvasElement[] = []): HistoryState => ({
  past: [],
  present,
  gestureStart: null,
})

const pushPast = (past: CanvasElement[][], snapshot: CanvasElement[]) => {
  const next = [...past, snapshot]
  return next.length > HISTORY_LIMIT ? next.slice(next.length - HISTORY_LIMIT) : next
}

const sameElements = (a: CanvasElement[], b: CanvasElement[]) =>
  a.length === b.length &&
  a.every((el, i) => {
    const other = b[i]
    return (
      el.id === other.id &&
      el.content === other.content &&
      el.x === other.x &&
      el.y === other.y &&
      el.scale === other.scale &&
      el.rotation === other.rotation &&
      el.color === other.color
    )
  })

export function historyReducer(state: HistoryState, action: HistoryAction): HistoryState {
  switch (action.type) {
    case 'commit': {
      // Si había un gesto a medio terminar, se cierra primero para no perderlo.
      const base = state.gestureStart ?? state.present
      if (sameElements(base, action.next)) return { ...state, present: action.next, gestureStart: null }
      return { past: pushPast(state.past, base), present: action.next, gestureStart: null }
    }
    case 'preview':
      return {
        ...state,
        present: action.next,
        gestureStart: state.gestureStart ?? state.present,
      }
    case 'endGesture': {
      if (!state.gestureStart) return state
      if (sameElements(state.gestureStart, state.present)) return { ...state, gestureStart: null }
      return { past: pushPast(state.past, state.gestureStart), present: state.present, gestureStart: null }
    }
    case 'undo': {
      if (state.gestureStart) return state // no deshacer en medio de un gesto
      if (state.past.length === 0) return state
      const previous = state.past[state.past.length - 1]
      return { past: state.past.slice(0, -1), present: previous, gestureStart: null }
    }
    case 'replace':
      return initialHistory(action.next)
  }
}
