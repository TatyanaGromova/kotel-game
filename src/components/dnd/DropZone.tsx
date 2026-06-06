import { useDroppable } from '@dnd-kit/core'

interface DropZoneProps {
  id: string
  title: string
  hint?: string
  children?: React.ReactNode
  variant?: 'danger' | 'normal' | 'check' | 'default' | 'dispatch'
  className?: string
}

const VARIANTS = {
  danger: 'border-red-500/40 bg-red-950/20 hover:bg-red-950/35',
  normal: 'border-green-500/40 bg-green-950/20 hover:bg-green-950/35',
  check: 'border-yellow-500/40 bg-yellow-950/15 hover:bg-yellow-950/30',
  default: 'border-steel-600/40 bg-graphite-900/50',
  dispatch: 'border-warm-500/30 bg-graphite-900/60',
}

export function DropZone({ id, title, hint, children, variant = 'default', className = '' }: DropZoneProps) {
  const { isOver, setNodeRef } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[72px] flex-col rounded-xl border-2 border-dashed p-3 transition-all ${VARIANTS[variant]} ${
        isOver ? 'scale-[1.02] ring-2 ring-warm-500/40' : ''
      } ${className}`}
    >
      <span className="text-xs font-bold uppercase tracking-wider text-steel-400">{title}</span>
      {hint && <span className="text-[10px] text-steel-500">{hint}</span>}
      <div className="mt-2 flex flex-1 flex-col gap-2">{children}</div>
    </div>
  )
}
