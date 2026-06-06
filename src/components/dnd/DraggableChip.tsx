import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

interface DraggableChipProps {
  id: string
  label: string
  disabled?: boolean
  className?: string
}

export function DraggableChip({ id, label, disabled, className = '' }: DraggableChipProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    disabled,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  }

  return (
    <button
      ref={setNodeRef}
      type="button"
      style={style}
      {...listeners}
      {...attributes}
      disabled={disabled}
      className={`touch-manipulation cursor-grab active:cursor-grabbing rounded-xl border border-steel-600/40 bg-graphite-800/90 px-4 py-3 text-sm font-medium text-gray-200 shadow-glass transition-shadow active:scale-[0.98] ${isDragging ? 'ring-2 ring-warm-500/50' : ''} ${className}`}
    >
      {label}
    </button>
  )
}
