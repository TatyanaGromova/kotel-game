import { motion } from 'framer-motion'
import { Check, Lock, ChevronRight } from 'lucide-react'
import type { LevelMeta } from '../data/levels'

const LEVEL_THEMES: Record<number, string> = {
  1: 'from-red-950/40 via-transparent to-transparent',
  2: 'from-steel-600/20 via-transparent to-transparent',
  3: 'from-orange-950/30 via-transparent to-transparent',
  4: 'from-warm-600/15 via-transparent to-transparent',
  5: 'from-frost-700/20 via-transparent to-transparent',
}

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
      whileHover={disabled ? {} : { y: -4 }}
      whileTap={disabled ? {} : { scale: 0.99 }}
      className={`level-card group ${
        status === 'available' ? 'level-card-available cursor-pointer' : ''
      } ${status === 'completed' ? 'level-card-completed cursor-pointer' : ''} ${
        disabled ? 'level-card-locked' : ''
      }`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60 ${LEVEL_THEMES[level.id] ?? ''}`}
      />
      {status === 'available' && (
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-warm-500/10 blur-2xl" />
      )}

      <div className="relative flex gap-5">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border transition-shadow ${
            status === 'completed'
              ? 'border-green-500/40 bg-green-950/50 text-green-400 shadow-[0_0_24px_rgba(34,197,94,0.15)]'
              : status === 'available'
                ? 'border-warm-500/40 bg-warm-600/20 text-warm-400 shadow-warm-sm group-hover:shadow-warm'
                : 'border-steel-600/30 bg-graphite-800/80 text-steel-500'
          }`}
        >
          {status === 'locked' ? (
            <Lock className="h-7 w-7" />
          ) : status === 'completed' ? (
            <Check className="h-7 w-7" />
          ) : (
            <Icon className="h-7 w-7" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-steel-500">
                Миссия {level.id}
              </span>
              <h3 className="mt-0.5 text-lg font-bold text-gray-50">{level.title}</h3>
            </div>
            <span className="reward-badge shrink-0">+{level.reward} ₽</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-steel-400">{level.description}</p>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs font-medium text-steel-500">
              {status === 'locked' && '🔒 Закрыто'}
              {status === 'available' && '● Доступно'}
              {status === 'completed' && '✓ Пройдено'}
            </p>
            {!disabled && (
              <ChevronRight className="h-4 w-4 text-warm-500/60 transition-transform group-hover:translate-x-1" />
            )}
          </div>
        </div>
      </div>
    </motion.button>
  )
}
