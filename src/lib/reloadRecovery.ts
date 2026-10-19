import type { CanvasElement } from '../types'

/**
 * Guardado TEMPORAL solo para sobrevivir a la recarga de una actualización.
 * Usa sessionStorage (se borra al cerrar la app) y se elimina apenas se recupera.
 * No es un sistema de proyectos guardados.
 */
const KEY = 'mi-imagen:recuperar'

interface Snapshot {
  present: CanvasElement[]
  past: CanvasElement[][]
}

export function saveForReload(snapshot: Snapshot) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(snapshot))
  } catch {
    // sin espacio o sin permiso: no se puede guardar
  }
}

export function takeSavedWork(): Snapshot | null {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) return null
    sessionStorage.removeItem(KEY)
    const data = JSON.parse(raw) as Snapshot
    if (!Array.isArray(data.present) || !Array.isArray(data.past)) return null
    return data
  } catch {
    return null
  }
}
