import { motion } from 'framer-motion'
import { Route } from 'lucide-react'
import { LEVELS } from '../data/levels'
import { LevelCard } from './LevelCard'
import { BonusBadge } from './BonusBadge'
import { KotelLogo } from './KotelLogo'
import { MAX_WINTER_BONUS } from '../data/rewards'

interface LevelSelectProps {
  completedLevels: number[]
  winterBonus: number
  getStatus: (id: number) => 'locked' | 'available' | 'completed'
  onSelectLevel: (id: number) => void
  onFinal?: () => void
  allComplete: boolean
}

export function LevelSelect({
  completedLevels,
  winterBonus,
  getStatus,
  onSelectLevel,
  onFinal,
  allComplete,
}: LevelSelectProps) {
  return (
    <div className="flex flex-col gap-5">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-5 sm:p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <KotelLogo size="md" showText={false} />
            <div>
              <div className="mb-1 flex items-center gap-2 text-warm-500/80">
                <Route className="h-4 w-4" />
                <span className="text-[10px] font-semibold uppercase tracking-widest">Трасса тепла</span>
              </div>
              <h2 className="heading-display text-xl sm:text-2xl">Этапы маршрута</h2>
              <p className="mt-1 text-sm text-steel-400">
                Пройдено{' '}
                <span className="font-semibold text-warm-400">{completedLevels.length}</span> из {LEVELS.length}
              </p>
            </div>
          </div>
          <BonusBadge amount={winterBonus} max={MAX_WINTER_BONUS} />
        </div>
      </motion.div>

      <div className="grid gap-3 sm:grid-cols-1">
        {LEVELS.map((level, i) => (
          <motion.div
            key={level.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.05, duration: 0.35 }}
          >
            <LevelCard
              level={level}
              status={getStatus(level.id)}
              onSelect={() => {
                if (getStatus(level.id) !== 'locked') onSelectLevel(level.id)
              }}
            />
          </motion.div>
        ))}
      </div>

      {allComplete && onFinal && (
        <motion.button
          type="button"
          onClick={onFinal}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="btn-primary w-full"
        >
          Маршрут собран — получить бонус
        </motion.button>
      )}
    </div>
  )
}
