import { useState, useEffect, type ComponentType } from 'react'
import { motion } from 'framer-motion'
import { DndContext, DragOverlay, type DragEndEvent, closestCenter } from '@dnd-kit/core'
import { Thermometer, Gauge, Flame, Clock, Snowflake } from 'lucide-react'
import {
  WINTER_ACTIONS,
  WINTER_ZONE_LABELS,
  WINTER_GOAL_HEAT,
  WINTER_GOAL_GOOD_ACTIONS,
  type WinterZone,
} from '../data/questions'
import { HEAT_CORRECT, HEAT_WRONG } from '../data/rewards'
import { HUMOR } from '../data/humor'
import { useDndSensors } from '../hooks/useDndSensors'
import { DraggableChip } from '../components/dnd/DraggableChip'
import { DropZone } from '../components/dnd/DropZone'
import { WinterHouseScene } from '../components/WinterHouseScene'
import { ProgressBar } from '../components/ProgressBar'
import { LevelHeader } from '../components/LevelHeader'
import { HumorBubble } from '../components/HumorBubble'

interface Props {
  onComplete: () => void
  onBack: () => void
  onHeat: (delta: number) => void
}

const ZONES: WinterZone[] = ['now', 'check', 'danger']

export function LevelFiveWinterMode({ onComplete, onBack, onHeat }: Props) {
  const [homeHeat, setHomeHeat] = useState(42)
  const [temp, setTemp] = useState(17)
  const [goodCount, setGoodCount] = useState(0)
  const [usedIds, setUsedIds] = useState<Set<string>>(new Set())
  const [feedback, setFeedback] = useState<string | null>(null)
  const [humor, setHumor] = useState<string | null>(null)
  const [finished, setFinished] = useState(false)
  const [warmHouse, setWarmHouse] = useState(false)
  const [shake, setShake] = useState(false)
  const [activeDrag, setActiveDrag] = useState<string | null>(null)
  const sensors = useDndSensors()

  const pool = WINTER_ACTIONS.filter((a) => !usedIds.has(a.id))

  useEffect(() => {
    if (finished) return
    const id = setInterval(() => setTemp((t) => Math.max(8, t - 0.14)), 2000)
    return () => clearInterval(id)
  }, [finished])

  useEffect(() => {
    if (goodCount >= WINTER_GOAL_GOOD_ACTIONS && homeHeat >= WINTER_GOAL_HEAT) {
      setFinished(true)
      setWarmHouse(true)
      setHumor(HUMOR.winter.done)
    }
  }, [goodCount, homeHeat])

  const frostIntensity = warmHouse ? 0 : Math.min(1, Math.max(0, (20 - temp) / 12))

  const onDragEnd = (e: DragEndEvent) => {
    setActiveDrag(null)
    const actionId = String(e.active.id).replace('action-', '')
    const action = WINTER_ACTIONS.find((a) => a.id === actionId)
    if (!action || usedIds.has(actionId)) return

    const over = e.over?.id as string | undefined
    if (!over?.startsWith('winter-')) return

    const zone = over.replace('winter-', '') as WinterZone
    setUsedIds((u) => new Set(u).add(actionId))

    if (zone === action.targetZone) {
      onHeat(HEAT_CORRECT)
      setHomeHeat((h) => Math.min(100, h + action.heatDelta))
      setTemp((t) => Math.min(22, t + (action.type === 'good' ? 1.5 : 0)))
      if (action.type === 'good') setGoodCount((c) => c + 1)
      setFeedback(action.comment)
      setHumor(HUMOR.winter.good)
    } else {
      onHeat(HEAT_WRONG)
      setHomeHeat((h) => Math.max(0, h - 8))
      setTemp((t) => Math.max(8, t - 2))
      setFeedback(`Для «${action.label}» лучше зона «${WINTER_ZONE_LABELS[action.targetZone]}».`)
      setHumor(HUMOR.winter.bad)
      setShake(true)
      setTimeout(() => setShake(false), 450)
    }
  }

  const activeAction = WINTER_ACTIONS.find((a) => `action-${a.id}` === activeDrag)

  return (
    <div className={`${shake ? 'screen-shake' : ''} ${frostIntensity > 0.45 && !warmHouse ? 'frost-edge rounded-2xl' : ''}`}>
      <LevelHeader
        title="Зимний режим"
        subtitle="Перетащите действия в нужные зоны — дом остывает!"
        badge="Уровень 5"
        onBack={onBack}
      />

      <WinterHouseScene temp={temp} warm={warmHouse} frostIntensity={frostIntensity} />

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat icon={Thermometer} label="Температура" value={`${temp.toFixed(1)}°C`} cold={temp < 14} />
        <Stat icon={Gauge} label="Тепло дома" value={`${Math.round(homeHeat)}%`} warm={homeHeat > 55} />
        <Stat icon={Flame} label="Верно" value={`${goodCount}/${WINTER_GOAL_GOOD_ACTIONS}`} warm={goodCount >= 3} />
        <Stat icon={Clock} label="До морозов" value="3 дня" />
      </div>

      <div className="mt-3">
        <ProgressBar value={homeHeat} label="Тепло дома" variant={warmHouse ? 'heat' : frostIntensity > 0.5 ? 'cold' : 'heat'} />
      </div>

      {!finished && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={(e) => setActiveDrag(String(e.active.id))}
          onDragEnd={onDragEnd}
        >
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {ZONES.map((z) => (
              <DropZone
                key={z}
                id={`winter-${z}`}
                title={WINTER_ZONE_LABELS[z]}
                variant={z === 'danger' ? 'danger' : z === 'now' ? 'normal' : 'check'}
                className="min-h-[100px]"
              />
            ))}
          </div>

          <p className="mt-5 mb-2 text-center text-sm text-steel-400">Перетащите карточки действий</p>
          <div className="flex flex-wrap justify-center gap-2">
            {pool.map((a) => (
              <DraggableChip
                key={a.id}
                id={`action-${a.id}`}
                label={a.label}
                className={a.type === 'bad' ? 'border-red-500/25' : ''}
              />
            ))}
          </div>

          <DragOverlay>
            {activeAction ? (
              <div className="rounded-xl border border-warm-500 bg-graphite-800 px-4 py-3 shadow-warm">
                {activeAction.label}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {feedback && <div className={`mt-4 ${humor === HUMOR.winter.bad ? 'feedback-danger' : 'feedback-success'}`}>{feedback}</div>}
      {humor && <HumorBubble text={humor} variant={warmHouse ? 'success' : humor === HUMOR.winter.bad ? 'danger' : 'boiler'} />}

      {finished && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 text-center">
          <Snowflake className="mx-auto h-8 w-8 text-warm-400" />
          <p className="heading-display mt-2 text-xl text-warm-400">Дом готов к зиме</p>
          <button type="button" onClick={onComplete} className="btn-primary mt-5 w-full">
            Завершить миссию
          </button>
        </motion.div>
      )}
    </div>
  )
}

function Stat({
  icon: Icon,
  label,
  value,
  cold,
  warm,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  value: string
  cold?: boolean
  warm?: boolean
}) {
  return (
    <div className={`glass-panel flex items-center gap-2 p-2.5 ${cold ? 'ring-1 ring-frost-500/20' : ''}`}>
      <Icon className={`h-4 w-4 ${cold ? 'text-frost-300' : 'text-warm-500/80'}`} />
      <div>
        <p className="text-[9px] uppercase text-steel-500">{label}</p>
        <p className={`font-mono text-sm font-semibold ${cold ? 'text-frost-300' : warm ? 'text-warm-400' : ''}`}>{value}</p>
      </div>
    </div>
  )
}
