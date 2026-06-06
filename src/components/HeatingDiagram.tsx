import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { HEATING_SEQUENCE } from '../data/questions'

interface HeatingDiagramProps {
  built: string[]
  finished: boolean
}

export function HeatingDiagram({ built, finished }: HeatingDiagramProps) {
  return (
    <div className="scene-frame relative min-h-[200px] p-4 sm:min-h-[240px] sm:p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-graphite-900 via-graphite-850 to-graphite-950" />
      {finished && (
        <>
          <div className="absolute inset-0 bg-warm-radial opacity-50" />
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div className="heat-flow-line absolute left-[10%] right-[10%] top-[45%] h-1 rounded" />
          </div>
        </>
      )}

      <div className="relative flex flex-col items-center gap-4">
        {/* Верх: котёл */}
        <motion.div
          animate={built.includes('Котёл') ? { boxShadow: '0 0 24px rgba(255,140,66,0.4)' } : {}}
          className={`rounded-xl border px-4 py-2 text-sm font-semibold ${
            built.includes('Котёл')
              ? 'border-warm-500/60 bg-warm-600/20 text-warm-300'
              : 'border-steel-600/40 bg-graphite-800/80 text-steel-400'
          }`}
        >
          🔥 Котёл
        </motion.div>

        <div className={`h-8 w-1 rounded ${built.length > 0 ? 'bg-gradient-to-b from-warm-500 to-warm-600' : 'bg-steel-600'}`} />

        {/* Средний ряд */}
        <div className="flex flex-wrap justify-center gap-2">
          {['Группа безопасности', 'Насос', 'Фильтр'].map((el) => (
            <Node key={el} label={el} active={built.includes(el)} />
          ))}
        </div>

        <div className={`h-6 w-1 rounded ${built.includes('Трубы') ? 'bg-warm-500' : 'bg-steel-600'}`} />

        <Node label="Трубы" active={built.includes('Трубы')} wide />

        <div className="flex gap-2">
          {['Радиаторы', 'Радиаторы', 'Радиаторы'].map((_, i) => (
            <div
              key={i}
              className={`h-14 w-10 rounded border sm:h-16 sm:w-12 ${
                built.includes('Радиаторы') || finished
                  ? 'window-lit border-warm-500/40'
                  : 'border-steel-600/50 bg-graphite-800'
              }`}
            />
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {['Расширительный бак', 'Дымоход', 'Вентиляция'].map((el) => (
            <Node key={el} label={el} active={built.includes(el)} small />
          ))}
        </div>
      </div>

      {/* Прогресс-цепочка */}
      <div className="relative mt-6 flex flex-wrap justify-center gap-1.5">
        {HEATING_SEQUENCE.map((el) => {
          const done = built.includes(el)
          const current = built.length < HEATING_SEQUENCE.length && HEATING_SEQUENCE[built.length] === el
          return (
            <span
              key={el}
              className={`rounded-md px-2 py-0.5 text-[10px] sm:text-xs ${
                done
                  ? 'bg-warm-600/25 text-warm-300 ring-1 ring-warm-500/30'
                  : current
                    ? 'border border-dashed border-warm-500/50 text-warm-400'
                    : 'bg-graphite-800/60 text-gray-600'
              }`}
            >
              {done && <Check className="mr-0.5 inline h-3 w-3" />}
              {el}
            </span>
          )
        })}
      </div>
    </div>
  )
}

function Node({
  label,
  active,
  wide,
  small,
}: {
  label: string
  active: boolean
  wide?: boolean
  small?: boolean
}) {
  return (
    <div
      className={`rounded-lg border text-center font-medium transition-all ${
        small ? 'px-2 py-1 text-[10px]' : wide ? 'px-6 py-2 text-sm' : 'px-3 py-1.5 text-xs'
      } ${
        active
          ? 'border-warm-500/50 bg-warm-600/15 text-warm-300 shadow-warm-sm'
          : 'border-steel-600/35 bg-graphite-800/70 text-steel-400'
      }`}
    >
      {label}
    </div>
  )
}
