import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'

export function PipePreview() {
  return (
    <div className="scene-frame mx-auto max-w-md p-4 sm:p-6">
      <div className="flex items-center justify-center gap-3">
        <div className="flex flex-col items-center gap-1 rounded-lg border border-steel-600/30 bg-graphite-900/60 px-2 py-3">
          <Flame className="h-6 w-6 text-warm-500" />
          <span className="text-[9px] uppercase tracking-wider text-steel-500">Котёл</span>
        </div>

        <div className="grid flex-1 grid-cols-4 gap-1">
          {[
            'empty',
            'empty',
            'empty',
            'empty',
            'straight',
            'corner',
            'straight',
            'corner',
            'empty',
            'straight',
            'straight',
            'empty',
            'empty',
            'empty',
            'empty',
            'empty',
          ].map((type, i) => (
            <motion.div
              key={i}
              className="aspect-square rounded-md border border-steel-700/30 bg-graphite-900/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.04 }}
            >
              {type !== 'empty' && (
                <svg viewBox="0 0 100 100" className="h-full w-full p-1" aria-hidden>
                  {type === 'straight' && (
                    <line
                      x1="50"
                      y1="0"
                      x2="50"
                      y2="100"
                      stroke="#7a9ab8"
                      strokeWidth="6"
                      strokeLinecap="round"
                      transform={i === 4 || i === 6 || i === 9 || i === 10 ? 'rotate(90 50 50)' : ''}
                    />
                  )}
                  {type === 'corner' && (
                    <>
                      <line x1="50" y1="0" x2="50" y2="50" stroke="#7a9ab8" strokeWidth="6" strokeLinecap="round" />
                      <line x1="50" y1="50" x2="100" y2="50" stroke="#7a9ab8" strokeWidth="6" strokeLinecap="round" />
                    </>
                  )}
                  {(i === 5 || i === 10) && (
                    <motion.line
                      x1="0"
                      y1="50"
                      x2="100"
                      y2="50"
                      stroke="#ff8c1a"
                      strokeWidth="4"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.9 }}
                      transition={{ delay: 1.2, duration: 0.8, repeat: Infinity, repeatDelay: 2 }}
                      style={{ filter: 'drop-shadow(0 0 4px rgba(255,140,26,0.8))' }}
                    />
                  )}
                </svg>
              )}
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-1 rounded-lg border border-warm-500/30 bg-warm-600/10 px-2 py-3 shadow-warm-sm">
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-warm-400" aria-hidden>
            {[4, 8, 12, 16, 20].map((y) => (
              <line key={y} x1="6" y1={y} x2="18" y2={y} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            ))}
          </svg>
          <span className="text-[9px] uppercase tracking-wider text-steel-500">Радиатор</span>
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-steel-500">Поверните трубы — проведите оранжевый поток</p>
    </div>
  )
}
