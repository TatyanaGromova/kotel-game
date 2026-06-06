import { motion } from 'framer-motion'
import { PipeBoiler } from './PipeBoiler'
import { PipeRadiator } from './PipeRadiator'
import { PipeStub } from './PipeStub'

export function PipePreview() {
  return (
    <div className="scene-frame mx-auto max-w-md p-4 sm:p-6">
      <div className="flex items-stretch justify-center gap-0">
        <div className="relative flex w-14 shrink-0 flex-col">
          <div className="absolute left-0 right-0 top-1/2 flex -translate-y-1/2 justify-center">
            <PipeBoiler active />
          </div>
        </div>
        <div className="relative flex w-4 shrink-0 flex-col">
          <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center">
            <PipeStub direction="right" flowing />
          </div>
        </div>

        <div className="grid flex-1 grid-cols-4 gap-1 rounded-lg border border-steel-600/25 bg-graphite-950/80 p-1">
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

        <div className="relative flex w-4 shrink-0 flex-col">
          <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center">
            <PipeStub direction="left" flowing />
          </div>
        </div>
        <div className="relative flex w-14 shrink-0 flex-col">
          <div className="absolute left-0 right-0 top-1/2 flex -translate-y-1/2 justify-center">
            <PipeRadiator active />
          </div>
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-steel-500">
        Котёл и радиатор снаружи — соберите маршрут в сетке между ними
      </p>
    </div>
  )
}
