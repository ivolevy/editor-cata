import type { CSSProperties, PointerEventHandler, RefObject } from 'react'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../constants'
import type { CanvasElement } from '../types'
import { ElementView } from './ElementView'

interface StageProps {
  areaRef:    RefObject<HTMLDivElement | null>
  frameRef:   RefObject<HTMLDivElement | null>
  scale:      number
  elements:   CanvasElement[]
  selectedId: string | null
  handlers: {
    onPointerDown:   PointerEventHandler<HTMLDivElement>
    onPointerMove:   PointerEventHandler<HTMLDivElement>
    onPointerUp:     PointerEventHandler<HTMLDivElement>
    onPointerCancel: PointerEventHandler<HTMLDivElement>
  }
}

/**
 * Lienzo 1080 × 1920 escalado a pantalla.
 * El fondo oscuro (gradiente) viene del CSS de .stage-frame.
 * Los elementos se posicionan en coordenadas reales del lienzo.
 */
export function Stage({ areaRef, frameRef, scale, elements, selectedId, handlers }: StageProps) {
  const frameStyle = {
    width:  CANVAS_WIDTH  * scale,
    height: CANVAS_HEIGHT * scale,
    '--inv': 1 / scale,
  } as CSSProperties

  return (
    <div className="stage-area" ref={areaRef}>
      <div
        ref={frameRef}
        id="canvas"
        className="stage-frame"
        style={frameStyle}
        aria-label="Lienzo"
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
            <div className="stage__empty">
              <span className="stage__empty-icon">✨</span>
              <p className="stage__empty-text">
                Tocá <strong>Aa</strong> o <strong>😊</strong><br />
                para empezar
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
