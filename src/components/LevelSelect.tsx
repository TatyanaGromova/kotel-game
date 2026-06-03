import { motion } from 'framer-motion'
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
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold sm:text-2xl">Выбор уровня</h2>
        <p className="mt-1 text-sm text-gray-400">
          Пройдено {completedLevels.length} из {LEVELS.length}. Уровни открываются по очереди.
        </p>
        <div className="mt-3">
          <BonusBadge amount={winterBonus} max={MAX_WINTER_BONUS} />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {LEVELS.map((level, i) => (
          <motion.div
            key={level.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <LevelCard
              level={level}
              status={getStatus(level.id)}
              onSelect={() => {
                const s = getStatus(level.id)
                if (s !== 'locked') onSelectLevel(level.id)
              }}
            />
          </motion.div>
        ))}
      </div>

      {allComplete && onFinal && (
        <button type="button" onClick={onFinal} className="btn-primary">
          Миссия выполнена — получить результат
        </button>
      )}
    </div>
  )
}
