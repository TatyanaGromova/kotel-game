import { ArrowLeft } from 'lucide-react'

interface LevelHeaderProps {
  title: string
  subtitle: string
  onBack: () => void
  badge?: string
  compact?: boolean
}

export function LevelHeader({ title, subtitle, onBack, badge, compact = false }: LevelHeaderProps) {
  if (compact) {
    return (
      <div className="flex shrink-0 items-center gap-1.5">
        <button
          type="button"
          onClick={onBack}
          className="btn-level-ghost !min-h-8 shrink-0 !px-1.5"
          aria-label="К уровням"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h2 className="min-w-0 flex-1 truncate font-display text-sm font-bold text-gray-50">{title}</h2>
        <span className="shrink-0 text-[10px] text-steel-500">{subtitle}</span>
      </div>
    )
  }

  return (
    <div className="mb-6">
      <button type="button" onClick={onBack} className="btn-ghost mb-4">
        <ArrowLeft className="h-4 w-4" />
        К уровням
      </button>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          {badge && (
            <span className="mb-2 inline-block rounded-full border border-steel-600/40 bg-graphite-800/60 px-3 py-0.5 text-xs font-medium uppercase tracking-wider text-steel-400">
              {badge}
            </span>
          )}
          <h2 className="heading-display text-2xl sm:text-3xl">{title}</h2>
          <p className="mt-1 text-sm text-steel-400">{subtitle}</p>
        </div>
      </div>
    </div>
  )
}
