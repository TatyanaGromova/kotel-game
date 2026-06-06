import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DndContext, DragOverlay, type DragEndEvent, closestCenter } from '@dnd-kit/core'
import { Clock, Zap, Flame } from 'lucide-react'
import { LEVEL_THREE_QUESTIONS, ARCADE_ZONE_LABELS, type ArcadeZone } from '../data/questions'
import { HEAT_CORRECT, HEAT_WRONG } from '../data/rewards'
import { HUMOR } from '../data/humor'
import { useDndSensors } from '../hooks/useDndSensors'
import { SituationCard } from '../components/dnd/SituationCard'
import { DropZone } from '../components/dnd/DropZone'
import { ProgressBar } from '../components/ProgressBar'
import { LevelHeader } from '../components/LevelHeader'
import { HumorBubble } from '../components/HumorBubble'

interface Props {
  onComplete: () => void
  onBack: () => void
  onHeat: (delta: number) => void
}

export function LevelThreeNoSurprises({ onComplete, onBack, onHeat }: Props) {
  const [step, setStep] = useState(0)
  const [timer, setTimer] = useState(100)
  const [combo, setCombo] = useState(0)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [humor, setHumor] = useState<string | null>(null)
  const [resolved, setResolved] = useState(false)
  const [wasCorrect, setWasCorrect] = useState(false)
  const [shake, setShake] = useState(false)
  const [activeDrag, setActiveDrag] = useState<string | null>(null)
  const sensors = useDndSensors()

  const q = LEVEL_THREE_QUESTIONS[step]
  const cardId = `card-${step}`

  const advance = useCallback(() => {
    if (step + 1 >= LEVEL_THREE_QUESTIONS.length) {
      onComplete()
      return
    }
    setStep((s) => s + 1)
    setResolved(false)
    setFeedback(null)
    setHumor(null)
    setTimer(100)
  }, [step, onComplete])

  useEffect(() => {
    if (resolved) return
    const id = setInterval(() => {
      setTimer((t) => {
        if (t <= 0) {
          onHeat(HEAT_WRONG)
          setResolved(true)
          setCombo(0)
          setFeedback('Время вышло!')
          setHumor(HUMOR.arcade.timeout)
          setTimeout(advance, 1200)
          return 0
        }
        return t - 2.5
      })
    }, 200)
    return () => clearInterval(id)
  }, [step, resolved, onHeat])

  const resolve = (zone: ArcadeZone | null) => {
    if (resolved) return
    setResolved(true)
    const ok = zone === q.zone
    setWasCorrect(ok)
    if (ok) {
      const newCombo = combo + 1
      setCombo(newCombo)
      onHeat(HEAT_CORRECT + (newCombo >= 3 ? 5 : 0))
      setFeedback(newCombo >= 3 ? HUMOR.arcade.combo(newCombo) : 'Верно!')
      setHumor(HUMOR.arcade.correct)
    } else {
      setCombo(0)
      onHeat(HEAT_WRONG)
      setFeedback(`Нужно было: ${ARCADE_ZONE_LABELS[q.zone].title}`)
      setHumor(HUMOR.arcade.wrong)
      setShake(true)
      setTimeout(() => setShake(false), 400)
    }
    setTimeout(advance, 1200)
  }

  const onDragEnd = (e: DragEndEvent) => {
    setActiveDrag(null)
    const over = e.over?.id as string | undefined
    if (!over?.startsWith('zone-')) return
    resolve(over.replace('zone-', '') as ArcadeZone)
  }

  return (
    <div className={shake ? 'screen-shake' : ''}>
      <LevelHeader title="Котёл не любит сюрпризы" subtitle="Быстрая реакция — перетащите карточку" badge="Уровень 3" onBack={onBack} />

      <div className="glass-panel mb-3 flex flex-wrap items-center gap-3 p-3">
        <Clock className={`h-5 w-5 ${timer < 25 ? 'animate-pulse text-red-400' : 'text-steel-400'}`} />
        <div className="min-w-[120px] flex-1">
          <ProgressBar value={timer} label="Время" variant={timer < 25 ? 'cold' : 'default'} urgent={timer < 25} />
        </div>
        <div className="flex items-center gap-1 rounded-full border border-warm-500/30 bg-warm-600/10 px-3 py-1">
          <Flame className="h-4 w-4 text-warm-500" />
          <span className="text-sm font-bold text-warm-400">x{combo}</span>
        </div>
        <Zap className="h-5 w-5 text-warm-500" />
      </div>

      <ProgressBar value={((step + 1) / LEVEL_THREE_QUESTIONS.length) * 100} label="Ситуации" variant="heat" />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={(e) => setActiveDrag(String(e.active.id))}
        onDragEnd={onDragEnd}
      >
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_2fr_1fr] sm:grid-rows-[auto_1fr_auto]">
          <div className="sm:col-span-3 sm:row-start-1">
            <DropZone id="zone-check" title={ARCADE_ZONE_LABELS.check.title} hint={ARCADE_ZONE_LABELS.check.hint} variant="check" className="min-h-[64px]" />
          </div>
          <div className="sm:col-start-1 sm:row-start-2">
            <DropZone id="zone-danger" title={ARCADE_ZONE_LABELS.danger.title} hint={ARCADE_ZONE_LABELS.danger.hint} variant="danger" className="min-h-[140px]" />
          </div>
          <div className="flex items-center justify-center sm:col-start-2 sm:row-start-2">
            <AnimatePresence mode="wait">
              {!resolved && (
                <motion.div key={step} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ x: 200, opacity: 0 }} className="w-full max-w-sm">
                  <SituationCard id={cardId} text={q.situation} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="sm:col-start-3 sm:row-start-2">
            <DropZone id="zone-normal" title={ARCADE_ZONE_LABELS.normal.title} hint={ARCADE_ZONE_LABELS.normal.hint} variant="normal" className="min-h-[140px]" />
          </div>
        </div>

        <DragOverlay>
          {activeDrag === cardId ? (
            <div className="rounded-2xl border border-warm-500 bg-graphite-800 p-6 font-bold shadow-warm">{q.situation}</div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {feedback && <div className={`mt-4 ${wasCorrect ? 'feedback-success' : 'feedback-danger'}`}>{feedback}</div>}
      {humor && resolved && <HumorBubble text={humor} variant={wasCorrect ? 'success' : 'danger'} />}
    </div>
  )
}
