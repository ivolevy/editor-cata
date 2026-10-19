import type { CSSProperties, PointerEventHandler, RefObject } from 'react'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../constants'
import type { CanvasElement } from '../types'
import { ElementView } from './ElementView'

interface StageProps {
  areaRef: RefObject<HTMLDivElement | null>
  frameRef: RefObject<HTMLDivElement | null>
  scale: number
  elements: CanvasElement[]
  selectedId: string | null
  handlers: {
    onPointerDown: PointerEventHandler<HTMLDivElement>
    onPointerMove: PointerEventHandler<HTMLDivElement>
    onPointerUp: PointerEventHandler<HTMLDivElement>
    onPointerCancel: PointerEventHandler<HTMLDivElement>
  }
}

/**
 * Lienzo blanco de 1080 × 1920 achicado para entrar en pantalla sin deformarse.
 * Los elementos se ubican en coordenadas reales del lienzo; solo cambia la escala visual.
 */
export function Stage({ areaRef, frameRef, scale, elements, selectedId, handlers }: StageProps) {
  const frameStyle = {
    width: CANVAS_WIDTH * scale,
    height: CANVAS_HEIGHT * scale,
    '--inv': 1 / scale,
  } as CSSProperties

  return (
    <main className="stage-area" ref={areaRef}>
      <div
        ref={frameRef}
        id="canvas"
        data-tour="canvas"
        className="stage-frame"
        style={frameStyle}
        aria-label="Lienzo de la imagen"
        role="region"
        {...handlers}
      >
        <div
          className="stage"
          style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT, transform: `scale(${scale})` }}
        >
          {elements.map((el) => (
            <ElementView key={el.id} element={el} selected={el.id === selectedId} />
          ))}
          {elements.length === 0 && (
            <p className="stage__empty">
              Tocá <strong>Texto</strong> o <strong>Emoji</strong>
              <br />
              para empezar
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
