import { useEffect, useMemo, useState } from 'react'
import { canShareFile, downloadFile, isIOS, shareFile } from '../lib/share'
import type { DeliveryResult } from '../lib/share'
import { CheckIcon, SaveIcon, ShareIcon } from './icons'
import { Sheet } from './Sheet'

interface ExportDialogProps {
  file: File | null
  onClose: () => void
  onResult: (message: string, tone: 'success' | 'error' | 'info') => void
}

/**
 * Aparece cuando la imagen ya está generada. Desde acá la persona elige compartir/guardar
 * (con el menú nativo del teléfono) o descargar el archivo.
 * Cada botón se toca directamente, algo que Safari en iPhone exige para compartir.
 */
export function ExportDialog({ file, onClose, onResult }: ExportDialogProps) {
  const open = file !== null
  return (
    <Sheet open={open} onClose={onClose} placement="center" labelledBy="export-title">
      {file && <ExportContent file={file} onClose={onClose} onResult={onResult} />}
    </Sheet>
  )
}

function ExportContent({ file, onClose, onResult }: { file: File } & Omit<ExportDialogProps, 'file'>) {
  const previewUrl = useMemo(() => URL.createObjectURL(file), [file])
  useEffect(() => () => URL.revokeObjectURL(previewUrl), [previewUrl])
  const [busy, setBusy] = useState(false)
  const ios = isIOS()
  const shareable = canShareFile(file)

  const report = (result: DeliveryResult) => {
    switch (result) {
      case 'shared':
        onResult('¡Listo! La imagen se guardó o se compartió.', 'success')
        onClose()
        break
      case 'downloaded':
        onResult(
          ios
            ? 'Se inició la descarga. Si aparece un aviso, tocá «Descargar». La imagen queda en la app Archivos.'
            : 'Se inició la descarga. La imagen queda en la carpeta «Descargas».',
          'info',
        )
        onClose()
        break
      case 'cancelled':
        onResult('No se compartió la imagen. Podés intentarlo de nuevo.', 'info')
        break
      case 'failed':
        onResult('No se pudo completar. Probá con el otro botón.', 'error')
        break
    }
  }

  return (
    <div className="export">
      <h2 id="export-title" className="sheet__title">
        <CheckIcon width={26} height={26} className="export__check" /> Tu imagen está lista
      </h2>

      <img
        className="export__preview"
        src={previewUrl}
        alt="Vista previa de la imagen que se va a guardar"
        width={1080}
        height={1920}
      />

      <p className="export__help">
        {ios
          ? 'Tocá «Guardar en galería» y elegí «Guardar imagen». Para WhatsApp, usá «Compartir por WhatsApp».'
          : 'Tocá «Guardar en galería» para guardarla en el teléfono, o «Compartir por WhatsApp» para enviarla.'}
      </p>

      <div className="sheet__actions sheet__actions--stack">
        <button
          id="gallery-button"
          type="button"
          className="big-button big-button--primary"
          disabled={busy}
          onClick={async () => {
            // iPhone: el menú de compartir es la única vía web para «Guardar imagen» en Fotos.
            if (ios && shareable) {
              setBusy(true)
              const result = await shareFile(file)
              setBusy(false)
              report(result)
            } else {
              report(downloadFile(file))
            }
          }}
        >
          <SaveIcon width={22} height={22} />
          Guardar en galería
        </button>
        <button
          id="share-button"
          type="button"
          className="big-button big-button--secondary"
          disabled={busy || !shareable}
          onClick={async () => {
            setBusy(true)
            const result = await shareFile(file)
            setBusy(false)
            report(result)
          }}
        >
          <ShareIcon width={22} height={22} />
          Compartir por WhatsApp
        </button>
        <button id="export-close" type="button" className="big-button big-button--ghost" onClick={onClose}>
          Volver a la imagen
        </button>
      </div>
    </div>
  )
}
