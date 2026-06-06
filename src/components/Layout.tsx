import { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { KotelLogo } from './KotelLogo'
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
          <div className="min-w-0">
            <KotelLogo size="sm" showText={false} />
            <p className="mt-0.5 truncate text-[10px] font-medium uppercase tracking-[0.18em] text-steel-500">
              Трубный маршрут
            </p>
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
          <button
            type="button"
            onClick={() => {
              if (confirm('Сбросить весь прогресс игры?')) onReset()
            }}
            className="btn-ghost text-xs text-gray-600 hover:text-gray-400"
          >
            <RotateCcw className="h-3 w-3" />
            Сбросить прогресс
          </button>
        </footer>
      )}
    </div>
  )
}
