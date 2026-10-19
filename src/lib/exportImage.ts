import { CANVAS_BACKGROUND, CANVAS_HEIGHT, CANVAS_WIDTH, LINE_HEIGHT, TEXT_WEIGHT } from '../constants'
import type { CanvasElement } from '../types'
import { elementFont, splitLines } from './elementStyle'

/** Espera a que la tipografía esté disponible para que el texto exportado no cambie de letra. */
async function ensureFontsReady(elements: CanvasElement[]) {
  if (!('fonts' in document)) return
  const loads = elements
    .filter((el) => el.kind === 'text')
    .slice(0, 1)
    .map(() => document.fonts.load(`${TEXT_WEIGHT} 96px "Inter Variable"`, 'Aa'))
  try {
    await Promise.all(loads)
    await document.fonts.ready
  } catch {
    // Si falla, se usa la letra del sistema: la imagen igual se genera.
  }
}

/**
 * Dibuja un elemento centrado en el origen. La posición vertical de cada línea replica
 * cómo el navegador ubica el texto dentro de un renglón con `line-height`.
 */
function drawElement(ctx: CanvasRenderingContext2D, el: CanvasElement) {
  const font = elementFont(el)
  const lines = splitLines(el.content)
  const lineHeight = font.size * LINE_HEIGHT

  ctx.save()
  ctx.translate(el.x, el.y)
  ctx.rotate((el.rotation * Math.PI) / 180)
  ctx.font = font.css
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = el.color

  const metrics = ctx.measureText('Hg')
  const ascent = metrics.fontBoundingBoxAscent ?? font.size * 0.8
  const descent = metrics.fontBoundingBoxDescent ?? font.size * 0.2
  const totalHeight = lineHeight * lines.length
  const top = -totalHeight / 2

  lines.forEach((line, i) => {
    const lineTop = top + i * lineHeight
    const baseline = lineTop + (lineHeight - (ascent + descent)) / 2 + ascent
    ctx.fillText(line, 0, baseline)
  })
  ctx.restore()
}

/** Dibuja la imagen completa en un canvas propio, sin ningún control de la interfaz. */
export function renderToCanvas(elements: CanvasElement[], canvas: HTMLCanvasElement) {
  canvas.width = CANVAS_WIDTH
  canvas.height = CANVAS_HEIGHT
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas-unavailable')
  ctx.fillStyle = CANVAS_BACKGROUND
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  elements.forEach((el) => drawElement(ctx, el))
  return canvas
}

/** Genera el PNG final de 1080 × 1920. */
export async function exportImage(elements: CanvasElement[]): Promise<Blob> {
  await ensureFontsReady(elements)
  const canvas = renderToCanvas(elements, document.createElement('canvas'))
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('blob-failed'))), 'image/png')
  })
}

export function imageFileName(date = new Date()) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `mi-imagen-${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(
    date.getHours(),
  )}${pad(date.getMinutes())}.png`
}
