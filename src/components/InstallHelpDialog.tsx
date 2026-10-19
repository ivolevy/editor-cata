import { isIOS } from '../lib/share'
import { CloseIcon, DotsIcon, PlusSquareIcon, ShareIcon } from './icons'
import { Sheet } from './Sheet'

interface InstallHelpDialogProps {
  open: boolean
  onClose: () => void
}

/** Instrucciones para agregar la app a la pantalla de inicio. Solo se muestran si la persona las pide. */
export function InstallHelpDialog({ open, onClose }: InstallHelpDialogProps) {
  const ios = isIOS()
  const iphone = (
    <section className="install__section" key="ios">
      <h3>En iPhone (Safari)</h3>
      <ol>
        <li>
          Tocá el botón Compartir <ShareIcon width={20} height={20} className="inline-icon" /> abajo en la pantalla.
        </li>
        <li>
          Elegí «Agregar a inicio» <PlusSquareIcon width={20} height={20} className="inline-icon" />.
        </li>
        <li>Tocá «Agregar». Vas a ver el ícono «Mi imagen» en tu pantalla.</li>
      </ol>
    </section>
  )
  const android = (
    <section className="install__section" key="android">
      <h3>En Android (Chrome)</h3>
      <ol>
        <li>
          Tocá el menú <DotsIcon width={20} height={20} className="inline-icon" /> arriba a la derecha.
        </li>
        <li>Elegí «Instalar app» o «Agregar a pantalla principal».</li>
        <li>Confirmá. Vas a ver el ícono «Mi imagen» en tu pantalla.</li>
      </ol>
    </section>
  )

  return (
    <Sheet open={open} onClose={onClose} placement="center" labelledBy="install-title">
      <div className="sheet__header">
        <h2 id="install-title" className="sheet__title">
          Tener la app en tu pantalla
        </h2>
        <button id="install-close" type="button" className="chip-button" onClick={onClose}>
          <CloseIcon width={22} height={22} />
          <span>Cerrar</span>
        </button>
      </div>
      <div className="install">{ios ? [iphone, android] : [android, iphone]}</div>
    </Sheet>
  )
}
