import { motion } from 'framer-motion'
import { Check, Lock, ChevronRight } from 'lucide-react'
import type { LevelMeta } from '../data/levels'

interface LevelCardProps {
  level: LevelMeta
  status: 'locked' | 'available' | 'completed'
  onSelect: () => void
}

export function LevelCard({ level, status, onSelect }: LevelCardProps) {
  const disabled = status === 'locked'

  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      whileHover={disabled ? {} : { y: -2 }}
      whileTap={disabled ? {} : { scale: 0.995 }}
      className={`level-card-v2 group w-full text-left ${
        status === 'available' ? 'level-card-available cursor-pointer' : ''
      } ${status === 'completed' ? 'level-card-completed cursor-pointer' : ''} ${
        disabled ? 'level-card-locked' : ''
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-sm font-bold ${
            status === 'completed'
              ? 'border-green-500/40 bg-green-950/40 text-green-400'
              : status === 'available'
                ? 'border-warm-500/40 bg-warm-600/15 text-warm-400'
                : 'border-steel-600/30 bg-graphite-800/80 text-steel-500'
          }`}
        >
          {status === 'locked' ? (
            <Lock className="h-5 w-5" />
          ) : status === 'completed' ? (
            <Check className="h-5 w-5" />
          ) : (
            <span>{level.id}</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate font-bold text-gray-50">{level.title}</h3>
            <span className="reward-badge shrink-0 text-xs">+{level.reward} ₽</span>
          </div>
          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-steel-400 sm:text-sm">
            {level.description}
          </p>
        </div>

        {!disabled && (
          <ChevronRight className="h-5 w-5 shrink-0 text-warm-500/50 transition-transform group-hover:translate-x-0.5" />
        )}
      </div>
    </motion.button>
  )
}
