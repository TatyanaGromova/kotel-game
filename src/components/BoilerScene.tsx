import { Gauge, Thermometer } from 'lucide-react'
import { SteamEffect } from './Effects/SteamEffect'

interface BoilerSceneProps {
  showError?: boolean
  compact?: boolean
}

export function BoilerScene({ showError = false, compact = false }: BoilerSceneProps) {
  const h = compact ? 'h-32 sm:h-40' : 'h-48 sm:h-56 md:h-64'

  return (
    <div className={`relative ${h} w-full overflow-hidden rounded-xl border border-graphite-700/60 bg-graphite-800/40`}>
      <SteamEffect />
      {/* Трубы */}
      <div className="absolute left-[8%] top-[25%] h-2 w-[35%] rounded bg-graphite-600" />
      <div className="absolute right-[10%] top-[30%] h-2 w-[28%] rounded bg-graphite-600" />
      <div className="absolute left-[20%] top-[25%] h-[45%] w-2 rounded bg-graphite-600" />

      {/* Котёл */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <div className="warm-glow-pulse relative h-24 w-28 rounded-lg border-2 border-graphite-600 bg-gradient-to-b from-graphite-700 to-graphite-800 sm:h-28 sm:w-32">
          <div className="absolute inset-x-2 top-2 flex justify-between gap-1">
            <span className="indicator-blink h-2 w-2 rounded-full bg-warm-500" />
            <span className="indicator-blink h-2 w-2 rounded-full bg-green-500/80" style={{ animationDelay: '0.5s' }} />
            <span className="indicator-blink h-2 w-2 rounded-full bg-warm-400" style={{ animationDelay: '1s' }} />
          </div>
          {showError ? (
            <div className="error-display absolute inset-x-2 bottom-3 rounded px-1 py-0.5 text-center text-[10px] font-mono font-bold sm:text-xs">
              ERR
            </div>
          ) : (
            <div className="absolute inset-x-2 bottom-3 rounded bg-graphite-900 px-1 py-0.5 text-center text-[10px] font-mono text-warm-400 sm:text-xs">
              1.4 bar
            </div>
          )}
        </div>
      </div>

      {/* Индикаторы */}
      <div className="absolute right-3 top-3 flex flex-col gap-2 text-warm-500/80">
        <Gauge className="h-4 w-4 indicator-blink" />
        <Thermometer className="h-4 w-4 indicator-blink" style={{ animationDelay: '0.7s' }} />
      </div>

      <div className="absolute bottom-2 left-3 text-[10px] text-gray-500">Котельная</div>
    </div>
  )
}
