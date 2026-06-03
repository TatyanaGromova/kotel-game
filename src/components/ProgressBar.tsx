import { motion } from 'framer-motion'

interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  variant?: 'heat' | 'default' | 'cold'
}

export function ProgressBar({
  value,
  max = 100,
  label,
  variant = 'default',
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const barColor =
    variant === 'heat'
      ? 'bg-gradient-to-r from-warm-600 to-warm-400'
      : variant === 'cold'
        ? 'bg-gradient-to-r from-frost-500 to-frost-300'
        : 'bg-gradient-to-r from-warm-600 to-warm-500'

  return (
    <div className="w-full">
      {label && (
        <div className="mb-1 flex justify-between text-xs text-gray-400">
          <span>{label}</span>
          <span>{Math.round(pct)}%</span>
        </div>
      )}
      <div className="h-2 overflow-hidden rounded-full bg-graphite-800">
        <motion.div
          className={`h-full rounded-full ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  )
}
