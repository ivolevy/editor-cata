import { useCallback, useEffect, useRef } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import type { CanvasElement } from '../types'
import { distance, oneFingerMove, twoFingerTransform } from '../lib/geometry'
import type { Point, TransformStart } from '../lib/geometry'

/** Distancia mínima (en píxeles de pantalla) para considerar que el dedo se movió y no fue un toque. */
const TAP_SLOP_PX = 6
const DOUBLE_TAP_MS = 350

interface Options {
  elements: CanvasElement[]
  selectedId: string | null
  /** Píxeles de pantalla por cada píxel del lienzo. */
  scale: number
  onSelect: (id: string | null) => void
  onPreview: (next: CanvasElement[]) => void
  onGestureEnd: () => void
  onDoubleTapText: (id: string) => void
}

interface Session {
  targetId: string | null
  start: TransformStart | null
  /** Posiciones de los dedos al comenzar el tramo actual del gesto (coordenadas del lienzo). */
  base: Map<number, Point>
  moved: boolean
  tapId: string | null
  tapScreen: Point | null
}

/**
 * Gestos táctiles estilo «historias de Instagram» con Pointer Events:
 * - un dedo sobre un elemento: lo elige y lo mueve;
 * - dos dedos: agrandan, achican y giran el elemento elegido (en cualquier parte del lienzo);
 * - tocar el fondo: deja de elegir.
 * Todo el gesto se registra como una sola acción para «Deshacer».
 */
export function useCanvasGestures(opts: Options) {
  const optsRef = useRef(opts)
  useEffect(() => {
    optsRef.current = opts
  })

  const frameRef = useRef<HTMLDivElement>(null)
  const pointers = useRef(new Map<number, Point>())
  const session = useRef<Session | null>(null)
  const lastTap = useRef<{ id: string; time: number } | null>(null)
  const rafId = useRef<number | null>(null)

  const toCanvas = useCallback((clientX: number, clientY: number): Point => {
    const rect = frameRef.current!.getBoundingClientRect()
    const s = optsRef.current.scale
    return { x: (clientX - rect.left) / s, y: (clientY - rect.top) / s }
  }, [])

  /** Reinicia el punto de partida cuando cambia la cantidad de dedos, para evitar saltos. */
  const rebase = useCallback(() => {
    const s = session.current
    if (!s) return
    s.base = new Map(Array.from(pointers.current.entries()).slice(0, 2))
    const el = optsRef.current.elements.find((e) => e.id === s.targetId)
    s.start = el ? { x: el.x, y: el.y, scale: el.scale, rotation: el.rotation } : null
  }, [])

  const applyFrame = useCallback(() => {
    rafId.current = null
    const s = session.current
    if (!s || !s.targetId || !s.start) return
    const ids = Array.from(s.base.keys())
    let next: TransformStart | null = null
    if (ids.length >= 2 && pointers.current.size >= 2) {
      const [a, b] = ids
      const pa = pointers.current.get(a)
      const pb = pointers.current.get(b)
      if (!pa || !pb) return
      next = twoFingerTransform(s.start, s.base.get(a)!, s.base.get(b)!, pa, pb)
    } else if (ids.length === 1) {
      const p = pointers.current.get(ids[0])
      if (!p) return
      const pos = oneFingerMove(s.start, s.base.get(ids[0])!, p)
      next = { ...s.start, ...pos }
    }
    if (!next) return
    const { elements, onPreview } = optsRef.current
    const values = next
    onPreview(elements.map((el) => (el.id === s.targetId ? { ...el, ...values } : el)))
  }, [])

  const flush = useCallback(() => {
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current)
      applyFrame()
    }
  }, [applyFrame])

  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      if (pointers.current.size >= 2) return // se ignoran dedos extra
      e.preventDefault()
      e.currentTarget.setPointerCapture?.(e.pointerId)
      flush()
      pointers.current.set(e.pointerId, toCanvas(e.clientX, e.clientY))

      if (pointers.current.size === 1) {
        const hit = (e.target as Element).closest<HTMLElement>('[data-element-id]')
        const hitId = hit?.dataset.elementId ?? null
        if (hitId) optsRef.current.onSelect(hitId)
        session.current = {
          targetId: hitId,
          start: null,
          base: new Map(),
          moved: false,
          tapId: hitId,
          tapScreen: { x: e.clientX, y: e.clientY },
        }
      } else if (session.current) {
        // Segundo dedo: se trabaja sobre el elemento ya elegido.
        session.current.targetId = session.current.targetId ?? optsRef.current.selectedId
        session.current.moved = true
      }
      rebase()
    },
    [flush, rebase, toCanvas],
  )

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!pointers.current.has(e.pointerId)) return
      const s = session.current
      pointers.current.set(e.pointerId, toCanvas(e.clientX, e.clientY))
      if (!s) return
      if (!s.moved && s.tapScreen) {
        if (distance(s.tapScreen, { x: e.clientX, y: e.clientY }) < TAP_SLOP_PX) return
        s.moved = true
      }
      if (rafId.current === null) rafId.current = requestAnimationFrame(applyFrame)
    },
    [applyFrame, toCanvas],
  )

  const endPointer = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!pointers.current.has(e.pointerId)) return
      flush()
      pointers.current.delete(e.pointerId)
      const s = session.current
      if (!s) return

      if (pointers.current.size > 0) {
        rebase() // queda un dedo: sigue moviendo sin saltos
        return
      }

      const cancelled = e.type === 'pointercancel'
      if (!s.moved && !cancelled) {
        const o = optsRef.current
        if (!s.tapId) {
          o.onSelect(null)
        } else {
          const now = performance.now()
          const prev = lastTap.current
          const el = o.elements.find((x) => x.id === s.tapId)
          if (prev && prev.id === s.tapId && now - prev.time < DOUBLE_TAP_MS && el?.kind === 'text') {
            lastTap.current = null
            o.onDoubleTapText(s.tapId)
          } else {
            lastTap.current = { id: s.tapId, time: now }
          }
        }
      }
      session.current = null
      optsRef.current.onGestureEnd()
    },
    [flush, rebase],
  )

  useEffect(
    () => () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current)
    },
    [],
  )

  /** Indica si hay dedos apoyados sobre el lienzo (para no interrumpir con actualizaciones). */
  const isInteracting = useCallback(() => pointers.current.size > 0, [])

  return {
    frameRef,
    isInteracting,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endPointer,
      onPointerCancel: endPointer,
    },
  }
}
