interface TrashZoneProps {
  trashRef: React.RefObject<HTMLDivElement | null>
  visible:  boolean
  active:   boolean
}

/** Tachito que aparece al arrastrar un elemento; se abre cuando lo tenés encima. */
export function TrashZone({ trashRef, visible, active }: TrashZoneProps) {
  return (
    <div
      ref={trashRef}
      className={`trash${visible ? ' is-visible' : ''}${active ? ' is-active' : ''}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <g className="trash__lid">
          <path d="M3 6h18" />
          <path d="M9 6V4h6v2" />
        </g>
        <path d="M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14" />
        <path d="M10 11v6M14 11v6" />
      </svg>
    </div>
  )
}
