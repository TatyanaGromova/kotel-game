import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { HeatingPieceIcon } from '../illustrations/heatingIcons'

export function PieceDraggable({ id, label }: { id: string; label: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), opacity: isDragging ? 0.5 : 1 }}
      {...listeners}
      {...attributes}
      className="flex cursor-grab flex-col items-center gap-1 rounded-xl border border-steel-600/40 bg-graphite-900/90 px-3 py-2 active:cursor-grabbing touch-manipulation"
    >
      <HeatingPieceIcon name={label} size={36} />
      <span className="max-w-[88px] text-center text-[10px] font-medium leading-tight text-gray-300">{label}</span>
    </div>
  )
}
