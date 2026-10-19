import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { isStandalone } from '../lib/share'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CloseIcon,
  HandIcon,
  PinchIcon,
  SaveIcon,
  SmileIcon,
  TextIcon,
  UndoIcon,
} from './icons'

interface Step {
  /** Valor del atributo data-tour del control real que se resalta. */
  target: 'text' | 'emoji' | 'canvas' | 'undo' | 'save'
  title: string
  body: string
  icon: ReactNode
}

const STEPS: Step[] = [
  {
    target: 'text',
    title: 'Tocá Texto para agregar palabras',
    body: 'Se abre un cuadro para escribir. Cuando termines, tocá «Agregar».',
    icon: <TextIcon />,
  },
  {
    target: 'emoji',
    title: 'Tocá Emoji para agregar un emoji',
    body: 'Elegí el que más te guste con un solo toque.',
    icon: <SmileIcon />,
  },
  {
    target: 'canvas',
    title: 'Mantené el dedo sobre un elemento y arrastralo para moverlo',
    body: 'Al tocarlo queda marcado con un borde. Así sabés cuál elegiste.',
    icon: <HandIcon />,
  },
  {
    target: 'canvas',
    title: 'Usá dos dedos para agrandarlo, achicarlo o girarlo',
    body: 'Separá los dedos para agrandar, juntalos para achicar y giralos para rotar.',
    icon: <PinchIcon />,
  },
  {
    target: 'undo',
    title: 'Si te equivocás, tocá Deshacer',
    body: 'Vuelve atrás el último cambio. Podés tocarlo varias veces.',
    icon: <UndoIcon />,
  },
  {
    target: 'save',
    title: 'Cuando termines, tocá Guardar imagen',
    body: 'Vas a poder guardarla en el teléfono o enviarla por WhatsApp.',
    icon: <SaveIcon />,
  },
]

interface Rect {
  top: number
  left: number
  width: number
  height: number
}

interface TutorialProps {
  open: boolean
  onClose: () => void
  onShowInstall: () => void
}

/** Guía paso a paso que resalta los controles reales del editor, sin salir de la pantalla. */
export function Tutorial({ open, onClose, onShowInstall }: TutorialProps) {
  const [index, setIndex] = useState(0)
  const [rect, setRect] = useState<Rect | null>(null)
  const nextRef = useRef<HTMLButtonElement>(null)
  const step = STEPS[index]
  const isLast = index === STEPS.length - 1

  const measure = useCallback(() => {
    const el = document.querySelector<HTMLElement>(`[data-tour="${STEPS[index].target}"]`)
    if (!el) return setRect(null)
    const r = el.getBoundingClientRect()
    setRect({ top: r.top, left: r.left, width: r.width, height: r.height })
  }, [index])

  useLayoutEffect(() => {
    if (!open) return
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [open, measure])

  useEffect(() => {
    if (open) nextRef.current?.focus()
  }, [open, index])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setIndex((i) => Math.min(i + 1, STEPS.length - 1))
      if (e.key === 'ArrowLeft') setIndex((i) => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const pad = 8
  const vh = window.innerHeight
  const isTall = rect ? rect.height > vh * 0.45 : false
  let cardPosition: CSSProperties
  if (!rect || isTall) {
    cardPosition = { bottom: 'calc(16px + env(safe-area-inset-bottom))' }
  } else if (rect.top + rect.height / 2 > vh / 2) {
    cardPosition = { bottom: vh - rect.top + pad + 14 }
  } else {
    cardPosition = { top: rect.top + rect.height + pad + 14 }
  }

  return (
    <div className="tour" role="dialog" aria-modal="true" aria-labelledby="tour-title" aria-describedby="tour-body">
      {rect ? (
        <div
          className={`tour__spotlight${isTall ? ' tour__spotlight--area' : ''}`}
          style={{
            top: rect.top - pad,
            left: rect.left - pad,
            width: rect.width + pad * 2,
            height: rect.height + pad * 2,
          }}
        />
      ) : (
        <div className="tour__dim" />
      )}

      <div className="tour__card" style={cardPosition}>
        <div className="tour__meta">
          <span className="tour__icon">{step.icon}</span>
          <span className="tour__count">
            Paso {index + 1} de {STEPS.length}
          </span>
          <button id="tour-exit" type="button" className="chip-button" onClick={onClose}>
            <CloseIcon width={20} height={20} />
            <span>Salir</span>
          </button>
        </div>

        <h2 id="tour-title" className="tour__title">
          {step.title}
        </h2>
        <p id="tour-body" className="tour__body">
          {step.body}
        </p>

        {isLast && !isStandalone() && (
          <button id="tour-install" type="button" className="link-button" onClick={onShowInstall}>
            ¿Querés tener la app en tu pantalla de inicio?
          </button>
        )}

        <div className="tour__dots" aria-hidden="true">
          {STEPS.map((_, i) => (
            <span key={i} className={i === index ? 'is-active' : ''} />
          ))}
        </div>

        <div className="tour__actions">
          <button
            id="tour-prev"
            type="button"
            className="big-button big-button--secondary"
            onClick={() => setIndex((i) => i - 1)}
            disabled={index === 0}
          >
            <ArrowLeftIcon width={22} height={22} />
            Anterior
          </button>
          <button
            id="tour-next"
            ref={nextRef}
            type="button"
            className="big-button big-button--primary"
            onClick={() => (isLast ? onClose() : setIndex((i) => i + 1))}
          >
            {isLast ? 'Terminar' : 'Siguiente'}
            {!isLast && <ArrowRightIcon width={22} height={22} />}
          </button>
        </div>
      </div>
    </div>
  )
}
