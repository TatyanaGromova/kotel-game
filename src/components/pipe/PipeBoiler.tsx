import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'

interface PipeBoilerProps {
  active: boolean
  flowDelay?: number
  compact?: boolean
  mini?: boolean
}

export function PipeBoiler({ active, flowDelay = 0, compact = false, mini = false }: PipeBoilerProps) {
  if (mini) {
    return (
      <motion.div
        className={`pipe-boiler flex flex-col items-center rounded-lg border px-1 py-1 ${active ? 'pipe-boiler-active' : ''}`}
        animate={active ? { boxShadow: '0 0 20px rgba(255,140,26,0.45)' } : {}}
        transition={{ delay: flowDelay, duration: 0.35 }}
        title="Котёл"
      >
        <div className={`rounded-md p-1 ${active ? 'bg-warm-600/25' : 'bg-graphite-800/90'}`}>
          <Flame className={`h-5 w-5 ${active ? 'text-warm-400' : 'text-steel-400'}`} />
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className={`pipe-boiler flex max-w-full flex-col items-center rounded-2xl border ${
        compact ? 'gap-1 px-1.5 py-2' : 'gap-1.5 px-2.5 py-3 sm:px-3 sm:py-3.5'
      } ${active ? 'pipe-boiler-active' : ''}`}
      animate={active ? { boxShadow: '0 0 28px rgba(255,140,26,0.45)' } : {}}
      transition={{ delay: flowDelay, duration: 0.35 }}
    >
      <div className={`rounded-xl ${compact ? 'p-1.5' : 'p-2.5'} ${active ? 'bg-warm-600/25' : 'bg-graphite-800/90'}`}>
        <Flame
          className={`${compact ? 'h-6 w-6' : 'h-8 w-8 sm:h-9 sm:w-9'} ${active ? 'text-warm-400' : 'text-steel-400'}`}
        />
      </div>
      <span className={`font-bold uppercase tracking-wider text-steel-400 ${compact ? 'text-[8px]' : 'text-[9px]'}`}>
        Котёл
      </span>
      {active && (
        <motion.div
          className="h-1 w-8 rounded-full bg-warm-500"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: flowDelay, duration: 0.3 }}
          style={{ boxShadow: '0 0 10px rgba(255,140,26,0.7)' }}
        />
      )}
    </motion.div>
  )
}
