import { SETTLEMENT_COORDS, type Settlement } from '../data/settlements'

interface DistrictMapProps {
  activeSettlement?: string
  completedSettlements?: string[]
}

export function DistrictMap({ activeSettlement, completedSettlements = [] }: DistrictMapProps) {
  const settlements = Object.keys(SETTLEMENT_COORDS) as Settlement[]

  return (
    <div className="scene-frame relative h-44 overflow-hidden sm:h-52">
      <div className="absolute inset-0 bg-gradient-to-br from-graphite-900 via-graphite-850 to-graphite-950" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle at 30% 40%, rgba(90,109,130,0.2) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(61,122,154,0.15) 0%, transparent 45%)',
        }}
      />

      {/* Сетка */}
      <svg className="absolute inset-0 h-full w-full opacity-20" aria-hidden>
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#5a6d82" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Маршрут */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <path
          d="M 50 45 L 72 38 L 65 62 L 38 72"
          fill="none"
          stroke="rgba(90, 109, 130, 0.35)"
          strokeWidth="0.8"
          strokeDasharray="4 3"
        />
        {activeSettlement && SETTLEMENT_COORDS[activeSettlement as Settlement] && (
          <line
            x1="50"
            y1="45"
            x2={SETTLEMENT_COORDS[activeSettlement as Settlement].x}
            y2={SETTLEMENT_COORDS[activeSettlement as Settlement].y}
            stroke="url(#routeWarm)"
            strokeWidth="1.2"
            strokeDasharray="100"
            strokeDashoffset="0"
            className="opacity-80"
          />
        )}
        <defs>
          <linearGradient id="routeWarm" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#ff8c42" />
          </linearGradient>
        </defs>
      </svg>

      {settlements.map((name) => {
        const c = SETTLEMENT_COORDS[name]
        const active = name === activeSettlement
        const done = completedSettlements.includes(name)
        return (
          <div
            key={name}
            className="absolute z-10"
            style={{ left: `${c.x}%`, top: `${c.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            {active && (
              <span className="map-point-ping absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-warm-500/30" />
            )}
            <span
              className={`relative block rounded-full border-2 ${
                done
                  ? 'h-3 w-3 border-green-500 bg-green-500 shadow-[0_0_12px_#22c55e]'
                  : active
                    ? 'h-4 w-4 border-warm-400 bg-warm-500 shadow-warm-sm'
                    : 'h-2.5 w-2.5 border-steel-500 bg-steel-600'
              }`}
            />
            {(active || done) && (
              <span
                className={`absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] font-medium ${
                  active ? 'bg-warm-600/30 text-warm-300' : 'text-green-400/90'
                }`}
              >
                {name}
              </span>
            )}
          </div>
        )
      })}

      <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-widest text-steel-500">
          Саткинский район · диспетчерская
        </span>
        {activeSettlement && (
          <span className="rounded-full border border-warm-500/30 bg-warm-600/20 px-2 py-0.5 text-[10px] text-warm-400">
            Активная заявка
          </span>
        )}
      </div>
    </div>
  )
}
