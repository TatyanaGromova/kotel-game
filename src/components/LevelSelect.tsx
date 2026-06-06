import { motion } from 'framer-motion'
import { Map } from 'lucide-react'
import { LEVELS } from '../data/levels'
import { LevelCard } from './LevelCard'
import { BonusBadge } from './BonusBadge'
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
    <div className="flex flex-col gap-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-2 flex items-center gap-2 text-warm-500/80">
          <Map className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-widest">Трасса тепла</span>
        </div>
        <h2 className="heading-display text-2xl sm:text-3xl">Этапы маршрута</h2>
        <p className="mt-2 text-sm text-steel-400">
          Пройдено <span className="font-semibold text-warm-400">{completedLevels.length}</span> из{' '}
          {LEVELS.length}. Этапы открываются по очереди.
        </p>
        <div className="mt-4">
          <BonusBadge amount={winterBonus} max={MAX_WINTER_BONUS} />
        </div>
      </motion.div>

      <div className="flex flex-col gap-4">
        {LEVELS.map((level, i) => (
          <motion.div
            key={level.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 + i * 0.07, duration: 0.4 }}
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
