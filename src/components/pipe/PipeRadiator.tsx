import { motion } from 'framer-motion'

interface PipeRadiatorProps {
  active: boolean
  flowDelay?: number
  compact?: boolean
  mini?: boolean
}

export function PipeRadiator({ active, flowDelay = 0, compact = false, mini = false }: PipeRadiatorProps) {
  if (mini) {
    return (
      <motion.div
        className={`pipe-radiator flex flex-col items-center rounded-lg border px-1 py-1 ${active ? 'pipe-radiator-active' : ''}`}
        animate={active ? { boxShadow: '0 0 20px rgba(255,140,26,0.5)' } : {}}
        transition={{ delay: flowDelay, duration: 0.35 }}
        title="Радиатор"
      >
        <div className={`rounded-md p-1 ${active ? 'bg-warm-600/25' : 'bg-graphite-800/90'}`}>
          <svg viewBox="0 0 24 28" className={`h-5 w-5 ${active ? 'text-warm-400' : 'text-steel-400'}`} aria-hidden>
            {[5, 9, 13, 17, 21].map((y) => (
              <line key={y} x1="4" y1={y} x2="20" y2={y} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ))}
          </svg>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className={`pipe-radiator flex max-w-full flex-col items-center rounded-2xl border ${
        compact ? 'gap-1 px-1.5 py-2' : 'gap-1.5 px-2.5 py-3 sm:px-3 sm:py-3.5'
      } ${active ? 'pipe-radiator-active' : ''}`}
      animate={active ? { boxShadow: '0 0 28px rgba(255,140,26,0.5)' } : {}}
      transition={{ delay: flowDelay, duration: 0.35 }}
    >
      <div className={`rounded-xl ${compact ? 'p-1.5' : 'p-2.5'} ${active ? 'bg-warm-600/25' : 'bg-graphite-800/90'}`}>
        <svg
          viewBox="0 0 24 28"
          className={`${compact ? 'h-6 w-6' : 'h-8 w-8 sm:h-9 sm:w-9'} ${active ? 'text-warm-400' : 'text-steel-400'}`}
          aria-hidden
        >
          {[5, 9, 13, 17, 21].map((y) => (
            <line key={y} x1="4" y1={y} x2="20" y2={y} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          ))}
        </svg>
      </div>
      <span className={`font-bold uppercase tracking-wider text-steel-400 ${compact ? 'text-[8px]' : 'text-[9px]'}`}>
        Радиатор
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
