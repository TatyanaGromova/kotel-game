import { motion } from 'framer-motion'

interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  variant?: 'heat' | 'default' | 'cold'
  urgent?: boolean
}

export function ProgressBar({
  value,
  max = 100,
  label,
  variant = 'default',
  urgent = false,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const fillClass =
    variant === 'heat'
      ? 'progress-fill-heat'
      : variant === 'cold'
        ? 'progress-fill-cold'
        : 'progress-fill-default'

  return (
    <div className="w-full">
      {label && (
        <div className="mb-1.5 flex justify-between text-xs">
          <span className={urgent && pct < 35 ? 'text-red-400/90' : 'text-steel-400'}>{label}</span>
          <span className="font-mono font-medium text-gray-300">{Math.round(pct)}%</span>
        </div>
      )}
      <div className="progress-track">
        <motion.div
          className={fillClass}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  )
}
