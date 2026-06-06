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
  compact?: boolean
}

export function Layout({
  children,
  heatScore = 0,
  winterBonus = 0,
  onReset,
  showHud = true,
  shake = false,
  compact = false,
}: LayoutProps) {
  return (
    <div
      className={`boiler-room-bg relative flex flex-col ${shake ? 'screen-shake' : ''} ${
        compact ? 'layout-compact h-dvh max-h-dvh overflow-hidden' : 'min-h-dvh'
      }`}
    >
      <header className="z-50 shrink-0 border-b border-white/[0.06] bg-graphite-950/80 backdrop-blur-2xl">
        <div
          className={`mx-auto flex max-w-4xl items-center justify-between gap-2 sm:gap-3 sm:px-4 ${
            compact ? 'px-2 py-1.5' : 'px-3 py-2 sm:py-3'
          }`}
        >
          <div className="layout-header-logo min-w-0">
            <KotelLogo size="sm" showText={false} />
            <p className="mt-0.5 truncate text-[10px] font-medium uppercase tracking-[0.18em] text-steel-500">
              Трубный маршрут
            </p>
          </div>
          {showHud && (
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <HeatScore score={heatScore} compact={compact} />
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
          className={
            compact
              ? 'layout-main mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col px-2 py-1.5'
              : 'layout-main mx-auto w-full max-w-4xl flex-1 px-3 py-4 pb-8 sm:px-4 sm:py-8'
          }
        >
          {children}
        </motion.main>
      </AnimatePresence>

      {onReset && !compact && (
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
