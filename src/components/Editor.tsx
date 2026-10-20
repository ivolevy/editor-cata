import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { CANVAS_HEIGHT, CANVAS_WIDTH, DEFAULT_TEXT_COLOR } from '../constants'
import { useCanvasGestures } from '../hooks/useCanvasGestures'
import { usePwaUpdate } from '../hooks/usePwaUpdate'
import { useStageScale } from '../hooks/useStageScale'
import { exportImage, imageFileName } from '../lib/exportImage'
import { saveForReload, takeSavedWork } from '../lib/reloadRecovery'
import { historyReducer, initialHistory } from '../state/history'
import type { HistoryState } from '../state/history'
import type { CanvasElement, ElementKind } from '../types'
import { EmojiPicker } from './EmojiPicker'
import { ExportDialog } from './ExportDialog'
import { Stage } from './Stage'
import { TextEditorDialog } from './TextEditorDialog'
import { Toast } from './Toast'
import type { ToastMessage } from './Toast'
import { Toolbar } from './Toolbar'
import { TrashZone } from './TrashZone'
import { TopBar } from './TopBar'

type Panel = null | { type: 'text'; editingId: string | null } | { type: 'emoji' }

let idCounter = 0
const newId = () => `el-${Date.now().toString(36)}-${(idCounter++).toString(36)}`

const loadInitialHistory = (): HistoryState => {
  const saved = takeSavedWork()
  return saved ? { past: saved.past, present: saved.present, gestureStart: null } : initialHistory()
}

/** Pantalla única: lienzo oscuro a pantalla completa con UI flotante, estilo IG Stories. */
export function Editor() {
  const [history, dispatch] = useReducer(historyReducer, undefined, loadInitialHistory)
  const elements = history.present
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [panel, setPanel]           = useState<Panel>(null)
  const [exportFile, setExportFile]     = useState<File | null>(null)
  const [drag, setDrag] = useState({ dragging: false, over: false })
  const trashRef = useRef<HTMLDivElement>(null)
  const [saving, setSaving]             = useState(false)
  const [toast, setToast]               = useState<ToastMessage | null>(null)

  // Si el elemento elegido desaparece (por ejemplo, al deshacer), quita la selección.
  useEffect(() => {
    if (selectedId && !elements.some((el) => el.id === selectedId)) setSelectedId(null)
  }, [elements, selectedId])

  const notify = useCallback(
    (text: string, tone: ToastMessage['tone'] = 'info') =>
      setToast({ id: Date.now(), text, tone }),
    [],
  )
  const clearToast = useCallback(() => setToast(null), [])

  const { areaRef, scale } = useStageScale<HTMLDivElement>()

  const historyRef = useRef(history)
  historyRef.current = history

  const gestures = useCanvasGestures({
    elements,
    selectedId,
    scale,
    onSelect: setSelectedId,
    onPreview: (next) => dispatch({ type: 'preview', next }),
    onGestureEnd: () => dispatch({ type: 'endGesture' }),
    onDoubleTapText: (id) => setPanel({ type: 'text', editingId: id }),
    getTrashRect: () => trashRef.current?.getBoundingClientRect() ?? null,
    onDragChange: setDrag,
    onDropOnTrash: (id) => handleDropOnTrash(id),
  })

  /** Crea un elemento en el centro; desplazado levemente si hay superposición. */
  const addElement = (kind: ElementKind, content: string, color: string) => {
    let x = CANVAS_WIDTH / 2
    let y = CANVAS_HEIGHT / 2
    while (elements.some((el) => Math.abs(el.x - x) < 20 && Math.abs(el.y - y) < 20)) {
      x += 50
      y += 70
    }
    const el: CanvasElement = { id: newId(), kind, content, x, y, scale: 1, rotation: 0, color }
    dispatch({ type: 'commit', next: [...elements, el] })
    setSelectedId(el.id)
  }

  const editingElement =
    panel?.type === 'text' && panel.editingId
      ? elements.find((el) => el.id === panel.editingId) ?? null
      : null

  const handleTextConfirm = (text: string, color: string) => {
    if (editingElement) {
      dispatch({
        type: 'commit',
        next: elements.map((el) =>
          el.id === editingElement.id ? { ...el, content: text, color } : el,
        ),
      })
      setSelectedId(editingElement.id)
    } else {
      addElement('text', text, color)
    }
    setPanel(null)
  }

  const handleEmojiPick = (emoji: string) => {
    addElement('emoji', emoji, DEFAULT_TEXT_COLOR)
    setPanel(null)
  }

  /** Elimina al instante el elemento soltado sobre el tachito. */
  const handleDropOnTrash = (id: string) => {
    setSelectedId(null)
    dispatch({ type: 'commit', next: historyRef.current.present.filter((x) => x.id !== id) })
  }

  const handleUndo = () => dispatch({ type: 'undo' })

  const handleSave = async () => {
    setSelectedId(null)
    setSaving(true)
    try {
      const blob = await exportImage(elements)
      setExportFile(new File([blob], imageFileName(), { type: 'image/png' }))
    } catch {
      notify('No se pudo crear la imagen. Probá de nuevo.', 'error')
    } finally {
      setSaving(false)
    }
  }

  // Actualizaciones PWA: solo en momentos seguros y sin perder el trabajo.
  const busyRef = useRef(false)
  busyRef.current = panel !== null || exportFile !== null || saving
  usePwaUpdate({
    isIdle:   () => !busyRef.current && !gestures.isInteracting(),
    isEmpty:  () => historyRef.current.present.length === 0,
    saveWork: () => {
      const { present, past } = historyRef.current
      if (present.length > 0 || past.length > 0) saveForReload({ present, past })
    },
  })

  // Evita que Safari en iPhone haga zoom de toda la página con dos dedos.
  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault()
    document.addEventListener('gesturestart', prevent)
    return () => document.removeEventListener('gesturestart', prevent)
  }, [])

  return (
    <div className="app">

      {/* Lienzo ocupa toda la pantalla (z-index 0) */}
      <Stage
        areaRef={areaRef}
        frameRef={gestures.frameRef}
        scale={scale}
        elements={elements}
        selectedId={selectedId}
        handlers={gestures.handlers}
      />

      {/* Barra superior flotante (z-index 10) — herramientas en el top */}
      <TopBar
        canUndo={history.past.length > 0}
        onUndo={handleUndo}
        onText={() => setPanel({ type: 'text', editingId: null })}
        onEmoji={() => setPanel({ type: 'emoji' })}
      />

      {/* Barra inferior flotante (z-index 10) — eliminar + guardar */}
      <Toolbar
        saving={saving}
        onSave={handleSave}
      />

      <TrashZone trashRef={trashRef} visible={drag.dragging} active={drag.over} />

      {/* Avisos */}
      <Toast message={toast} onDone={clearToast} />

      {/* Paneles superpuestos */}
      <TextEditorDialog
        open={panel?.type === 'text'}
        mode={editingElement ? 'edit' : 'new'}
        initialText={editingElement?.content ?? ''}
        initialColor={editingElement?.color ?? DEFAULT_TEXT_COLOR}
        onCancel={() => setPanel(null)}
        onConfirm={handleTextConfirm}
      />

      <EmojiPicker
        open={panel?.type === 'emoji'}
        onClose={() => setPanel(null)}
        onPick={handleEmojiPick}
      />

      <ExportDialog
        file={exportFile}
        onClose={() => setExportFile(null)}
        onResult={notify}
      />


    </div>
  )
}
