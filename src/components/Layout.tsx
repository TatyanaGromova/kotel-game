import { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { HeatScore } from './HeatScore'
import { BonusBadge } from './BonusBadge'

interface LayoutProps {
  children: ReactNode
  heatScore?: number
  winterBonus?: number
  onReset?: () => void
  showHud?: boolean
  shake?: boolean
  frostIntensity?: number
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
    <div className={`boiler-room-bg min-h-screen ${shake ? 'screen-shake' : ''}`}>
      <header className="sticky top-0 z-50 border-b border-graphite-700/50 bg-graphite-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-2 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-xs text-warm-500/90 sm:text-sm">КотёлЪ</p>
            <h1 className="truncate text-sm font-bold sm:text-base">Миссия «Тёплая зима»</h1>
          </div>
          {showHud && (
            <div className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-3">
              <HeatScore score={heatScore} />
              {winterBonus > 0 && <BonusBadge amount={winterBonus} />}
            </div>
          )}
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.main
          key={typeof children === 'string' ? children : 'main'}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="mx-auto max-w-4xl px-4 py-4 pb-8 sm:py-6"
        >
          {children}
        </motion.main>
      </AnimatePresence>

      {onReset && (
        <footer className="mx-auto max-w-4xl px-4 pb-6 text-center">
          <button
            type="button"
            onClick={() => {
              if (confirm('Сбросить весь прогресс игры?')) onReset()
            }}
            className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-400"
          >
            <RotateCcw className="h-3 w-3" />
            Сбросить прогресс
          </button>
        </footer>
      )}
    </div>
  )
}
