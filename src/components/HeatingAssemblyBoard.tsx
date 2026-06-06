import { useDroppable } from '@dnd-kit/core'
import { motion } from 'framer-motion'
import { HEATING_SLOTS } from '../data/questions'
import { HeatingSchemeIllustration } from './illustrations/HeatingSchemeIllustration'
import { HeatingPieceIcon } from './illustrations/heatingIcons'

interface Props {
  filled: Record<string, string>
  finished: boolean
}

function Slot({
  id,
  label,
  piece,
  finished,
}: {
  id: string
  label: string
  piece?: string
  finished: boolean
}) {
  const { isOver, setNodeRef } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[88px] flex-col items-center justify-center rounded-xl border-2 border-dashed p-2 text-center transition-all ${
        piece
          ? 'border-warm-500/60 bg-warm-600/10 shadow-warm-sm'
          : isOver
            ? 'border-warm-400 bg-warm-500/15 scale-[1.02]'
            : 'border-steel-600/50 bg-graphite-900/70'
      }`}
    >
      {piece ? (
        <>
          <HeatingPieceIcon name={piece} size={36} active />
          <span className="mt-1 text-[10px] font-semibold text-warm-300">{piece}</span>
        </>
      ) : (
        <>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-steel-600/40 bg-graphite-800/80">
            <span className="text-lg text-steel-600">+</span>
          </div>
          <span className="mt-1 text-[10px] uppercase tracking-wider text-steel-500">{label}</span>
        </>
      )}
      {finished && piece && <div className="heat-flow-line mt-1 h-0.5 w-12 rounded" />}
    </div>
  )
}

export function HeatingAssemblyBoard({ filled, finished }: Props) {
  return (
    <div className="scene-frame relative overflow-hidden p-3 sm:p-5">
      <div className="absolute inset-0 bg-gradient-to-br from-graphite-900 via-graphite-850 to-graphite-950" />
      {finished && <div className="absolute inset-0 bg-warm-radial opacity-35" />}

      <p className="relative mb-2 text-center text-sm text-steel-400">
        Перетащите детали в зоны. Подсказка — только названия зон, не порядок.
      </p>

      <div className="relative mb-4 hidden min-h-[120px] sm:block">
        <HeatingSchemeIllustration filled={filled} finished={finished} />
      </div>

      <div className="relative grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5">
        {HEATING_SLOTS.map((s) => (
          <Slot key={s.id} id={s.id} label={s.label} piece={filled[s.id]} finished={finished} />
        ))}
      </div>

      {finished && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative mt-3 text-center text-xs text-warm-400/90"
        >
          Система собрана — тепло пошло по контуру
        </motion.p>
      )}
    </div>
  )
}
