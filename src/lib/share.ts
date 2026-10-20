/** Utilidades para entregar la imagen: compartir (iPhone/Android) o descargar. */

export type DeliveryResult = 'shared' | 'cancelled' | 'downloaded' | 'failed'

export function canShareFile(file: File) {
  try {
    return typeof navigator.share === 'function' && !!navigator.canShare?.({ files: [file] })
  } catch {
    return false
  }
}

/** Abre el menú nativo de compartir. Debe llamarse directamente desde un toque. */
export async function shareFile(file: File): Promise<DeliveryResult> {
  try {
    await navigator.share({ files: [file] })
    return 'shared'
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return 'cancelled'
    return 'failed'
  }
}

/** Descarga clásica mediante un enlace temporal. */
export function downloadFile(file: File): DeliveryResult {
  try {
    const url = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = url
    link.download = file.name
    link.rel = 'noopener'
    document.body.appendChild(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
    return 'downloaded'
  } catch {
    return 'failed'
  }
}

export const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

export const isStandalone = () =>
  window.matchMedia?.('(display-mode: standalone)').matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true
