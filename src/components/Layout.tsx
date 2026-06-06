import { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, Flame } from 'lucide-react'
import { HeatScore } from './HeatScore'
import { BonusBadge } from './BonusBadge'

interface LayoutProps {
  children: ReactNode
  heatScore?: number
  winterBonus?: number
  onReset?: () => void
  showHud?: boolean
  shake?: boolean
}

export function Layout({
  children,
  heatScore = 0,
  winterBonus = 0,
  onReset,
  showHud = true,
  shake = false,
}: LayoutProps) {
  return (
    <div className={`boiler-room-bg relative min-h-screen ${shake ? 'screen-shake' : ''}`}>
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-graphite-950/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-warm-500/30 bg-warm-600/15 shadow-warm-sm">
              <Flame className="h-4 w-4 text-warm-500" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-warm-500/90">
                КотёлЪ
              </p>
              <h1 className="truncate text-sm font-bold text-gray-100 sm:text-base">
                Трубный маршрут
              </h1>
            </div>
          </div>
          {showHud && (
            <div className="flex shrink-0 flex-col items-end gap-1.5 sm:flex-row sm:items-center sm:gap-2">
              <HeatScore score={heatScore} />
              {winterBonus > 0 && <BonusBadge amount={winterBonus} />}
            </div>
          )}
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-warm-500/20 to-transparent" />
      </header>

      <AnimatePresence mode="wait">
        <motion.main
          key="main-content"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-4xl px-4 py-5 pb-10 sm:py-8"
        >
          {children}
        </motion.main>
      </AnimatePresence>

      {onReset && (
        <footer className="mx-auto max-w-4xl px-4 pb-8 text-center">
          <button type="button" onClick={() => {
            if (confirm('Сбросить весь прогресс игры?')) onReset()
          }} className="btn-ghost text-xs text-gray-600 hover:text-gray-400">
            <RotateCcw className="h-3 w-3" />
            Сбросить прогресс
          </button>
        </footer>
      )}
    </div>
  )
}
