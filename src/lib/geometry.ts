import { CANVAS_HEIGHT, CANVAS_WIDTH, MAX_SCALE, MIN_SCALE } from '../constants'

export interface Point {
  x: number
  y: number
}

export const distance = (a: Point, b: Point) => Math.hypot(b.x - a.x, b.y - a.y)

/** Ángulo en grados de la línea que une los dos dedos. */
export const angleDeg = (a: Point, b: Point) => (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI

export const midpoint = (a: Point, b: Point): Point => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 })

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export const clampScale = (scale: number) => clamp(scale, MIN_SCALE, MAX_SCALE)

/** El centro del elemento siempre queda dentro del lienzo, así nunca se pierde. */
export const clampPosition = (p: Point): Point => ({
  x: clamp(p.x, 0, CANVAS_WIDTH),
  y: clamp(p.y, 0, CANVAS_HEIGHT),
})

/** Diferencia angular más corta (evita saltos al cruzar ±180°). */
export const angleDelta = (from: number, to: number) => {
  let d = to - from
  while (d > 180) d -= 360
  while (d < -180) d += 360
  return d
}

/** Normaliza a (-180, 180]. */
export const normalizeAngle = (deg: number) => {
  let a = deg % 360
  if (a > 180) a -= 360
  if (a <= -180) a += 360
  return a
}

/**
 * «Imán» suave: si el elemento queda casi derecho (a menos de `threshold` grados de 0°, 90°, 180°...),
 * se endereza. Así es fácil dejar un texto recto después de agrandarlo.
 */
export const snapAngle = (deg: number, threshold = 4) => {
  const a = normalizeAngle(deg)
  const nearest = Math.round(a / 90) * 90
  return Math.abs(a - nearest) <= threshold ? normalizeAngle(nearest) : a
}

export interface TransformStart {
  x: number
  y: number
  scale: number
  rotation: number
}

/**
 * Calcula el nuevo estado de un elemento durante un gesto de dos dedos.
 * `p0a/p0b` son las posiciones iniciales de los dedos y `pa/pb` las actuales, en coordenadas del lienzo.
 * Mover, agrandar y girar se calculan de forma independiente, así no se interfieren.
 */
export function twoFingerTransform(
  start: TransformStart,
  p0a: Point,
  p0b: Point,
  pa: Point,
  pb: Point,
): TransformStart {
  const d0 = Math.max(distance(p0a, p0b), 1)
  const d1 = Math.max(distance(pa, pb), 1)
  const m0 = midpoint(p0a, p0b)
  const m1 = midpoint(pa, pb)
  const rotation = snapAngle(start.rotation + angleDelta(angleDeg(p0a, p0b), angleDeg(pa, pb)))
  const pos = clampPosition({ x: start.x + (m1.x - m0.x), y: start.y + (m1.y - m0.y) })
  return { x: pos.x, y: pos.y, scale: clampScale(start.scale * (d1 / d0)), rotation }
}

/** Movimiento con un dedo: el elemento sigue exactamente al dedo. */
export function oneFingerMove(start: Point, p0: Point, p: Point): Point {
  return clampPosition({ x: start.x + (p.x - p0.x), y: start.y + (p.y - p0.y) })
}
