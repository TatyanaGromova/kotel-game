import { useState } from 'react'
import type { ProblemZone } from '../data/questions'
import { ZONE_LABELS } from '../data/questions'

/** Центры маркеров на сцене (в % от контейнера) */
/** Привязка к BoilerRoomIllustration (viewBox 400×260) */
const MARKERS: { id: ProblemZone; left: string; top: string }[] = [
  { id: 'chimney', left: '50%', top: '14%' },
  { id: 'pipe', left: '18%', top: '38%' },
  { id: 'display', left: '50%', top: '46%' },
  { id: 'boiler', left: '50%', top: '58%' },
  { id: 'gauge', left: '78%', top: '42%' },
]

interface Props {
  activeZone: ProblemZone | null
  targetZone: ProblemZone
  onSelect: (zone: ProblemZone) => void
  disabled?: boolean
}

export function BoilerDiagnosticOverlay({ activeZone, targetZone, onSelect, disabled }: Props) {
  const [hovered, setHovered] = useState<ProblemZone | null>(null)

  return (
    <div className="absolute inset-0 z-20">
      {MARKERS.map((m) => {
        const isTarget = m.id === targetZone
        const isActive = activeZone === m.id
        const showMarker = !disabled && isTarget
        const showTooltip = hovered === m.id && !disabled

        return (
          <div
            key={m.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: m.left, top: m.top }}
          >
            {/* Невидимая кликабельная область */}
            <button
              type="button"
              disabled={disabled}
              onClick={() => onSelect(m.id)}
              onMouseEnter={() => setHovered(m.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(m.id)}
              onBlur={() => setHovered(null)}
              aria-label={ZONE_LABELS[m.id]}
              className={`relative flex h-12 w-12 items-center justify-center rounded-full sm:h-14 sm:w-14 ${
                disabled ? 'cursor-default' : 'cursor-pointer touch-manipulation'
              }`}
            >
              {/* Пульсирующий маркер — только у целевой зоны */}
              {showMarker && (
                <>
                  <span className="diagnostic-marker-ring absolute h-8 w-8 rounded-full" aria-hidden />
                  <span className="diagnostic-marker-dot relative z-10 block h-3 w-3 rounded-full sm:h-3.5 sm:w-3.5" aria-hidden />
                </>
              )}

              {/* После выбора: краткая индикация без рамок */}
              {disabled && isActive && (
                <span
                  className={`absolute z-10 block h-2.5 w-2.5 rounded-full ${
                    isTarget ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500/80'
                  }`}
                  aria-hidden
                />
              )}
            </button>

            {/* Подсказка при наведении / фокусе */}
            {showTooltip && (
              <div
                className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-graphite-950/95 px-2.5 py-1 text-[11px] font-medium text-warm-200 shadow-glass backdrop-blur-sm"
                role="tooltip"
              >
                {ZONE_LABELS[m.id]}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
