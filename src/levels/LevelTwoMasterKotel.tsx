import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DndContext, DragOverlay, type DragEndEvent, closestCenter } from '@dnd-kit/core'
import { MapPin } from 'lucide-react'
import { LEVEL_TWO_TICKETS, DISPATCH_ZONES, type DispatchStatus } from '../data/questions'
import { HEAT_CORRECT, HEAT_WRONG } from '../data/rewards'
import { HUMOR } from '../data/humor'
import { useDndSensors } from '../hooks/useDndSensors'
import { DistrictMap } from '../components/DistrictMap'
import { DropZone } from '../components/dnd/DropZone'
import { TicketCard } from '../components/dnd/TicketCard'
import { HeatGlowEffect } from '../components/Effects/HeatGlowEffect'
import { ProgressBar } from '../components/ProgressBar'
import { LevelHeader } from '../components/LevelHeader'
import { HumorBubble } from '../components/HumorBubble'

interface Props {
  onComplete: () => void
  onBack: () => void
  onHeat: (delta: number) => void
}

export function LevelTwoMasterKotel({ onComplete, onBack, onHeat }: Props) {
  const [step, setStep] = useState(0)
  const [phase, setPhase] = useState<'answer' | 'dispatch'>('answer')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [humor, setHumor] = useState<string | null>(null)
  const [answerOk, setAnswerOk] = useState(false)
  const [dispatchDone, setDispatchDone] = useState(false)
  const [donePoints, setDonePoints] = useState<string[]>([])
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [activeDrag, setActiveDrag] = useState<string | null>(null)
  const sensors = useDndSensors()

  const ticket = LEVEL_TWO_TICKETS[step]
  const ticketDragId = `ticket-${step}`

  const handleAnswer = (index: number) => {
    if (phase !== 'answer' || selectedIdx !== null) return
    setSelectedIdx(index)
    const ok = index === ticket.correctIndex
    setAnswerOk(ok)
    if (ok) {
      onHeat(HEAT_CORRECT)
      setFeedback(ticket.comment)
      setHumor(HUMOR.master.correctAnswer)
      setPhase('dispatch')
    } else {
      onHeat(HEAT_WRONG)
      setFeedback('Стоит уточнить детали и провести диагностику.')
      setHumor(HUMOR.master.wrongAnswer)
    }
  }

  const onDragEnd = (e: DragEndEvent) => {
    setActiveDrag(null)
    if (!answerOk || dispatchDone) return
    const over = e.over?.id as string | undefined
    if (!over?.startsWith('dispatch-')) return
    const status = over.replace('dispatch-', '') as DispatchStatus
    if (status === ticket.dispatchStatus) {
      onHeat(HEAT_CORRECT)
      setDispatchDone(true)
      setDonePoints((p) => [...p, ticket.settlement])
      setHumor(HUMOR.master.correctDispatch)
      setFeedback('Заявка в диспетчерской. Мастер выезжает по плану.')
    } else {
      onHeat(HEAT_WRONG)
      setHumor(HUMOR.master.wrongDispatch)
      setFeedback(`Для этой заявки нужен статус «${ticket.dispatchStatus}».`)
    }
  }

  const next = () => {
    if (step + 1 >= LEVEL_TWO_TICKETS.length) {
      onComplete()
      return
    }
    setStep((s) => s + 1)
    setPhase('answer')
    setAnswerOk(false)
    setDispatchDone(false)
    setFeedback(null)
    setHumor(null)
    setSelectedIdx(null)
  }

  return (
    <div>
      <LevelHeader
        title="Мастер КотёлЪ"
        subtitle={phase === 'answer' ? 'Примите заявку' : 'Перетащите заявку в статус'}
        badge="Уровень 2"
        onBack={onBack}
      />

      <ProgressBar
        value={((step + (dispatchDone ? 1 : answerOk ? 0.5 : 0)) / LEVEL_TWO_TICKETS.length) * 100}
        label="Заявки"
        variant="heat"
      />

      <div className="mt-5">
        <DistrictMap activeSettlement={ticket.settlement} completedSettlements={donePoints} />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={(e) => setActiveDrag(String(e.active.id))}
        onDragEnd={onDragEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-panel-strong relative mt-5 p-5">
            <HeatGlowEffect active={dispatchDone} />
            <div className="mb-3 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-warm-400" />
              <span className="font-semibold text-warm-300">Клиент из {ticket.settlement}</span>
            </div>
            <blockquote className="border-l-2 border-warm-500/50 pl-4 italic text-gray-200">«{ticket.message}»</blockquote>

            {phase === 'answer' && (
              <div className="mt-5 flex flex-col gap-3">
                {ticket.options.map((opt, i) => (
                  <button
                    key={opt}
                    type="button"
                    disabled={selectedIdx !== null}
                    onClick={() => handleAnswer(i)}
                    className={`option-btn ${selectedIdx === i ? (i === ticket.correctIndex ? 'option-btn-correct' : 'option-btn-wrong') : ''}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {phase === 'dispatch' && answerOk && (
              <>
                <p className="mt-4 text-center text-sm text-steel-400">Перетащите карточку в нужный статус</p>
                <div className="mt-3 flex justify-center">
                  {!dispatchDone && <TicketCard id={ticketDragId} settlement={ticket.settlement} />}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {DISPATCH_ZONES.map((z) => (
                    <DropZone key={z} id={`dispatch-${z}`} title={z} variant="dispatch">
                      {dispatchDone && ticket.dispatchStatus === z && (
                        <span className="text-xs text-warm-300">{ticket.settlement}</span>
                      )}
                    </DropZone>
                  ))}
                </div>
              </>
            )}

            {feedback && (
              <div className={`mt-4 ${dispatchDone || (phase === 'answer' && answerOk) ? 'feedback-success' : 'feedback-danger'}`}>
                {feedback}
              </div>
            )}
            {humor && <HumorBubble text={humor} variant={dispatchDone ? 'success' : 'boiler'} />}
            {dispatchDone && (
              <button type="button" onClick={next} className="btn-primary mt-5 w-full">
                {step + 1 >= LEVEL_TWO_TICKETS.length ? 'Завершить уровень' : 'Следующая заявка'}
              </button>
            )}
            {phase === 'answer' && selectedIdx !== null && !answerOk && (
              <button
                type="button"
                onClick={() => {
                  setSelectedIdx(null)
                  setFeedback(null)
                  setHumor(null)
                }}
                className="btn-secondary mt-4 w-full"
              >
                Попробовать снова
              </button>
            )}
          </motion.div>
        </AnimatePresence>
        <DragOverlay>
          {activeDrag === ticketDragId ? (
            <div className="rounded-xl border border-warm-500 bg-graphite-800 px-4 py-3 shadow-warm">
              Заявка · {ticket.settlement}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
