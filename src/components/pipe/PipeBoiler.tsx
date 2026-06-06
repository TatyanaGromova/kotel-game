import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'

interface PipeBoilerProps {
  active: boolean
  flowDelay?: number
}

export function PipeBoiler({ active, flowDelay = 0 }: PipeBoilerProps) {
  return (
    <motion.div
      className={`pipe-boiler flex flex-col items-center gap-1.5 rounded-2xl border px-2.5 py-3 sm:px-3 sm:py-3.5 ${
        active ? 'pipe-boiler-active' : ''
      }`}
      animate={active ? { boxShadow: '0 0 28px rgba(255,140,26,0.45)' } : {}}
      transition={{ delay: flowDelay, duration: 0.35 }}
    >
      <div className={`rounded-xl p-2.5 ${active ? 'bg-warm-600/25' : 'bg-graphite-800/90'}`}>
        <Flame className={`h-8 w-8 sm:h-9 sm:w-9 ${active ? 'text-warm-400' : 'text-steel-400'}`} />
      </div>
      <span className="text-[9px] font-bold uppercase tracking-wider text-steel-400">Котёл</span>
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
