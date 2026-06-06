import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

export function SituationCard({ id, text }: { id: string; text: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id })
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), opacity: isDragging ? 0.5 : 1 }}
      {...listeners}
      {...attributes}
      className="cursor-grab touch-manipulation rounded-2xl border border-steel-600/50 bg-graphite-800/90 p-6 text-center text-lg font-bold text-gray-50 shadow-glass active:cursor-grabbing sm:text-xl"
    >
      {text}
    </div>
  )
}
