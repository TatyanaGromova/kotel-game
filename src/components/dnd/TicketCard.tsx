import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

export function TicketCard({ id, settlement }: { id: string; settlement: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id })
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), opacity: isDragging ? 0.4 : 1 }}
      {...listeners}
      {...attributes}
      className="flex cursor-grab items-center gap-2 rounded-xl border border-warm-500/40 bg-warm-600/15 px-4 py-3 active:cursor-grabbing touch-manipulation"
    >
      <GripVertical className="h-4 w-4 text-steel-500" />
      <span className="font-medium">Заявка · {settlement}</span>
    </div>
  )
}
