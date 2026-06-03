import { motion } from 'framer-motion'
import { Check, Lock } from 'lucide-react'
import type { LevelMeta } from '../data/levels'

interface LevelCardProps {
  level: LevelMeta
  status: 'locked' | 'available' | 'completed'
  onSelect: () => void
}

export function LevelCard({ level, status, onSelect }: LevelCardProps) {
  const Icon = level.icon
  const disabled = status === 'locked'

  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      whileHover={disabled ? {} : { scale: 1.02, y: -2 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className={`card-panel relative w-full p-4 text-left transition-shadow sm:p-5 ${
        status === 'available' ? 'shadow-warm ring-1 ring-warm-500/30' : ''
      } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
    >
      {status === 'available' && (
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-warm-500/5" />
      )}

      <div className="flex gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
            status === 'completed'
              ? 'bg-green-900/40 text-green-400'
              : status === 'available'
                ? 'bg-warm-600/20 text-warm-400'
                : 'bg-graphite-800 text-gray-500'
          }`}
        >
          {status === 'locked' ? (
            <Lock className="h-6 w-6" />
          ) : status === 'completed' ? (
            <Check className="h-6 w-6" />
          ) : (
            <Icon className="h-6 w-6" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-100">
              {level.id}. {level.title}
            </h3>
            <span className="shrink-0 rounded-lg bg-warm-600/20 px-2 py-0.5 text-xs font-medium text-warm-400">
              +{level.reward} ₽
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-400">{level.description}</p>
          <p className="mt-2 text-xs text-gray-500">
            {status === 'locked' && 'Закрыт — пройдите предыдущий уровень'}
            {status === 'available' && 'Доступен'}
            {status === 'completed' && 'Пройден'}
          </p>
        </div>
      </div>
    </motion.button>
  )
}
