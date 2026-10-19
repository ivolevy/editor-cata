import { useLayoutEffect, useRef, useState } from 'react'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../constants'

/**
 * Calcula cuánto hay que achicar el lienzo de 1080 × 1920 para que entre completo
 * en el espacio disponible, sin deformarlo.
 */
export function useStageScale<T extends HTMLElement>() {
  const areaRef = useRef<T>(null)
  const [scale, setScale] = useState(0.3)

  useLayoutEffect(() => {
    const area = areaRef.current
    if (!area) return
    const update = () => {
      const { width, height } = area.getBoundingClientRect()
      if (width <= 0 || height <= 0) return
      setScale(Math.min(width / CANVAS_WIDTH, height / CANVAS_HEIGHT))
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(area)
    return () => observer.disconnect()
  }, [])

  return { areaRef, scale }
}
