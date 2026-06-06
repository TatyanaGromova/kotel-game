import { useState } from 'react'
import { motion } from 'framer-motion'
import { DndContext, DragOverlay, type DragEndEvent, closestCenter } from '@dnd-kit/core'
import {
  HEATING_PIECES,
  HEATING_SLOTS,
  ELEMENT_TO_SLOT,
  DECOY_PIECES,
} from '../data/questions'
import { HEAT_CORRECT, HEAT_WRONG } from '../data/rewards'
import { HUMOR } from '../data/humor'
import { useDndSensors } from '../hooks/useDndSensors'
import { PieceDraggable } from '../components/dnd/PieceDraggable'
import { HeatingPieceIcon } from '../components/illustrations/heatingIcons'
import { HeatingAssemblyBoard } from '../components/HeatingAssemblyBoard'
import { ExplosionEffect } from '../components/Effects/ExplosionEffect'
import { ProgressBar } from '../components/ProgressBar'
import { LevelHeader } from '../components/LevelHeader'
import { HumorBubble } from '../components/HumorBubble'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

interface Props {
  onComplete: () => void
  onBack: () => void
  onHeat: (delta: number) => void
}

export function LevelFourBuildHeating({ onComplete, onBack, onHeat }: Props) {
  const [filled, setFilled] = useState<Record<string, string>>({})
  const [pool, setPool] = useState(() => shuffle([...HEATING_PIECES]))
  const [feedback, setFeedback] = useState<string | null>(null)
  const [humor, setHumor] = useState<string | null>(null)
  const [explosion, setExplosion] = useState(false)
  const [bounce, setBounce] = useState<string | null>(null)
  const [activeDrag, setActiveDrag] = useState<string | null>(null)
  const sensors = useDndSensors()

  const finished = HEATING_SLOTS.every((s) => filled[s.id])
  const progress = (Object.keys(filled).length / HEATING_SLOTS.length) * 100

  const onDragEnd = (e: DragEndEvent) => {
    setActiveDrag(null)
    const piece = String(e.active.id).replace('piece-', '')
    const slotId = e.over?.id as string | undefined
    const validSlot = HEATING_SLOTS.some((s) => s.id === slotId)

    const fail = (msg: string, h: string) => {
      onHeat(HEAT_WRONG)
      setFeedback(msg)
      setHumor(h)
      setExplosion(true)
      setBounce(piece)
      setTimeout(() => {
        setExplosion(false)
        setBounce(null)
      }, 700)
    }

    if (!validSlot || !slotId) {
      fail('Не та зона. Попробуйте другой узел схемы.', HUMOR.heating.wrong)
      return
    }
    if (DECOY_PIECES.includes(piece)) {
      fail('Эта деталь сюда не входит.', HUMOR.heating.decoy)
      return
    }
    if (ELEMENT_TO_SLOT[piece] !== slotId) {
      fail('Элемент не подходит к этой зоне.', HUMOR.heating.wrong)
      return
    }
    if (filled[slotId]) {
      fail('Зона уже занята.', HUMOR.heating.wrong)
      return
    }

    onHeat(HEAT_CORRECT)
    setFilled((f) => ({ ...f, [slotId]: piece }))
    setPool((p) => p.filter((x) => x !== piece))
    setFeedback(null)
    setHumor(HUMOR.heating.snap)
  }

  const activeLabel = activeDrag?.replace('piece-', '') ?? ''

  return (
    <div>
      <LevelHeader
        title="Собери отопление"
        subtitle="Перетащите детали в зоны схемы — порядок не подсказан"
        badge="Уровень 4"
        onBack={onBack}
      />

      <ProgressBar value={progress} label="Сборка" variant="heat" />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={(e) => setActiveDrag(String(e.active.id))}
        onDragEnd={onDragEnd}
      >
        <div className="relative mt-5">
          <ExplosionEffect active={explosion} />
          <HeatingAssemblyBoard filled={filled} finished={finished} />
        </div>

        {!finished && (
          <div className="mt-5">
            <p className="mb-3 text-center text-sm text-steel-400">Детали — перетащите на схему</p>
            <div className="flex flex-wrap justify-center gap-2">
              {pool.map((el) => (
                <motion.div
                  key={el}
                  animate={bounce === el ? { x: [0, -8, 8, -4, 0] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <PieceDraggable id={`piece-${el}`} label={el} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <DragOverlay>
          {activeLabel ? (
            <div className="flex flex-col items-center rounded-xl border border-warm-500 bg-graphite-800 px-3 py-2 shadow-warm">
              <HeatingPieceIcon name={activeLabel} size={40} active />
              <span className="mt-1 text-xs font-semibold">{activeLabel}</span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {humor && <HumorBubble text={humor} variant={finished ? 'success' : explosion ? 'danger' : 'boiler'} />}
      {feedback && !finished && <div className="feedback-danger mt-3">{feedback}</div>}

      {finished && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="feedback-success mt-4 text-center">
            {HUMOR.heating.complete}
          </motion.div>
          <button type="button" onClick={onComplete} className="btn-primary mt-5 w-full">
            Завершить уровень
          </button>
        </>
      )}
    </div>
  )
}
